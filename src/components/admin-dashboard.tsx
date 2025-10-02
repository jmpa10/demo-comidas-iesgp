'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { Users, Package, ShoppingCart, TrendingUp, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';

type AdminDashboardProps = {
  orders: any[];
  menus: any[];
  users: any[];
};

export function AdminDashboard({ orders, menus, users }: AdminDashboardProps) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const [menusState, setMenusState] = useState(menus);

  const toggleMenuAvailability = async (menuId: string, currentState: boolean) => {
    try {
      const response = await fetch('/api/menus', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: menuId,
          available: !currentState,
        }),
      });

      if (response.ok) {
        setMenusState(
          menusState.map((m) =>
            m.id === menuId ? { ...m, available: !currentState } : m
          )
        );
      }
    } catch (error) {
      alert('Error al actualizar el menú');
    }
  };

  const deleteMenu = async (menuId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este menú?')) {
      return;
    }

    try {
      const response = await fetch(`/api/menus?id=${menuId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMenusState(menusState.filter((m) => m.id !== menuId));
      }
    } catch (error) {
      alert('Error al eliminar el menú');
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Total acumulado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menús Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menus.filter((m) => m.available).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {menus.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con detalles */}
      <Tabs defaultValue="orders" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="menus">Menús</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>
          <Link href="/admin/create-menu">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear Menú
            </Button>
          </Link>
        </div>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No hay pedidos todavía
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {order.user.name || order.user.email}
                      </CardTitle>
                      <CardDescription>
                        {formatDateTime(order.createdAt)} • {order.menu?.name || 'Personalizado'}
                      </CardDescription>
                    </div>
                    <Badge>{order.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} platos
                      </p>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="menus" className="space-y-4">
          {menusState.map((menu) => (
            <Card key={menu.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{menu.name}</CardTitle>
                    <CardDescription>
                      {menu.dishes.length} platos • {formatCurrency(menu.price)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={menu.available ? 'default' : 'secondary'}>
                      {menu.available ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleMenuAvailability(menu.id, menu.available)}
                      title={menu.available ? 'Desactivar' : 'Activar'}
                    >
                      {menu.available ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => deleteMenu(menu.id)}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {menu._count.orders} pedidos realizados
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{user.name || 'Sin nombre'}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {user._count.orders} pedidos realizados
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
