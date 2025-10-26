import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock del CartProvider para las pruebas
jest.mock('../context/CartContext', () => ({
  CartProvider: ({ children }) => <div data-testid="cart-provider">{children}</div>,
  useCart: () => ({
    getTotalItems: () => 0,
    items: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    getTotalPrice: () => 0
  })
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
  });

  test('renders navbar with brand name', () => {
    render(<App />);
    // Puede aparecer en navbar y en el footer; comprobar que al menos una instancia existe
    const marcas = screen.getAllByText('🌱 HuertoHogar');
    expect(marcas.length).toBeGreaterThan(0);
  });

  test('renders navigation links', () => {
    const { container } = render(<App />);
    // Puede haber múltiples nodos con el texto 'Inicio' en la página
    const inicio = screen.getAllByText('Inicio');
    expect(inicio.length).toBeGreaterThan(0);
    // 'Productos' puede aparecer en navbar y footer; comprobar al menos una instancia
    const productos = screen.getAllByText('Productos');
    expect(productos.length).toBeGreaterThan(0);
    // El icono del carrito está en un nodo separado del contador; comprobar al menos el icono
    expect(screen.getByText('🛒')).toBeInTheDocument();
    // y que exista un enlace al carrito
    const cartLink = container.querySelector('a[href="/cart"]');
    expect(cartLink).toBeTruthy();
  });
});
