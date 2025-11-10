import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types'; 
import CartContext from '../context/CartContext';

describe('ProductCard Component (Test 4/10) - JASMINE', () => {
  
  // --- Mocks con JASMINE ---
  const mockAddToCart = jasmine.createSpy('addToCart');
  const mockRemoveFromCart = jasmine.createSpy('removeFromCart');
  const mockClearCart = jasmine.createSpy('clearCart');
  const mockToggleCart = jasmine.createSpy('toggleCart');
  const mockOpenCart = jasmine.createSpy('openCart');

  // Mock de producto base (Manzanas Fuji)
  const mockProduct: Product = {
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

  // Función helper para renderizar con todos los providers necesarios
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <CartContext.Provider value={{
          items: [],
          cart: [],
          isCartOpen: false,
          addToCart: mockAddToCart,
          removeFromCart: mockRemoveFromCart,
          updateQuantity: jasmine.createSpy('updateQuantity'),
          clearCart: mockClearCart,
          toggleCart: mockToggleCart,
          openCart: mockOpenCart,
          closeCart: jasmine.createSpy('closeCart'),
          getTotalItems: () => 0,
          getTotalPrice: () => 0,
        }}>
          {component}
        </CartContext.Provider>
      </MemoryRouter>
    );
  };

  // Limpieza de Spies de Jasmine
  beforeEach(() => {
    mockAddToCart.calls.reset();
    mockRemoveFromCart.calls.reset();
    mockClearCart.calls.reset();
    mockToggleCart.calls.reset();
    mockOpenCart.calls.reset();
  });

  // --- PRUEBA 1: Renderizado y Props ---
  it('renders product information correctly (Happy Path)', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('$1.200')).toBeInTheDocument();
    expect(screen.getByText('Frutas Frescas')).toBeInTheDocument();
    expect(screen.getByText(/Región Valle del Maule/i)).toBeInTheDocument();
    expect(screen.getByText('TEMPORADA')).toBeInTheDocument();
  });

  // --- PRUEBA 2: Evento onClick (Agregar al Carrito) ---
  it('calls addToCart when "Agregar al Carrito" button is clicked', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(addButton);
    
    // Verificamos que el espía fue llamado (Jasmine)
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  // --- PRUEBA 3: Renderizado Condicional (Stock Cero) ---
  it('disables button and shows "Agotado" when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('Agotado')).toBeInTheDocument();
    
    // Verificamos el estado 'disabled' (Jasmine)
    const addButton = screen.getByRole('button', { name: /agregar al carrito/i });
    expect(addButton).toBeDisabled();
  });

  // --- PRUEBA 4: Renderizado Condicional (Oferta) ---
  it('renders offer price and badge when on offer', () => {
    const offerProduct = { 
      ...mockProduct, 
      offer: true, 
      offerPrice: 1000, 
      discount: 17 
    };
    
    renderWithProviders(<ProductCard product={offerProduct} />);
    
    expect(screen.getByText('$1.000')).toBeInTheDocument();
    expect(screen.getByText(/Antes: \$1\.200/i)).toBeInTheDocument();
    expect(screen.getByText(/-17% OFF/i)).toBeInTheDocument();
  });

});