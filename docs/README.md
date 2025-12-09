# README - Documentación del Proyecto

Bienvenido a la documentación completa del **Sistema de Reservas de Comida del IES Gregorio Prieto**.

Esta carpeta contiene toda la documentación necesaria para desarrolladores, profesores y alumnos que participan en el proyecto de innovación docente.

---

## 📚 Documentos Disponibles

### 1. [Especificación de Requisitos (SRS)](./01-ESPECIFICACION-REQUISITOS.md)
**¿Qué es?** Documento formal que describe QUÉ debe hacer el sistema.

**Contenido:**
- Requisitos funcionales (RF-001 a RF-010)
- Requisitos no funcionales (rendimiento, seguridad, usabilidad)
- Casos de uso principales
- Modelo de datos
- Restricciones y limitaciones

**Para quién:**
- ✅ Profesores: Para entender el alcance del proyecto
- ✅ Alumnos: Para saber qué features implementar
- ✅ Evaluadores: Para verificar cumplimiento

---

### 2. [Tareas por Módulo Profesional](./02-TAREAS-POR-MODULO.md)
**¿Qué es?** Guía práctica de tareas asignadas a cada módulo de 2º ASIR.

**Contenido:**
- **Seguridad**: Auditoría, hardening, headers HTTP
- **Proyecto Intermodular (n8n)**: Automatizaciones y webhooks
- **Servicios de Red**: Despliegue, CI/CD, monitorización
- Actividades transversales (testing, documentación)
- Cronograma sugerido (10 semanas)
- Criterios de evaluación

**Para quién:**
- ✅ Alumnos: Lista de tareas concretas a realizar
- ✅ Profesores: Asignación y seguimiento de trabajo
- ✅ Coordinadores: Planificación del proyecto

---

### 3. [Guía de Desarrollo](./03-GUIA-DESARROLLO.md)
**¿Qué es?** Manual técnico para desarrollar y mantener el código.

**Contenido:**
- Setup inicial (clonar, instalar, configurar)
- Arquitectura del proyecto
- Estructura de carpetas detallada
- Convenciones de código (TypeScript, React, Git)
- Flujo de trabajo con Git (branching, commits, PRs)
- Testing (unitarios y E2E)
- Troubleshooting común

**Para quién:**
- ✅ Alumnos desarrolladores: Guía día a día
- ✅ Nuevos colaboradores: Onboarding rápido
- ✅ Mantenedores futuros: Referencia técnica

---

### 4. [Arquitectura del Sistema](./04-ARQUITECTURA.md)
**¿Qué es?** Documento que explica CÓMO está construido el sistema.

**Contenido:**
- Visión general y objetivos
- Arquitectura en capas (Presentación, Aplicación, Datos)
- Diagramas de flujo de datos
- Decisiones arquitectónicas (¿Por qué Next.js? ¿Por qué Prisma?)
- Estrategias de escalabilidad y rendimiento
- Consideraciones de seguridad
- Servicios externos (Firebase, OAuth, n8n)

**Para quién:**
- ✅ Alumnos avanzados: Comprender el diseño
- ✅ Profesores: Evaluar decisiones técnicas
- ✅ Arquitectos: Documentación de referencia

---

### 5. [Guía de Despliegue](./05-GUIA-DEPLOY.md)
**¿Qué es?** Tutorial paso a paso para llevar la app a producción.

**Contenido:**
- Despliegue en Vercel (paso a paso con screenshots)
- Configuración de PostgreSQL (Railway/Render)
- Setup de Firebase Storage
- Configuración de Google OAuth
- Variables de entorno completas
- CI/CD con GitHub Actions
- Monitorización (Analytics, Sentry, UptimeRobot)
- Sistema de backups
- Troubleshooting de problemas comunes

**Para quién:**
- ✅ Alumnos de Servicios de Red: Tarea principal
- ✅ Cualquier persona que despliegue: Guía completa
- ✅ Runbook de operaciones

---

## 🎯 ¿Por Dónde Empezar?

### Si eres **Alumno Desarrollador**:
1. Lee [03-GUIA-DESARROLLO.md](./03-GUIA-DESARROLLO.md)
2. Sigue los pasos de setup inicial
3. Lee [02-TAREAS-POR-MODULO.md](./02-TAREAS-POR-MODULO.md) y busca tus tareas
4. Consulta [01-ESPECIFICACION-REQUISITOS.md](./01-ESPECIFICACION-REQUISITOS.md) cuando tengas dudas sobre features

### Si eres **Profesor/Coordinador**:
1. Lee [01-ESPECIFICACION-REQUISITOS.md](./01-ESPECIFICACION-REQUISITOS.md) para el contexto completo
2. Revisa [02-TAREAS-POR-MODULO.md](./02-TAREAS-POR-MODULO.md) para asignar trabajo
3. Consulta [04-ARQUITECTURA.md](./04-ARQUITECTURA.md) para decisiones técnicas

