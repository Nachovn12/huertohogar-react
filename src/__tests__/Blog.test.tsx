import React from 'react';
import { render, screen } from '@testing-library/react';
import Blog from '../components/Blog';

describe('Componente Blog - Pruebas de Renderizado', () => {

  // PRUEBA 1: Verificar que se renderizan todos los elementos principales del blog
  it('debería renderizar el título principal, subtítulo y todos los posts del blog', () => {
    
    // Paso 1: RENDERIZAR el componente
    // No necesitamos MemoryRouter aquí porque el componente Blog
    // usa etiquetas <a> normales de HTML, no <Link> de react-router
    render(<Blog />);

    // Paso 2: VERIFICAR que los elementos existen en el DOM
    
    // Verificamos que el título principal aparezca correctamente
    // Usamos getByRole porque los <h1> son "heading" en el DOM
    expect(screen.getByRole('heading', { name: /Blog HuertoHogar/i })).toBeInTheDocument();

    // Verificamos que el subtítulo esté presente
    // La expresión regular /i hace que no importe si está en mayúsculas o minúsculas
    expect(screen.getByText(/Novedades, recetas y consejos/i)).toBeInTheDocument();

    // Verificamos que se rendericen los 4 posts definidos en el array blogPosts
    // Cada título de post es un <h3>, por eso usamos 'heading'
    expect(screen.getByRole('heading', { name: /Ensalada de Verano/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /5 Pasos Sencillos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Beneficios de la Miel Orgánica/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Guía para tu Primer Huerto/i })).toBeInTheDocument();

    // Verificamos que existan exactamente 4 botones "Leer más"
    // Usamos getAllByText porque esperamos encontrar más de uno
    // Si el componente tiene menos o más de 4, esta prueba fallará
    const botonesLeerMas = screen.getAllByText('Leer más →');
    expect(botonesLeerMas.length).toBe(4);
  });

});