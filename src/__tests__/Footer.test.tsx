// src/__tests__/Footer.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer';

describe('Footer Component', () => {

  // Definimos la fecha falsa que usaremos para el test
  const FAKE_DATE = new Date('2025-11-10T12:00:00Z');
  
  // --- CORRECCIÓN JASMINE: Reemplazamos jest.useFakeTimers ---
  beforeEach(() => {
    // Usamos jasmine.clock().install() en lugar de jest.useFakeTimers()
    jasmine.clock().install();
    jasmine.clock().mockDate(FAKE_DATE);
  });

  afterEach(() => {
    // Usamos jasmine.clock().uninstall() en lugar de jest.useRealTimers()
    jasmine.clock().uninstall();
  });

  // --- PRUEBA 1 ---
  it('renders all main sections and contact info correctly', () => {
    
    // 1. RENDERIZAR
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // 2. COMPROBAR (ASSERT)

    // CORREGIDO: El heading renderizado es "HuertoHogar" sin espacio
    // El componente renderiza: Huerto<span>Hogar</span>
    // Pero el texto accesible es "HuertoHogar" (sin espacio)
    expect(screen.getByRole('heading', { name: /HuertoHogar/i })).toBeInTheDocument();

    // Comprobar la descripción
    expect(screen.getByText(/Productos frescos, locales y sostenibles/i)).toBeInTheDocument();

    // Comprobar los títulos de las columnas
    expect(screen.getByText('Navegación')).toBeInTheDocument();
    expect(screen.getByText('Enlaces Útiles')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();

    // Comprobar la información de contacto específica
    expect(screen.getByText('Concepción, Chile')).toBeInTheDocument();
    expect(screen.getByText('contacto@huertohogar.cl')).toBeInTheDocument();
    expect(screen.getByText('+56 9 1234 5678')).toBeInTheDocument();
    expect(screen.getByText('Lun a Sáb: 8:00 - 20:00')).toBeInTheDocument();

    // Comprobar el copyright usando el año 2025 (definido en el mock de fecha de Jasmine)
    expect(screen.getByText(/© 2025 HuertoHogar. Todos los derechos reservados./i)).toBeInTheDocument();
  });

});