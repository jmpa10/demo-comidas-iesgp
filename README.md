# Sistema de Reservas - IES Gregorio Prieto

Aplicación web moderna para la gestión y reserva de menús de comida preparados por los alumnos de hostelería del IES Gregorio Prieto.

## 🎯 Características

- **Autenticación con Google**: Login seguro mediante cuentas de Google
- **Dos roles de usuario**:
  - **Cliente**: Puede ver menús y hacer reservas
  - **Profesor/Admin**: Puede gestionar menús, platos y ver pedidos
- **Gestión de Menús**: Crear menús con múltiples platos
- **Fotos de Platos**: Cada plato puede tener su imagen
- **Subida de Imágenes**: 
  - 📤 Subir imágenes desde el dispositivo (Firebase Storage)
  - 🔗 Usar URLs externas (ej: Unsplash, Imgur)
  - 👁️ Vista previa en tiempo real
  - 📊 Indicador de progreso de subida
- **Compra Flexible**: Compra del menú completo o platos individuales
- **Interfaz Moderna**: Diseño limpio en tonos verdes corporativos del instituto

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ con App Router
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js con Google OAuth
- **Almacenamiento**: Firebase Storage (fotos)
- **Estilos**: Tailwind CSS
- **Componentes UI**: Shadcn/ui + Radix UI

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18.0 o superior
- **npm** o **yarn**
- **PostgreSQL** 14 o superior
- Una cuenta de **Google Cloud Platform** (para OAuth)
- Una cuenta de **Firebase** (para almacenamiento de imágenes)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd "Proyecto de Innovación"
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto copiando `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las siguientes variables:

#### Base de Datos PostgreSQL
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/reservas_gregorio_prieto"
```

#### NextAuth
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secreto-aleatorio-aqui"
```

Para generar un secreto seguro:
```bash
openssl rand -base64 32
```

#### Firebase (para almacenamiento de imágenes)
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a Configuración del proyecto > General
4. En "Tus aplicaciones", agrega una aplicación web
5. Copia las credenciales en tu `.env`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="tu-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

#### Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs y servicios" > "Credenciales"
4. Crea credenciales de "ID de cliente de OAuth 2.0"
5. Configura los orígenes autorizados:
   - `http://localhost:3000`
   - Tu dominio de producción
6. Configura las URIs de redireccionamiento:
   - `http://localhost:3000/api/auth/callback/google`
   - Tu dominio de producción + `/api/auth/callback/google`
7. Copia las credenciales:

```env
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"
```

### 4. Configurar la base de datos

#### Crear la base de datos PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE reservas_gregorio_prieto;

# Salir
\q
```

#### Ejecutar migraciones de Prisma

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# (Opcional) Abrir Prisma Studio para ver la BD
npx prisma studio
```

### 5. Ejecutar la aplicación

#### Modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

#### Modo producción
```bash
# Construir
npm run build

# Iniciar
npm start
```

## 📁 Estructura del Proyecto

```
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── public/                    # Archivos estáticos
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── api/
│   │   │   └── auth/         # Endpoints de autenticación
│   │   ├── auth/
│   │   │   └── signin/       # Página de login
│   │   ├── admin/            # Panel de administración
│   │   ├── menu/             # Páginas de menús
│   │   ├── orders/           # Gestión de pedidos
│   │   ├── profile/          # Perfil de usuario
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Página de inicio
│   │   └── globals.css       # Estilos globales
│   ├── components/
│   │   ├── ui/               # Componentes UI reutilizables
│   │   ├── navbar.tsx        # Barra de navegación
│   │   ├── menu-list.tsx     # Lista de menús
│   │   └── providers.tsx     # Proveedores de contexto
│   ├── lib/
│   │   ├── auth.ts           # Configuración de NextAuth
│   │   ├── firebase.ts       # Configuración de Firebase
│   │   ├── prisma.ts         # Cliente de Prisma
│   │   ├── format.ts         # Funciones de formato
│   │   └── utils.ts          # Utilidades generales
│   └── types/
│       └── next-auth.d.ts    # Tipos personalizados
├── .env.example              # Plantilla de variables de entorno
├── .gitignore
├── next.config.js            # Configuración de Next.js
├── package.json
├── tailwind.config.ts        # Configuración de Tailwind
└── tsconfig.json             # Configuración de TypeScript
```

