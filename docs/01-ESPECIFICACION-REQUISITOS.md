# Especificación de Requisitos del Sistema (SRS)
## Sistema de Reservas de Comida - IES Gregorio Prieto

**Versión:** 1.0  
**Fecha:** Diciembre 2025  
**Proyecto:** Innovación Docente - Gestión de Reservas

---

## 1. Introducción

### 1.1 Propósito
Este documento describe los requisitos funcionales y no funcionales del Sistema de Reservas de Comida del IES Gregorio Prieto. El sistema permitirá a los alumnos y personal del centro reservar menús preparados por los estudiantes de Hostelería.

### 1.2 Alcance
**Nombre del Sistema:** Sistema de Reservas IES Gregorio Prieto

**Funcionalidades principales:**
- Gestión de usuarios con dos roles (Cliente y Profesor/Admin)
- Gestión de menús y platos por parte de administradores
- Sistema de reservas de menús completos o platos individuales
- Panel de administración para gestión de pedidos
- Autenticación segura mediante Google OAuth

### 1.3 Definiciones y Acrónimos
- **ASIR:** Administración de Sistemas Informáticos en Red
- **OAuth:** Open Authorization Protocol
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **UI/UX:** User Interface / User Experience

### 1.4 Stakeholders
- **Alumnos de Hostelería:** Preparan los menús
- **Profesores de Hostelería:** Gestionan menús y pedidos
- **Alumnos del Centro:** Realizan reservas
- **Personal del Centro:** Realizan reservas
- **Alumnos de ASIR:** Desarrolladores y mantenedores del sistema

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
Sistema web desarrollado con Next.js que se integrará con:
- Google OAuth para autenticación
- Firebase Storage para almacenamiento de imágenes
- PostgreSQL/SQLite para base de datos
- n8n para automatización de procesos

### 2.2 Funciones del Producto
1. **Autenticación y autorización** de usuarios
2. **Gestión de menús** (crear, editar, activar/desactivar, eliminar)
3. **Gestión de platos** con información e imágenes
4. **Sistema de reservas** flexible (menú completo o platos individuales)
5. **Panel administrativo** con estadísticas y gestión
6. **Notificaciones** automáticas (futuro con n8n)

### 2.3 Características de Usuario

#### Usuario Tipo 1: Cliente (CUSTOMER)
- **Perfil:** Alumnos y personal del centro
- **Nivel técnico:** Básico
- **Funciones:** Ver menús, realizar reservas, consultar sus pedidos

#### Usuario Tipo 2: Profesor/Admin (TEACHER/ADMIN)
- **Perfil:** Profesores de Hostelería
- **Nivel técnico:** Medio
- **Funciones:** Todas las de Cliente + gestión completa de menús y pedidos

### 2.4 Restricciones
- Debe ser accesible desde navegadores modernos (Chrome, Firefox, Safari, Edge)
- Debe funcionar en dispositivos móviles y tablets
- Debe cumplir con RGPD y protección de datos
- Tiempo de respuesta < 3 segundos para operaciones estándar

---

## 3. Requisitos Funcionales

### RF-001: Autenticación de Usuarios
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir a los usuarios autenticarse mediante Google OAuth o credenciales demo.

**Criterios de aceptación:**
- Login con cuenta de Google funcional
- Login con credenciales demo (desarrollo)
- Redirección automática si no está autenticado
- Sesión persistente durante navegación

---

### RF-002: Gestión de Roles
**Prioridad:** Alta  
**Descripción:** El sistema debe diferenciar entre roles de Cliente y Profesor/Admin.

**Criterios de aceptación:**
- Asignación automática de rol al crear usuario
- Restricción de acceso a rutas administrativas
- Panel de admin solo accesible para TEACHER/ADMIN

---

### RF-003: Visualización de Menús
**Prioridad:** Alta  
**Descripción:** Los usuarios deben poder ver todos los menús disponibles.

**Criterios de aceptación:**
- Lista de menús con imagen, nombre, descripción y precio
- Filtrado por disponibilidad
- Ordenación por fecha
- Vista responsive en móviles

---

### RF-004: Detalle de Menú
**Prioridad:** Alta  
**Descripción:** Los usuarios deben poder ver el detalle completo de un menú.

**Criterios de aceptación:**
- Visualización de todos los platos del menú
- Imagen, descripción y precio de cada plato
- Precio total del menú con descuento (10%)
- Opción de reservar menú completo o platos individuales

---

### RF-005: Realizar Reserva
**Prioridad:** Alta  
**Descripción:** Los usuarios deben poder realizar reservas de menús o platos.

**Criterios de aceptación:**
- Selección de menú completo o platos individuales
- Ajuste de cantidades
- Cálculo automático del total
- Confirmación visual de reserva exitosa
- Registro en base de datos con estado PENDING

---

### RF-006: Consultar Mis Pedidos
**Prioridad:** Media  
**Descripción:** Los usuarios deben poder ver el historial de sus pedidos.

**Criterios de aceptación:**
- Lista de pedidos del usuario ordenados por fecha
- Estado visual del pedido (colores/iconos)
- Detalle de platos en cada pedido
- Fecha y hora de cada pedido

---

### RF-007: Crear Menú (Admin)
**Prioridad:** Alta  
**Descripción:** Los administradores deben poder crear nuevos menús.

**Criterios de aceptación:**
- Formulario con nombre, descripción, fecha, precio
- Añadir múltiples platos dinámicamente
- Subir imagen desde dispositivo o URL
- Cálculo automático de precio sugerido (suma platos - 10%)
- Validación de campos obligatorios

---

### RF-008: Gestionar Menús (Admin)
**Prioridad:** Alta  
**Descripción:** Los administradores deben poder gestionar menús existentes.

