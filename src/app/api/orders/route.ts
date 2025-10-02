import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error al crear el pedido' },
      { status: 500 }
    );
  }
}
