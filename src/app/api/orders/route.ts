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
      menu: true,
      items: {
        include: {
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
    const { menuId, isFullMenu, dishes, total } = body;

    // Asegura email/rol desde BD para automatizaciones (n8n)
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true },
    });

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        menuId,
        isFullMenu,
        total,
        status: 'PENDING',
        items: {
          create: dishes.map((dish: any) => ({
            dishId: dish.dishId,
            quantity: dish.quantity,
            price: dish.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        menu: true,
      },
    });

    await sendToN8n('order.created', {
      order: {
        id: order.id,
        menuId: order.menuId,
        total: order.total,
        status: order.status,
        isFullMenu: order.isFullMenu,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          dishId: item.dishId,
          quantity: item.quantity,
          price: item.price,
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
