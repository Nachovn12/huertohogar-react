# 🌱 HuertoHogar - Tienda Online (Migración a React)

Migración de la tienda online HuertoHogar de HTML/CSS/JavaScript a React para la Evaluación Parcial N° 2 del curso DSY1104 - DESARROLLO FULLSTACK II.

**Proyecto Original:** [https://github.com/Nachovn12/huertohogar-tienda-grupo5](https://github.com/Nachovn12/huertohogar-tienda-grupo5)  
**Demo Original:** [https://nachovn12.github.io/huertohogar-tienda-grupo5/](https://nachovn12.github.io/huertohogar-tienda-grupo5/)

Una aplicación web de comercio electrónico desarrollada con React para la venta de productos frescos del campo a la puerta de los clientes en Chile.

## 🚀 Características

- Catálogo de productos frescos, orgánicos y lácteos con información detallada (precio, descripción, origen, stock, ofertas)
- Filtros por categoría: Frutas Frescas, Verduras Orgánicas, Productos Orgánicos, Lácteos
- Carrito de compras con persistencia y resumen de precios
- Gestión de stock y control de cantidades
- Visualización de ofertas y promociones destacadas
- Diseño moderno, profesional y responsivo inspirado en HelloFresh
- Sección "Nosotros" con misión, visión y mapa de ubicaciones
- Pruebas unitarias con Jest, React Testing Library, Jasmine y Karma
- Documentación técnica y cobertura de testing
- Interfaz intuitiva y adaptativa para móviles, tablets y desktop
- Integración de Material UI para experiencia visual atractiva
- Sistema de registro y autenticación de usuarios (propuesta)
- Gestión y seguimiento de pedidos (propuesta)
- Reseñas y calificaciones de productos (propuesta)

## 🛠️ Tecnologías Utilizadas

- **React 18** — Framework principal para la SPA
- **Material UI** — Librería de componentes UI modernos
- **React Router DOM** — Navegación entre páginas
- **Bootstrap 5** — Framework CSS responsivo (legacy)
- **Jest** — Testing de lógica y componentes
- **React Testing Library** — Testing de componentes React
- **Jasmine + Karma** — Testing adicional y cobertura en navegadores
- **Context API** — Estado global para el carrito
- **HTML5 & CSS3** — Estructura y estilos base
- **Node.js & npm** — Entorno de ejecución y gestión de dependencias


## 📦 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/huertohogar-tienda-online.git
cd huertohogar-tienda-online
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Ejecutar la aplicación:**
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 🧪 Testing

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
npm run test:coverage

# Ejecutar en modo CI
npm run test:ci
```

### Configuración de Testing
- **Jest:** Framework principal de testing
- **Karma + Jasmine:** Para pruebas en navegadores
- **React Testing Library:** Para testing de componentes
- **Coverage:** Análisis de cobertura de código

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── Navbar.js       # Barra de navegación
│   ├── Hero.js         # Sección principal
│   ├── ProductList.js  # Lista de productos
│   └── CartContext.js  # Estado global del carrito
├── data/               # Datos estáticos
│   └── products.js     # Catálogo de productos
├── __tests__/          # Pruebas unitarias
│   ├── App.test.js
│   ├── Cart.test.js
│   ├── Navbar.test.js
│   ├── Hero.test.js
│   ├── Footer.test.js
│   └── utils.test.js
└── docs/               # Documentación
    ├── ERS.md          # Especificación de Requisitos
    └── COBERTURA_TESTING.md
```

## 🎯 Funcionalidades

### Gestión de Productos
- Visualización de catálogo completo
- Filtrado por categorías (herramientas, semillas, maceteros, etc.)
- Información detallada de cada producto
- Control de stock

### Carrito de Compras
- Agregar/eliminar productos
- Modificar cantidades
- Cálculo automático de totales
- Persistencia del estado

### Interfaz Responsiva
- Diseño adaptativo para todos los dispositivos
- Navegación intuitiva
- Componentes Bootstrap optimizados

## 📊 Cobertura de Testing

| Componente | Cobertura | Pruebas |
|------------|-----------|---------|
| App | 100% | 3 |
| ProductCard | 95% | 4 |
| ProductList | 90% | 5 |
| Cart | 85% | 5 |
| CartContext | 100% | 6 |
| Navbar | 100% | 4 |
| Hero | 100% | 5 |
| Footer | 100% | 5 |
| Utils | 100% | 4 |

**Total: 10 pruebas unitarias con 92% de cobertura**

## 🚀 Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm build          # Construir para producción
npm test           # Ejecutar pruebas
npm run test:coverage  # Ejecutar pruebas con cobertura
npm run test:ci    # Ejecutar pruebas en modo CI
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móviles:** 320px - 768px
- **Tablets:** 768px - 1024px
- **Desktop:** 1024px+

## 🎨 Diseño

- **Paleta de colores:** Verde natural (#2c5530) como color principal
- **Tipografía:** Sistema de fuentes nativas del navegador
- **Componentes:** Bootstrap 5 con personalización
- **Iconos:** Emojis para simplicidad

## 📄 Documentación

- **[ERS.md](docs/ERS.md)** - Especificación de Requisitos del Software
- **[COBERTURA_TESTING.md](docs/COBERTURA_TESTING.md)** - Documento de cobertura de testing

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador:** [Ignacio Valeria - Benjamin Flores]
- **Asignatura:** DSY1104 - DESARROLLO FULLSTACK II

## 📞 Contacto

- **Email:** info@huertohogar.cl
- **Teléfono:** +56 9 1234 5678
- **Ubicación:** Concepción, Chile
