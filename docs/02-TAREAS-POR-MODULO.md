# Guía de Tareas por Módulo Profesional
## Proyecto de Innovación - Sistema de Reservas IES Gregorio Prieto

**Curso:** 2º ASIR  
**Fecha:** Diciembre 2025  
**Duración estimada del proyecto:** 8-10 semanas

---

## 📋 Índice de Módulos Participantes

1. [Seguridad](#1-seguridad-2º-asir)
2. [Proyecto Intermodular (n8n)](#2-proyecto-intermodular-n8n)
3. [Servicios de Red e Internet](#3-servicios-de-red-e-internet)
4. [Actividades Transversales](#4-actividades-transversales)

---

## 1. Seguridad (2º ASIR)

### 🎯 Objetivo General
Auditar, asegurar y endurecer la aplicación web y su infraestructura, garantizando la protección de datos de usuarios y cumplimiento de estándares de seguridad.

### 📝 Tareas Asignadas

#### Tarea 1.1: Auditoría de Seguridad de la Aplicación
**Prioridad:** Alta  
**Tiempo estimado:** 6-8 horas  
**Dificultad:** Media

**Descripción:**
Realizar una auditoría completa de seguridad de la aplicación identificando vulnerabilidades del OWASP Top 10.

**Actividades:**
1. Instalar y configurar OWASP ZAP o Burp Suite
2. Realizar escaneo automático de la aplicación
3. Pruebas manuales de:
   - Inyección SQL (inputs de formularios)
   - XSS (Cross-Site Scripting)
   - CSRF (Cross-Site Request Forgery)
   - Autenticación y gestión de sesiones
   - Configuración incorrecta de seguridad
4. Documentar hallazgos con screenshots
5. Clasificar vulnerabilidades por severidad

**Entregables:**
- Informe de auditoría en formato PDF/Markdown
- Lista de vulnerabilidades con clasificación (Crítica/Alta/Media/Baja)
- Screenshots de evidencias
- Recomendaciones de corrección

**Herramientas:**
- OWASP ZAP
- Burp Suite (versión Community)
- Postman (para API testing)

**Criterios de evaluación:**
- [ ] Identificadas al menos 5 vulnerabilidades potenciales
- [ ] Documentación clara con ejemplos
- [ ] Clasificación correcta por severidad
- [ ] Propuestas de solución viables

---

#### Tarea 1.2: Revisión y Hardening de Firebase Storage
**Prioridad:** Alta  
**Tiempo estimado:** 4-6 horas  
**Dificultad:** Media

**Descripción:**
Revisar las reglas de seguridad de Firebase Storage y realizar pruebas de acceso no autorizado.

**Actividades:**
1. Analizar las reglas actuales de Firebase Storage
2. Identificar posibles brechas de seguridad
3. Realizar pruebas de:
   - Acceso sin autenticación
   - Subida de archivos maliciosos
   - Acceso a archivos de otros usuarios
   - Bypass de validaciones de tipo/tamaño
4. Proponer reglas mejoradas
5. Implementar y probar nuevas reglas

**Entregables:**
- Documento con análisis de reglas actuales
- Informe de pruebas de penetración realizadas
- Propuesta de reglas mejoradas (código)
- PR en GitHub con las reglas actualizadas

**Reglas a validar:**
```javascript
// Comprobar que se valida:
- Solo usuarios autenticados pueden subir
- Límite de tamaño (5MB)
- Solo tipos de imagen permitidos
- Lectura pública pero escritura restringida
```

**Criterios de evaluación:**
- [ ] Identificados al menos 3 problemas de seguridad
- [ ] Pruebas documentadas con evidencias
- [ ] Reglas mejoradas funcionando correctamente
- [ ] No se rompe funcionalidad existente

---

#### Tarea 1.3: Headers de Seguridad HTTP
**Prioridad:** Media  
**Tiempo estimado:** 3-4 horas  
**Dificultad:** Baja

**Descripción:**
Implementar headers de seguridad HTTP en la aplicación Next.js.

**Actividades:**
1. Auditar headers actuales con herramientas online
2. Investigar mejores prácticas de headers de seguridad
3. Implementar en `next.config.js`:
   - Content Security Policy (CSP)
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security (HSTS)
   - Referrer-Policy
4. Probar que no rompen funcionalidad
5. Validar con herramientas de análisis

**Entregables:**
- Análisis de headers antes/después
- Código de configuración en `next.config.js`
- Captura de validación con SecurityHeaders.com
- PR en GitHub

**Ejemplo de configuración:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          // ... más headers
        ],
      },
    ]
  },
}
```

**Criterios de evaluación:**
- [ ] Todos los headers críticos implementados
- [ ] Puntuación A en SecurityHeaders.com
- [ ] Funcionalidad no afectada
- [ ] Documentación clara

---

#### Tarea 1.4: Análisis de Dependencias
**Prioridad:** Media  
**Tiempo estimado:** 2-3 horas  
**Dificultad:** Baja

**Descripción:**
Auditar las dependencias del proyecto buscando vulnerabilidades conocidas.

**Actividades:**
1. Ejecutar `npm audit` y analizar resultados
2. Usar Snyk o GitHub Dependabot
3. Identificar vulnerabilidades críticas y altas
4. Investigar y proponer actualizaciones
5. Probar que las actualizaciones no rompen el código

**Entregables:**
- Informe de vulnerabilidades encontradas
- Plan de actualización de dependencias
- PR con actualizaciones aplicadas
- Verificación de que todo funciona

**Comandos útiles:**
```bash
npm audit
npm audit fix
npx snyk test
```

**Criterios de evaluación:**
- [ ] Todas las vulnerabilidades críticas resueltas
- [ ] Informe detallado con justificaciones
- [ ] Tests pasando después de actualizaciones
- [ ] Documentación de cambios

---

#### Tarea 1.5: Documento de Buenas Prácticas
**Prioridad:** Baja  
**Tiempo estimado:** 2-3 horas  
**Dificultad:** Baja

**Descripción:**
Crear un documento de buenas prácticas de seguridad para futuros desarrolladores.

**Entregables:**
- Guía de buenas prácticas (Markdown)
- Checklist de seguridad para PRs
- Ejemplos de código seguro vs inseguro

---

## 2. Proyecto Intermodular (n8n)

### 🎯 Objetivo General
Automatizar procesos y crear integraciones usando n8n para mejorar la eficiencia operativa del sistema.

### 📝 Tareas Asignadas

#### Tarea 2.1: Configuración de Entorno n8n
**Prioridad:** Alta  
**Tiempo estimado:** 2-3 horas  
**Dificultad:** Baja

**Descripción:**
Instalar y configurar n8n en servidor local o cloud.

**Actividades:**
1. Instalar n8n (Docker o npm)
2. Configurar acceso seguro
3. Crear cuenta de servicio
4. Documentar instalación

**Entregables:**
- Guía de instalación paso a paso
- n8n funcionando y accesible
- Credenciales de prueba configuradas

**Comando de instalación:**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

---

#### Tarea 2.2: Workflow de Confirmación de Pedido
**Prioridad:** Alta  
**Tiempo estimado:** 4-6 horas  
**Dificultad:** Media

**Descripción:**
Crear un workflow que envíe email de confirmación cuando se realiza un pedido.

**Actividades:**
1. Configurar webhook receiver en n8n
2. Crear endpoint en Next.js que llame al webhook
3. Configurar nodo de Email (Gmail/SMTP)
4. Diseñar plantilla HTML del email
5. Probar flujo completo

**Flujo del workflow:**
```
Webhook → Procesar datos → Formatear mensaje → Enviar email
```

**Entregables:**
- Workflow exportado (.json)
- Código de integración en API de Next.js
- Plantilla de email HTML
- Documentación de configuración
- Video demo del flujo funcionando

**Ejemplo de integración:**
```typescript
// En /api/orders/route.ts
await fetch('https://n8n.tu-servidor.com/webhook/order-confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: user.email,
    name: user.name,
    orderId: order.id,
    total: order.total,
    items: order.items,
  }),
});
```

**Criterios de evaluación:**
- [ ] Email se envía correctamente
- [ ] Plantilla profesional y legible
- [ ] Información completa del pedido
- [ ] Manejo de errores implementado

---

#### Tarea 2.3: Exportación a Google Sheets
**Prioridad:** Media  
**Tiempo estimado:** 4-5 horas  
**Dificultad:** Media

**Descripción:**
Crear workflow que copie todos los pedidos a Google Sheets para seguimiento.

**Actividades:**
1. Configurar conexión con Google Sheets API
2. Crear hoja de cálculo plantilla
3. Diseñar workflow para insertar pedidos
4. Configurar trigger (webhook o cron)
5. Añadir formateo condicional

**Estructura de Google Sheet:**
| Fecha | ID Pedido | Cliente | Email | Total | Estado | Platos |

**Entregables:**
- Workflow exportado
- Google Sheet plantilla compartida
- Documentación de configuración
- Video tutorial

---

#### Tarea 2.4: Backup Automático de Base de Datos
**Prioridad:** Media  
**Tiempo estimado:** 3-4 horas  
**Dificultad:** Media

**Descripción:**
Automatizar backups diarios de la base de datos.

**Actividades:**
1. Crear script de backup (pg_dump o export)
2. Configurar workflow con Schedule Trigger
3. Subir backup a almacenamiento (Drive/Dropbox)
4. Configurar notificación de éxito/error
5. Probar restauración

**Frecuencia:** Diario a las 02:00 AM

**Entregables:**
- Workflow exportado
- Script de backup y restore
- Documentación completa
- Prueba de restauración exitosa

---

#### Tarea 2.5: Dashboard de Monitorización
**Prioridad:** Baja  
**Tiempo estimado:** 3-4 horas  
**Dificultad:** Media-Alta

**Descripción:**
Crear workflow que recopile estadísticas diarias y las envíe por email/Slack.

**Estadísticas a recopilar:**
- Pedidos del día
- Ingresos totales
- Menús más solicitados
- Nuevos usuarios

**Entregables:**
- Workflow exportado
- Plantilla de reporte HTML/Markdown
- Configuración de notificaciones

---

## 3. Servicios de Red e Internet

### 🎯 Objetivo General
Desplegar, monitorizar y mantener la infraestructura del sistema en producción.

### 📝 Tareas Asignadas

#### Tarea 3.1: Despliegue en Vercel
**Prioridad:** Alta  
**Tiempo estimado:** 4-6 horas  
**Dificultad:** Media

**Descripción:**
Desplegar la aplicación Next.js en Vercel (o alternativa).

**Actividades:**
1. Crear cuenta en Vercel
2. Conectar repositorio de GitHub
3. Configurar variables de entorno
4. Realizar primer despliegue
5. Configurar dominio personalizado (opcional)
6. Probar funcionalidad en producción

**Variables de entorno necesarias:**
```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
...
```

**Entregables:**
- URL de la aplicación desplegada
- Documento de runbook de despliegue
- Checklist de verificación post-deploy
- Video tutorial del proceso

**Criterios de evaluación:**
- [ ] Aplicación funcional en producción
- [ ] Todas las features funcionando
- [ ] SSL configurado correctamente
- [ ] Documentación completa

---

#### Tarea 3.2: Configuración de Base de Datos PostgreSQL
**Prioridad:** Alta  
**Tiempo estimado:** 3-4 horas  
**Dificultad:** Media

**Descripción:**
Configurar PostgreSQL en Railway/Render/Vercel Postgres.

**Actividades:**
1. Crear instancia de PostgreSQL
2. Configurar Prisma para producción
3. Ejecutar migraciones
4. Ejecutar seed de datos
5. Verificar conexión

**Entregables:**
- Credenciales de base de datos (seguras)
- Scripts de migración aplicados
- Backup inicial
- Documentación de conexión

**Migración de SQLite a PostgreSQL:**
```bash
# Actualizar schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# Generar y aplicar
npx prisma generate
npx prisma db push
node prisma/seed.js
```

---

#### Tarea 3.3: CI/CD con GitHub Actions
**Prioridad:** Media  
**Tiempo estimado:** 5-7 horas  
**Dificultad:** Media-Alta

**Descripción:**
Configurar pipeline de integración y despliegue continuo.

**Actividades:**
1. Crear workflow de CI en `.github/workflows/`
2. Configurar tests automáticos
3. Lint y type checking
4. Build verification
5. Deploy automático a staging/producción

**Pipeline:**
```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    - Checkout code
    - Install dependencies
    - Run linter
    - Run type check
    - Run tests
  deploy:
    - Deploy to Vercel
    - Run smoke tests
