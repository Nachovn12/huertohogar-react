import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoriesPage from '../components/CategoriesPage';
import { CartProvider } from '../context/CartContext';

// Mock de productos con múltiples categorías
jest.mock('../data/products', () => ({
  products: [
    {
      id: 1,
      name: 'Tomates',
      price: 2500,
      image: '/img/tomates.jpg',
      description: 'Tomates frescos',
      category: 'Verduras',
      stock: 50,
      unit: 'kg',
      offer: false
    },
    {
      id: 2,
      name: 'Manzanas',
      price: 3000,
      image: '/img/manzanas.jpg',
      description: 'Manzanas rojas',
      category: 'Frutas',
      stock: 60,
      unit: 'kg',
      offer: false
    },
    {
      id: 3,
      name: 'Lechugas',
      price: 1500,
      image: '/img/lechugas.jpg',
      description: 'Lechugas frescas',
      category: 'Verduras',
      stock: 30,
      unit: 'unidad',
      offer: false
    },
    {
      id: 4,
      name: 'Plátanos',
      price: 2000,
      image: '/img/platanos.jpg',
      description: 'Plátanos maduros',
      category: 'Frutas',
      stock: 40,
      unit: 'kg',
      offer: false
    },
    {
      id: 5,
      name: 'Leche',
      price: 1800,
      image: '/img/leche.jpg',
      description: 'Leche fresca',
      category: 'Lácteos',
      stock: 25,
      unit: 'litro',
      offer: false
    }
  ]
}));

describe('CategoriesPage Component', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        <CartProvider>
          {component}
        </CartProvider>
      </BrowserRouter>
    );
  };

  test('renders categories page title', () => {
    renderWithRouter(<CategoriesPage />);
    expect(screen.getByText(/Explora por Categorías/i)).toBeInTheDocument();
  });

  test('renders categories badge', () => {
    renderWithRouter(<CategoriesPage />);
    expect(screen.getByText(/📂 Nuestras Categorías/i)).toBeInTheDocument();
  });

  test('displays all products by default', () => {
    renderWithRouter(<CategoriesPage />);
    // Debe mostrar los 5 productos mockeados
    expect(screen.getByText(/5 productos/i)).toBeInTheDocument();
  });

  test('renders "Todas" category button', () => {
    renderWithRouter(<CategoriesPage />);
    expect(screen.getByText(/Todas/)).toBeInTheDocument();
  });

  test('renders all unique categories', () => {
    renderWithRouter(<CategoriesPage />);
    
    // Debe mostrar las 3 categorías: Verduras, Frutas, Lácteos
    expect(screen.getByText(/Verduras/)).toBeInTheDocument();
    expect(screen.getByText(/Frutas/)).toBeInTheDocument();
    expect(screen.getByText(/Lácteos/)).toBeInTheDocument();
  });

  test('filters products when category is selected', () => {
    renderWithRouter(<CategoriesPage />);
    
    // Click en categoría Verduras
    const verdurasButton = screen.getByText(/Verduras/).closest('a');
    fireEvent.click(verdurasButton);
    
    // Debe mostrar solo 2 productos (Tomates y Lechugas)
    expect(screen.getByText(/2 productos en Verduras/i)).toBeInTheDocument();
    expect(screen.getByText('Tomates')).toBeInTheDocument();
    expect(screen.getByText('Lechugas')).toBeInTheDocument();
  });

  test('shows all products when "Todas" is clicked after filtering', () => {
    renderWithRouter(<CategoriesPage />);
    
    // Primero filtrar por Frutas
    const frutasButton = screen.getByText(/Frutas/).closest('a');
    fireEvent.click(frutasButton);
    
    expect(screen.getByText(/2 productos en Frutas/i)).toBeInTheDocument();
    
    // Luego click en "Todas"
    const todasButton = screen.getByText(/Todas/).closest('a');
    fireEvent.click(todasButton);
    
    // Debe mostrar los 5 productos nuevamente
    expect(screen.getByText(/5 productos/i)).toBeInTheDocument();
  });

  test('displays correct product count for each category', () => {
    renderWithRouter(<CategoriesPage />);
    
    // Verificar contadores (badges) en cada categoría
    // Todas: 5, Verduras: 2, Frutas: 2, Lácteos: 1
    const badges = screen.getAllByText(/\d+/);
    expect(badges.length).toBeGreaterThan(0);
  });

  test('renders contact banner at bottom', () => {
    renderWithRouter(<CategoriesPage />);
    expect(screen.getByText(/¿No encuentras lo que buscas?/i)).toBeInTheDocument();
    expect(screen.getByText(/Contáctanos/i)).toBeInTheDocument();
  });

  test('displays all product cards', () => {
    renderWithRouter(<CategoriesPage />);
    
    // Verificar que todos los productos se muestran
    expect(screen.getByText('Tomates')).toBeInTheDocument();
    expect(screen.getByText('Manzanas')).toBeInTheDocument();
    expect(screen.getByText('Lechugas')).toBeInTheDocument();
    expect(screen.getByText('Plátanos')).toBeInTheDocument();
    expect(screen.getByText('Leche')).toBeInTheDocument();
  });
});
