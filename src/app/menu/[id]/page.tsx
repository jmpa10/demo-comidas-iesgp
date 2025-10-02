import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MenuDetailClient } from '@/components/menu-detail-client';

export default async function MenuDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const menu = await prisma.menu.findUnique({
    where: { id: params.id },
    include: {
      dishes: true,
    },
  });

  if (!menu) {
    redirect('/');
  }

  return <MenuDetailClient menu={menu} userId={session.user.id} />;
}
