import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../components/Hero';

describe('Hero Component', () => {

  // --- PRUEBA 1 ---
  it('renders main heading, subtitle, and call-to-action button', () => {
    
    // 1. RENDERIZAR
    // Volvemos a usar <MemoryRouter> porque el <Button> que
    // dice "Ver Productos" tiene una prop 'href="/productos"',
    // lo que lo convierte en un Link que necesita un Router.
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    // 2. COMPROBAR (ASSERT)

    // Comprobar el Título Principal
    // Usamos 'getByRole' porque el texto "Bienvenido a HuertoHogar"
    // está dividido por un <span>, tal como pasó en el Footer.
    expect(screen.getByRole('heading', { name: /Bienvenido a HuertoHogar/i })).toBeInTheDocument();

    // Comprobar el Subtítulo
    // Usamos regex con 'getByText' para que no falle por
    // el salto de línea (<br />) que tiene en medio.
    expect(screen.getByText(/Productos frescos, orgánicos y llenos de sabor/i)).toBeInTheDocument();
    expect(screen.getByText(/seleccionados para ti/i)).toBeInTheDocument();

    // Comprobar el Botón
    // Buscamos por el 'rol' de botón y su nombre de texto
    expect(screen.getByRole('link', { name: /Ver Productos/i })).toBeInTheDocument();
  });

});