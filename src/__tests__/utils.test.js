// Pruebas para funciones utilitarias
describe('Utility Functions', () => {
  test('formats price correctly in Chilean pesos', () => {
    const formatPrice = (price) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(price);
    };

    expect(formatPrice(25000)).toBe('$25.000');
    expect(formatPrice(3500)).toBe('$3.500');
    expect(formatPrice(100000)).toBe('$100.000');
  });

  test('validates product data structure', () => {
    const validateProduct = (product) => {
      return product && 
             product.id && 
             product.name && 
             product.price && 
             product.image && 
             product.description && 
             product.category && 
             typeof product.stock === 'number';
    };

    const validProduct = {
      id: 1,
      name: 'Test Product',
      price: 1000,
      image: '🧪',
      description: 'Test description',
      category: 'test',
      stock: 10
    };

    const invalidProduct = {
      id: 1,
      name: 'Test Product',
      // missing required fields
    };

  expect(validateProduct(validProduct)).toBe(true);
  // la función puede devolver undefined para campos faltantes; aceptar cualquier valor falsy
  expect(validateProduct(invalidProduct)).toBeFalsy();
  });

  test('calculates cart totals correctly', () => {
    const calculateTotal = (items) => {
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const items = [
      { price: 1000, quantity: 2 },
      { price: 500, quantity: 3 },
      { price: 2000, quantity: 1 }
    ];

    expect(calculateTotal(items)).toBe(5500);
  });

  test('filters products by category', () => {
    const filterProducts = (products, category) => {
      return category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    };

    const products = [
      { id: 1, category: 'herramientas' },
      { id: 2, category: 'semillas' },
      { id: 3, category: 'herramientas' }
    ];

    expect(filterProducts(products, 'all')).toHaveLength(3);
    expect(filterProducts(products, 'herramientas')).toHaveLength(2);
    expect(filterProducts(products, 'semillas')).toHaveLength(1);
  });
});