```

**Entregables:**
- Archivo `.github/workflows/ci.yml`
- Badge de estado en README
- Documentación del pipeline
- Configuración de secretos

---

#### Tarea 3.4: Configuración de Backups
**Prioridad:** Alta  
**Tiempo estimado:** 3-4 horas  
**Dificultad:** Media

**Descripción:**
Implementar sistema de backups automáticos y procedimiento de restore.

**Actividades:**
1. Configurar backups automáticos en proveedor de BD
2. Crear script manual de backup
3. Documentar procedimiento de restore
4. Realizar prueba de restauración
5. Configurar alertas de fallo

**Frecuencia de backups:**
- Diario: completo
- Semanal: archivado
- Mensual: archivado largo plazo

**Entregables:**
- Scripts de backup y restore
- Runbook de recuperación ante desastres
- Prueba documentada de restore
- Configuración de alertas

**Script de backup ejemplo:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
# Subir a storage...
```

---

#### Tarea 3.5: Monitorización y Logs
**Prioridad:** Media  
**Tiempo estimado:** 4-5 horas  
**Dificultad:** Media

**Descripción:**
Configurar sistema de monitorización y gestión de logs.

**Actividades:**
1. Configurar Vercel Analytics (o similar)
2. Integrar Sentry para error tracking
3. Configurar alertas de downtime
4. Dashboard de métricas
5. Documentar acceso y uso

