# 📦 CHANGELOG – Perkorafy

Historial de cambios del proyecto Perkorafy.

---

## [v1.0.0-20240519] - 2025-05-19

### ✨ Funcionalidad
- Se muestra la cantidad de perks disponibles del usuario en el catálogo.
- Los perks mostrados se obtienen desde la base de datos.
- Se renderiza el botón "Canjear" únicamente si el usuario tiene suficientes perks.
- Los perks se actualizan correctamente tras salir y volver al catálogo.
- Implementación completa de la API \`/api/canjear\` con lógica de validación y descuento de perks.

### 🎨 Diseño visual unificado
- Botón "Canjear" con estilo azul corporativo, coherente con el botón "Cerrar sesión".
- Botones del diálogo (Cancelar y Confirmar) con estilo consistente y tamaño compacto.
- Mensajes \`toast\` para feedback de éxito, error o denegación de canje.

### 🐛 Correcciones y mejoras internas
- Redirección automática al login si no hay sesión activa.
- Manejo de errores del fetch y validación robusta de datos del usuario.
- Desactivación del botón de confirmación durante la operación para evitar dobles envíos.

---

## [v0.1.0] - 2025-04-XX *(desarrollo inicial)*

- Estructura inicial del proyecto con Next.js, Tailwind, shadcn/ui y routing básico.
- Creación de páginas base: login, dashboard, catálogo.
- Primer prototipo funcional de canje de beneficios.


## ✅ Versión estable – 2025-05-24

### 🎯 Catálogo de beneficios funcional en `/dashboard/catalogo`

#### ✨ Nuevas funcionalidades:
- Visualización completa del catálogo con datos desde `/api/perks`.
- Carga dinámica del número de perks disponibles del usuario desde `/api/user/perks`.
- Confirmación visual antes de canjear un perk.
- Feedback mediante `toast` al confirmar o fallar el canje.
- Actualización automática del catálogo y de los perks disponibles tras cada canje.

#### 🛠 Mejoras de UX:
- Beneficios no canjeables aparecen desactivados y con estilo atenuado.
- Botón "Canjear" se desactiva automáticamente si el usuario no tiene suficientes puntos.
- Se muestra el mensaje: *"No tienes suficientes perks"* bajo los beneficios inactivos.
- Diseño responsive adaptado a desktop y dispositivos móviles.

#### ✅ Estabilidad:
- Manejo robusto de errores en el cliente y en los endpoints.
- Validación de sesión JWT en la API de usuario.
- Código refactorizado y limpio, preparado para animaciones o evoluciones futuras.


### 📜 Historial de canjes del usuario

#### ✨ Nuevas funcionalidades:
- Pantalla `/dashboard/historial` con listado de todos los canjes realizados por el usuario.
- Visualización de:
  - Fecha del canje (formateada en español)
  - Nombre del beneficio
  - Coste en perks
  - Estado del canje

#### 🔎 Funcionalidades añadidas:
- Filtro visual por rango de fechas: selección de `Desde` y `Hasta` permite limitar el listado de canjes.
- Inclusión automática de los días seleccionados gracias a ajuste horario.
- Comportamiento inmediato sin necesidad de botón de aplicar filtro.

#### ✅ Estabilidad:
- Filtro aplicado desde frontend sobre datos precargados.
- Comprobación robusta de fechas para evitar exclusión errónea de canjes en el mismo día.

### 👤 Perfil de usuario editable

#### ✨ Nuevas funcionalidades:
- Pantalla `/dashboard/perfil` que muestra:
  - Nombre
  - Correo electrónico
  - Perks disponibles
  - Fecha de alta
- Campo de nombre editable al pulsar el botón "Modificar".
- Al guardar, se actualiza el nombre del usuario en base de datos vía API (`PUT /api/user/perfil`).
- Validación del token para proteger el acceso y actualización del perfil.
- Estilo visual unificado con el resto del dashboard.

#### ✅ Estabilidad:
- Campo de nombre desactivado por defecto para evitar ediciones accidentales.
- Mensajes de error visuales si la actualización falla.
- Botón "Guardar" deshabilitado mientras se está enviando el cambio.

✅ Versión estable — 28 de mayo de 2025
Incluye:

🔐 Conexión confirmada a base de datos production en Neon.
🧮 Actualización de perks totalmente funcional y sincronizada en dashboard.
🧼 Limpieza del endpoint de debug tras verificación completa.
🧠 Configuración centralizada de entorno local y producción unificados.
✅ Preparada para continuar con nuevas funcionalidades de forma segura.

## [2025-06-11] Versión estable v2

- Sustitución del componente Dialog de shadcn/ui por modal personalizado para evitar problemas de overlays bloqueados.
- Mejor control de estado y limpieza de DOM.
- Preparado para continuar con la importación de usuarios vía CSV.

# Changelog

## v3 - Junio 2025

### Nuevas funcionalidades:

- Implementación completa de importación de usuarios vía CSV.
- Generación automática de tokens de recuperación de contraseña en las altas.
- Envío automático de email de bienvenida con enlace de activación de cuenta.
- Unificación de flujos de alta manual y carga masiva.
- Creación de tabla `PasswordRecovery` en base de datos para la gestión de tokens.
- Refactorización de `sendWelcomeEmail` para soportar activación por token.
- Prisma Client versionado dentro del repositorio para builds estables en Vercel.

### Mejoras técnicas:

- Solución definitiva al conflicto Prisma + Next.js + Vercel para generación de tipos.
- Versionado de `prisma/generated/client` como patrón profesional de compilación.
- Limpieza y consolidación completa del flujo de alta de usuarios.

---

*Versión estable revisada y consolidada tras validación completa de builds en Vercel.*

