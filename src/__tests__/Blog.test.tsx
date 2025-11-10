import React from 'react';
import { render, screen } from '@testing-library/react';
import Blog from '../components/Blog';

describe('Blog Component', () => {

  // --- PRUEBA 1 ---
  it('renders main title, subtitle, and all blog posts', () => {
    
    // 1. RENDERIZAR
    // No se necesita <MemoryRouter> porque este componente
    // usa etiquetas <a> estándar, no <Link> de react-router.
    render(<Blog />);

    // 2. COMPROBAR (ASSERT)

    // Comprobar el Título Principal de la página
    expect(screen.getByRole('heading', { name: /Blog HuertoHogar/i })).toBeInTheDocument();

    // Comprobar el Subtítulo
    expect(screen.getByText(/Novedades, recetas y consejos/i)).toBeInTheDocument();

    // Comprobar que los 4 posts de la lista 'blogPosts' se renderizaron
    // Buscamos los 4 títulos (que son 'headings' <h3>)
    expect(screen.getByRole('heading', { name: /Ensalada de Verano/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /5 Pasos Sencillos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Beneficios de la Miel Orgánica/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Guía para tu Primer Huerto/i })).toBeInTheDocument();

    // Comprobar que existen 4 links de "Leer más" (uno por cada post)
    // Usamos 'getAllByText' porque esperamos encontrar más de uno
    const readMoreLinks = screen.getAllByText('Leer más →');
    expect(readMoreLinks.length).toBe(4);
  });

});