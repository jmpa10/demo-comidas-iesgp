import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreateMenuForm } from '@/components/create-menu-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function CreateMenuPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Panel
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Crear Nuevo Menú</h1>
        <p className="text-muted-foreground">
          Completa el formulario para añadir un nuevo menú al sistema
        </p>
      </div>

      <CreateMenuForm />
    </div>
  );
}
