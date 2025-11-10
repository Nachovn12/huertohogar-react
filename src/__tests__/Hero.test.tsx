import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../components/Hero';

describe('Componente Hero - Pruebas de Renderizado', () => {

  // PRUEBA 1: Verificar que se renderizan todos los elementos del banner principal
  it('debería renderizar el título principal, subtítulo y botón de llamada a la acción', () => {
    
    // Paso 1: RENDERIZAR el componente
    // Necesitamos MemoryRouter porque el botón "Ver Productos" 
    // tiene una prop href="/productos" que lo convierte en un Link
    // Los Link de react-router SIEMPRE necesitan estar dentro de un Router
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    // Paso 2: VERIFICAR que todos los elementos existen en el DOM

    // Verificamos el título principal del banner
    // IMPORTANTE: Usamos getByRole('heading') porque es más semántico
    // El texto está dividido por un <span> igual que en el Footer
    // pero React Testing Library lo lee como un solo texto
    expect(screen.getByRole('heading', { name: /Bienvenido a HuertoHogar/i })).toBeInTheDocument();

    // Verificamos el subtítulo (descripción del negocio)
    // NOTA: El subtítulo tiene un <br /> en el medio que lo parte en 2 líneas
    // Por eso buscamos cada parte por separado usando getByText
    expect(screen.getByText(/Productos frescos, orgánicos y llenos de sabor/i)).toBeInTheDocument();
    expect(screen.getByText(/seleccionados para ti/i)).toBeInTheDocument();

    // Verificamos el botón de llamada a la acción (CTA)
    // Buscamos por 'link' porque el Button de Material-UI con href
    // se convierte en un <a> en el DOM (no en un <button>)
    expect(screen.getByRole('link', { name: /Ver Productos/i })).toBeInTheDocument();
  });

});