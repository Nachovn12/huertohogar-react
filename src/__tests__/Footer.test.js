import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  test('renders company name', () => {
    render(<Footer />);
    expect(screen.getByText('🌱 HuertoHogar')).toBeInTheDocument();
  });

  test('renders company description', () => {
    render(<Footer />);
    expect(screen.getByText('Tu tienda de confianza para productos de jardinería y hogar.')).toBeInTheDocument();
  });

  test('renders quick links section', () => {
    render(<Footer />);
    expect(screen.getByText('Enlaces Rápidos')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Carrito')).toBeInTheDocument();
  });

  test('renders contact information', () => {
    render(<Footer />);
    expect(screen.getByText('Contacto')).toBeInTheDocument();
    expect(screen.getByText('📧 info@huertohogar.cl')).toBeInTheDocument();
    expect(screen.getByText('📞 +56 9 1234 5678')).toBeInTheDocument();
    expect(screen.getByText('📍 Santiago, Chile')).toBeInTheDocument();
  });

  test('renders copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText('© 2024 HuertoHogar. Todos los derechos reservados.')).toBeInTheDocument();
  });
});
