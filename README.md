# 🌱 HuertoHogar — Tienda Online (React + TypeScript)

![HuertoHogar Banner](https://i.imgur.com/aO9sMTY.png)

**Última actualización: 1 de diciembre de 2025** — Plataforma completa de eCommerce con integración API real y sistema de ofertas dinámicas.

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Demo_en_Vivo-HuertoHogar-2E8B57?style=for-the-badge)](https://nachovn12.github.io/huertohogar-react/)
[![GitHub Pages](https://img.shields.io/badge/Deployado_en-GitHub_Pages-181717?style=for-the-badge&logo=github)](https://nachovn12.github.io/huertohogar-react/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Material UI](https://img.shields.io/badge/Material_UI-5-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)

![GitHub repo size](https://img.shields.io/github/repo-size/Nachovn12/huertohogar-react?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Nachovn12/huertohogar-react?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/Nachovn12/huertohogar-react?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/Nachovn12/huertohogar-react?style=flat-square)

</div>

---

## 🚀 Demo en Vivo

### 🌐 Accede a la aplicación desplegada:

**👉 [https://nachovn12.github.io/huertohogar-react/](https://nachovn12.github.io/huertohogar-react/)**

> La aplicación está desplegada automáticamente en GitHub Pages con integración continua. Cada push a la rama `main` actualiza el sitio en producción.

---

## 🎯 Resumen del Proyecto

HuertoHogar es una plataforma completa de eCommerce desarrollada con React 18 + TypeScript que conecta productores locales con consumidores. El proyecto integra una API real con sistema de fallback, gestión completa de productos, categorías, carrito de compras y panel de administración.

### ✨ Características Principales

- ✅ **Integración API Completa**: Conectado a Railway con productos, categorías y usuarios reales
- ✅ **Sistema de Ofertas Dinámicas**: Gestión de descuentos con localStorage y cálculo automático de precios
- ✅ **Búsqueda Inteligente**: Filtrado en tiempo real con autocompletado y vista previa de productos
- ✅ **Filtrado por Categorías**: Navegación dinámica con conteo de productos por categoría
- ✅ **Panel de Administración**: CRUD completo de productos con gestión de ofertas y descuentos
- ✅ **Carrito de Compras**: Sincronizado con API y persistencia local
- ✅ **Sistema Híbrido de Autenticación**: API real con fallback automático a datos mock
- ✅ **Roles de Usuario**: Admin, Vendedor y Cliente con permisos diferenciados
- ✅ **UI Responsive**: Diseño moderno con Material UI + React Bootstrap
- ✅ **TypeScript**: Tipado fuerte en toda la aplicación para mayor seguridad

---

## 🖼️ Capturas de Pantalla

<div align="center">

| Inicio | Productos | Admin Panel |
|--------|-----------|-------------|
| ![Inicio](https://i.imgur.com/zFUsJnv.png) | ![Productos](https://i.imgur.com/RHovyon.png) | ![Admin](https://i.imgur.com/312WyEw.png) |

</div>

---

## 🔐 Credenciales de Acceso

### 👨‍💼 Administrador
```
📧 Email: admin@admin.com
🔑 Password: admin
🎯 Panel: /admin/dashboard
✨ Permisos: Gestión completa de productos, usuarios, categorías y ofertas
```

### 🛒 Vendedor
```
📧 Email: vendedor@vendedor.com
🔑 Password: admin
🎯 Panel: /vendedor/dashboard
✨ Permisos: Gestión de productos y visualización de órdenes
```

### 👤 Cliente
```
📧 Email: cliente@cliente.com
🔑 Password: admin
🎯 Inicio: /productos
✨ Permisos: Navegación, compras y gestión de carrito
```

---

## 🛠️ Tecnologías Utilizadas

<div align="center">

| Frontend | UI/UX | Backend Integration | Dev Tools |
|----------|-------|---------------------|-----------|
| React 18 | Material UI 5 | Axios | TypeScript 4.9 |
| React Router 6 | React Bootstrap | Railway API | Create React App |
| Context API | Custom Hooks | LocalStorage | ESLint + Prettier |
| React Hooks | Responsive Design | CORS Proxy | Git & GitHub |

</div>

---

## 📦 Estructura del Proyecto

```
huertohogar-react/
├── public/
│   ├── img/                    # Imágenes estáticas
│   └── index.html              # HTML principal
├── src/
│   ├── components/             # Componentes React
│   │   ├── Admin/             # Panel de administración
│   │   ├── Blog.tsx           # Blog de consejos
│   │   ├── Cart.tsx           # Carrito lateral
│   │   ├── Categories.tsx     # Categorías destacadas
│   │   ├── Navbar.tsx         # Barra de navegación
│   │   ├── ProductCard.tsx    # Tarjeta de producto
│   │   ├── ProductList.tsx    # Lista de productos
│   │   └── ...
│   ├── context/               # Context API
│   │   ├── AuthContext.tsx    # Autenticación
│   │   └── CartContext.tsx    # Carrito de compras
│   ├── hooks/                 # Custom Hooks
│   │   └── useApi.ts          # Hooks para API
│   ├── service/               # Servicios
│   │   └── api.ts             # Cliente API
│   ├── styles/                # Estilos CSS
│   │   └── App.css            # Estilos principales
│   ├── types/                 # Tipos TypeScript
│   │   └── index.ts           # Definiciones de tipos
│   ├── data/                  # Datos de fallback
│   │   ├── products.json      # Productos mock
│   │   └── categories.json    # Categorías mock
│   ├── App.tsx                # Componente principal
│   └── index.tsx              # Punto de entrada
├── package.json               # Dependencias
├── tsconfig.json              # Configuración TypeScript
└── README.md                  # Este archivo
```

---

## 🌐 API Integrada
**Base URL**: `https://api-dfs2-dm-production.up.railway.app`

### Endpoints usados por HuertoHogar

- ✅ `/api/huerto` - Productos principales: listado, búsqueda y detalles (recurso principal del catálogo).
- ✅ `/api/productos` - Endpoint complementario para operaciones puntuales sobre productos (usado por algunos adaptadores internos).
- ✅ `/api/categorias` - Categorías de productos (navegación y filtros).
- ✅ `/api/usuarios` - Gestión y autenticación de usuarios (login, registro, perfiles).
- ✅ `/api/carritos` - Carrito de compras (persistencia y sincronización con backend cuando aplica).
- ✅ `/api/productos/:id/stock` - Consulta/actualización de stock por producto.
- ℹ️ `/api/ordenes` - Órdenes: en la versión actual se utiliza como mock/temporal desde el cliente; puede no estar disponible en todas las instancias de la API.

**Versión de la API**: `2.0.0` (Proveedor: "API para Alumnos - Huerto, Gaming, Pastelería")

**Autor / Fuente**: Profesor Sting Parra Silva (implementación desplegada en Railway)

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias:

```bash
npm install
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

¡Las contribuciones son bienvenidas! Si deseas contribuir a HuertoHogar:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### 📝 Normas de Contribución

- Ejecuta `npm test` antes de hacer commit
- Sigue las convenciones de código existentes
- Documenta nuevas funcionalidades
- Actualiza el README si es necesario

---

## 👥 Equipo de Desarrollo

<div align="center">

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Nachovn12">
        <img src="https://github.com/Nachovn12.png" width="100px;" alt="Ignacio Valeria"/><br />
        <sub><b>Ignacio Valeria</b></sub>
      </a><br />
      <a href="https://github.com/Nachovn12" title="GitHub">💻 GitHub</a>
    </td>
    <td align="center">
      <a href="https://github.com/BenjaFlores379">
        <img src="https://github.com/BenjaFlores379.png" width="100px;" alt="Benjamín Flores"/><br />
        <sub><b>Benjamín Flores</b></sub>
      </a><br />
      <a href="https://github.com/BenjaFlores379" title="GitHub">💻 GitHub</a>
    </td>
  </tr>
</table>

</div>

---

## 📄 Licencia

[MIT](LICENSE)

---

<div align="center">

### 🌱 HuertoHogar - Del Campo al Hogar 🏡

<sub>⭐ Si te gustó este proyecto, regálanos una estrella en GitHub ⭐</sub>

---

*© 2025 HuertoHogar. Conectando productores locales con tu mesa.*

</div>