### Si vas a **Desplegar el Proyecto**:
1. Lee [05-GUIA-DEPLOY.md](./05-GUIA-DEPLOY.md) completa
2. Sigue el checklist paso a paso
3. No te saltes ningún paso
4. Consulta troubleshooting si hay problemas

### Si quieres **Entender la Arquitectura**:
1. Lee [04-ARQUITECTURA.md](./04-ARQUITECTURA.md)
2. Consulta los diagramas y flujos
3. Lee las decisiones de diseño

---

## 📖 Documentación Adicional

Además de estos documentos principales, consulta:

### En la raíz del proyecto:
- **[README.md](../README.md)**: Introducción general y quick start
- **[FIREBASE_SETUP.md](../FIREBASE_SETUP.md)**: Configuración detallada de Firebase Storage
- **[.env.example](../.env.example)**: Plantilla de variables de entorno

### En el código fuente:
- Comentarios inline en archivos complejos
- JSDoc en funciones principales
- Types en TypeScript (documentación viva)

---

## 🆘 Soporte

### ¿Tienes dudas?

1. **Busca en esta documentación** - Probablemente esté explicado
2. **Revisa los Issues de GitHub** - Alguien pudo tener la misma duda
3. **Pregunta en Discord/Slack** del proyecto
4. **Contacta al coordinador** - Como último recurso

### ¿Encontraste un error en la documentación?

1. Abre un Issue en GitHub
2. O mejor: haz un PR corrigiéndolo
3. Todos los PRs son bienvenidos

---

## 🔄 Mantenimiento de la Documentación

Esta documentación debe mantenerse actualizada:

- **Cuando cambies features**: Actualiza 01-ESPECIFICACION-REQUISITOS.md
- **Cuando cambies arquitectura**: Actualiza 04-ARQUITECTURA.md
- **Cuando cambies el proceso de deploy**: Actualiza 05-GUIA-DEPLOY.md
- **Cuando añadas convenciones nuevas**: Actualiza 03-GUIA-DESARROLLO.md

### Responsables:
- Cada módulo es responsable de su sección en 02-TAREAS-POR-MODULO.md
- El coordinador revisa y aprueba cambios mayores
- Todos pueden proponer mejoras

---

## 📊 Estructura Visual

```
docs/
├── README.md                          ← Estás aquí
├── 01-ESPECIFICACION-REQUISITOS.md    ← QUÉ hace el sistema
├── 02-TAREAS-POR-MODULO.md            ← QUIÉN hace QUÉ
├── 03-GUIA-DESARROLLO.md              ← CÓMO desarrollar
├── 04-ARQUITECTURA.md                 ← CÓMO está construido
└── 05-GUIA-DEPLOY.md                  ← CÓMO llevarlo a producción
```

---

## 🎓 Contexto del Proyecto de Innovación

Este sistema es parte de un **proyecto de innovación docente** en el que participan:

- **Alumnos de Hostelería**: Crean y publican los menús
- **Alumnos de 2º ASIR**: Desarrollan y mantienen el sistema
  - Módulo de Seguridad
  - Módulo de Proyecto Intermodular (n8n)
  - Módulo de Servicios de Red e Internet
- **Comunidad Educativa**: Usuarios finales del sistema

### Objetivos educativos:
1. Aprender desarrollo web moderno (Next.js, React, TypeScript)
2. Trabajar en equipo con control de versiones (Git)
3. Aplicar conocimientos de seguridad en un proyecto real
4. Automatizar procesos con herramientas como n8n
5. Desplegar y mantener aplicaciones en producción
6. Documentar y comunicar decisiones técnicas

---

## 📅 Versiones

- **v1.0** (Diciembre 2025): Versión inicial
  - Documentación completa del MVP
  - 5 documentos principales
  - Guías para desarrollo y despliegue

---

## 🤝 Contribuciones

**Esta documentación es un documento vivo.** Se mejora con las aportaciones de todos.

Si encuentras:
- ❌ Errores o información desactualizada
- 💡 Secciones que podrían explicarse mejor
- 📝 Features no documentadas
- 🆕 Mejores prácticas que añadir

**¡Contribuye!**
1. Fork del repo
2. Crea una rama (`docs/mejora-seccion-x`)
3. Haz tus cambios
4. Abre un Pull Request

---

## 📞 Contactos

**Coordinador del Proyecto:**  
[Nombre] - [email]

**Profesores Responsables:**
- Seguridad: [Nombre] - [email]
- Proyecto Intermodular: [Nombre] - [email]
- Servicios de Red: [Nombre] - [email]

**Canales de Comunicación:**
- Discord/Slack: [link]
- GitHub Issues: [repo]/issues
- Email de soporte: [email]

---

## 🌟 Agradecimientos

Gracias a todos los alumnos, profesores y colaboradores que hacen posible este proyecto.

---

**¡Buena suerte con el desarrollo! 🚀**

---

_Última actualización: Diciembre 2025_  
_Versión de documentación: 1.0_
