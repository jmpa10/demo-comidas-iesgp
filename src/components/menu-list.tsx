'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Image from 'next/image';
import { formatDate, formatCurrency } from '@/lib/format';
import Link from 'next/link';
import { ShoppingCart, Plus } from 'lucide-react';

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

interface MenuListProps {
  menus: Menu[];
  userRole: string;
}

export function MenuList({ menus, userRole }: MenuListProps) {
  if (menus.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No hay menús disponibles en este momento
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menus.map((menu) => (
        <Card key={menu.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-primary">{menu.name}</CardTitle>
            <CardDescription>{formatDate(menu.date)}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {menu.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {menu.description}
              </p>
            )}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Platos incluidos:</h4>
              {menu.dishes.map((dish) => (
                <div key={dish.id} className="flex items-center space-x-3">
                  {dish.imageUrl && (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{dish.name}</p>
                    {dish.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {dish.description}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-primary flex-shrink-0">
                    {formatCurrency(dish.price)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Menú completo</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(menu.price)}
              </p>
            </div>
            <Link href={`/menu/${menu.id}`}>
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Reservar
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
