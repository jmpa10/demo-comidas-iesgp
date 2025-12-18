'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { 
  ShoppingCart, 
  Menu as MenuIcon, 
  User, 
  LogOut,
  LayoutDashboard,
  Package
} from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(0);

  const isAuthed = useMemo(() => Boolean(session?.user?.id), [session?.user?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadCartCount() {
      if (!isAuthed) {
        setCartCount(0);
        return;
      }

      try {
        const res = await fetch('/api/cart', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { items?: Array<{ quantity: number }> };
        const items = data.items ?? [];
        const totalQty = items.reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);
        if (!cancelled) setCartCount(totalQty);
      } catch {
        // Silencioso: el contador es decorativo.
      }
    }

    loadCartCount();
    return () => {
      cancelled = true;
    };
  }, [isAuthed, pathname]);

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
                    <Package className="h-4 w-4 mr-2" />
                    Mis Pedidos
                  </Button>
                </Link>

                <Link href="/cart">
                  <Button variant="ghost" size="sm">
                    <span className="relative mr-2 inline-flex">
                      <ShoppingCart className="h-5 w-5" />
                      {cartCount > 0 && (
                        <span className="absolute right-0 top-0 z-10 inline-flex min-w-4 h-4 px-1 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold leading-none tabular-nums">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </span>
                    Carrito
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
