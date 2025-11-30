# 🌱 HuertoHogar — Tienda Online (React + TypeScript)

**Última actualización: 29 de noviembre de 2025** — Sistema híbrido de autenticación con API real integrada.

## 🎯 Resumen Rápido

Proyecto frontend de HuertoHogar con **sistema híbrido de autenticación** que integra la API real del profesor con fallback automático a datos mock. Desarrollado con React 18 + TypeScript, incluye gestión completa de productos, categorías, carrito y usuarios.

### ✨ Características Principales

- ✅ **Sistema Híbrido de Autenticación**: API real + fallback a mock
- ✅ **Integración API Completa**: Productos, categorías, carrito y usuarios
- ✅ **Roles de Usuario**: Admin, Vendedor y Cliente
- ✅ **Gestión de Carrito**: Sincronizado con API real
- ✅ **UI Responsive**: Diseño moderno y adaptable
- ✅ **TypeScript**: Tipado fuerte en toda la aplicación

---

## 🔐 Credenciales de Acceso

```
ADMINISTRADOR:
📧 Email: admin@admin.com
🔑 Password: admin
🎯 Dashboard: /admin/dashboard

VENDEDOR:
📧 Email: vendedor@vendedor.com
🔑 Password: admin
🎯 Dashboard: /vendedor/dashboard

CLIENTE:
📧 Email: cliente@cliente.com
🔑 Password: admin
🎯 Inicio: /productos
```

---

## 🌐 API Integrada

**Base URL**: `https://api-dfs2-dm-production.up.railway.app`

### Endpoints Disponibles:

- ✅ `/api/usuarios` - Gestión de usuarios
- ✅ `/api/huerto` - Productos de HuertoHogar
- ✅ `/api/categorias` - Categorías de productos
- ✅ `/api/carritos` - Carrito de compras
- ⏳ `/api/ordenes` - Órdenes (mock temporal)

📖 **Documentación completa**: Ver `API_CREDENTIALS.md`

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias:

```bash
npm install --legacy-peer-deps
```

### 2. Iniciar servidor de desarrollo:

```bash
npm start
```

### 3. Abrir en el navegador:

```
http://localhost:3000
```

### 4. Hacer login:

- Email: `admin@admin.com`
- Password: `admin`

### 5. Verificar en consola:

- Deberías ver peticiones a la API
- Login exitoso con token generado

---

## 📋 Estado Actual

- **Código base**: React 18 + Create React App (`react-scripts@5`)
- **TypeScript**: Fijado a la serie `4.9.x` para compatibilidad con `react-scripts`
- **Migración**: Muchos componentes y contextos convertidos a `.tsx`/`.ts`

### Quick Links

- Entrada de la app: `src/index.tsx`
- Componentes: `src/components/`
- Contexts: `src/context/`
- Tipos: `src/types/`
- Servicios: `src/service/`
- Datos estáticos: `src/data/`

---

## 📦 Requisitos

- Node.js >= 16 (recomendado)
- npm >= 8

---

## 🛠️ Scripts Útiles

```bash
npm start        # Desarrollo
npm run build    # Build producción
npm test         # Ejecutar tests
```

---

## 📚 Documentación Adicional

Este proyecto incluye documentación completa sobre la integración con la API:

- 📖 **`API_CREDENTIALS.md`** - Credenciales y endpoints disponibles
- 🎯 **`RESUMEN_EJECUTIVO.md`** - Resumen completo de la implementación
- 🧪 **`GUIA_PRUEBAS.md`** - Guía paso a paso para testing
- 📊 **`DIAGRAMA_SISTEMA.md`** - Diagrama visual del sistema híbrido
- ✅ **`SOLUCION_IMPLEMENTADA.md`** - Detalles técnicos de la solución

---

## 🔄 Cambios Recientes (Nov 2025)

### Sistema Híbrido de Autenticación

- ✅ Integración con `/api/usuarios`
- ✅ Fallback automático a datos mock
- ✅ Manejo robusto de errores
- ✅ Tipos TypeScript correctos

### Integración API Real

- ✅ Productos desde `/api/huerto`
- ✅ Categorías desde `/api/categorias`
- ✅ Carrito desde `/api/carritos`
- ✅ Gestión de usuarios

### Mejoras UI/UX

- ✅ Navbar responsive con overlay móvil
- ✅ Fix de recursión en Login
- ✅ Navegación programática mejorada

---

## 📝 Archivos Destacados

### Componentes Principales

- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/Login.tsx`
- `src/components/ProductList.tsx`
- `src/components/ProductCard.tsx`
- `src/components/ProductDetails.tsx`

### Contextos

- `src/context/CartContext.tsx`
- `src/context/AuthContext.tsx`

### Servicios

- `src/service/api.ts` ⭐ **Sistema híbrido**

### Tipos

- `src/types/index.ts`

---

## 🔧 Notas Técnicas

- **TypeScript**: Versión `4.9.5` fijada para compatibilidad con `react-scripts@5`
- **Imports**: Evita usar rutas con extensión `.tsx` explícita
- **Shims**: Hay shims `.js` temporales para compatibilidad con CRA

---

## 🧪 Pruebas y CI

- **Tests**: Disponibles en `src/__tests__/` (Jest/RTL y Karma/Jasmine)
- **CI Recomendado**: GitHub Actions con `npm ci`, `npm run build` y `npm test`

---

## 🎯 Próximos Pasos Sugeridos

1. Profesionalizar flujo: ESLint + Prettier, Husky + lint-staged
2. Migrar tests a TypeScript (`.test.tsx`)
3. Migrar `src/components/Admin/*` a TypeScript
4. (Opcional) Evaluar migración de CRA a Vite

---

## 🤝 Contribuir

Sigue la guía estándar: fork → rama → PR. Asegúrate de ejecutar linters y tests antes de abrir PR.

---

## 📞 Contacto

- Ignacio / Equipo HuertoHogar

---

## 📄 Licencia

MIT

---

**¿Necesitas ayuda?** Revisa la documentación en los archivos `.md` del proyecto o abre un issue en GitHub.
