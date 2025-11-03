import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { products } from '../data/products';

const Offers = () => {
  // Filtrar productos en oferta
  const offerProducts = products.filter(product => product.offer === true);

  return (
    <div style={{ background: '#f7faf7', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        {/* Header de Ofertas */}
        <div className="text-center mb-5">
          <Badge bg="success" className="mb-3" style={{ fontSize: '1.1rem', padding: '0.6rem 1.5rem' }}>
            🔥 Ofertas Especiales
          </Badge>
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontWeight: 700, 
            color: '#2E8B57',
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            Productos en Oferta
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#666',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Aprovecha nuestros mejores descuentos en productos frescos y de calidad. 
            ¡Ofertas por tiempo limitado!
          </p>
        </div>

        {/* Contador de ofertas */}
        <div className="text-center mb-4">
          <h5 style={{ color: '#2E8B57', fontWeight: 600 }}>
            {offerProducts.length} {offerProducts.length === 1 ? 'producto' : 'productos'} en oferta disponibles
          </h5>
        </div>

        {/* Grid de productos en oferta */}
        {offerProducts.length > 0 ? (
          <Row className="g-4">
            {offerProducts.map(product => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '3rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ color: '#2E8B57', marginBottom: '1rem' }}>
                😊 No hay ofertas disponibles en este momento
              </h3>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>
                ¡Vuelve pronto! Constantemente actualizamos nuestras ofertas especiales.
              </p>
            </div>
          </div>
        )}

        {/* Banner inferior */}
        <div className="mt-5 p-4" style={{
          background: 'linear-gradient(135deg, #2E8B57 0%, #3CB371 100%)',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center'
        }}>
          <h4 style={{ marginBottom: '0.5rem' }}>
            💡 ¿Quieres recibir nuestras ofertas?
          </h4>
          <p style={{ marginBottom: 0, fontSize: '1.1rem' }}>
            Suscríbete a nuestro newsletter y recibe notificaciones de nuevas ofertas
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Offers;
