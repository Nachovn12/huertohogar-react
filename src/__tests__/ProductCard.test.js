import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

// Mock del contexto del carrito
const mockAddToCart = jest.fn();
jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart
  })
}));

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Kit de Herramientas Básicas',
    price: 25000,
    image: 'https://example.com/toolkit.jpg',
    description: 'Kit completo con pala, rastrillo y guantes',
    category: 'herramientas',
    stock: 15
  };

  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  test('renders product information correctly', () => {
  render(<MemoryRouter><ProductCard product={mockProduct} /></MemoryRouter>);
    
    expect(screen.getByText('Kit de Herramientas Básicas')).toBeInTheDocument();
    expect(screen.getByText('Kit completo con pala, rastrillo y guantes')).toBeInTheDocument();
  // Precio puede incluir el separador '/' con la unidad, buscar por regex para evitar empates exactos
  expect(screen.getByText(/\$25\.000/)).toBeInTheDocument();
    // Verificar que el stock aparece en el documento (sin texto "Stock:")
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByAltText('Kit de Herramientas Básicas')).toBeInTheDocument();
  });

  test('calls addToCart when button is clicked', () => {
    render(<MemoryRouter><ProductCard product={mockProduct} /></MemoryRouter>);
    // El botón ahora dice 'Agregar'
    const addButton = screen.getByText('Agregar');
    fireEvent.click(addButton);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test('disables button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
  render(<MemoryRouter><ProductCard product={outOfStockProduct} /></MemoryRouter>);
    
    const button = screen.getByText('Sin Stock');
    expect(button).toBeDisabled();
  });

  test('formats price correctly in Chilean pesos', () => {
  render(<MemoryRouter><ProductCard product={mockProduct} /></MemoryRouter>);
    
  // Verifica que el precio se formatea correctamente (coincidencia parcial con regex)
  expect(screen.getByText(/\$25\.000/)).toBeInTheDocument();
  });
});