**Métricas a monitorizar:**
- Uptime / Downtime
- Tiempo de respuesta
- Errores 500
- Uso de recursos
- Tráfico de usuarios

**Herramientas:**
- Vercel Analytics
- Sentry
- UptimeRobot
- Google Analytics (opcional)

**Entregables:**
- Configuración de Sentry
- Dashboard de métricas
- Configuración de alertas
- Guía de interpretación de métricas

---

#### Tarea 3.6: Documentación de Infraestructura
**Prioridad:** Media  
**Tiempo estimado:** 3-4 horas  
**Dificultad:** Baja

**Descripción:**
Crear documentación completa de arquitectura e infraestructura.

**Entregables:**
- Diagrama de arquitectura
- Inventario de servicios
- Matriz de responsabilidades
- Contactos de soporte
- Procedimientos de emergencia

---

## 4. Actividades Transversales

### 4.1 Testing y QA

#### Tarea T.1: Tests Unitarios
**Módulos:** Todos  
**Tiempo:** 6-8 horas

**Descripción:**
Crear tests unitarios para componentes críticos.

**Herramientas:** Jest + React Testing Library

**Componentes a testear:**
- Formularios
- Componentes de autenticación
- Cálculos de precios
- Validaciones

**Entregables:**
- Suite de tests con cobertura > 60%
- Documentación de tests

