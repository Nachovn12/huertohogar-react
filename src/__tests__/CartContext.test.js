import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  
  const testProduct = {
    id: 1,
    name: 'Test Product',
    price: 1000,
    image: '🧪',
    description: 'Test description'
  };

  return (
    <div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="total-price">{getTotalPrice()}</div>
      <div data-testid="items-count">{items.length}</div>
      <button onClick={() => addToCart(testProduct)}>Add to Cart</button>
      <button onClick={() => removeFromCart(1)}>Remove from Cart</button>
      <button onClick={() => updateQuantity(1, 5)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('CartContext', () => {
  test('provides initial empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  test('adds product to cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByText('Add to Cart'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('1000');
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
  });

  test('increases quantity when adding same product twice', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByText('Add to Cart'));
    fireEvent.click(screen.getByText('Add to Cart'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('2000');
  });

  test('removes product from cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Agregar producto primero
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
    
    // Luego removerlo
    fireEvent.click(screen.getByText('Remove from Cart'));
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  test('updates product quantity', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Agregar producto primero
    fireEvent.click(screen.getByText('Add to Cart'));
    
    // Actualizar cantidad
    fireEvent.click(screen.getByText('Update Quantity'));
    
    expect(screen.getByTestId('total-items')).toHaveTextContent('5');
    expect(screen.getByTestId('total-price')).toHaveTextContent('5000');
  });

  test('clears entire cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Agregar producto
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(screen.getByTestId('items-count')).toHaveTextContent('1');
    
    // Limpiar carrito
    fireEvent.click(screen.getByText('Clear Cart'));
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });
});
