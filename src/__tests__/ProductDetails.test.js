import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';

const mockAddToCart = jest.fn();

jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart
  })
}));

describe('ProductDetails Component', () => {
  beforeEach(() => {
    mockAddToCart.mockClear();
  });

  test('renders product details for existing product and adds to cart', () => {
    render(
      <MemoryRouter initialEntries={["/productos/FR001"]}>
        <Routes>
          <Route path="/productos/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

  // Should render product name (heading) and add to cart button
  expect(screen.getByRole('heading', { name: /Manzanas Fuji/i })).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /Agregar al Carrito/i });
    expect(button).toBeInTheDocument();

    // Click should call addToCart
    fireEvent.click(button);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });

  test('renders not found message for invalid id', () => {
    render(
      <MemoryRouter initialEntries={["/productos/NO_EXISTE"]}>
        <Routes>
          <Route path="/productos/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument();
  });
});
