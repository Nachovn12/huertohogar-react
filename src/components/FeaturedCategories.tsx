import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAvailableCategories, useProducts } from '../hooks/useApi';

const FeaturedCategories: React.FC = () => {
  const { categories: availableCategories, loading: loadingCategories, error: errorCategories } = useAvailableCategories();
  const { products, loading: loadingProducts } = useProducts();

  // Contar productos por categoría usando el ID de la categoría
  const getCategoryCount = (categoryId: number) => {
    return products.filter(p => p.categoriaId === categoryId).length;
  };

  // Obtener icono según el nombre de la categoría
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('fruta')) return '🍓';
    if (name.includes('verdura')) return '🥬';
    if (name.includes('hierba')) return '🌿';
    if (name.includes('semilla')) return '🌱';
    if (name.includes('herramienta')) return '🔨';
    if (name.includes('tierra') || name.includes('abono')) return '🪴';
    if (name.includes('orgánico')) return '🌾';
    if (name.includes('lácteo')) return '🥛';
    return '🥬'; // Por defecto
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
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            padding: '8px 24px',
            borderRadius: '32px',
            background: 'rgba(46, 139, 87, 0.1)',
            border: '1px solid rgba(46, 139, 87, 0.2)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🌱</span>
            <span style={{ 
              color: '#2E8B57', 
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}>
              Explora por Categoría
            </span>
          </div>
          
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 800,
            color: '#1a1a1a',
            fontSize: '2.8rem',
            marginBottom: '1rem',
            letterSpacing: '-1px'
          }}>
            Nuestras Categorías
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: '#666666',
            maxWidth: '600px',
            margin: '0 auto',
            fontFamily: 'Montserrat, Arial, sans-serif',
            lineHeight: 1.6
          }}>
            Descubre nuestra amplia selección de productos frescos, orgánicos y naturales organizados para tu conveniencia
          </p>
        </div>

        <Row className="g-4">
          {availableCategories.map((category) => (
            <Col key={category.id} xs={12} sm={6} md={4}>
              <Link 
                to={`productos?categoria=${category.id}`} 
                style={{ textDecoration: 'none' }}
              >
                <Card 
                  className="h-100 category-card"
                  style={{
                    border: '1px solid #f0f0f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    background: '#fff',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <Card.Body style={{ 
                    padding: '2.5rem 2rem', 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto 0.5rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      boxShadow: '0 4px 12px rgba(46, 139, 87, 0.15)'
                    }}>
                      {getCategoryIcon(category.nombre)}
                    </div>
                    
                    <Card.Title style={{
                      fontWeight: 700,
                      color: '#1a1a1a',
                      fontSize: '1.4rem',
                      marginBottom: '0.5rem',
                      fontFamily: 'Montserrat, Arial, sans-serif'
                    }}>
                      {category.nombre}
                    </Card.Title>
                    
                    <Card.Text style={{
                      color: '#666666',
                      fontSize: '0.95rem',
                      marginBottom: '1rem',
                      lineHeight: 1.6,
                      fontFamily: 'Montserrat, Arial, sans-serif',
                      minHeight: '48px'
                    }}>
                      {category.descripcion || 'Productos frescos y de calidad'}
                    </Card.Text>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: 'auto'
                    }}>
                      <Badge 
                        bg="success" 
                        style={{ 
                          fontSize: '0.85rem',
                          padding: '0.6rem 1.2rem',
                          fontWeight: 600,
                          borderRadius: '8px',
                          background: '#2E8B57',
                          fontFamily: 'Montserrat, Arial, sans-serif'
                        }}
                      >
                        {getCategoryCount(category.id)} productos
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
            box-shadow: 0 16px 40px rgba(0,0,0,0.15) !important;
            border-color: #2E8B57 !important;
          }
        `}</style>
      </Container>
    </section>
  );
};

export default FeaturedCategories;
