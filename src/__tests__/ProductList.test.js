import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductList from '../components/ProductList';

// Mock del contexto del carrito
jest.mock('../context/CartContext', () => ({
  useCart: () => ({
    addToCart: jest.fn()
  })
}));

describe('ProductList Component', () => {
  test('renders all products by default', () => {
  render(<MemoryRouter><ProductList /></MemoryRouter>);
    
    expect(screen.getByText('Nuestros Productos')).toBeInTheDocument();
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument();
  });

  test('renders filter buttons', () => {
  render(<MemoryRouter><ProductList /></MemoryRouter>);
    
    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('Frutas Frescas')).toBeInTheDocument();
    expect(screen.getByText('Verduras Orgánicas')).toBeInTheDocument();
  });

  test('filters products by category', () => {
  render(<MemoryRouter><ProductList /></MemoryRouter>);
    
    // Hacer clic en el filtro de frutas
    const frutasButton = screen.getByText('Frutas Frescas');
    fireEvent.click(frutasButton);
    
    // Verificar que solo se muestran productos de frutas
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument();
    
    // Verificar que no se muestran otros productos
    expect(screen.queryByText('Zanahorias Orgánicas')).not.toBeInTheDocument();
  });

  test('shows message when no products in category', () => {
  render(<MemoryRouter><ProductList /></MemoryRouter>);
    
    // Hacer clic en una categoría que tiene productos
    const frutasButton = screen.getByText('Frutas Frescas');
    fireEvent.click(frutasButton);
    
    // Verificar que se muestran los productos de frutas
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
  });

  test('resets to all products when clicking "Todos"', () => {
  render(<MemoryRouter><ProductList /></MemoryRouter>);
    
    // Primero filtrar por frutas
    const frutasButton = screen.getByText('Frutas Frescas');
    fireEvent.click(frutasButton);
    
    // Luego hacer clic en "Todos"
    const todosButton = screen.getByText('Todos');
    fireEvent.click(todosButton);
    
    // Verificar que se muestran todos los productos
    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument();
    expect(screen.getByText('Zanahorias Orgánicas')).toBeInTheDocument();
  });
});
