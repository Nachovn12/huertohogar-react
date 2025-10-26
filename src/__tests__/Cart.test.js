import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from '../components/Cart';

// Mock del contexto del carrito
const mockRemoveFromCart = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockClearCart = jest.fn();

jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    items: [
      {
        id: 1,
        name: 'Kit de Herramientas Básicas',
        price: 25000,
        image: '🛠️',
        description: 'Kit completo con pala, rastrillo y guantes',
        quantity: 2
      },
      {
        id: 2,
        name: 'Semillas de Tomate Cherry',
        price: 3500,
        image: '🍅',
        description: 'Semillas orgánicas de tomate cherry',
        quantity: 1
      }
    ],
    removeFromCart: mockRemoveFromCart,
    updateQuantity: mockUpdateQuantity,
    clearCart: mockClearCart,
    getTotalPrice: () => 53500
  })
}));

describe('Cart Component', () => {
  beforeEach(() => {
    mockRemoveFromCart.mockClear();
    mockUpdateQuantity.mockClear();
    mockClearCart.mockClear();
  });

  test('renders cart items correctly', () => {
  render(<MemoryRouter><Cart /></MemoryRouter>);
    
    expect(screen.getByText('Mi Carrito')).toBeInTheDocument();
    expect(screen.getByText('Kit de Herramientas Básicas')).toBeInTheDocument();
    expect(screen.getByText('Semillas de Tomate Cherry')).toBeInTheDocument();
  });

  test('displays correct total price', () => {
  render(<MemoryRouter><Cart /></MemoryRouter>);
    
    expect(screen.getByText('$53.500')).toBeInTheDocument();
  });

  test('calls removeFromCart when delete button is clicked', () => {
  render(<MemoryRouter><Cart /></MemoryRouter>);
    
    const deleteButtons = screen.getAllByText('🗑️');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });

  test('calls updateQuantity when quantity is changed', () => {
  render(<MemoryRouter><Cart /></MemoryRouter>);
    
    const quantityInputs = screen.getAllByDisplayValue('2');
    fireEvent.change(quantityInputs[0], { target: { value: '3' } });
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  test('calls clearCart when clear button is clicked', () => {
  render(<MemoryRouter><Cart /></MemoryRouter>);
    
    const clearButton = screen.getByText('Vaciar Carrito');
    fireEvent.click(clearButton);
    
    expect(mockClearCart).toHaveBeenCalled();
  });
});
