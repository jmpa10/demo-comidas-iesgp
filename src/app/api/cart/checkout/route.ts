import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendToN8n } from '@/lib/n8n';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    // Asegura email/rol desde BD para automatizaciones (n8n)
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true, name: true, role: true },
    });

    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            include: { menu: true, dish: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      const items = cart?.items ?? [];
      if (!cart || items.length === 0) {
        return { order: null as any, items: [] as typeof items };
      }

      const total = items.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          status: 'PENDING',
          total,
          lines: {
            create: items.map((line) => ({
              type: line.type,
              menuId: line.menuId,
              dishId: line.dishId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
            })),
          },
        },
        include: {
          lines: {
            include: { menu: true, dish: true },
          },
        },
      });

      await tx.cartLine.deleteMany({ where: { cartId: cart.id } });

      return { order, items };
    });

    if (!result.order) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 });
    }

    await sendToN8n('order.created', {
      order: {
        id: result.order.id,
        total: result.order.total,
        status: result.order.status,
        createdAt: result.order.createdAt,
        lines: result.order.lines.map((line: {
          type: 'MENU' | 'DISH';
          menuId: string | null;
          dishId: string | null;
          quantity: number;
          unitPrice: number;
          menu?: { name: string } | null;
          dish?: { name: string } | null;
        }) => ({
          type: line.type,
          menuId: line.menuId,
          dishId: line.dishId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          name: line.type === 'MENU' ? line.menu?.name ?? null : line.dish?.name ?? null,
        })),
      },
      user: {
        id: dbUser?.id ?? session.user.id,
        email: dbUser?.email ?? session.user.email ?? null,
        name: dbUser?.name ?? session.user.name ?? null,
        role: dbUser?.role ?? session.user.role,
      },
    });

    return NextResponse.json(result.order);
  } catch (error) {
    console.error('Error checking out cart:', error);
    return NextResponse.json({ error: 'Error al finalizar el pedido' }, { status: 500 });
  }
}
