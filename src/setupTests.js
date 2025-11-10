// src/setupTests.js (Versión compatible con Jasmine/Karma)

// Ya NO necesitamos importar '@testing-library/jest-dom' porque Jasmine no lo usa
// Y lo que hace es causar el error "expect.extend is not a function".

// Configuración global para las pruebas
// Utilizamos la sintaxis de Jasmine y variables globales
// para mockear funciones, ya que 'jest' no está definido.

/* global jasmine */ 

// 1. Mock de window.matchMedia para pruebas (Necesario para Material-UI)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function() {}, // deprecated
      removeListener: function() {}, // deprecated
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {},
    };
  },
});

// 2. Mock de IntersectionObserver (Común en React)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// 3. Mock de Timers y Funciones de Espía (Solo si los necesitas en el futuro)
// En Jasmine, se usa jasmine.clock() y jasmine.createSpy().
// Por ahora, solo dejamos el código de Jest afuera para que no cause errores.

// NOTA: Si ves el error 'jest is not defined' en tus archivos de prueba,
// es porque tus archivos .test.tsx están usando 'jest.fn()' o 'jest.mock()'.
// DEBES cambiar esos por 'jasmine.createSpy()' y 'jasmine.createSpyObj()'.