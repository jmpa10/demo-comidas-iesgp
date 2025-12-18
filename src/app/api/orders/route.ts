import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendToN8n } from '@/lib/n8n';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      lines: {
        include: {
          menu: true,
          dish: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { menuId, isFullMenu, dishes } = body as {
      menuId: string;
      isFullMenu: boolean;
      dishes: Array<{ dishId: string; quantity: number }>;
      total?: number;
    };

    // Asegura email/rol desde BD para automatizaciones (n8n)
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true },
    });

    // Construye líneas: si es menú completo, se registra como línea MENU.
    // Si son platos, se registran como líneas DISH (con menuId rellenado para trazabilidad).
    const linesToCreate: Array<{
      type: 'MENU' | 'DISH';
      menuId?: string | null;
      dishId?: string | null;
      quantity: number;
      unitPrice: number;
    }> = [];

    if (isFullMenu) {
      const menu = await prisma.menu.findUnique({
        where: { id: menuId },
        select: { id: true, price: true },
      });
      if (!menu) {
        return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
      }
      linesToCreate.push({
        type: 'MENU',
        menuId: menu.id,
        dishId: null,
        quantity: 1,
        unitPrice: menu.price,
      });
    } else {
      for (const dish of dishes) {
        const dbDish = await prisma.dish.findUnique({
          where: { id: dish.dishId },
          select: { id: true, price: true, menuId: true },
        });
        if (!dbDish) {
          return NextResponse.json({ error: 'Plato no encontrado' }, { status: 404 });
        }
        linesToCreate.push({
          type: 'DISH',
          menuId: dbDish.menuId,
          dishId: dbDish.id,
          quantity: Math.max(1, Math.floor(dish.quantity || 1)),
          unitPrice: dbDish.price,
        });
      }
    }

    const total = linesToCreate.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: 'PENDING',
        lines: {
          create: linesToCreate.map((line) => ({
            type: line.type,
            menuId: line.menuId ?? null,
            dishId: line.dishId ?? null,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          })),
        },
      },
      include: {
        lines: {
          include: {
            menu: true,
            dish: true,
          },
        },
      },
    });

    await sendToN8n('order.created', {
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        lines: order.lines.map((line) => ({
          type: line.type,
          menuId: line.menuId,
          dishId: line.dishId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
        })),
      },
      user: {
        id: dbUser?.id ?? session.user.id,
        email: dbUser?.email ?? session.user.email ?? null,
        name: dbUser?.name ?? session.user.name ?? null,
        role: dbUser?.role ?? session.user.role,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error al crear el pedido' },
      { status: 500 }
    );
  }
}
