
# Prieto Eats (IES Gregorio Prieto)

Aplicación web para reservas/venta de menús del IES Gregorio Prieto.

- Roles: **Cliente** y **Profesor/Admin**
- Stack: Next.js + Prisma + PostgreSQL + NextAuth

## Ejecutar desde DockerHub (recomendado)

Requisitos: Docker Desktop (con Docker Compose).

1) Crea tu fichero de entorno (solo una vez):

```bash
cp env/.env.dockerhub.example env/.env.dockerhub
```

Edita `env/.env.dockerhub` y cambia como mínimo `NEXTAUTH_SECRET`.

2) Arranca la app + Postgres usando la imagen publicada:

```bash
docker compose -f docker-compose.image.yml --env-file env/.env.dockerhub up -d
```

3) Abre:

- http://localhost:3000

### Login demo

Si `PRISMA_SEED=true` (viene así en el ejemplo), tendrás usuarios demo:

- Profesor: `admin@iesgregorioprieto.es`
- Cliente: `cliente@iesgregorioprieto.es`

## n8n (opcional)

La app puede notificar a n8n al crear un pedido.

- Configura `N8N_WEBHOOK_URL` en `env/.env.dockerhub`.
- Si n8n está en Docker (otro stack) exponiendo `5678` al host (macOS/Windows):
  - Producción: `http://host.docker.internal:5678/webhook/<id>`
  - Test: `http://host.docker.internal:5678/webhook-test/<id>` (solo si el workflow está “escuchando”)

## Desarrollo (desde el código)

Para desarrollo local con contenedores (build local):

```bash
docker compose up -d --build
```

Variables por defecto para docker-compose en `env/.env.docker`.

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
