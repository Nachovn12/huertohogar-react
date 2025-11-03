import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Offers from '../components/Offers';
import { CartProvider } from '../context/CartContext';

// Mock de productos
jest.mock('../data/products', () => ({
  products: [
    {
      id: 1,
      name: 'Tomates Orgánicos',
      price: 2500,
      image: '/img/tomates.jpg',
      description: 'Tomates frescos',
      category: 'Verduras',
      stock: 50,
      unit: 'kg',
      offer: true
    },
    {
      id: 2,
      name: 'Lechugas',
      price: 1500,
      image: '/img/lechugas.jpg',
      description: 'Lechugas frescas',
      category: 'Verduras',
      stock: 30,
      unit: 'unidad',
      offer: true
    },
    {
      id: 3,
      name: 'Zanahorias',
      price: 1200,
      image: '/img/zanahorias.jpg',
      description: 'Zanahorias orgánicas',
      category: 'Verduras',
      stock: 40,
      unit: 'kg',
      offer: false
    },
    {
      id: 4,
      name: 'Manzanas',
      price: 3000,
      image: '/img/manzanas.jpg',
      description: 'Manzanas rojas',
      category: 'Frutas',
      stock: 60,
      unit: 'kg',
      offer: true
    }
  ]
}));

describe('Offers Component', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        <CartProvider>
          {component}
        </CartProvider>
      </BrowserRouter>
    );
  };

  test('renders offers page title', () => {
    renderWithRouter(<Offers />);
    // Usar getAllByText para obtener todos los elementos y verificar que exista el h1
    const titles = screen.getAllByText(/Productos en Oferta/i);
    expect(titles.length).toBeGreaterThan(0);
  });

  test('renders special offers badge', () => {
    renderWithRouter(<Offers />);
    expect(screen.getByText(/🔥 Ofertas Especiales/i)).toBeInTheDocument();
  });

  test('displays correct number of products on offer', () => {
    renderWithRouter(<Offers />);
    // De los 4 productos mockeados, 3 tienen offer: true
    expect(screen.getByText(/3 productos en oferta disponibles/i)).toBeInTheDocument();
  });

  test('renders only products with offer flag', () => {
    renderWithRouter(<Offers />);
    
    // Productos con oferta deben estar presentes
    expect(screen.getByText('Tomates Orgánicos')).toBeInTheDocument();
    expect(screen.getByText('Lechugas')).toBeInTheDocument();
    expect(screen.getByText('Manzanas')).toBeInTheDocument();
    
    // Producto sin oferta NO debe estar presente
    expect(screen.queryByText('Zanahorias')).not.toBeInTheDocument();
  });

  test('renders newsletter banner', () => {
    renderWithRouter(<Offers />);
    expect(screen.getByText(/¿Quieres recibir nuestras ofertas?/i)).toBeInTheDocument();
    expect(screen.getByText(/Suscríbete a nuestro newsletter/i)).toBeInTheDocument();
  });

  test('displays description text', () => {
    renderWithRouter(<Offers />);
    expect(screen.getByText(/Aprovecha nuestros mejores descuentos/i)).toBeInTheDocument();
  });
});
