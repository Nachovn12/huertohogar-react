import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types'; 
import CartContext from '../context/CartContext';

describe('Componente ProductCard - Pruebas de Renderizado, Props y Eventos', () => {
  
  // ========== Mocks con JASMINE ==========
  // Creamos espías (spies) de Jasmine para simular las funciones del carrito
  // Esto nos permite verificar si las funciones fueron llamadas sin ejecutarlas realmente
  const mockAgregarAlCarrito = jasmine.createSpy('addToCart');
  const mockEliminarDelCarrito = jasmine.createSpy('removeFromCart');
  const mockLimpiarCarrito = jasmine.createSpy('clearCart');
  const mockToggleCarrito = jasmine.createSpy('toggleCart');
  const mockAbrirCarrito = jasmine.createSpy('openCart');

  // Producto de prueba basado en el caso de HuertoHogar (Manzanas Fuji)
  // Este es el producto base que usaremos en la mayoría de las pruebas
  const productoMock: Product = {
    id: 'FR001',
    name: 'Manzanas Fuji',
    price: 1200,
    stock: 150,
    image: 'fuji.jpg',
    description: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.',
    category: 'frutas',
    origin: 'Valle del Maule',
    unit: 'kilo',
    offer: false,
    seasonal: true,
    rating: 4,
    reviews: 89,
  };

  // Función auxiliar para renderizar el componente con todos los providers necesarios
  // Esto evita repetir código en cada test
  const renderizarConProviders = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <CartContext.Provider value={{
          items: [],
          cart: [],
          isCartOpen: false,
          addToCart: mockAgregarAlCarrito,
          removeFromCart: mockEliminarDelCarrito,
          updateQuantity: jasmine.createSpy('updateQuantity'),
          clearCart: mockLimpiarCarrito,
          toggleCart: mockToggleCarrito,
          openCart: mockAbrirCarrito,
          closeCart: jasmine.createSpy('closeCart'),
          getTotalItems: () => 0,
          getTotalPrice: () => 0,
        }}>
          {component}
        </CartContext.Provider>
      </MemoryRouter>
    );
  };

  // beforeEach se ejecuta antes de cada test individual
  // Limpiamos el historial de llamadas de los espías para que cada test empiece limpio
  beforeEach(() => {
    mockAgregarAlCarrito.calls.reset();
    mockEliminarDelCarrito.calls.reset();
    mockLimpiarCarrito.calls.reset();
    mockToggleCarrito.calls.reset();
    mockAbrirCarrito.calls.reset();
  });

  // ========== PRUEBA 1: Renderizado y Props (Caso Feliz) ==========
  // Verificamos que el componente renderice correctamente toda la información del producto
  it('debería renderizar correctamente toda la información del producto', () => {
    renderizarConProviders(<ProductCard product={productoMock} />);
    
    // Verificamos que el nombre del producto esté visible
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    
    // Verificamos que el precio se muestre con formato chileno (punto como separador de miles)
    expect(screen.getByText('$1.200')).toBeInTheDocument();
    
    // Verificamos que la categoría se muestre correctamente
    expect(screen.getByText('Frutas Frescas')).toBeInTheDocument();
    
    // Verificamos que el origen del producto se muestre
    // Usamos regex /i para que no importe mayúsculas/minúsculas
    expect(screen.getByText(/Región Valle del Maule/i)).toBeInTheDocument();
    
    // Verificamos que la etiqueta de temporada aparezca (porque seasonal = true)
    expect(screen.getByText('TEMPORADA')).toBeInTheDocument();
  });

  // ========== PRUEBA 2: Evento onClick (Agregar al Carrito) ==========
  // Verificamos que al hacer clic en el botón se llame a la función addToCart correctamente
  it('debería llamar a la función addToCart cuando se hace clic en el botón "Agregar al Carrito"', () => {
    renderizarConProviders(<ProductCard product={productoMock} />);
    
    // Buscamos el botón por su rol y texto
    const botonAgregar = screen.getByRole('button', { name: /agregar al carrito/i });
    
    // Simulamos un clic en el botón
    fireEvent.click(botonAgregar);
    
    // Verificamos que el espía fue llamado exactamente 1 vez
    expect(mockAgregarAlCarrito).toHaveBeenCalledTimes(1);
    
    // Verificamos que se pasó el producto correcto como argumento
    expect(mockAgregarAlCarrito).toHaveBeenCalledWith(productoMock);
  });

  // ========== PRUEBA 3: Renderizado Condicional (Sin Stock) ==========
  // Verificamos que cuando el stock es 0, el botón se deshabilite y muestre "Agotado"
  it('debería deshabilitar el botón y mostrar "Agotado" cuando el stock es 0', () => {
    // Creamos una copia del producto pero con stock en 0
    // Usamos spread operator para copiar todas las propiedades
    const productoSinStock = { ...productoMock, stock: 0 };
    
    renderizarConProviders(<ProductCard product={productoSinStock} />);
    
    // Verificamos que el texto "Agotado" aparezca
    expect(screen.getByText('Agotado')).toBeInTheDocument();
    
    // Verificamos que el botón esté deshabilitado
    // toBeDisabled es un matcher personalizado que agregamos en test-utils.js
    const botonAgregar = screen.getByRole('button', { name: /agregar al carrito/i });
    expect(botonAgregar).toBeDisabled();
  });

  // ========== PRUEBA 4: Renderizado Condicional (Producto en Oferta) ==========
  // Verificamos que cuando un producto está en oferta, se muestren el precio rebajado y la etiqueta de descuento
  it('debería renderizar el precio de oferta y la etiqueta de descuento cuando el producto está en oferta', () => {
    // Creamos una copia del producto pero con oferta activa
    const productoEnOferta = { 
      ...productoMock, 
      offer: true,           // Activamos la oferta
      offerPrice: 1000,      // Precio rebajado
      discount: 17           // Porcentaje de descuento
    };
    
    renderizarConProviders(<ProductCard product={productoEnOferta} />);
    
    // Verificamos que el precio de oferta se muestre
    expect(screen.getByText('$1.000')).toBeInTheDocument();
    
    // Verificamos que el precio original se muestre tachado con "Antes:"
    // Usamos regex porque el punto del precio necesita ser escapado (\.)
    expect(screen.getByText(/Antes: \$1\.200/i)).toBeInTheDocument();
    
    // Verificamos que la etiqueta de descuento aparezca
    expect(screen.getByText(/-17% OFF/i)).toBeInTheDocument();
  });

});