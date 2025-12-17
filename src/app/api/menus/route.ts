import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendToN8n } from '@/lib/n8n';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, date, price, dishes } = body;

    const menu = await prisma.menu.create({
      data: {
        name,
        description,
        date: new Date(date),
        price: parseFloat(price),
        available: true,
        dishes: {
          create: dishes.map((dish: any) => ({
            name: dish.name,
            description: dish.description || null,
            price: parseFloat(dish.price),
            imageUrl: dish.imageUrl || null,
          })),
        },
      },
      include: {
        dishes: true,
      },
    });

    await sendToN8n('menu.created', {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      available: menu.available,
      date: menu.date,
      createdAt: menu.createdAt,
      dishes: menu.dishes.map((dish) => ({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        imageUrl: dish.imageUrl,
      })),
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Error al crear el menú' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
  }

  const menus = await prisma.menu.findMany({
    include: {
      dishes: true,
      _count: {
        select: { orders: true },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return NextResponse.json(menus);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, available } = body;

    const menu = await prisma.menu.update({
      where: { id },
      data: { available },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el menú' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de menú requerido' },
        { status: 400 }
      );
    }

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el menú' },
      { status: 500 }
    );
  }
}
