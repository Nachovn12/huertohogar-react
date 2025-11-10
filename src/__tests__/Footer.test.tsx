// src/__tests__/Footer.test.tsx
// Pruebas unitarias para el componente Footer
// Autor: [Tu nombre]
// Fecha: Noviembre 2025
// Nota: Este test usa jasmine.clock() para mockear fechas (importante para el copyright)

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer';

describe('Componente Footer - Pruebas de Renderizado', () => {

  // Definimos una fecha fija para las pruebas
  // Esto es necesario porque el footer muestra el año actual en el copyright
  const FECHA_SIMULADA = new Date('2025-11-10T12:00:00Z');
  
  // beforeEach se ejecuta ANTES de cada test
  // Aquí configuramos el reloj falso de Jasmine
  beforeEach(() => {
    // Instalamos el reloj de Jasmine (equivalente a jest.useFakeTimers())
    jasmine.clock().install();
    // Seteamos la fecha simulada para que new Date() retorne siempre esta fecha
    jasmine.clock().mockDate(FECHA_SIMULADA);
  });

  // afterEach se ejecuta DESPUÉS de cada test
  // Importante: siempre hay que desinstalar el reloj para no afectar otros tests
  afterEach(() => {
    jasmine.clock().uninstall();
  });

  // PRUEBA 1: Verificar que todas las secciones del footer se renderizan correctamente
  it('debería renderizar todas las secciones principales y la información de contacto', () => {
    
    // Paso 1: RENDERIZAR el componente
    // Necesitamos MemoryRouter porque el Footer tiene <Link> de react-router
    // Sin MemoryRouter, los <Link> fallarían
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    // Paso 2: VERIFICAR que todos los elementos están en el documento

    // Verificamos el logo/marca principal
    // NOTA IMPORTANTE: El componente renderiza "Huerto<span>Hogar</span>"
    // pero el texto accesible se lee como "HuertoHogar" (sin espacio)
    expect(screen.getByRole('heading', { name: /HuertoHogar/i })).toBeInTheDocument();

    // Verificamos el eslogan/descripción de la empresa
    expect(screen.getByText(/Productos frescos, locales y sostenibles/i)).toBeInTheDocument();

    // Verificamos que existan las 3 columnas principales del footer
    expect(screen.getByText('Navegación')).toBeInTheDocument();
    expect(screen.getByText('Enlaces Útiles')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();

    // Verificamos la información de contacto específica de HuertoHogar
    // Estos datos están hardcodeados en el componente
    expect(screen.getByText('Concepción, Chile')).toBeInTheDocument();
    expect(screen.getByText('contacto@huertohogar.cl')).toBeInTheDocument();
    expect(screen.getByText('+56 9 1234 5678')).toBeInTheDocument();
    expect(screen.getByText('Lun a Sáb: 8:00 - 20:00')).toBeInTheDocument();

    // Verificamos el copyright con el año correcto
    // Gracias al mock de fecha, sabemos que el año será 2025
    // Si el componente usa new Date().getFullYear(), va a retornar 2025
    expect(screen.getByText(/© 2025 HuertoHogar. Todos los derechos reservados./i)).toBeInTheDocument();
  });

});