'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { formatCurrency } from '@/lib/format';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

type CartLine = {
  id: string;
  type: 'MENU' | 'DISH';
  quantity: number;
  unitPrice: number;
  menu: { id: string; name: string; date: Date } | null;
  dish: { id: string; name: string } | null;
};

export function CartClient({
  initialItems,
  initialTotal,
}: {
  initialItems: CartLine[];
  initialTotal: number;
}) {
  const router = useRouter();
  const [items, setItems] = useState<CartLine[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return items.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  }, [items]);

  const updateQuantity = async (lineId: string, nextQuantity: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineId, quantity: nextQuantity }),
      });

      if (!res.ok) {
        alert('Error al actualizar el carrito');
        return;
      }

      setItems((prev) =>
        prev.map((l) => (l.id === lineId ? { ...l, quantity: nextQuantity } : l))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeLine = async (lineId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart?lineId=${encodeURIComponent(lineId)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Error al eliminar del carrito');
        return;
      }

      setItems((prev) => prev.filter((l) => l.id !== lineId));
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!confirm('¿Vaciar carrito?')) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/cart', { method: 'DELETE' });
      if (!res.ok) {
        alert('Error al vaciar el carrito');
        return;
      }
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cart/checkout', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.error ?? 'Error al finalizar el pedido');
        return;
      }

      router.push('/orders');
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">Tu carrito está vacío</p>
          <Button className="mt-6" onClick={() => router.push('/')}
            >Ver menús</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Artículos</CardTitle>
          <Button variant="outline" onClick={clearCart} disabled={isLoading}>
            Vaciar carrito
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((line) => {
            const title =
              line.type === 'MENU'
                ? `Menú completo: ${line.menu?.name ?? 'Menú'}`
                : `${line.dish?.name ?? 'Plato'}`;

            return (
              <div
                key={line.id}
                className="flex items-center gap-4 border-b pb-3 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(line.unitPrice)} / unidad
                  </p>
                </div>

                <div className="w-40 flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={isLoading || line.quantity <= 1}
                    onClick={() => updateQuantity(line.id, Math.max(1, line.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold tabular-nums">
                    {line.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => updateQuantity(line.id, line.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => removeLine(line.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="w-24 text-right font-semibold tabular-nums">
                  {formatCurrency(line.unitPrice * line.quantity)}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
          <Button className="w-full" size="lg" disabled={isLoading} onClick={checkout}>
            {isLoading ? 'Procesando...' : 'Realizar pedido'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
