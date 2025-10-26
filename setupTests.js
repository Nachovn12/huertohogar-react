import '@testing-library/jest-dom';

// Configuración global para las pruebas
global.console = {
  ...console,
  // Suprimir warnings específicos en las pruebas
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock de window.matchMedia para pruebas
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock de IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
