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
    // El logo y el texto 'HuertoHogar' deben estar presentes
    expect(screen.getByAltText('HuertoHogar logo')).toBeInTheDocument();
    expect(screen.getAllByText('HuertoHogar').length).toBeGreaterThan(0);
  });

  test('renders navigation links', () => {
    const { container } = render(<App />);
    expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Productos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nosotros').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Blog').length).toBeGreaterThan(0);
    // Icono del carrito (SVG de MUI)
    expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument();
  });
});
