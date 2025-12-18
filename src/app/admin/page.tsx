import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminDashboard } from '@/components/admin-dashboard';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const [orders, menus, users] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: true,
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
    }),
    prisma.menu.findMany({
      include: {
        dishes: true,
        _count: {
          select: { orderLines: true },
        },
      },
      orderBy: {
        date: 'desc',
      },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: { orders: true },
        },
      },
    }),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Panel de Administración</h1>
      <AdminDashboard orders={orders} menus={menus} users={users} />
    </div>
  );
}
