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
