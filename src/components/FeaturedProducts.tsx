import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useProducts, useProductsOnOffer } from '../hooks/useApi';
import { Product } from '../types';
import { CircularProgress, Box } from '@mui/material';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const FeaturedProducts: React.FC = () => {
  const { addToCart } = useCart();
  const { products: offerProducts, loading: loadingOffers } = useProductsOnOffer();
  const { products: allProducts, loading: loadingAll } = useProducts();
  
  // Usar productos en oferta, o si no hay, los primeros 8 productos
  const featuredProducts = React.useMemo(() => {
    if (offerProducts.length >= 4) return offerProducts;
    return allProducts.slice(0, 8);
  }, [offerProducts, allProducts]);

  const loading = loadingOffers || loadingAll;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleViewDetails = (product: Product) => {
    navigate(`/productos/${product.id}`);
  };

  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const update = () => setIsWide(window.innerWidth >= 900);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const duplicated = [...featuredProducts, ...featuredProducts];
  const trackRef = useRef<HTMLDivElement | null>(null);

  const baseDurationPerCard = 4; // seconds per card approx
  const duration = Math.max(12, featuredProducts.length * baseDurationPerCard);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#2E8B57' }} />
      </Box>
    );
  }

  return (
    <section style={{ 
      padding: '60px 0 80px 0', 
      background: 'linear-gradient(180deg, #F7F7F7 0%, #ffffff 100%)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Header mejorado */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            padding: '8px 24px',
            borderRadius: '32px',
            background: 'rgba(139, 69, 19, 0.1)',
            border: '1px solid rgba(139, 69, 19, 0.2)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⭐</span>
            <span style={{ 
              color: '#8B4513', 
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}>
              Selección Especial
            </span>
          </div>

          <h2 style={{ 
            fontWeight: 800, 
            fontSize: '2.8rem', 
            color: '#1a1a1a',
            marginBottom: 16, 
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '-1px'
          }}>
            Productos Destacados
          </h2>
          <p style={{ 
            color: '#666666', 
            fontSize: '1.05rem', 
            marginBottom: 0,
            fontWeight: 400,
            fontFamily: 'Montserrat, Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Los mejores productos frescos y orgánicos seleccionados especialmente para ti y tu familia
          </p>
        </div>
        
        {isWide ? (
          <div className="ch-carousel" aria-hidden={false}>
            <div
              className="ch-track"
              ref={trackRef}
              style={{ animationDuration: `${duration}s` }}
              onMouseEnter={() => trackRef.current && (trackRef.current.style.animationPlayState = 'paused')}
              onMouseLeave={() => trackRef.current && (trackRef.current.style.animationPlayState = 'running')}
            >
              {duplicated.map((product, idx) => {
                const isOffer = product.oferta && product.offerPrice && product.offerPrice < product.precio;
                const currentPrice = isOffer ? product.offerPrice : product.precio;
                const originalPrice = isOffer ? product.precio : null;
                const savings = isOffer ? (product.precio - (product.offerPrice || 0)) : 0;

                return (
                <div className="ch-slide" key={`${product.id}-${idx}`}>
                  {/* Reuse same markup for product card */}
                  <div className="ch-card">
                    {product.descuento && (
                      <span className="ch-badge">-{product.descuento}%</span>
                    )}
                    <div className="ch-img">
                      <img src={product.imagen} alt={product.nombre} onError={(e: any) => { e.target.style.display = 'none'; }} />
                    </div>
                    <h5 className="ch-name">{product.nombre}</h5>
                    <div className="ch-price">
                      <span className="ch-price-main">{formatPrice(currentPrice || 0)}</span>
                      <span className="ch-unit">{product.unidad}</span>
                    </div>
                    {originalPrice ? (
                      <div className="ch-savings">
                        <span className="ch-strike">{formatPrice(originalPrice)}</span>
                        <span className="ch-save">Ahorras {formatPrice(savings)}</span>
                      </div>
                    ) : (
                      <div style={{ height: 32 }} />
                    )}
                    <div className="ch-actions">
                      <button className="ch-ghost" onClick={() => handleViewDetails(product)}>Ver Detalles</button>
                      <button className="ch-primary" onClick={() => handleAddToCart(product)}>Agregar al Carrito</button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.5}
          centeredSlides={false}
          navigation={true}
          pagination={{ 
            clickable: true,
            dynamicBullets: false
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={true}
          speed={800}
          grabCursor={true}
          breakpoints={{
            480: {
              slidesPerView: 2.2,
              spaceBetween: 14,
            },
            640: {
              slidesPerView: 2.5,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 18,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 18,
            },
          }}
          style={{
            paddingTop: '8px',
            paddingBottom: '52px',
            paddingLeft: '4px',
            paddingRight: '4px'
          }}
        >
          {featuredProducts.map((product) => {
            const isOffer = product.oferta && product.offerPrice && product.offerPrice < product.precio;
            const currentPrice = isOffer ? product.offerPrice : product.precio;
            const originalPrice = isOffer ? product.precio : null;
            const savings = isOffer ? (product.precio - (product.offerPrice || 0)) : 0;

            return (
            <SwiperSlide key={product.id}>
              <div style={{ 
                background: '#fff', 
                borderRadius: 12, 
                border: '1px solid #e5e7eb',
                display: 'flex', 
                flexDirection: 'column', 
                padding: '16px 14px 18px 14px', 
                height: '100%',
                minHeight: '360px',
                maxHeight: '360px',
                maxWidth: '250px',
                margin: '0 auto',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
                (e.currentTarget as HTMLElement).style.borderColor = '#2E8B57';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
              }}
              >
                {product.descuento && (
                  <span style={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    background: '#2E8B57', 
                    color: '#fff', 
                    fontWeight: 600, 
                    fontSize: '0.75rem', 
                    borderRadius: 4, 
                    padding: '4px 8px',
                    letterSpacing: '0.3px',
                    zIndex: 2
                  }}>
                    -{product.descuento}%
                  </span>
                )}
                <div style={{
                  width: '100%',
                  height: '110px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  background: '#f9fafb',
                  borderRadius: 8,
                  flexShrink: 0,
                  border: '1px solid #f3f4f6'
                }}>
                  <img 
                    src={product.imagen} 
                    alt={product.nombre}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '8px'
                    }}
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <h5 style={{ 
                  fontWeight: 600, 
                  fontSize: '0.9rem', 
                  color: '#1a1a1a', 
                  marginBottom: 6, 
                  textAlign: 'center',
                  lineHeight: 1.3,
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {product.nombre}
                </h5>
                <div style={{ marginBottom: 5, textAlign: 'center', flexShrink: 0 }}>
                  <span style={{ 
                    fontWeight: 700, 
                    fontSize: '1.1rem', 
                    color: '#2E8B57',
                    letterSpacing: '-0.3px',
                    display: 'block',
                    marginBottom: '1px'
                  }}>
                    {formatPrice(currentPrice || 0)}
                  </span>
                  <span style={{ 
                    color: '#9ca3af', 
                    fontSize: '0.75rem',
                    fontWeight: 400
                  }}>
                    {product.unidad}
                  </span>
                </div>
                {originalPrice ? (
                  <div style={{ 
                    marginBottom: 6, 
                    textAlign: 'center', 
                    flexShrink: 0,
                    height: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <span style={{ 
                      color: '#9ca3af', 
                      textDecoration: 'line-through', 
                      fontSize: '0.72rem',
                      fontWeight: 400,
                      display: 'block',
                      marginBottom: '2px'
                    }}>
                      {formatPrice(originalPrice)}
                    </span>
                    <span style={{ 
                      color: '#2E8B57', 
                      fontWeight: 600, 
                      fontSize: '0.7rem',
                      display: 'inline-block'
                    }}>
                      Ahorras {formatPrice(savings)}
                    </span>
                  </div>
                ) : (
                  <div style={{ 
                    height: '32px',
                    flexShrink: 0
                  }} />
                )}
                <div style={{ 
                  width: '100%', 
                  marginTop: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 7,
                  paddingTop: '6px'
                }}>
                  <button
                    type="button"
                    style={{ 
                      border: '1px solid #e5e7eb', 
                      color: '#6b7280', 
                      fontWeight: 500, 
                      borderRadius: 8, 
                      padding: '8px 0', 
                      fontSize: '0.8rem', 
                      background: '#fff', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => handleViewDetails(product)}
                  >
                    Ver Detalles
                  </button>
                  <button
                    style={{ 
                      background: '#2E8B57', 
                      color: '#fff', 
                      fontWeight: 600, 
                      borderRadius: 8, 
                      padding: '9px 0', 
                      fontSize: '0.8rem', 
                      border: 'none', 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(33, 145, 80, 0.3)'
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </SwiperSlide>
          )})}
        </Swiper>
        )}
      </div>

      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #374151;
          background: #ffffff;
          padding: 8px;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
          top: 50%;
          transform: translateY(-50%);
          margin-top: -26px;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 12px;
          font-weight: 900;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #2E8B57;
          color: #fff;
          border-color: #2E8B57;
          box-shadow: 0 4px 12px rgba(33, 145, 80, 0.3);
          transform: translateY(-50%) scale(1.08);
        }

        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
          margin: 0 4px !important;
        }

        .swiper-pagination-bullet-active {
          background: #2E8B57;
          width: 28px;
          border-radius: 4px;
        }

        .swiper-slide {
          height: auto;
          display: flex;
        }

        .swiper-slide > div {
          width: 100%;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