**Criterios de aceptación:**
- Activar/desactivar disponibilidad de menús
- Eliminar menús (con confirmación)
- Ver lista completa de menús en panel admin

---

### RF-009: Subida de Imágenes
**Prioridad:** Media  
**Descripción:** El sistema debe permitir subir imágenes de menús y platos.

**Criterios de aceptación:**
- Subida desde dispositivo a Firebase Storage
- Alternativa: pegar URL externa
- Vista previa de imagen
- Validación: solo imágenes, máx 5MB
- Barra de progreso durante subida

---

### RF-010: Panel de Estadísticas (Admin)
**Prioridad:** Media  
**Descripción:** Los administradores deben ver estadísticas del sistema.

**Criterios de aceptación:**
- Total de pedidos
- Total de menús activos
- Total de usuarios registrados
- Pedidos recientes
- Listado de todos los pedidos con detalles

---

## 4. Requisitos No Funcionales

### RNF-001: Rendimiento
- Tiempo de carga de página principal < 2 segundos
- Tiempo de respuesta de API < 1 segundo
- Subida de imágenes < 10 segundos (5MB)

### RNF-002: Seguridad
- Autenticación OAuth 2.0
- Validación de sesiones en servidor
- Protección CSRF en formularios
- Sanitización de inputs
- Headers de seguridad (CSP, HSTS)
- Reglas de seguridad en Firebase Storage

### RNF-003: Usabilidad
- Interfaz intuitiva y limpia
- Diseño responsive (móvil, tablet, desktop)
- Mensajes de error claros
- Confirmación de acciones críticas
- Accesibilidad WCAG 2.1 nivel AA

### RNF-004: Mantenibilidad
- Código limpio y documentado
- Estructura modular de componentes
- Separación de capas (UI, lógica, datos)
- Sistema de versionado (Git)

### RNF-005: Escalabilidad
- Arquitectura preparada para crecimiento
- Base de datos normalizada
- Posibilidad de caché
- CDN para imágenes estáticas

### RNF-006: Disponibilidad
- Uptime 99% en horario escolar
- Sistema de backups automáticos
- Recuperación ante fallos < 1 hora

### RNF-007: Compatibilidad
- Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- Dispositivos: Móviles iOS/Android, tablets, desktops
- Resoluciones: desde 320px hasta 4K

---

## 5. Modelo de Datos

### Entidades Principales

#### User (Usuario)
- id (PK)
- email (único)
- name
- image
- role (CUSTOMER | TEACHER)
- emailVerified
- timestamps

#### Menu (Menú)
- id (PK)
- name
- description
- price
- imageUrl
- date
- available
- timestamps

#### Dish (Plato)
- id (PK)
- name
- description
- price
- imageUrl
- menuId (FK → Menu)
- timestamps

#### Order (Pedido)
- id (PK)
- userId (FK → User)
- total
- status (PENDING | CONFIRMED | READY | DELIVERED | CANCELLED)
- notes
- timestamps

#### OrderItem (Línea de Pedido)
- id (PK)
- orderId (FK → Order)
- dishId (FK → Dish)
- quantity
- price

---

## 6. Interfaces Externas

### 6.1 Interfaz de Usuario
- **Tecnología:** React + Next.js + Tailwind CSS
- **Componentes:** Shadcn/ui + Radix UI
- **Tema:** Verde corporativo IES Gregorio Prieto

### 6.2 Interfaz de Base de Datos
- **Desarrollo:** SQLite
- **Producción:** PostgreSQL
- **ORM:** Prisma

### 6.3 Interfaz de Autenticación
- **Provider:** Google OAuth 2.0
- **Framework:** NextAuth.js

### 6.4 Interfaz de Almacenamiento
- **Servicio:** Firebase Storage
- **Tipo:** Imágenes (JPEG, PNG, WebP)

---

## 7. Casos de Uso Principales

### CU-001: Reservar Menú Completo
**Actor:** Cliente  
**Flujo Principal:**
1. Usuario ve lista de menús
2. Selecciona un menú
3. Hace clic en "Reservar Menú Completo"
4. Ajusta cantidad
5. Confirma reserva
6. Sistema guarda pedido y muestra confirmación

### CU-002: Reservar Platos Individuales
**Actor:** Cliente  
**Flujo Principal:**
1. Usuario ve detalle de menú
2. Activa opción "Platos Individuales"
3. Selecciona platos deseados
4. Ajusta cantidades
5. Confirma reserva
6. Sistema guarda pedido

### CU-003: Crear Menú del Día
**Actor:** Profesor/Admin  
**Flujo Principal:**
1. Admin accede a panel de administración
2. Navega a "Crear Menú"
3. Completa información del menú
4. Añade platos con imágenes
5. Guarda menú
6. Sistema valida y crea menú en BD

### CU-004: Gestionar Pedidos
**Actor:** Profesor/Admin  
**Flujo Principal:**
1. Admin accede a panel
2. Ve lista de pedidos
3. Filtra por estado
4. Puede cambiar estado de pedidos
5. Sistema actualiza y notifica

---

## 8. Anexos

### 8.1 Glosario
- **Menú:** Conjunto de platos ofrecidos para un día específico
- **Plato:** Elemento individual de comida con precio
- **Reserva/Pedido:** Solicitud de menú o platos por un usuario
- **Disponibilidad:** Estado que indica si un menú puede ser reservado

### 8.2 Referencias
- [Documentación Next.js](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Firebase Storage](https://firebase.google.com/docs/storage)

---

**Aprobado por:** [Nombre del coordinador]  
**Fecha de aprobación:** [Fecha]