---

#### Tarea T.2: Tests E2E
**Módulos:** Todos  
**Tiempo:** 6-8 horas

**Descripción:**
Tests end-to-end de flujos principales.

**Herramientas:** Playwright o Cypress

**Flujos a testear:**
1. Login y logout
2. Ver menús y hacer reserva
3. Crear menú (admin)
4. Ver mis pedidos

**Entregables:**
- Suite de tests E2E
- Videos de ejecución
- Documentación

---

### 4.2 Documentación

#### Tarea T.3: Manual de Usuario
**Módulos:** Todos  
**Tiempo:** 4-5 horas

**Entregables:**
- Manual para clientes
- Manual para administradores
- FAQs
- Capturas de pantalla

---

#### Tarea T.4: Documentación Técnica
**Módulos:** Todos  
**Tiempo:** 3-4 horas

**Entregables:**
- Arquitectura del sistema
- Guía de desarrollo
- Guía de contribución
- Convenciones de código

---

### 4.3 Presentación Final

#### Tarea T.5: Demo Day
**Módulos:** Todos  
**Tiempo:** 2-3 horas preparación + presentación

**Formato:**
- 10-15 minutos por grupo
- Demo en vivo
- Presentación de resultados
- Lecciones aprendidas

**Estructura:**
1. Introducción (1 min)
2. Tareas realizadas (3-4 min)
3. Demo en vivo (5-7 min)
4. Resultados y métricas (2 min)
5. Conclusiones (1-2 min)
6. Q&A (3 min)

---

## 5. Cronograma Sugerido

### Semana 1-2: Setup y Preparación
- Configuración de entornos
- Formación en herramientas
- Asignación definitiva de tareas

### Semana 3-4: Sprint 1 - Infraestructura
- Despliegue básico
- Base de datos producción
- CI/CD básico

### Semana 5-6: Sprint 2 - Seguridad y Automatización
- Auditoría de seguridad
- Implementación de correcciones
- Workflows de n8n

### Semana 7-8: Sprint 3 - Monitorización y Testing
- Configuración de monitorización
- Tests automáticos
- Backups y recovery

### Semana 9: Sprint 4 - Documentación
- Completar toda la documentación
- Preparar presentaciones

### Semana 10: Demo y Entrega
- Presentaciones finales
- Evaluación
- Retrospectiva

---

## 6. Recursos y Herramientas

### Accesos Necesarios
- [ ] Repositorio GitHub
- [ ] Cuenta Vercel/Railway
- [ ] Firebase Console
- [ ] n8n instance
- [ ] Google Cloud Console
- [ ] Herramientas de testing

### Comunicación
- Discord/Slack del proyecto
- GitHub Issues y Projects
- Reuniones semanales

### Documentación de Referencia
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [n8n Docs](https://docs.n8n.io/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Docs](https://vercel.com/docs)

---

## 7. Criterios de Evaluación

### Evaluación Individual (60%)
- Completitud de tareas asignadas (30%)
- Calidad técnica del trabajo (20%)
- Documentación entregada (10%)

### Evaluación Grupal (30%)
- Trabajo en equipo (10%)
- Integración entre módulos (10%)
- Presentación final (10%)

### Bonus (10%)
- Iniciativa y mejoras extra
- Ayuda a compañeros
- Contribuciones destacadas

---

## 8. Contactos y Soporte

**Coordinador del Proyecto:**  
[Nombre] - [email]

**Profesores Responsables:**
- **Seguridad:** [Nombre]
- **Proyecto Intermodular:** [Nombre]
- **Servicios de Red:** [Nombre]

**Horario de Consultas:**  
[Especificar horarios]

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.0
