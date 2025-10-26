import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock del contexto del carrito
jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    getTotalItems: () => 3
  })
}));

describe('Navbar Component', () => {
  test('renders brand name', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('🌱 HuertoHogar')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    // Puede haber varias ocurrencias (desktop + mobile), comprobar al menos una
    const inicios = screen.getAllByText('Inicio');
    expect(inicios.length).toBeGreaterThan(0);
    const productos = screen.getAllByText('Productos');
    expect(productos.length).toBeGreaterThan(0);
    // El icono del carrito y/o el contador pueden estar en elementos separados
    expect(screen.getByText('🛒')).toBeInTheDocument();
  });

  test('displays cart item count', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('has correct links', () => {
    const { container } = render(<MemoryRouter><Navbar /></MemoryRouter>);

    // Tomar la primera ocurrencia de 'Inicio' (puede haber mobile y desktop)
    const homeLink = screen.getAllByText('Inicio')[0].closest('a');
    // Buscar explícitamente el enlace al carrito por su href
    const cartLink = container.querySelector('a[href="/cart"]');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(cartLink).toBeTruthy();
    expect(cartLink).toHaveAttribute('href', '/cart');
  });
});
