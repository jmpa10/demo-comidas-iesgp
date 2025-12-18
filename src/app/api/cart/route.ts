import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

type AddCartItemsBody =
  | {
      items: Array<{
        type: 'MENU' | 'DISH';
        menuId?: string;
        dishId?: string;
        quantity?: number;
      }>;
    }
  | {
      menuId: string;
      isFullMenu: boolean;
      dishes: Array<{ dishId: string; quantity: number }>;
    };

function toPositiveInt(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  const asInt = Math.floor(value);
  return asInt > 0 ? asInt : fallback;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { menu: true, dish: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  const items = cart?.items ?? [];
  const total = items.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

  return NextResponse.json({
    cart: cart ? { id: cart.id, userId: cart.userId, createdAt: cart.createdAt, updatedAt: cart.updatedAt } : null,
    items,
    total,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = (await request.json()) as AddCartItemsBody;

    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });

    const itemsToAdd: Array<{ type: 'MENU' | 'DISH'; menuId?: string; dishId?: string; quantity: number }> = [];

    if ('items' in body) {
      for (const item of body.items) {
        itemsToAdd.push({
          type: item.type,
          menuId: item.menuId,
          dishId: item.dishId,
          quantity: toPositiveInt(item.quantity, 1),
        });
      }
    } else {
      if (body.isFullMenu) {
        itemsToAdd.push({ type: 'MENU', menuId: body.menuId, quantity: 1 });
      } else {
        for (const dish of body.dishes) {
          itemsToAdd.push({ type: 'DISH', dishId: dish.dishId, quantity: toPositiveInt(dish.quantity, 1) });
        }
      }
    }

    for (const item of itemsToAdd) {
      if (item.type === 'MENU') {
        if (!item.menuId) {
          return NextResponse.json({ error: 'menuId requerido' }, { status: 400 });
        }

        const menu = await prisma.menu.findUnique({
          where: { id: item.menuId },
          select: { id: true, price: true },
        });

        if (!menu) {
          return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
        }

        const lineKey = `MENU:${menu.id}`;

        await prisma.cartLine.upsert({
          where: { cartId_lineKey: { cartId: cart.id, lineKey } },
          update: {
            quantity: { increment: item.quantity },
            unitPrice: menu.price,
            menuId: menu.id,
            dishId: null,
            type: 'MENU',
          },
          create: {
            cartId: cart.id,
            lineKey,
            type: 'MENU',
            menuId: menu.id,
            unitPrice: menu.price,
            quantity: item.quantity,
          },
        });
      }

      if (item.type === 'DISH') {
        if (!item.dishId) {
          return NextResponse.json({ error: 'dishId requerido' }, { status: 400 });
        }

        const dish = await prisma.dish.findUnique({
          where: { id: item.dishId },
          select: { id: true, price: true, menuId: true },
        });

        if (!dish) {
          return NextResponse.json({ error: 'Plato no encontrado' }, { status: 404 });
        }

        const lineKey = `DISH:${dish.id}`;

        await prisma.cartLine.upsert({
          where: { cartId_lineKey: { cartId: cart.id, lineKey } },
          update: {
            quantity: { increment: item.quantity },
            unitPrice: dish.price,
            dishId: dish.id,
            menuId: dish.menuId,
            type: 'DISH',
          },
          create: {
            cartId: cart.id,
            lineKey,
            type: 'DISH',
            menuId: dish.menuId,
            dishId: dish.id,
            unitPrice: dish.price,
            quantity: item.quantity,
          },
        });
      }
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { menu: true, dish: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const updatedItems = updatedCart?.items ?? [];
    const total = updatedItems.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

    return NextResponse.json({
      cart: updatedCart ? { id: updatedCart.id, userId: updatedCart.userId, createdAt: updatedCart.createdAt, updatedAt: updatedCart.updatedAt } : null,
      items: updatedItems,
      total,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Error al añadir al carrito' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = (await request.json()) as { lineId: string; quantity: number };
    const quantity = toPositiveInt(body.quantity, 1);

    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return NextResponse.json({ error: 'Carrito vacío' }, { status: 404 });

    const line = await prisma.cartLine.findFirst({
      where: { id: body.lineId, cartId: cart.id },
      select: { id: true },
    });

    if (!line) return NextResponse.json({ error: 'Línea no encontrada' }, { status: 404 });

    await prisma.cartLine.update({ where: { id: body.lineId }, data: { quantity } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Error al actualizar el carrito' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const lineId = searchParams.get('lineId');

  const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
  if (!cart) return NextResponse.json({ success: true });

  if (!lineId) {
    await prisma.cartLine.deleteMany({ where: { cartId: cart.id } });
    return NextResponse.json({ success: true });
  }

  await prisma.cartLine.deleteMany({ where: { cartId: cart.id, id: lineId } });
  return NextResponse.json({ success: true });
}
