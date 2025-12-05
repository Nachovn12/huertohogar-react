import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import ProductCard from './ProductCard';
import { useProductsOnOffer } from '../hooks/useApi';
import '../styles/Offers.css';

const Offers: React.FC = () => {
  const { products: offerProducts, loading } = useProductsOnOffer();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('discount');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Contador regresivo hasta medianoche
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const difference = midnight.getTime() - now.getTime();
      
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filtrar productos por categoría
  const categories = ['Todos', 'Verduras', 'Frutas', 'Orgánicos'];
  const filteredProducts = selectedCategory === 'Todos' 
    ? offerProducts 
    : offerProducts.filter(p => p.categoria === selectedCategory);

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'discount') {
      const discountA = a.offerPrice ? ((a.precio - a.offerPrice) / a.precio) * 100 : 0;
      const discountB = b.offerPrice ? ((b.precio - b.offerPrice) / b.precio) * 100 : 0;
      return discountB - discountA;
    } else if (sortBy === 'price-low') {
      return (a.offerPrice || a.precio) - (b.offerPrice || b.precio);
    } else {
      return (b.offerPrice || b.precio) - (a.offerPrice || a.precio);
    }
  });

  // Calcular ahorro total
  const totalSavings = offerProducts.reduce((sum, p) => {
    return sum + (p.offerPrice ? p.precio - p.offerPrice : 0);
  }, 0);

  if (loading) {
    return (
      <div className="offers-loading">
        <div className="loading-spinner"></div>
        <p>Cargando ofertas increíbles...</p>
      </div>
    );
  }

  return (
    <div className="offers-page">
      <Container maxWidth="xl">
        {/* Breadcrumbs integrados */}
        <div className="breadcrumbs">
          <a href="/">Inicio</a>
          <i className="fas fa-chevron-right"></i>
          <span>Ofertas</span>
        </div>

        {/* Hero Section Mejorado */}
        <div className="offers-hero">
          <div className="offers-badge-animated">
            <i className="fas fa-fire"></i>
            <span>Ofertas Especiales</span>
          </div>
          <h1 className="offers-title">Productos en Oferta</h1>
          <p className="offers-subtitle">
            Aprovecha nuestros mejores descuentos en productos frescos y de calidad.
            <br />
            <strong>¡Ofertas por tiempo limitado!</strong>
          </p>
        </div>

        {/* Contador de Urgencia - Diseño Premium */}
        <div className="urgency-banner-premium">
          <div className="urgency-left">
            <div className="urgency-icon-premium">
              <i className="fas fa-fire-alt"></i>
            </div>
            <div className="urgency-text">
              <h3>OFERTAS FLASH</h3>
              <p>Termina en: <span className="countdown-inline">{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span></p>
            </div>
          </div>
          <div className="urgency-right">
            <div className="savings-badge">
              <span className="savings-label">Ahorra hasta</span>
              <span className="savings-amount">${Math.round(totalSavings).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="offers-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tag"></i>
            </div>
            <div className="stat-content">
              <h3>{offerProducts.length}</h3>
              <p>Ofertas Activas</p>
            </div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-icon">
              <i className="fas fa-piggy-bank"></i>
            </div>
            <div className="stat-content">
              <h3>${Math.round(totalSavings).toLocaleString()}</h3>
              <p>Ahorra Hasta Hoy</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-content">
              <h3>Hasta 30%</h3>
              <p>De Descuento</p>
            </div>
          </div>
        </div>

        {/* Filtros y Ordenamiento */}
        <div className="filters-section">
          <div className="category-filters">
            <span className="filter-label">Categorías:</span>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sort-controls">
            <span className="sort-label">Ordenar por:</span>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="discount">Mayor Descuento</option>
              <option value="price-low">Menor Precio</option>
              <option value="price-high">Mayor Precio</option>
            </select>
          </div>
        </div>

        {/* Grid de productos */}
        {sortedProducts.length > 0 ? (
          <>
            <div className="products-count">
              Mostrando <strong>{sortedProducts.length}</strong> {sortedProducts.length === 1 ? 'producto' : 'productos'}
            </div>
            <div className="offers-grid-enhanced">
              {sortedProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="offer-item-enhanced"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-offers-enhanced">
            <div className="no-offers-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>No se encontraron productos</h3>
            <p>Intenta con otra categoría o vuelve más tarde</p>
            <button 
              className="btn-reset-filters"
              onClick={() => setSelectedCategory('Todos')}
            >
              Ver Todas las Ofertas
            </button>
          </div>
        )}

        {/* Newsletter Banner Mejorado */}
        <div className="newsletter-banner-enhanced">
          <div className="newsletter-left">
            <div className="newsletter-icon-large">
              <i className="fas fa-envelope-open-text"></i>
            </div>
            <div className="newsletter-text">
              <h3>¿Quieres recibir nuestras ofertas?</h3>
              <p>Suscríbete y recibe <strong>10% OFF</strong> en tu primera compra</p>
            </div>
          </div>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Tu correo electrónico"
              className="newsletter-input"
            />
            <button className="newsletter-submit">
              <i className="fas fa-paper-plane"></i>
              Suscribirme
            </button>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="trust-signals">
          <div className="trust-item">
            <i className="fas fa-users"></i>
            <div>
              <strong>+10,000</strong>
              <span>Clientes Satisfechos</span>
            </div>
          </div>
          <div className="trust-item">
            <i className="fas fa-leaf"></i>
            <div>
              <strong>100%</strong>
              <span>Productos Frescos</span>
            </div>
          </div>
          <div className="trust-item">
            <i className="fas fa-undo"></i>
            <div>
              <strong>Garantía</strong>
              <span>Devolución Fácil</span>
            </div>
          </div>
          <div className="trust-item">
            <i className="fas fa-shipping-fast"></i>
            <div>
              <strong>Envío Gratis</strong>
              <span>Sobre $30.000</span>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="benefits-grid">
          <div className="benefit-card-enhanced">
            <div className="benefit-icon-wrapper">
              <i className="fas fa-percent"></i>
            </div>
            <h4>Hasta 30% OFF</h4>
            <p>En productos seleccionados de temporada</p>
          </div>
          <div className="benefit-card-enhanced">
            <div className="benefit-icon-wrapper">
              <i className="fas fa-clock"></i>
            </div>
            <h4>Ofertas Limitadas</h4>
            <p>Aprovecha antes que se acaben</p>
          </div>
          <div className="benefit-card-enhanced">
            <div className="benefit-icon-wrapper">
              <i className="fas fa-leaf"></i>
            </div>
            <h4>Productos Frescos</h4>
            <p>Calidad garantizada del campo</p>
          </div>
          <div className="benefit-card-enhanced">
            <div className="benefit-icon-wrapper">
              <i className="fas fa-truck"></i>
            </div>
            <h4>Envío Rápido</h4>
            <p>Entrega en 24-48 horas</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Offers;
