import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CartClient } from '@/components/cart-client';

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Carrito</h1>
      <CartClient initialItems={items} initialTotal={total} />
    </div>
  );
}
