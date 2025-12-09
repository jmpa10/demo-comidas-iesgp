# Guía de Desarrollo
## Sistema de Reservas IES Gregorio Prieto

**Para desarrolladores y alumnos de 2º ASIR**

---

## 📚 Índice

1. [Primeros Pasos](#1-primeros-pasos)
2. [Arquitectura del Proyecto](#2-arquitectura-del-proyecto)
3. [Estructura de Carpetas](#3-estructura-de-carpetas)
4. [Convenciones de Código](#4-convenciones-de-código)
5. [Flujo de Trabajo con Git](#5-flujo-de-trabajo-con-git)
6. [Testing](#6-testing)
7. [Despliegue](#7-despliegue)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Primeros Pasos

### 1.1 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** 18.x o superior → [Descargar](https://nodejs.org/)
- **Git** → [Descargar](https://git-scm.com/)
- **Editor de código** (recomendado: VS Code)
- **GitHub CLI** (opcional) → [Descargar](https://cli.github.com/)

### 1.2 Clonar el Repositorio

```bash
# HTTPS
git clone https://github.com/jmpa10/demo-comidas-iesgp.git

# SSH (si tienes configurado)
git clone git@github.com:jmpa10/demo-comidas-iesgp.git

cd demo-comidas-iesgp
```

### 1.3 Instalar Dependencias

```bash
npm install
```

### 1.4 Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Base de datos (SQLite para desarrollo)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secreto-aleatorio"

# Firebase (opcional para desarrollo)
NEXT_PUBLIC_FIREBASE_API_KEY="tu-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-dominio.firebaseapp.com"
# ... resto de variables Firebase

# Google OAuth (opcional para desarrollo)
GOOGLE_CLIENT_ID="tu-client-id"
GOOGLE_CLIENT_SECRET="tu-secret"
```

**Generar secreto aleatorio:**
```bash
openssl rand -base64 32
```

### 1.5 Inicializar Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar schema a la BD
npx prisma db push

# Poblar con datos de prueba
node prisma/seed.js
```

### 1.6 Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

**Usuarios de prueba:**
- **Admin:** admin@iesgregorioprieto.es
- **Cliente:** cliente@iesgregorioprieto.es

---

## 2. Arquitectura del Proyecto

### 2.1 Stack Tecnológico

```
┌─────────────────────────────────────┐
│         FRONTEND (React)            │
│  Next.js 14 + TypeScript + Tailwind │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│       API ROUTES (Next.js)          │
│    /api/auth, /api/menus, etc.      │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         BASE DE DATOS               │
│    Prisma ORM + PostgreSQL/SQLite   │
└─────────────────────────────────────┘

        SERVICIOS EXTERNOS
┌──────────────┬──────────────┬────────────┐
│ Firebase     │ Google OAuth │    n8n     │
│ (Imágenes)   │ (Auth)       │ (Webhooks) │
└──────────────┴──────────────┴────────────┘
```

### 2.2 Flujo de una Petición

```
Usuario → Navegador → Next.js Router
  → Componente React (Client/Server)
    → API Route (si es necesario)
      → Prisma Client
        → Base de Datos
      ← Respuesta
    ← Props/Data
  ← Renderizado
← HTML/JS
```

### 2.3 Server vs Client Components

**Server Components (por defecto en Next.js 14):**
- Se ejecutan en el servidor
- Pueden acceder directamente a la BD
- No tienen interactividad (no useState, useEffect)
- Mejores para SEO y rendimiento

**Client Components (`"use client"`)**
- Se ejecutan en el navegador
- Tienen interactividad (hooks, eventos)
- No pueden acceder directamente a la BD
- Necesarios para formularios, modals, etc.

**Ejemplo:**
```tsx
// app/page.tsx (Server Component)
import { prisma } from '@/lib/prisma'
import { MenuList } from '@/components/menu-list'

export default async function HomePage() {
  const menus = await prisma.menu.findMany() // ✅ Directo desde servidor
  return <MenuList menus={menus} />
}

// components/menu-list.tsx (Client Component)
'use client'
import { useState } from 'react'

export function MenuList({ menus }) {
  const [filter, setFilter] = useState('') // ✅ Interactividad
  // ...
}
```

---

## 3. Estructura de Carpetas

```
proyecto/
├── .github/                    # GitHub Actions, templates
├── docs/                       # 📚 Documentación del proyecto
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.js                # Datos de prueba
│   └── dev.db                 # SQLite (development)
├── public/                     # Archivos estáticos
├── src/
│   ├── app/                   # 🎯 App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── menus/         # CRUD de menús
│   │   │   └── orders/        # CRUD de pedidos
│   │   ├── admin/             # Rutas de administración
│   │   ├── auth/              # Rutas de autenticación
│   │   ├── menu/              # Rutas de menús
│   │   ├── orders/            # Rutas de pedidos
│   │   ├── layout.tsx         # Layout raíz
│   │   ├── page.tsx           # Página principal
│   │   └── globals.css        # Estilos globales
│   ├── components/            # 🧩 Componentes React
│   │   ├── ui/                # Componentes UI base (shadcn)
│   │   ├── navbar.tsx
│   │   ├── menu-list.tsx
│   │   └── ...
│   ├── lib/                   # 🔧 Utilidades y configuraciones
│   │   ├── auth.ts            # NextAuth config
│   │   ├── firebase.ts        # Firebase config
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Funciones helper
│   └── types/                 # 📝 Tipos TypeScript
├── .env                       # Variables de entorno (NO subir a Git)
├── .env.example               # Plantilla de variables
├── .gitignore
├── next.config.js             # Configuración de Next.js
├── package.json
├── tailwind.config.ts         # Configuración de Tailwind
└── tsconfig.json              # Configuración de TypeScript
```

### 3.1 Convención de Nombres de Archivos

- **Componentes:** `kebab-case.tsx` (ej: `menu-list.tsx`)
- **Páginas:** `page.tsx` (obligatorio en App Router)
- **Layouts:** `layout.tsx`
- **API Routes:** `route.ts`
- **Utilidades:** `camelCase.ts` (ej: `formatDate.ts`)

---

## 4. Convenciones de Código

### 4.1 TypeScript

✅ **Buenas prácticas:**
```typescript
// Tipos explícitos en parámetros
function calcularTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// Interfaces para objetos complejos
interface MenuFormData {
  name: string
  description?: string
  price: number
  date: Date
}

// Evitar 'any', usar tipos específicos
const data: unknown = await response.json()
if (isMenu(data)) {
  // Type guard
  console.log(data.name)
}
```

❌ **Evitar:**
```typescript
// Nunca usar 'any' sin justificación
function procesar(data: any) { ... }

// No omitir tipos de retorno en funciones importantes
async function fetchMenus() { ... }
```

### 4.2 React Components

✅ **Buenas prácticas:**
```tsx
// Props con interface
interface MenuCardProps {
  menu: Menu
  onReserve?: (menuId: string) => void
}

export function MenuCard({ menu, onReserve }: MenuCardProps) {
  // Component logic
}

// Server Components por defecto
export default async function MenusPage() {
  const menus = await prisma.menu.findMany()
  return <MenuList menus={menus} />
}

// Client Components solo cuando sea necesario
'use client'
export function InteractiveForm() {
  const [state, setState] = useState()
  // ...
}
```

### 4.3 Nombres de Variables

```typescript
// Constantes en UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Variables en camelCase
const userName = session.user.name

// Funciones en camelCase con verbos
function calculateMenuPrice(dishes: Dish[]): number { ... }
async function fetchUserOrders(userId: string): Promise<Order[]> { ... }

// Componentes en PascalCase
function MenuCard() { ... }
const OrderList = () => { ... }

// Booleanos con prefijos is/has/can
const isAdmin = user.role === 'TEACHER'
const hasOrders = orders.length > 0
const canEdit = isAdmin && menu.available
```

### 4.4 Comentarios

```typescript
// ✅ Comentarios útiles
/**
 * Calcula el precio total del menú con descuento aplicado.
 * @param dishes Array de platos del menú
 * @returns Precio total con 10% de descuento
 */
function calculateMenuPrice(dishes: Dish[]): number {
  const total = dishes.reduce((sum, dish) => sum + dish.price, 0)
  return total * 0.9 // 10% de descuento
}

// ❌ Comentarios obvios
// Sumar dos números
const sum = a + b

// ✅ TODOs y FIXMEs
// TODO: Implementar paginación cuando haya >100 menús
// FIXME: Bug cuando el usuario cancela durante la subida
```

---

## 5. Flujo de Trabajo con Git

### 5.1 Branching Strategy

```
main (producción)
  ↓
develop (desarrollo)
  ↓
feature/nombre-feature (nuevas características)
bugfix/nombre-bug (correcciones)
hotfix/nombre-urgente (urgente en producción)
```

### 5.2 Crear una Nueva Feature

```bash
# 1. Actualizar develop
git checkout develop
git pull origin develop

# 2. Crear branch desde develop
git checkout -b feature/crear-menu-platos

# 3. Trabajar en tu código
# ... hacer cambios ...

# 4. Hacer commits frecuentes
git add .
git commit -m "feat: añadir formulario de platos dinámicos"

# 5. Push a GitHub
git push origin feature/crear-menu-platos

# 6. Crear Pull Request en GitHub
```

### 5.3 Convención de Commits (Conventional Commits)

```bash
# Formato
<tipo>(<scope>): <descripción corta>

<descripción detallada (opcional)>

# Tipos
feat:     # Nueva característica
fix:      # Corrección de bug
docs:     # Cambios en documentación
style:    # Formato, comas, etc (no afecta código)
refactor: # Refactorización de código
test:     # Añadir o modificar tests
chore:    # Tareas de mantenimiento

# Ejemplos
git commit -m "feat(menu): añadir filtro por fecha"
git commit -m "fix(auth): corregir redirect después de login"
git commit -m "docs: actualizar README con instrucciones de deploy"
git commit -m "refactor(api): simplificar lógica de orders endpoint"
```

### 5.4 Pull Requests

**Plantilla de PR:**
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] El código compila sin errores
- [ ] He probado los cambios localmente
- [ ] He añadido tests (si aplica)
- [ ] He actualizado la documentación
- [ ] El código sigue las convenciones del proyecto

## Capturas de pantalla (si aplica)
```

**Revisión de código:**
- Al menos 1 aprobación antes de merge
- Todos los tests deben pasar
- No debe haber conflictos

---

## 6. Testing

### 6.1 Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage

# Tests E2E
npm run test:e2e
```

### 6.2 Escribir Tests Unitarios

```typescript
// components/__tests__/menu-card.test.tsx
import { render, screen } from '@testing-library/react'
import { MenuCard } from '../menu-card'

describe('MenuCard', () => {
  const mockMenu = {
    id: '1',
    name: 'Menú del Día',
    price: 12.5,
    description: 'Test menu',
    available: true,
  }

  it('muestra el nombre del menú', () => {
    render(<MenuCard menu={mockMenu} />)
    expect(screen.getByText('Menú del Día')).toBeInTheDocument()
  })

  it('muestra el precio formateado', () => {
    render(<MenuCard menu={mockMenu} />)
    expect(screen.getByText('12,50 €')).toBeInTheDocument()
  })
})
```

### 6.3 Tests E2E con Playwright

```typescript
// tests/e2e/order-flow.spec.ts
import { test, expect } from '@playwright/test'

test('usuario puede realizar una reserva completa', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/auth/signin')
  await page.click('text=Cliente Usuario')
  
  // Ver menús
  await expect(page).toHaveURL('http://localhost:3000')
  await expect(page.locator('h1')).toContainText('Bienvenido')
  
  // Seleccionar menú
  await page.click('text=Ver Menú >> nth=0')
  
  // Reservar
  await page.click('text=Reservar Menú Completo')
  await page.click('text=Confirmar Reserva')
  
  // Verificar
  await expect(page.locator('text=Reserva confirmada')).toBeVisible()
})
```

---

## 7. Despliegue

### 7.1 Despliegue en Vercel (Producción)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

**Variables de entorno en Vercel:**
1. Ir a Project Settings → Environment Variables
2. Añadir todas las variables de `.env.example`
3. Redeploy para aplicar cambios

### 7.2 Migraciones de Base de Datos

```bash
# Generar migración
npx prisma migrate dev --name nombre_migracion

# Aplicar en producción
npx prisma migrate deploy

# Ver estado
npx prisma migrate status
```

### 7.3 Checklist Pre-Deploy

- [ ] Todos los tests pasan
- [ ] No hay errores de TypeScript
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Backup de BD creado
- [ ] Smoke tests en staging
- [ ] Documentación actualizada

---

## 8. Troubleshooting

### 8.1 Problemas Comunes

#### Error: "Module not found"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

#### Error: "Port 3000 already in use"
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Error de TypeScript en componentes UI
```bash
# Regenerar tipos
npm run build
```

#### Base de datos corrupta
```bash
# Resetear BD (⚠️ perderás datos)
rm prisma/dev.db
npx prisma db push
node prisma/seed.js
```

### 8.2 Logs y Debug

```typescript
// Habilitar logs de Prisma
// En .env
DATABASE_URL="file:./dev.db?connection_limit=1&socket_timeout=10"
DEBUG="prisma:*"

// Logs en componentes
'use client'
import { useEffect } from 'react'

export function DebugComponent() {
  useEffect(() => {
    console.log('Component mounted')
    return () => console.log('Component unmounted')
  }, [])
}
```

### 8.3 Herramientas de Debug

```bash
# Prisma Studio (visualizar BD)
npx prisma studio

# Next.js Build Analysis
npm run build
# Ver .next/analyze/

# Lighthouse (rendimiento)
# En Chrome DevTools → Lighthouse → Generate Report
```

---

## 9. Recursos Adicionales

### 9.1 Documentación Oficial

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org/)

### 9.2 Tutoriales y Cursos

- [Next.js Learn](https://nextjs.org/learn)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)

### 9.3 Herramientas Recomendadas

**VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- GitLens
- Auto Rename Tag
- Error Lens

**Chrome Extensions:**
- React Developer Tools
- Redux DevTools (si se usa)
- JSON Viewer

---

## 10. Contacto y Soporte

**¿Dudas? Contacta con:**
- Coordinador del Proyecto: [email]
- Canal de Discord/Slack: [link]
- GitHub Issues: [repo/issues]

**Horario de soporte:**
- Lunes a Viernes: 10:00 - 14:00

---

**¡Bienvenido al proyecto! Happy coding! 🚀**

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.0
