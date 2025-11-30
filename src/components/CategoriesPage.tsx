import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Nav, Badge, Spinner, Alert } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { Product, Category } from '../types';
import { useProducts, useAvailableCategories } from '../hooks/useApi';

const CategoriesPage: React.FC = () => {
  const { products, loading: loadingProducts, error: errorProducts } = useProducts();
  const { categories: allCategories, loading: loadingCategories, error: errorCategories } = useAvailableCategories();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Filtrar productos por categoría
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todas') {
      return products;
    }
    return products.filter((p: Product) => String(p.categoria) === String(selectedCategory));
  }, [selectedCategory, products]);

  // Contar productos por categoría
  const getCategoryCount = (category: string) => {
    if (category === 'Todas') return products.length;
    return products.filter((p: Product) => String(p.categoria) === String(category)).length;
  };

  // Mostrar spinner mientras carga
  if (loadingProducts || loadingCategories) {
    return (
      <Container className="text-center py-5" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3" style={{ color: '#2E8B57', fontSize: '1.2rem' }}>Cargando productos...</p>
      </Container>
    );
  }

  // Mostrar error si hay alguno
  if (errorProducts || errorCategories) {
    return (
      <Container className="py-5" style={{ minHeight: '100vh' }}>
        <Alert variant="danger">
          <Alert.Heading>Error al cargar datos</Alert.Heading>
          <p>{errorProducts?.message || errorCategories?.message}</p>
          <p className="mb-0">Usando datos locales como respaldo.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <div style={{ background: '#f7faf7', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        {/* Header de Categorías */}
        <div className="text-center mb-5">
          <Badge bg="success" className="mb-3" style={{ fontSize: '1.1rem', padding: '0.6rem 1.5rem' }}>
            📂 Nuestras Categorías
          </Badge>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            color: '#2E8B57',
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            Explora por Categorías
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Encuentra fácilmente los productos que necesitas navegando por nuestras categorías organizadas.
          </p>
        </div>

        {/* Navegación de Categorías */}
        <div className="mb-5" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h5 style={{
            color: '#2E8B57',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Selecciona una categoría
          </h5>
          <Nav
            variant="pills"
            className="flex-wrap justify-content-center gap-2"
            activeKey={selectedCategory}
          >
            {/* Botón "Todas" */}
            <Nav.Item>
              <Nav.Link
                eventKey="Todas"
                onClick={() => setSelectedCategory('Todas')}
                style={{
                  borderRadius: '12px',
                  padding: '0.8rem 1.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: '2px solid #e0e0e0',
                  background: selectedCategory === 'Todas' ? '#2E8B57' : 'white',
                  color: selectedCategory === 'Todas' ? 'white' : '#2E8B57',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                className={selectedCategory === 'Todas' ? '' : 'hover-category-btn'}
              >
                Todas <Badge bg="light" text="dark" className="ms-2">{getCategoryCount('Todas')}</Badge>
              </Nav.Link>
            </Nav.Item>

            {/* Botones de categorías */}
            {allCategories.map((category) => (
              <Nav.Item key={category.id}>
                <Nav.Link
                  eventKey={category.id}
                   onClick={() => setSelectedCategory(String(category.id))}
                  style={{
                    borderRadius: '12px',
                    padding: '0.8rem 1.5rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    border: '2px solid #e0e0e0',
                    background: String(selectedCategory) === String(category.id) ? '#2E8B57' : 'white',
                    color: String(selectedCategory) === String(category.id) ? 'white' : '#2E8B57',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  className={String(selectedCategory) === String(category.id) ? '' : 'hover-category-btn'}
                >
                  {category.nombre} <Badge bg="light" text="dark" className="ms-2">{getCategoryCount(String(category.id))}</Badge>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        {/* Contador de productos */}
        <div className="text-center mb-4">
          <h5 style={{ color: '#2E8B57', fontWeight: 600 }}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            {selectedCategory !== 'Todas' && ` en ${selectedCategory}`}
          </h5>
        </div>

        {/* Grid de productos */}
        <Row className="g-4">
          {filteredProducts.map((product: Product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {/* Banner informativo */}
        <div className="mt-5 p-4" style={{
          background: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h4 style={{ marginBottom: '0.5rem' }}>
            🌿 ¿No encuentras lo que buscas?
          </h4>
          <p style={{ marginBottom: 0, fontSize: '1.1rem' }}>
            Contáctanos y te ayudaremos a encontrar el producto perfecto para ti
          </p>
        </div>
      </Container>

      {/* Estilos adicionales para hover */}
      <style>{`
        .hover-category-btn:hover {
          background: #e6f4ea !important;
          border-color: #2E8B57 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(46, 139, 87, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;
