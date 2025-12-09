# Arquitectura del Sistema
## Sistema de Reservas - IES Gregorio Prieto

**Versión:** 1.0  
**Fecha:** Diciembre 2025

---

## 📋 Índice

1. [Visión General](#1-visión-general)
2. [Arquitectura de Alto Nivel](#2-arquitectura-de-alto-nivel)
3. [Capa de Presentación](#3-capa-de-presentación)
4. [Capa de Aplicación](#4-capa-de-aplicación)
5. [Capa de Datos](#5-capa-de-datos)
6. [Servicios Externos](#6-servicios-externos)
7. [Flujos de Datos](#7-flujos-de-datos)
8. [Decisiones de Arquitectura](#8-decisiones-de-arquitectura)
9. [Escalabilidad y Rendimiento](#9-escalabilidad-y-rendimiento)
10. [Seguridad](#10-seguridad)

---

## 1. Visión General

### 1.1 Contexto

El Sistema de Reservas del IES Gregorio Prieto es una aplicación web que permite:
- A los **alumnos de Hostelería** publicar menús diarios
- A la **comunidad educativa** reservar menús completos o platos individuales
- A los **administradores** gestionar el sistema

### 1.2 Objetivos Arquitectónicos

1. **Simplicidad**: Arquitectura clara y mantenible por alumnos
2. **Escalabilidad**: Preparada para crecimiento futuro
3. **Seguridad**: Protección de datos de usuarios
4. **Rendimiento**: Tiempos de respuesta < 3 segundos
5. **Modularidad**: Componentes independientes y reutilizables

### 1.3 Restricciones

- **Presupuesto**: Limitado (uso de tier gratuito)
- **Tecnología**: Next.js obligatorio (aprendizaje del equipo)
- **Infraestructura**: Cloud-first (sin servidores propios)
- **Tiempo**: Desarrollo en 10 semanas

---

## 2. Arquitectura de Alto Nivel

### 2.1 Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR WEB                            │
│  (Chrome, Firefox, Safari, Edge - Móvil/Desktop/Tablet)    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS APPLICATION (Vercel)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FRONTEND (React + Tailwind CSS)                     │  │
│  │  - Server Components (SSR)                           │  │
│  │  - Client Components (CSR)                           │  │
│  │  - Static Generation (SSG)                           │  │
│  └───────────────────────┬──────────────────────────────┘  │
│                          │                                  │
│  ┌───────────────────────▼──────────────────────────────┐  │
│  │  API ROUTES (Serverless Functions)                   │  │
│  │  - /api/auth/* → NextAuth.js                         │  │
│  │  - /api/menus → Gestión de menús                     │  │
│  │  - /api/orders → Gestión de pedidos                  │  │
│  └───────────────────────┬──────────────────────────────┘  │
└──────────────────────────┼──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │   Firebase   │  │ Google OAuth │
│  (Railway)   │  │   Storage    │  │  (Auth)      │
│              │  │  (Imágenes)  │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
         ↓
┌──────────────┐
│     n8n      │
│ (Webhooks/   │
│ Automation)  │
└──────────────┘
```

### 2.2 Estilo Arquitectónico

**Arquitectura en Capas (Layered Architecture)** combinada con **Serverless**

1. **Capa de Presentación**: React Components (UI/UX)
2. **Capa de Aplicación**: Next.js API Routes (Lógica de negocio)
3. **Capa de Datos**: Prisma ORM + PostgreSQL
4. **Capa de Servicios**: Firebase, OAuth, n8n

**Ventajas:**
- ✅ Separación clara de responsabilidades
- ✅ Fácil de entender y mantener
- ✅ Escalabilidad mediante serverless
- ✅ Coste bajo (pay-per-use)

---

## 3. Capa de Presentación

### 3.1 Tecnologías

```
React 18 + Next.js 14 (App Router)
  ↓
TypeScript (Type Safety)
  ↓
Tailwind CSS (Styling)
  ↓
Shadcn/ui + Radix UI (Components)
```

### 3.2 Estructura de Componentes

```
App
├── Layout (Global)
│   ├── Navbar
│   │   ├── UserMenu
│   │   └── Navigation
│   └── Footer
│
├── Pages (Routes)
│   ├── Home (/)
│   │   └── MenuList
│   │       └── MenuCard
│   ├── Menu Detail (/menu/[id])
│   │   └── MenuDetailClient
│   │       ├── DishList
│   │       └── OrderForm
│   ├── Orders (/orders)
│   │   └── OrdersList
│   │       └── OrderCard
│   └── Admin (/admin)
│       ├── AdminDashboard
│       │   ├── StatsCards
│       │   ├── OrdersTable
│       │   └── MenusTable
│       └── CreateMenu (/admin/create-menu)
│           └── CreateMenuForm
│               ├── MenuInfoSection
│               ├── DishesSection
│               └── ImageUpload
│
└── Shared Components
    ├── ui/
    │   ├── Button
    │   ├── Card
    │   ├── Input
    │   ├── Badge
    │   └── ...
    └── ImageUpload
```

### 3.3 Patrón de Renderizado

**Estrategia híbrida:**

```typescript
// Server Components (por defecto)
// ✅ Acceso directo a BD
// ✅ SEO optimizado
// ✅ Menor bundle JS
async function HomePage() {
  const menus = await prisma.menu.findMany()
  return <MenuList menus={menus} />
}

// Client Components (cuando sea necesario)
// ✅ Interactividad
// ✅ State management
// ✅ Event handlers
'use client'
function MenuDetailClient({ menu }) {
  const [quantity, setQuantity] = useState(1)
  return <div onClick={() => setQuantity(q => q + 1)}>...</div>
}
```

**Ventajas:**
- Menor JavaScript enviado al cliente
- Mejor rendimiento inicial
- SEO optimizado
- Interactividad cuando se necesita

---

## 4. Capa de Aplicación

### 4.1 API Routes (Next.js)

```
/api/
├── auth/
│   └── [...nextauth]/
│       └── route.ts          # NextAuth handlers
│
├── menus/
│   ├── route.ts              # GET, POST (todos los menús)
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE (menú específico)
│
└── orders/
    ├── route.ts              # GET, POST (todos los pedidos)
    └── [id]/
        └── route.ts          # GET, PATCH (pedido específico)
```

### 4.2 Estructura de un Endpoint

```typescript
// /api/menus/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET /api/menus - Listar menús
export async function GET(request: NextRequest) {
  try {
    const menus = await prisma.menu.findMany({
      where: { available: true },
      include: { dishes: true },
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(menus)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching menus' },
      { status: 500 }
    )
  }
}

// POST /api/menus - Crear menú (solo admin)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Validar autenticación
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Validar rol
  if (session.user.role !== 'TEACHER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Procesar request
  const body = await request.json()
  
  // Validar datos
  if (!body.name || !body.price) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }
  
  try {
    const menu = await prisma.menu.create({
      data: {
        ...body,
        dishes: {
          create: body.dishes
        }
      },
      include: { dishes: true }
    })
    
    // Webhook a n8n (opcional)
    await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify({ event: 'menu.created', menu })
    })
    
    return NextResponse.json(menu, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating menu' },
      { status: 500 }
    )
  }
}
```

### 4.3 Middleware

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      // Rutas públicas
      if (req.nextUrl.pathname.startsWith('/auth')) {
        return true
      }
      
      // Resto requiere autenticación
      if (!token) {
        return false
      }
      
      // Rutas admin solo para TEACHER
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token.role === 'TEACHER'
      }
      
      return true
    }
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

---

## 5. Capa de Datos

### 5.1 Modelo de Datos

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          String    @default("CUSTOMER")
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  orders   Order[]
  accounts Account[]
  sessions Session[]
}

model Menu {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  imageUrl    String?
  date        DateTime
  available   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  dishes Dish[]
}

model Dish {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  imageUrl    String?
  menuId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  menu       Menu        @relation(fields: [menuId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
}

model Order {
  id        String   @id @default(cuid())
  userId    String
  total     Float
  status    String   @default("PENDING")
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user  User        @relation(fields: [userId], references: [id])
  items OrderItem[]
}

model OrderItem {
  id       String @id @default(cuid())
  orderId  String
  dishId   String
  quantity Int    @default(1)
  price    Float
  
  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  dish  Dish  @relation(fields: [dishId], references: [id])
}
```

### 5.2 Patrones de Acceso a Datos

**Repository Pattern via Prisma:**

```typescript
// lib/repositories/menu.repository.ts
export class MenuRepository {
  async findAvailable() {
    return prisma.menu.findMany({
      where: { available: true },
      include: { dishes: true },
      orderBy: { date: 'asc' }
    })
  }
  
  async findById(id: string) {
    return prisma.menu.findUnique({
      where: { id },
      include: { dishes: true }
    })
  }
  
  async create(data: CreateMenuInput) {
    return prisma.menu.create({
      data: {
        ...data,
        dishes: {
          create: data.dishes
        }
      },
      include: { dishes: true }
    })
  }
}
```

### 5.3 Optimizaciones

**1. Conexión Singleton:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**2. Indexes:**
```prisma
model Menu {
  // ...
  
  @@index([available, date])
}

model Order {
  // ...
  
  @@index([userId, createdAt])
}
```

**3. Caching (futuro):**
```typescript
import { unstable_cache } from 'next/cache'

export const getAvailableMenus = unstable_cache(
  async () => {
    return prisma.menu.findMany({ where: { available: true } })
  },
  ['available-menus'],
  { revalidate: 60 } // 1 minuto
)
```

---

## 6. Servicios Externos

### 6.1 Autenticación (Google OAuth)

```
Usuario → Click "Login con Google"
  ↓
Next.js → Redirect a Google OAuth
  ↓
Google → Usuario autoriza
  ↓
Google → Redirect con code
  ↓
NextAuth → Exchange code por token
  ↓
NextAuth → Crear/actualizar User en BD
  ↓
NextAuth → Crear Session
  ↓
Usuario → Autenticado
```

**Configuración:**
```typescript
// lib/auth.ts
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.role = user.role
      return session
    }
  }
}
```

### 6.2 Almacenamiento de Imágenes (Firebase)

```
Usuario → Selecciona imagen
  ↓
ImageUpload Component → Validar (tipo, tamaño)
  ↓
Firebase Storage SDK → Upload con progreso
  ↓
Firebase → Retornar URL pública
  ↓
Form → Guardar URL en BD
```

**Configuración:**
```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const app = initializeApp({ /* config */ })
const storage = getStorage(app)

export async function uploadImage(file: File, folder: string): Promise<string> {
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`)
  const uploadTask = uploadBytesResumable(storageRef, file)
  
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        // Progreso
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log(`Upload is ${progress}% done`)
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}
```

### 6.3 Automatización (n8n)

```
Next.js API → Trigger webhook
  ↓
n8n → Procesar datos
  ↓
n8n → Ejecutar acciones:
  - Enviar email
  - Actualizar Google Sheets
  - Notificar Slack
  - Backup DB
```

**Ejemplo de integración:**
```typescript
// Después de crear pedido
await fetch(process.env.N8N_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'order.created',
    data: {
      orderId: order.id,
      userEmail: user.email,
      total: order.total,
      items: order.items
    }
  })
})
```

---

## 7. Flujos de Datos

### 7.1 Flujo de Reserva de Menú

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Usuario  │────▶│ MenuCard │────▶│   API    │────▶│ Database │
│          │     │Component │     │ /orders  │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
    │                  │                 │                │
    │  1. Click       │                 │                │
    │  "Reservar"     │                 │                │
    │                 │                 │                │
    │                 │  2. POST        │                │
    │                 │  fetch()        │                │
    │                 │─────────────────▶                │
    │                 │                 │  3. Validate  │
    │                 │                 │  session      │
    │                 │                 │                │
    │                 │                 │  4. Create    │
    │                 │                 │  order        │
    │                 │                 │────────────────▶
    │                 │                 │                │
    │                 │                 │  5. Return    │
    │                 │                 │  order        │
    │                 │                 │◀────────────────
    │                 │  6. Response   │                │
    │                 │  { order }     │                │
    │                 │◀─────────────────                │
    │                 │                 │                │
    │                 │  7. Show       │                │
    │                 │  confirmation  │                │
    │◀─────────────────                │                │
    │                                  │                │
    │                                  │  8. Webhook   │
    │                                  │  to n8n       │
    │                                  │────────────────▶
    │                                  │                │
                                       │  9. Send email │
                                       │  via n8n      │
                                       ▼
```

### 7.2 Flujo de Creación de Menú (Admin)

```
Admin → CreateMenuForm
  ↓
  1. Fill form data (name, price, date)
  ↓
  2. Add dishes (name, price per dish)
  ↓
  3. Upload images
     ├─▶ File → Firebase Storage → URL
     └─▶ URL → Direct input
  ↓
  4. Submit → POST /api/menus
  ↓
  5. API validates:
     - User is TEACHER
     - Required fields present
     - Prices are valid numbers
  ↓
  6. Prisma creates Menu + Dishes (transaction)
  ↓
  7. Return created menu
  ↓
  8. Redirect to /admin
  ↓
  9. Show success message
```

---

## 8. Decisiones de Arquitectura

### 8.1 ¿Por qué Next.js?

**Alternativas consideradas:**
- Create React App (CRA)
- Vite + React
- Remix
- Astro

**Decisión: Next.js 14 con App Router**

**Razones:**
✅ SSR y SSG out-of-the-box (mejor SEO)
✅ API Routes integradas (no necesita backend separado)
✅ Optimización automática (code splitting, images)
✅ Despliegue sencillo en Vercel
✅ Comunidad grande y activa
✅ Experiencia de aprendizaje valiosa para alumnos

### 8.2 ¿Por qué Prisma?

**Alternativas consideradas:**
- TypeORM
- Sequelize
- Raw SQL
- Drizzle

**Decisión: Prisma ORM**

**Razones:**
✅ Type-safety total con TypeScript
✅ Migraciones automáticas
✅ Prisma Studio (UI visual de BD)
✅ Documentación excelente
✅ Developer experience superior

### 8.3 ¿Por qué PostgreSQL?

**Alternativas consideradas:**
- MySQL
- MongoDB
- SQLite

**Decisión: PostgreSQL (prod) + SQLite (dev)**

**Razones:**
✅ Relaciones complejas bien soportadas
✅ ACID compliance
✅ JSON support (futuras extensiones)
✅ Escalabilidad
✅ Tier gratuito generoso en Railway/Render
✅ SQLite para desarrollo (sin instalaciones)

### 8.4 ¿Por qué Serverless?

**Alternativas consideradas:**
- VPS tradicional (DigitalOcean, Linode)
- Containers (Docker + Kubernetes)
- PaaS (Heroku)

**Decisión: Serverless (Vercel)**

**Razones:**
✅ Coste $0 en tier gratuito
✅ Escalabilidad automática
✅ No requiere gestión de servidores
✅ Deploy automático desde Git
✅ SSL gratuito

---

## 9. Escalabilidad y Rendimiento

### 9.1 Estrategias de Escalabilidad

**Horizontal (más instancias):**
- Vercel escala automáticamente funciones serverless
- PostgreSQL puede usar read replicas

**Vertical (más recursos):**
- Upgrade de plan en Vercel si se necesita
- Upgrade de BD en Railway/Render

**Caching:**
```typescript
// React Server Components con revalidación
export const revalidate = 60 // 60 segundos

export default async function MenusPage() {
  const menus = await prisma.menu.findMany()
  return <MenuList menus={menus} />
}
```

### 9.2 Métricas de Rendimiento

**Objetivos:**
- Time to First Byte (TTFB): < 600ms
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s

**Optimizaciones implementadas:**
1. Image optimization (next/image)
2. Code splitting automático
3. Server Components (menos JS)
4. Font optimization
5. Lazy loading de componentes pesados

### 9.3 Monitorización

```typescript
// Vercel Analytics
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 10. Seguridad

### 10.1 Amenazas y Mitigaciones

| Amenaza | Mitigación |
|---------|------------|
| SQL Injection | Prisma usa prepared statements |
| XSS | React escapa por defecto, CSP headers |
| CSRF | NextAuth incluye protección CSRF |
| Session hijacking | Tokens seguros, httpOnly cookies |
| Brute force login | Rate limiting en API |
| Data exposure | Roles y permisos en middleware |
| File upload | Validación tipo/tamaño, Firebase rules |

### 10.2 Headers de Seguridad

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  }
]
```

### 10.3 Autenticación y Autorización

**Flujo:**
```
Request → Middleware → Verificar session
  ↓
Session válida? → No → Redirect /auth/signin
  ↓ Sí
Ruta admin? → Sí → Role = TEACHER? → No → 403 Forbidden
  ↓ No                    ↓ Sí
Allow                   Allow
```

---

## 11. Anexos

### 11.1 Glosario Técnico

- **SSR**: Server-Side Rendering
- **SSG**: Static Site Generation
- **CSR**: Client-Side Rendering
- **ORM**: Object-Relational Mapping
- **CRUD**: Create, Read, Update, Delete
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **CSRF**: Cross-Site Request Forgery
- **XSS**: Cross-Site Scripting

### 11.2 Referencias

- [Next.js Architecture](https://nextjs.org/docs/architecture)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Vercel Edge Network](https://vercel.com/docs/concepts/edge-network)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Revisado por:** [Nombre]  
**Fecha:** Diciembre 2025  
**Versión:** 1.0
