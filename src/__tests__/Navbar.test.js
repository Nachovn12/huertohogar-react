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
    // El logo y el texto 'HuertoHogar' deben estar presentes
    expect(screen.getByAltText('HuertoHogar logo')).toBeInTheDocument();
    expect(screen.getByText('HuertoHogar')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    // Links principales (pueden aparecer en desktop y mobile menu)
    expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Productos').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nosotros').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Blog').length).toBeGreaterThan(0);
    // Icono del carrito (SVG de MUI)
    expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument();
  });

  test('displays cart item count', () => {
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    // El contador del carrito debe mostrar el número correcto
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('has correct links', () => {
    const { container } = render(<MemoryRouter><Navbar /></MemoryRouter>);
    // Link de inicio
    const homeLink = screen.getAllByText('Inicio')[0].closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
    // El carrito no es un link, es un icono
    expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument();
  });
});
