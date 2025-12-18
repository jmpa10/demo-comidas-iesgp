'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';

type OrderLine = {
  id: string;
  type: 'MENU' | 'DISH';
  quantity: number;
  unitPrice: number;
  menu: { id: string; name: string; date: Date } | null;
  dish: { id: string; name: string; description: string | null } | null;
};

type Order = {
  id: string;
  createdAt: Date;
  status: string;
  total: number;
  lines: OrderLine[];
};

interface OrdersListProps {
  orders: Order[];
}

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  CONFIRMED: {
    label: 'Confirmado',
    icon: CheckCircle,
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  READY: {
    label: 'Listo',
    icon: Package,
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  DELIVERED: {
    label: 'Entregado',
    icon: CheckCircle,
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  },
  CANCELLED: {
    label: 'Cancelado',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">
            No has realizado ningún pedido todavía
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING;
        const StatusIcon = status.icon;

        const menuNames = Array.from(
          new Set(
            order.lines
              .filter((l) => l.type === 'MENU' && l.menu?.name)
              .map((l) => l.menu!.name)
          )
        );
        const title = menuNames.length === 1 ? menuNames[0] : menuNames.length > 1 ? 'Pedido mixto' : 'Pedido';

        return (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {title}
                  </CardTitle>
                  <CardDescription>
                    Pedido realizado el {formatDateTime(order.createdAt)}
                  </CardDescription>
                </div>
                <Badge className={status.className}>
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Detalle:</h4>
                  <div className="space-y-2">
                    {order.lines.map((line) => (
                      <div
                        key={line.id}
                        className="flex justify-between text-sm border-b pb-2 last:border-0"
                      >
                        <span>
                          {line.quantity}x{' '}
                          {line.type === 'MENU'
                            ? `Menú completo${line.menu?.name ? `: ${line.menu.name}` : ''}`
                            : line.dish?.name ?? 'Plato'}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(line.unitPrice * line.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-semibold text-lg">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
