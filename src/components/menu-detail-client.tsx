'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { formatDate, formatCurrency } from '@/lib/format';
import { ShoppingCart, Check, Minus, Plus, ArrowLeft } from 'lucide-react';

type Dish = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
};

type Menu = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  date: Date;
  dishes: Dish[];
};

interface MenuDetailClientProps {
  menu: Menu;
  userId: string;
}

export function MenuDetailClient({ menu, userId }: MenuDetailClientProps) {
  const router = useRouter();
  const [isFullMenu, setIsFullMenu] = useState(true);
  const [selectedDishes, setSelectedDishes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const toggleDish = (dishId: string) => {
    setSelectedDishes((prev) => {
      const current = prev[dishId] || 0;
      if (current > 0) {
        const { [dishId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dishId]: 1 };
    });
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setSelectedDishes((prev) => {
      const current = prev[dishId] || 0;
      const newValue = current + delta;
      if (newValue <= 0) {
        const { [dishId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dishId]: newValue };
    });
  };

  const calculateTotal = () => {
    if (isFullMenu) return menu.price;
    return Object.entries(selectedDishes).reduce((total, [dishId, quantity]) => {
      const dish = menu.dishes.find((d) => d.id === dishId);
      return total + (dish?.price || 0) * quantity;
    }, 0);
  };

  const handleReserve = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuId: menu.id,
          isFullMenu,
          dishes: isFullMenu
            ? menu.dishes.map((d) => ({ dishId: d.id, quantity: 1, price: d.price }))
            : Object.entries(selectedDishes).map(([dishId, quantity]) => ({
                dishId,
                quantity,
                price: menu.dishes.find((d) => d.id === dishId)?.price || 0,
              })),
          total: calculateTotal(),
        }),
      });

      if (response.ok) {
        router.push('/orders');
      } else {
        alert('Error al crear la reserva');
      }
    } catch (error) {
      alert('Error al crear la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  const canReserve = isFullMenu || Object.keys(selectedDishes).length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a menús
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información del menú */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-primary">{menu.name}</CardTitle>
              <CardDescription className="text-lg">
                {formatDate(menu.date)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {menu.description && (
                <p className="text-muted-foreground mb-6">{menu.description}</p>
              )}

              {/* Selector de tipo de reserva */}
              <div className="flex gap-4 mb-6">
                <Button
                  variant={isFullMenu ? 'default' : 'outline'}
                  onClick={() => setIsFullMenu(true)}
                  className="flex-1"
                >
                  Menú Completo ({formatCurrency(menu.price)})
                </Button>
                <Button
                  variant={!isFullMenu ? 'default' : 'outline'}
                  onClick={() => setIsFullMenu(false)}
                  className="flex-1"
                >
                  Platos Individuales
                </Button>
              </div>

              {/* Lista de platos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Platos del menú:</h3>
                {menu.dishes.map((dish) => (
                  <Card
                    key={dish.id}
                    className={
                      !isFullMenu && selectedDishes[dish.id]
                        ? 'border-primary ring-2 ring-primary'
                        : ''
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {dish.imageUrl && (
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={dish.imageUrl}
                              alt={dish.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg">{dish.name}</h4>
                          {dish.description && (
                            <p className="text-sm text-muted-foreground">
                              {dish.description}
                            </p>
                          )}
                          <p className="text-lg font-bold text-primary mt-2">
                            {formatCurrency(dish.price)}
                          </p>
                        </div>
                        {!isFullMenu && (
                          <div className="flex items-center gap-2">
                            {selectedDishes[dish.id] ? (
                              <>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => updateQuantity(dish.id, -1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-semibold">
                                  {selectedDishes[dish.id]}
                                </span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => updateQuantity(dish.id, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                onClick={() => toggleDish(dish.id)}
                              >
                                Añadir
                              </Button>
                            )}
                          </div>
                        )}
                        {isFullMenu && (
                          <Check className="h-6 w-6 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen de reserva */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen de Reserva</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFullMenu ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Menú completo</p>
                  <p className="text-sm">
                    Incluye todos los platos ({menu.dishes.length})
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Platos seleccionados ({Object.keys(selectedDishes).length})
                  </p>
                  {Object.entries(selectedDishes).map(([dishId, quantity]) => {
                    const dish = menu.dishes.find((d) => d.id === dishId);
                    if (!dish) return null;
                    return (
                      <div
                        key={dishId}
                        className="flex justify-between text-sm py-1"
                      >
                        <span>
                          {quantity}x {dish.name}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(dish.price * quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!canReserve || isLoading}
                  onClick={handleReserve}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isLoading ? 'Procesando...' : 'Confirmar Reserva'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
