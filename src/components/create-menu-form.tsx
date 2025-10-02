'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ImageUpload } from './image-upload';
import { Plus, Trash2, Save } from 'lucide-react';

type DishForm = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

export function CreateMenuForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [menuData, setMenuData] = useState({
    name: '',
    description: '',
    date: '',
    price: '',
    imageUrl: '',
  });
  const [dishes, setDishes] = useState<DishForm[]>([
    { name: '', description: '', price: '', imageUrl: '' },
  ]);

  const addDish = () => {
    setDishes([...dishes, { name: '', description: '', price: '', imageUrl: '' }]);
  };

  const removeDish = (index: number) => {
    if (dishes.length > 1) {
      setDishes(dishes.filter((_, i) => i !== index));
    }
  };

  const updateDish = (index: number, field: keyof DishForm, value: string) => {
    const newDishes = [...dishes];
    newDishes[index][field] = value;
    setDishes(newDishes);
  };

  const calculateMenuPrice = () => {
    const total = dishes.reduce((sum, dish) => {
      const price = parseFloat(dish.price) || 0;
      return sum + price;
    }, 0);
    return (total * 0.9).toFixed(2); // 10% de descuento en menú completo
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...menuData,
          price: parseFloat(menuData.price || calculateMenuPrice()),
          date: new Date(menuData.date),
          dishes: dishes.map((dish) => ({
            ...dish,
            price: parseFloat(dish.price),
          })),
        }),
      });

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert('Error al crear el menú');
      }
    } catch (error) {
      alert('Error al crear el menú');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    menuData.name &&
    menuData.date &&
    dishes.every((d) => d.name && d.price);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Menú</CardTitle>
          <CardDescription>
            Completa los datos básicos del menú
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Menú *</Label>
            <Input
              id="name"
              placeholder="Ej: Menú del Día - Lunes"
              value={menuData.name}
              onChange={(e) =>
                setMenuData({ ...menuData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción opcional del menú"
              value={menuData.description}
              onChange={(e) =>
                setMenuData({ ...menuData, description: e.target.value })
              }
            />
          </div>

          <ImageUpload
            label="Imagen del Menú"
            value={menuData.imageUrl}
            onChange={(url) => setMenuData({ ...menuData, imageUrl: url })}
            folder="menus"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha del Menú *</Label>
              <Input
                id="date"
                type="date"
                value={menuData.date}
                onChange={(e) =>
                  setMenuData({ ...menuData, date: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Precio del Menú Completo (€)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder={`Sugerido: ${calculateMenuPrice()}`}
                value={menuData.price}
                onChange={(e) =>
                  setMenuData({ ...menuData, price: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Si no se especifica, se calculará automáticamente (suma de platos - 10%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Platos del Menú</CardTitle>
              <CardDescription>
                Añade los platos que formarán parte del menú
              </CardDescription>
            </div>
            <Button type="button" onClick={addDish}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Plato
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {dishes.map((dish, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6 space-y-4">
                <div className="absolute top-4 right-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDish(index)}
                    disabled={dishes.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2 pr-12">
                  <Label htmlFor={`dish-name-${index}`}>
                    Nombre del Plato *
                  </Label>
                  <Input
                    id={`dish-name-${index}`}
                    placeholder="Ej: Ensalada Mixta"
                    value={dish.name}
                    onChange={(e) =>
                      updateDish(index, 'name', e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`dish-description-${index}`}>
                    Descripción
                  </Label>
                  <Textarea
                    id={`dish-description-${index}`}
                    placeholder="Descripción del plato"
                    value={dish.description}
                    onChange={(e) =>
                      updateDish(index, 'description', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`dish-price-${index}`}>
                    Precio (€) *
                  </Label>
                  <Input
                    id={`dish-price-${index}`}
                    type="number"
                    step="0.01"
                    placeholder="5.00"
                    value={dish.price}
                    onChange={(e) =>
                      updateDish(index, 'price', e.target.value)
                    }
                    required
                  />
                </div>

                <ImageUpload
                  label={`Imagen del Plato ${index + 1}`}
                  value={dish.imageUrl}
                  onChange={(url) => updateDish(index, 'imageUrl', url)}
                  folder="dishes"
                />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin')}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={!isFormValid || isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Crear Menú'}
        </Button>
      </div>
    </form>
  );
}
