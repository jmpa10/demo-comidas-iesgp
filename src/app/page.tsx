import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MenuList } from "@/components/menu-list";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const menus = await prisma.menu.findMany({
    where: {
      available: true,
      date: {
        gte: new Date(),
      },
    },
    include: {
      dishes: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Bienvenido, {session.user.name}
        </h1>
        <p className="text-muted-foreground">
          Descubre los menús disponibles y haz tu reserva
        </p>
      </div>
      
      <MenuList menus={menus} userRole={session.user.role} />
    </div>
  );
}