## 👥 Roles de Usuario

### Cliente (CUSTOMER)
- Ver menús disponibles
- Hacer reservas de menús completos
- Comprar platos individuales
- Ver sus pedidos
- Editar su perfil

### Profesor/Admin (TEACHER/ADMIN)
- Todas las funciones de Cliente
- Crear y editar menús
- Agregar y editar platos
- Subir fotos desde dispositivo o usar URLs externas
- Ver todos los pedidos
- Activar/Desactivar menús
- Eliminar menús
- Gestionar usuarios

## 📤 Gestión de Imágenes

La aplicación ofrece dos formas de añadir imágenes:

### Opción 1: Subir desde dispositivo (Firebase Storage)
1. Haz clic en "Subir Imagen"
2. Selecciona una imagen (máx. 5MB)
3. La imagen se subirá automáticamente a Firebase Storage
4. Ver [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) para configuración

### Opción 2: URL externa
1. Haz clic en el ícono de enlace (🔗)
2. Pega la URL de una imagen (ej: desde Unsplash)
3. La imagen se mostrará sin necesidad de subir archivos

**Nota**: Si Firebase no está configurado, solo estará disponible la opción de URL. La aplicación seguirá funcionando perfectamente.

## 🔐 Seguridad

- Autenticación mediante Google OAuth 2.0
- Sesiones seguras con NextAuth.js
- Validación de roles en el servidor
- Variables de entorno para credenciales sensibles
- Conexión segura a base de datos

## 🎨 Personalización de Tema

El tema verde corporativo está definido en `src/app/globals.css`. Para personalizarlo:

```css
:root {
  --primary: 142 76% 36%;        /* Verde principal */
  --secondary: 142 30% 90%;      /* Verde secundario */
  /* ... más variables */
}
```

## 📊 Base de Datos

El esquema incluye las siguientes tablas principales:

- **User**: Usuarios del sistema
- **Account**: Cuentas OAuth
- **Session**: Sesiones de usuario
- **Menu**: Menús disponibles
- **Dish**: Platos de los menús
- **Order**: Pedidos realizados
- **OrderItem**: Ítems de cada pedido

Ver `prisma/schema.prisma` para más detalles.

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté corriendo: `sudo systemctl status postgresql`
- Comprueba las credenciales en `DATABASE_URL`
- Asegúrate de que la base de datos existe

### Error de autenticación con Google
- Verifica que las URIs de redireccionamiento estén configuradas correctamente
- Comprueba que `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` sean correctos
- Asegúrate de que `NEXTAUTH_URL` coincida con tu dominio

### Errores de Prisma
```bash
# Resetear la base de datos (¡CUIDADO: borra todos los datos!)
npx prisma db push --force-reset

# Regenerar el cliente
npx prisma generate
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Modo desarrollo
npm run build        # Construir para producción
npm start            # Iniciar servidor de producción
npm run lint         # Ejecutar linter
npx prisma studio    # Abrir interfaz de BD
npx prisma generate  # Generar cliente de Prisma
```

## 🚀 Despliegue en Producción

### Vercel (Recomendado para Next.js)

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Despliega

### Base de datos en producción

Opciones recomendadas:
- **Vercel Postgres**
- **Supabase**
- **Railway**
- **Neon**

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es para uso educativo del IES Gregorio Prieto.

## 📧 Contacto

IES Gregorio Prieto - [Web del Instituto](https://www.iesgregorioprieto.es/)

---

**Desarrollado con ❤️ para el IES Gregorio Prieto**
