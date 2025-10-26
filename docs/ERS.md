# Especificación de Requisitos del Software (ERS)
## HuertoHogar - Tienda Online

### 1. INFORMACIÓN GENERAL

**Nombre del Proyecto:** HuertoHogar - Tienda Online  
**Versión:** 1.0  
**Fecha:** Diciembre 2024  
**Desarrolladores:** Equipo de Desarrollo Fullstack  

### 2. DESCRIPCIÓN GENERAL

HuertoHogar es una aplicación web de comercio electrónico desarrollada con React que permite a los usuarios explorar, filtrar y comprar productos relacionados con jardinería y hogar. La aplicación incluye un carrito de compras funcional, diseño responsivo y un sistema de pruebas unitarias completo.

### 3. OBJETIVOS DEL SISTEMA

- Proporcionar una interfaz intuitiva para la compra de productos de jardinería
- Implementar un carrito de compras funcional
- Garantizar una experiencia responsiva en diferentes dispositivos
- Asegurar la calidad del código mediante pruebas unitarias

### 4. REQUISITOS FUNCIONALES

#### 4.1 Gestión de Productos
- **RF001:** El sistema debe mostrar una lista de productos disponibles
- **RF002:** El sistema debe permitir filtrar productos por categoría
- **RF003:** El sistema debe mostrar información detallada de cada producto (nombre, precio, descripción, stock)

#### 4.2 Carrito de Compras
- **RF004:** El sistema debe permitir agregar productos al carrito
- **RF005:** El sistema debe permitir modificar la cantidad de productos en el carrito
- **RF006:** El sistema debe permitir eliminar productos del carrito
- **RF007:** El sistema debe calcular el total del carrito automáticamente
- **RF008:** El sistema debe mostrar el número de items en el carrito en la navegación

#### 4.3 Interfaz de Usuario
- **RF009:** El sistema debe tener un diseño responsivo que funcione en móviles, tablets y desktop
- **RF010:** El sistema debe incluir navegación entre páginas
- **RF011:** El sistema debe mostrar un mensaje cuando el carrito está vacío

### 5. REQUISITOS NO FUNCIONALES

#### 5.1 Rendimiento
- **RNF001:** La aplicación debe cargar en menos de 3 segundos
- **RNF002:** Las transiciones entre páginas deben ser fluidas

#### 5.2 Usabilidad
- **RNF003:** La interfaz debe ser intuitiva para usuarios sin experiencia técnica
- **RNF004:** El diseño debe ser consistente en todas las páginas

#### 5.3 Compatibilidad
- **RNF005:** La aplicación debe funcionar en navegadores modernos (Chrome, Firefox, Safari, Edge)
- **RNF006:** La aplicación debe ser responsiva en dispositivos con pantallas de 320px a 1920px

#### 5.4 Calidad
- **RNF007:** El código debe tener cobertura de pruebas unitarias del 80% o superior
- **RNF008:** Todas las funcionalidades críticas deben tener pruebas unitarias

### 6. ARQUITECTURA DEL SISTEMA

#### 6.1 Tecnologías Utilizadas
- **Frontend:** React 18.2.0
- **Routing:** React Router DOM 6.8.0
- **Styling:** Bootstrap 5.3.0, React Bootstrap 2.8.0
- **Testing:** Jest, React Testing Library, Jasmine, Karma
- **Build Tool:** Create React App

#### 6.2 Estructura de Componentes
```
src/
├── components/
│   ├── Navbar.js
│   ├── Hero.js
│   ├── ProductList.js
│   ├── ProductCard.js
│   ├── Cart.js
│   └── Footer.js
├── context/
│   └── CartContext.js
├── data/
│   └── products.js
└── __tests__/
    ├── App.test.js
    ├── ProductCard.test.js
    ├── ProductList.test.js
    ├── Cart.test.js
    ├── CartContext.test.js
    ├── Navbar.test.js
    ├── Hero.test.js
    ├── Footer.test.js
    └── utils.test.js
```

### 7. CASOS DE USO

#### 7.1 Explorar Productos
**Actor:** Usuario  
**Precondición:** Usuario accede a la aplicación  
**Flujo Principal:**
1. Usuario ve la página principal con productos
2. Usuario puede filtrar productos por categoría
3. Usuario ve información detallada de cada producto

#### 7.2 Agregar Producto al Carrito
**Actor:** Usuario  
**Precondición:** Usuario está viendo productos  
**Flujo Principal:**
1. Usuario hace clic en "Agregar al Carrito"
2. El producto se agrega al carrito
3. El contador del carrito se actualiza

#### 7.3 Gestionar Carrito
**Actor:** Usuario  
**Precondición:** Usuario tiene productos en el carrito  
**Flujo Principal:**
1. Usuario accede al carrito
2. Usuario puede modificar cantidades
3. Usuario puede eliminar productos
4. El total se recalcula automáticamente

### 8. CRITERIOS DE ACEPTACIÓN

#### 8.1 Funcionalidad
- ✅ Todos los productos se muestran correctamente
- ✅ El filtrado por categoría funciona
- ✅ El carrito mantiene el estado entre navegaciones
- ✅ Los cálculos de totales son correctos

#### 8.2 Diseño
- ✅ La aplicación es completamente responsiva
- ✅ El diseño es consistente y profesional
- ✅ La navegación es intuitiva

#### 8.3 Calidad
- ✅ 10 pruebas unitarias implementadas y funcionando
- ✅ Cobertura de código del 80% o superior
- ✅ No hay errores de linting críticos

### 9. RESTRICCIONES

- La aplicación no incluye backend (solo frontend)
- No se implementa autenticación de usuarios
- No se incluye procesamiento de pagos real
- Los datos de productos son estáticos (mock data)

### 10. RIESGOS Y MITIGACIONES

#### 10.1 Riesgos Identificados
- **Riesgo:** Problemas de rendimiento con muchos productos
- **Mitigación:** Implementación de paginación o lazy loading

- **Riesgo:** Incompatibilidad con navegadores antiguos
- **Mitigación:** Uso de polyfills y testing en múltiples navegadores

### 11. CRONOGRAMA

- **Semana 1:** Configuración del proyecto y componentes básicos
- **Semana 2:** Implementación de funcionalidades y pruebas
- **Semana 3:** Testing, documentación y entrega final

### 12. CONCLUSIONES

Este documento especifica los requisitos para el desarrollo de HuertoHogar, una tienda online moderna construida con React que cumple con los estándares de desarrollo frontend actuales, incluyendo pruebas unitarias exhaustivas y diseño responsivo.
