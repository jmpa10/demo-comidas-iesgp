# Configuración de Firebase Storage

Este documento explica cómo configurar Firebase Storage para subir imágenes en la aplicación.

## Pasos para configurar Firebase

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o selecciona un proyecto existente
3. Sigue los pasos del asistente para crear el proyecto

### 2. Habilitar Firebase Storage

1. En la consola de Firebase, ve a **Storage** en el menú lateral
2. Haz clic en "Comenzar"
3. Acepta las reglas de seguridad predeterminadas (las modificaremos después)
4. Selecciona una ubicación para tu bucket de Storage (ej: europe-west3)

### 3. Configurar reglas de seguridad

En la pestaña **Rules** de Storage, reemplaza las reglas con:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Permitir lectura pública de todas las imágenes
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Permitir escritura solo a usuarios autenticados en carpetas específicas
    match /menus/{fileName} {
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024 // Máximo 5MB
                   && request.resource.contentType.matches('image/.*');
    }
    
    match /dishes/{fileName} {
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024 // Máximo 5MB
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

**Nota**: Estas reglas permiten:
- ✅ Cualquiera puede **leer** (ver) las imágenes
- ✅ Solo usuarios autenticados pueden **subir** imágenes
- ✅ Límite de tamaño de 5MB por imagen
- ✅ Solo archivos de tipo imagen

### 4. Obtener las credenciales de Firebase

1. En la consola de Firebase, ve a **Configuración del proyecto** (⚙️ > Project Settings)
2. En la sección "Tus apps", selecciona la app web (</>) o crea una nueva
3. Copia las credenciales del `firebaseConfig`

### 5. Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

2. Abre `.env.local` y completa las variables de Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123"
```

### 6. Reiniciar el servidor de desarrollo

```bash
npm run dev
```

## Uso del componente ImageUpload

El componente `ImageUpload` se usa automáticamente en:

- **Formulario de crear menú**: Para la imagen principal del menú
- **Formulario de platos**: Para la imagen de cada plato

### Características:

✨ **Subir desde dispositivo**: Click en "Subir Imagen" para seleccionar un archivo
✨ **URL externa**: Click en el ícono de enlace para pegar una URL (ej: Unsplash)
✨ **Vista previa**: Muestra la imagen seleccionada
✨ **Barra de progreso**: Indica el progreso de subida
✨ **Validación**: Solo acepta imágenes de máximo 5MB
✨ **Eliminar imagen**: Click en la X para remover la imagen seleccionada

## Estructura de carpetas en Storage

```
firebase-storage-bucket/
├── menus/
│   ├── 1696339200000_menu_lunes.jpg
│   ├── 1696339201000_menu_martes.jpg
│   └── ...
└── dishes/
    ├── 1696339300000_ensalada_mixta.jpg
    ├── 1696339301000_pollo_asado.jpg
    └── ...
```

## Solución de problemas

### Error: "Firebase: Error (auth/operation-not-allowed)"

- Asegúrate de habilitar Storage en la consola de Firebase
- Verifica que las reglas de seguridad estén configuradas correctamente

### Error: "Permission denied"

- Verifica que el usuario esté autenticado antes de subir imágenes
- Revisa las reglas de seguridad en Storage

### Las imágenes no se cargan

- Verifica que el dominio `firebasestorage.googleapis.com` esté en `next.config.js`
- Comprueba que las variables de entorno estén correctamente configuradas
- Reinicia el servidor de desarrollo después de cambiar las variables de entorno

### Error de tamaño de archivo

- El límite es 5MB por imagen
- Considera optimizar las imágenes antes de subirlas (puedes usar herramientas como TinyPNG)

## Alternativa: Continuar usando URLs externas

Si prefieres no configurar Firebase Storage por ahora, puedes:

1. Usar URLs de servicios como [Unsplash](https://unsplash.com/)
2. Click en el ícono de enlace (🔗) en el componente ImageUpload
3. Pegar la URL de la imagen
4. Las imágenes de Unsplash ya están configuradas en `next.config.js`

Ejemplo de URL de Unsplash:
```
https://images.unsplash.com/photo-1546069901-ba9599a7e63c
```

---

**¿Necesitas ayuda?** Consulta la [documentación oficial de Firebase Storage](https://firebase.google.com/docs/storage)
