# Guía de Despliegue en Producción
## Sistema de Reservas IES Gregorio Prieto

**Versión:** 1.0  
**Fecha:** Diciembre 2025

---

## 📋 Índice

1. [Introducción](#1-introducción)
2. [Prerequisitos](#2-prerequisitos)
3. [Despliegue en Vercel](#3-despliegue-en-vercel)
4. [Configuración de Base de Datos](#4-configuración-de-base-de-datos)
5. [Configuración de Firebase](#5-configuración-de-firebase)
6. [Configuración de OAuth](#6-configuración-de-oauth)
7. [Variables de Entorno](#7-variables-de-entorno)
8. [CI/CD con GitHub Actions](#8-cicd-con-github-actions)
9. [Monitorización](#9-monitorización)
10. [Backups](#10-backups)
11. [Troubleshooting](#11-troubleshooting)
12. [Despliegue con Docker](#12-despliegue-con-docker)
13. [Publicar en DockerHub](#13-publicar-en-dockerhub)

---

## 1. Introducción

Esta guía detalla el proceso completo de despliegue del Sistema de Reservas en un entorno de producción.

### 1.1 Arquitectura de Despliegue

```
GitHub Repository
      ↓
   Vercel (CI/CD)
      ↓
┌─────────────────────────┐
│  Next.js App (Vercel)   │
│  - Frontend             │
│  - API Routes           │
└───────┬─────────────────┘
        │
        ├─→ PostgreSQL (Railway)
        ├─→ Firebase Storage
        ├─→ Google OAuth
        └─→ n8n (opcional)
```

### 1.2 Checklist Rápido

- [ ] Cuenta de GitHub
- [ ] Cuenta de Vercel
- [ ] Cuenta de Railway/Render (PostgreSQL)
- [ ] Cuenta de Firebase
- [ ] Cuenta de Google Cloud (OAuth)
- [ ] Dominio personalizado (opcional)

---

## 2. Prerequisitos

### 2.1 Herramientas Necesarias

```bash
# Verificar Node.js
node --version  # >= 18.0.0

# Verificar npm
npm --version

# Instalar Vercel CLI (opcional)
npm i -g vercel

# Instalar Prisma CLI
npm i -g prisma

# (Alternativa) Docker para despliegue en contenedores
docker --version
docker compose version
```

---

## 12. Despliegue con Docker

Esta opción despliega **aplicación + base de datos** en un único `docker compose` (ideal para servidor propio / VPS / NAS).

### 12.1 Requisitos

- Docker y Docker Compose instalados.

### 12.2 Variables de entorno

El repositorio incluye un archivo de ejemplo:

- `.env.docker.example` (plantilla)
- `.env.docker` (valores por defecto para local)

Para producción, **rellena** como mínimo:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` (si usas Google)
- Variables `NEXT_PUBLIC_FIREBASE_*` (si usas Firebase)

### 12.3 Arranque (producción sencilla)

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

La app queda disponible en:

- http://localhost:3000

### 12.4 Base de datos y Prisma

En este proyecto, el contenedor ejecuta automáticamente al arrancar:

- `npx prisma migrate deploy` si existe `prisma/migrations/`
- si no existe, hace `npx prisma db push`

Si quieres poblar datos demo (solo recomendado en dev):

1) En `.env.docker` pon `PRISMA_SEED=true`
2) Reinicia:

```bash
docker compose restart app
```

### 12.5 Logs y mantenimiento

```bash
# Ver logs
docker compose logs -f app

# Parar
docker compose down

# Parar y borrar datos (⚠️ elimina la BD)
docker compose down -v
```

---

## 13. Publicar en DockerHub

### 13.1 Opción A (recomendada): GitHub Actions

El repositorio incluye un workflow en `.github/workflows/dockerhub.yml` que construye y publica la imagen en DockerHub al hacer push a `main`.

1) Crea un repositorio en DockerHub (ejemplo):

- `jmpa15/prieto-eats`

2) En GitHub → Settings → Secrets and variables → Actions → **New repository secret** añade:

- `DOCKERHUB_USERNAME` → tu usuario de DockerHub
- `DOCKERHUB_TOKEN` → un *Access Token* de DockerHub (recomendado, no uses tu password)

3) (Opcional) Cambia el nombre de imagen editando `IMAGE_NAME` en el workflow.

Tags que publica:

- `latest`
- `sha-<commit>`
- `vX.Y.Z` (cuando creas un tag Git `vX.Y.Z`)

### 13.2 Opción B: push manual desde tu máquina

```bash
# Login
docker login

# Build local
docker build -t jmpa15/prieto-eats:latest .

# Push
docker push jmpa15/prieto-eats:latest
```

### 13.3 Ejecutar desde DockerHub en un servidor

Ejemplo de despliegue usando la imagen publicada y Postgres en el mismo `docker compose`:

1) En el servidor, copia `.env.docker` y ajusta variables.
2) En `docker-compose.yml`, cambia el servicio `app` para usar `image:` en lugar de `build:`:

```yaml
  app:
    image: jmpa15/prieto-eats:latest
    env_file:
      - .env.docker
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3000:3000"
```

Y arranca:

```bash
docker compose up -d
```

### 2.2 Repositorio Git

```bash
# Asegúrate de que tu código esté en GitHub
git remote -v
# origin  https://github.com/jmpa10/demo-comidas-iesgp.git

# Actualizar a la última versión
git checkout main
git pull origin main
```

---

## 3. Despliegue en Vercel

### 3.1 Crear Cuenta

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Sign Up"
3. Conecta con GitHub
4. Autoriza Vercel para acceder a tus repositorios

### 3.2 Importar Proyecto

1. Click en "Add New..." → "Project"
2. Selecciona tu repositorio `demo-comidas-iesgp`
3. Click en "Import"

### 3.3 Configurar Build

Vercel detectará automáticamente Next.js. Configuración recomendada:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: (dejar vacío, usa .next por defecto)
Install Command: npm install
Development Command: npm run dev
```

### 3.4 Variables de Entorno

**⚠️ NO hacer deploy todavía. Primero configura las variables de entorno.**

Click en "Environment Variables" y añade:

```env
# Base de datos (configurar después)
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXTAUTH_SECRET=genera-secreto-aleatorio-aqui

# Google OAuth (configurar después)
GOOGLE_CLIENT_ID=tu-client-id
GOOGLE_CLIENT_SECRET=tu-client-secret

# Firebase (configurar después)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# n8n (opcional)
N8N_WEBHOOK_URL=https://tu-n8n.com/webhook/...
```

**Generar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3.5 Deploy Inicial

1. Click en "Deploy"
2. Espera a que termine (2-3 minutos)
3. ⚠️ Fallará porque aún no hay BD configurada - ¡Es normal!

---

## 4. Configuración de Base de Datos

### Opción A: Railway (Recomendado)

#### 4.1 Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Sign up con GitHub
3. Verifica email

#### 4.2 Crear Proyecto PostgreSQL

1. Click en "New Project"
2. Selecciona "Provision PostgreSQL"
3. Espera a que se cree (1-2 minutos)

#### 4.3 Obtener Credenciales

1. Click en tu base de datos PostgreSQL
2. Ve a "Connect" tab
3. Copia "Postgres Connection URL"

Formato:
```
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway
```

#### 4.4 Actualizar Variables en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Edita `DATABASE_URL` y pega la URL de Railway
4. Click en "Save"

#### 4.5 Aplicar Migraciones

**Opción 1: Desde local**
```bash
# En tu máquina local
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." node prisma/seed.js
```

**Opción 2: Desde Vercel (recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link a tu proyecto
vercel link

# Ejecutar comandos en Vercel
vercel exec -- npx prisma db push
vercel exec -- node prisma/seed.js
```

### Opción B: Render

#### 4.1 Crear Base de Datos en Render

1. Ve a [render.com](https://render.com)
2. Sign up
3. Click en "New +" → "PostgreSQL"
4. Configuración:
   - Name: `comidas-iesgp-db`
   - Region: Frankfurt (más cercano a España)
   - Plan: Free
5. Click en "Create Database"

#### 4.2 Obtener Credenciales

En la página de tu BD:
- Internal Database URL (para usar desde backend)
- External Database URL (para usar desde local)

Copia "Internal Database URL" y actualiza Vercel.

### Opción C: Vercel Postgres

1. En tu proyecto de Vercel
2. Storage tab → "Create Database"
3. Selecciona "Postgres"
4. Click en "Continue"
5. Se configurará automáticamente

---

## 5. Configuración de Firebase

### 5.1 Crear Proyecto

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Click en "Agregar proyecto"
3. Nombre: `comidas-iesgp`
4. Deshabilita Google Analytics (opcional)
5. Click en "Crear proyecto"

### 5.2 Habilitar Storage

1. En el menú lateral: "Storage"
2. Click en "Comenzar"
3. Reglas de seguridad: "Producción"
4. Ubicación: `europe-west3` (Frankfurt)
5. Click en "Listo"

### 5.3 Configurar Reglas

En Storage → Rules, reemplaza con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Solo usuarios autenticados pueden escribir
    match /menus/{fileName} {
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    match /dishes/{fileName} {
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 5.4 Obtener Credenciales

1. Click en ⚙️ (Configuración) → "Configuración del proyecto"
2. En "Tus apps", click en </> (web)
3. Nombre: `comidas-iesgp-web`
4. No marcar Firebase Hosting
5. Click en "Registrar app"
6. Copia las credenciales:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "comidas-iesgp.firebaseapp.com",
  projectId: "comidas-iesgp",
  storageBucket: "comidas-iesgp.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 5.5 Actualizar Variables en Vercel

Añade en Vercel Environment Variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=comidas-iesgp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=comidas-iesgp
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=comidas-iesgp.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

## 6. Configuración de OAuth

### 6.1 Crear Proyecto en Google Cloud

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Click en selector de proyectos → "Nuevo proyecto"
3. Nombre: `Comidas IES Gregorio Prieto`
4. Click en "Crear"

### 6.2 Configurar Pantalla de Consentimiento

1. Menú → "APIs y servicios" → "Pantalla de consentimiento de OAuth"
2. Tipo: "Externo"
3. Click en "Crear"
4. Configurar:
   - Nombre de la app: `Sistema de Reservas IES GP`
   - Email de asistencia: tu email
   - Dominios autorizados: (dejar vacío por ahora)
   - Email del desarrollador: tu email
5. Click en "Guardar y continuar"
6. Scopes: Dejar por defecto
7. Usuarios de prueba: Añade emails de prueba
8. Click en "Guardar y continuar"

### 6.3 Crear Credenciales OAuth

1. "APIs y servicios" → "Credenciales"
2. Click en "+ Crear credenciales" → "ID de cliente de OAuth 2.0"
3. Tipo: "Aplicación web"
4. Nombre: `Web Client`
5. Orígenes autorizados:
   ```
   https://tu-proyecto.vercel.app
   http://localhost:3000
   ```
6. URIs de redireccionamiento:
   ```
   https://tu-proyecto.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
7. Click en "Crear"
8. Copia:
   - ID de cliente
   - Secreto de cliente

### 6.4 Actualizar Variables en Vercel

```env
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
```

### 6.5 Actualizar NEXTAUTH_URL

```env
NEXTAUTH_URL=https://tu-proyecto.vercel.app
```

---

## 7. Variables de Entorno

### 7.1 Lista Completa

```env
# === Base de Datos ===
DATABASE_URL=postgresql://user:pass@host:5432/db

# === NextAuth ===
NEXTAUTH_URL=https://tu-proyecto.vercel.app
NEXTAUTH_SECRET=abc123...

# === Google OAuth ===
GOOGLE_CLIENT_ID=123-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# === Firebase ===
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc

# === n8n (Opcional) ===
N8N_WEBHOOK_URL=https://n8n.com/webhook/...
```

### 7.2 Environments en Vercel

Vercel soporta 3 ambientes:

- **Production**: Rama `main`
- **Preview**: PRs y otras ramas
- **Development**: Local

Puedes configurar variables específicas por ambiente:
1. Settings → Environment Variables
2. Selecciona environment(s) al añadir variable

---

## 8. CI/CD con GitHub Actions

### 8.1 Crear Workflow

`.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit
      
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: file:./test.db
      
      - name: Build
        run: npm run build
  
  deploy-preview:
    needs: lint-and-test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

### 8.2 Configurar Secrets

En GitHub:
1. Settings → Secrets and variables → Actions
2. New repository secret

Añadir:
- `VERCEL_TOKEN`: Obtener de vercel.com/account/tokens
- `VERCEL_ORG_ID`: En Vercel Settings → General
- `VERCEL_PROJECT_ID`: En Vercel Settings → General

---

## 9. Monitorización

### 9.1 Vercel Analytics

1. En tu proyecto de Vercel
2. Analytics tab
3. Click en "Enable Analytics"
4. Añade en `layout.tsx`:

```tsx
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

### 9.2 Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

`sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### 9.3 UptimeRobot

1. Ve a [uptimerobot.com](https://uptimerobot.com)
2. Sign up (gratis)
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: https://tu-proyecto.vercel.app
   - Interval: 5 minutes
4. Configura alertas por email

---

## 10. Backups

### 10.1 Backup de Base de Datos

**Script manual:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/backup_$DATE.sql
```

**Automatizado con n8n:**
1. Schedule Trigger: Daily at 2:00 AM
2. Execute Command: `pg_dump`
3. Upload to Google Drive/Dropbox
4. Send notification email

### 10.2 Backup de Firebase

Firebase Storage no necesita backup manual (replicación automática).

Para peace of mind:
- Descarga imágenes importantes periódicamente
- Usa Firebase Admin SDK para export programático

---

## 11. Troubleshooting

### 11.1 Error: "Database connection failed"

```bash
# Verificar URL de conexión
echo $DATABASE_URL

# Probar conexión
psql $DATABASE_URL

# Verificar que Prisma esté configurado
npx prisma db push
```

### 11.2 Error: "NextAuth session null"

Verificar:
- `NEXTAUTH_URL` coincide con URL de producción
- `NEXTAUTH_SECRET` está configurado
- Cookies habilitadas en navegador

### 11.3 Error: "Firebase upload failed"

Verificar:
- Reglas de Storage configuradas correctamente
- Usuario autenticado
- Tamaño de imagen < 5MB
- Tipo de archivo es imagen

### 11.4 Build Failed en Vercel

```bash
# Ver logs completos en Vercel dashboard
# Errores comunes:

# TypeScript errors
npm run build  # Probar localmente primero

# Missing dependencies
npm install

# Environment variables
# Verificar que todas estén configuradas
```

### 11.5 Rollback a Versión Anterior

En Vercel:
1. Deployments tab
2. Encuentra deployment que funcionaba
3. Click en "⋯" → "Promote to Production"

---

## 12. Checklist Post-Deploy

- [ ] Aplicación accesible en URL de producción
- [ ] Login con Google funciona
- [ ] Login con usuarios demo funciona
- [ ] Menús se muestran correctamente
- [ ] Imágenes cargan correctamente
- [ ] Reservas se guardan en BD
- [ ] Panel admin accesible para TEACHER
- [ ] Crear menú funciona
- [ ] Subir imágenes funciona
- [ ] SSL activo (HTTPS)
- [ ] Analytics configurado
- [ ] Monitoring activo
- [ ] Backups configurados
- [ ] Documentación actualizada con URLs

---

## 13. Comandos Útiles

```bash
# Ver logs en Vercel
vercel logs

# Ejecutar comando en producción
vercel exec -- [comando]

# Listar deployments
vercel ls

# Ver información del proyecto
vercel inspect

# Alias de dominio
vercel alias set [deployment-url] [custom-domain]

# Variables de entorno
vercel env ls
vercel env add [nombre]
vercel env rm [nombre]
```

---

## 14. Contacto de Soporte

**Problemas con el deploy:**
- GitHub: [repo]/issues
- Email coordinador: [email]

**Documentación oficial:**
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Firebase Docs](https://firebase.google.com/docs)

---

**¡Felicidades! Tu aplicación está en producción 🎉**

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.0
