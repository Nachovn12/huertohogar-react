# Entregables - Evaluación Parcial 2 (EP2)

Este documento resume las acciones realizadas para cumplir la rúbrica de la Evaluación Parcial 2: migración a React, implementación de pruebas unitarias y documentación requerida.

## 1. Resumen de trabajo realizado

- Migración parcial del frontend a React (componentes principales ya implementados en el repositorio).
- Implementación de `CartContext` y componentes reutilizables (Navbar, Hero, ProductList, ProductCard, FeaturedProducts, ProductDetails, Footer).
- Añadidas pruebas unitarias adicionales para alcanzar y superar el mínimo requerido (véase `src/__tests__`).
- Documentos ERS (`docs/ERS.md`) y Cobertura (`docs/COBERTURA_TESTING.md`) actualizados o presentes.

## 2. Tests y Herramientas

- Herramienta principal: Jest + React Testing Library (predeterminada en apps React creadas con Create React App).
- Razonamiento: Jest + RTL es ampliamente usado para testing en React; ofrece APIs modernas, buen soporte para mocks y generación de coverage. Si la evaluación exige explícitamente Jasmine+Karma, puedo preparar la configuración adicional y migrar las pruebas.

### Comandos útiles

Ejecutar todas las pruebas:

```bash
npm test
```

Ejecutar pruebas en modo CI (sin watch):

```bash
npm run test:ci
```

Generar reporte de coverage (incluido en `test:ci`):

```bash
npm run test:ci
```

## 3. Pruebas añadidas

- `src/__tests__/ProductDetails.test.js` — verifica renderizado de detalle de producto, comportamiento del botón "Agregar al Carrito" y caso de producto no encontrado.

## 4. Documentación entregada

- `docs/ERS.md` — Especificación de Requisitos del Software (actualizada).
- `docs/COBERTURA_TESTING.md` — Documento de cobertura de testing y guía de ejecución.
- `docs/DELIVERABLES_EP2.md` — Este resumen de entregables para EP2.

## 5. Siguientes pasos (recomendados)

1. Si la evaluación exige Jasmine+Karma, confirmar para que prepare la configuración (`karma.conf.js`, adaptadores y script `npm run test:karma`).
2. Completar pruebas adicionales hasta cubrir casos edge (manejo de errores, flujos de compra completos).
3. Revisar y ajustar ERS si hay requisitos específicos adicionales del equipo o docentes.
