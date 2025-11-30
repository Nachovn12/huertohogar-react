import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAvailableCategories, useProducts } from '../hooks/useApi';

const FeaturedCategories: React.FC = () => {
  const { categories: availableCategories, loading: loadingCategories, error: errorCategories } = useAvailableCategories();
  const { products, loading: loadingProducts } = useProducts();

  // Contar productos por categoría
  const getCategoryCount = (categoryId: string) => {
    return products.filter(p => String(p.categoria) === String(categoryId)).length;
  };

  if (loadingCategories || loadingProducts) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  if (errorCategories) {
    return null; // O mostrar un mensaje de error discreto
  }

  return (
    <section style={{ 
      background: 'linear-gradient(135deg, #f0f9f4 0%, #ffffff 100%)',
      padding: '4rem 0'
    }}>
      <Container>
        <div className="text-center mb-5">
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            color: '#2E8B57',
            fontSize: '2.5rem',
            marginBottom: '1rem'
          }}>
            Nuestras Categorías
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explora nuestras categorías de productos frescos y orgánicos
          </p>
        </div>

        <Row className="g-4">
          {availableCategories.map((category) => (
            <Col key={category.id} xs={12} sm={6} md={4}>
              <Link 
                to={`/categorias?cat=${category.id}`} 
                style={{ textDecoration: 'none' }}
              >
                <Card 
                  className="h-100 category-card"
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <Card.Body style={{ padding: '2rem', textAlign: 'center' }}>
                    <Card.Title style={{
                      fontWeight: 700,
                      color: '#2E8B57',
                      fontSize: '1.5rem',
                      marginBottom: '1rem'
                    }}>
                      {category.nombre}
                    </Card.Title>
                    <Card.Text style={{
                      color: '#666',
                      fontSize: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      {category.descripcion}
                    </Card.Text>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Badge 
                        bg="success" 
                        style={{ 
                          fontSize: '0.9rem',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        {getCategoryCount(String(category.id))} productos
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        {/* Estilos para hover */}
        <style>{`
          .category-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(46, 139, 87, 0.2) !important;
            border-color: #2E8B57 !important;
          }
        `}</style>
      </Container>
    </section>
  );
};

export default FeaturedCategories;
