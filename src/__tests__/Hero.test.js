import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../components/Hero';

describe('Hero Component', () => {
  test('renders hero title', () => {
    render(<Hero />);
    expect(screen.getByText('Bienvenido a HuertoHogar')).toBeInTheDocument();
  });

  test('renders hero description', () => {
    render(<Hero />);
    // Texto actualizado del componente Hero
    expect(screen.getByText(/Productos frescos, orgánicos y llenos de sabor, seleccionados para ti/)).toBeInTheDocument();
  });

  test('renders call to action button', () => {
    render(<Hero />);
    expect(screen.getByText('Ver Productos')).toBeInTheDocument();
  });

  test('renders hero image placeholder', () => {
    render(<Hero />);
    // Placeholder eliminado: verificar que ya no se renderiza el texto del placeholder
    expect(screen.queryByText('🌱 Tu Huerto, Tu Hogar')).not.toBeInTheDocument();
  });

  test('has correct button styling', () => {
    render(<Hero />);
    const button = screen.getByText('Ver Productos');
    // El botón debe tener la clase de MUI y estilos personalizados
    expect(button).toHaveClass('MuiButton-root');
    expect(button).toHaveClass('MuiButton-contained');
    expect(button).toHaveClass('MuiButton-sizeLarge');
  });
});
