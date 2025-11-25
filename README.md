# 🌱 HuertoHogar — Tienda Online (React + TypeScript)

Última actualización: 10 de noviembre de 2025 — Migración incremental a TypeScript y mejoras UI.

Resumen rápido
- Proyecto frontend de HuertoHogar creado con Create React App y migrado de forma incremental a TypeScript. Se aplicaron mejoras de UX en el navbar móvil, correcciones en `Login` y navegación programática en `Mission`.

Estado actual
- Código base: React 18 + Create React App (`react-scripts@5`).
- TypeScript: presente y fijado a la serie `4.9.x` para compatibilidad con `react-scripts`.
- Migración: muchos componentes y contextos convertidos a `.tsx`/`.ts`; quedan tests y la carpeta `Admin` por migrar.

Quick links
- Entrada de la app: `src/index.tsx`
- Componentes: `src/components/`
- Contexts: `src/context/`
- Tipos: `src/types/`
- Datos estáticos: `src/data/`

Requisitos
- Node.js >= 16 (recomendado) y npm >= 8

Instalación (recomendado)

1) Clona el repositorio y entra en la carpeta:

```powershell
git clone https://github.com/Nachovn12/huertohogar-react.git
cd "c:\Users\TuUsuario\Documents\HuertoHogar Proyectos\huertohogar-react"
```

2) Instala dependencias (si hay errores de peer-deps con TypeScript, usar la primera opción):

```powershell
# Opción A (rápida, ignora peer deps conflictivos)
npm install --legacy-peer-deps

# Opción B (conservadora): fijar typescript a 4.9.x en package.json y ejecutar
npm install
```

Scripts útiles

```powershell
npm start        # desarrollo
npm run build    # build producción
npm test         # ejecutar tests (Karma/Jasmine + RTL); algunos tests están pendientes de migración a TS
```

Cambios clave en esta iteración

- Migración parcial a TypeScript: `App`, `index`, varios componentes y contexts.
- Navbar responsive: overlay móvil con búsqueda integrada; evita scroll de body cuando está abierto.
- Fix: `Login` ya no provoca recursión por renderizar `Navbar` dentro de sí mismo.
- `Mission` ahora usa `useNavigate` para redirigir a `/nosotros` desde el CTA.

Archivos destacados convertidos (representativos)

- `src/App.tsx`
- `src/index.tsx`
- `src/components/Navbar.tsx` (+ `src/components/Navbar.css`)
- `src/components/Mission.tsx`
- `src/components/Login.tsx`
- `src/components/ProductList.tsx`, `ProductCard.tsx`, `ProductDetails.tsx`
- `src/context/CartContext.tsx`, `AuthContext.tsx`
- `src/data/products.ts`
- `src/types/index.ts`

Notas técnicas y recomendaciones

- TypeScript: la versión en `devDependencies` está fijada a `4.9.5` para evitar conflictos con `react-scripts@5`. Si actualizas `react-scripts` o cambias a otra herramienta (Vite), revisa la compatibilidad de TypeScript.
- Imports: evita usar rutas con la extensión `.tsx` explícita (a menos que actives `allowImportingTsExtensions` en `tsconfig.json`).
- Shims: hay shims `.js` temporales en puntos sensibles (por ejemplo `src/index.js`) para mantener compatibilidad con la entrada de CRA; elimínalos solo cuando la entrada TypeScript esté probada.

Pruebas y CI

- Tests: hay tests en `src/__tests__/` (Jest/RTL y Karma/Jasmine). La migración completa de tests a TypeScript está pendiente.
- CI recomendado: añadir un workflow de GitHub Actions que ejecute `npm ci`, `npm run build` y `npm test` en PRs.

Próximos pasos sugeridos

1. Profesionalizar flujo: ESLint + Prettier, Husky + lint-staged y CI (GitHub Actions).
2. Migrar tests a TypeScript (`.test.tsx`) y actualizar configuración de Jest/Karma.
3. Migrar `src/components/Admin/*` a TypeScript.
4. (Opcional) Evaluar migración de CRA a Vite para mejor experiencia de desarrollo.

Contribuir

- Sigue la guía estándar: fork → rama → PR. Asegúrate de ejecutar linters y tests antes de abrir PR.

Contacto

- Ignacio / Equipo HuertoHogar

Licencia

- MIT

-----
Si quieres que deje el README con más detalles (por ejemplo, sección de changelog con commits, badges, o instrucciones específicas para CI), dime qué prefieres y lo agrego.
