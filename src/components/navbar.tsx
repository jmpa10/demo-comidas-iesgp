'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';
import { 
  ShoppingCart, 
  Menu as MenuIcon, 
  User, 
  LogOut,
  Settings,
  LayoutDashboard
} from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <MenuIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">
              IES Gregorio Prieto
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {(session.user.role === 'TEACHER' || session.user.role === 'ADMIN') && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Panel Admin
                    </Button>
                  </Link>
                )}
                
                <Link href="/orders">
                  <Button variant="ghost" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Mis Pedidos
                  </Button>
                </Link>

                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>
                </Link>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button>Iniciar Sesión</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
