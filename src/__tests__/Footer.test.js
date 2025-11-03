import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  test('renders company name', () => {
    render(<Footer />);
    expect(screen.getByText('HuertoHogar')).toBeInTheDocument();
  });

  test('renders company description', () => {
    render(<Footer />);
    expect(screen.getByText(/¡Descubre la frescura del campo con HuertoHogar!/)).toBeInTheDocument();
  });

  test('renders navigation section', () => {
    render(<Footer />);
    expect(screen.getByText('Navegación')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  test('renders contact information', () => {
    const { container } = render(<Footer />);
    expect(screen.getByText('Contacto')).toBeInTheDocument();
    // Verificar que existe un link mailto
    const emailLink = container.querySelector('a[href="mailto:info@huertohogar.com"]');
    expect(emailLink).toBeTruthy();
  });

  test('renders copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 HuertoHogar/)).toBeInTheDocument();
  });
});
