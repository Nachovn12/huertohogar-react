import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const { addToCart } = useCart();

  const featuredProducts = [
    {
      id: "VR001",
      name: "Zanahorias Orgánicas",
      price: 900,
      image: "https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-fresh-organic-carrots-in-a-neat-stack-png-image_14812590.png",
      unit: "kilos"
    },
    {
      id: "VR002",
      name: "Espinacas Frescas",
      price: 700,
      image: "https://pngimg.com/uploads/spinach/spinach_PNG45.png",
      unit: "bolsas de 500g"
    },
    {
      id: "VR003",
      name: "Pimientos Tricolores",
      price: 1230,
      originalPrice: 1500,
      discount: 18,
      savings: 270,
      image: "https://png.pngtree.com/png-vector/20241212/ourmid/pngtree-colored-paprica-raw-paprika-fruit-png-image_14613829.png",
      unit: "kilos"
    },
    {
      id: "FR001",
      name: "Manzanas Fuji",
      price: 1020,
      originalPrice: 1200,
      discount: 15,
      savings: 180,
      image: "https://santaisabel.vtexassets.com/arquivos/ids/174684-900-900?width=200&height=200&aspect=true",
      unit: "kilos"
    },
    {
      id: "FR002",
      name: "Naranjas Valencia", 
      price: 1000,
      image: "https://static.vecteezy.com/system/resources/previews/022/825/544/non_2x/orange-fruit-orange-on-transparent-background-free-png.png",
      unit: "kilos"
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (product) => {
    navigate(`/productos/${product.id}`);
  };

  // Responsive: use continuous marquee on wide screens, fallback to Swiper on small screens
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const update = () => setIsWide(window.innerWidth >= 900);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // duplicated array for seamless loop
  const duplicated = [...featuredProducts, ...featuredProducts];
  const trackRef = useRef(null);

  // compute speed based on number of cards (longer lists => longer duration)
  const baseDurationPerCard = 4; // seconds per card approx
  const duration = Math.max(12, featuredProducts.length * baseDurationPerCard);

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
              {duplicated.map((product, idx) => (
                <div className="ch-slide" key={`${product.id}-${idx}`}>
                  {/* Reuse same markup for product card */}
                  <div className="ch-card">
                    {product.discount && (
                      <span className="ch-badge">-{product.discount}%</span>
                    )}
                    <div className="ch-img">
                      <img src={product.image} alt={product.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <h5 className="ch-name">{product.name}</h5>
                    <div className="ch-price">
                      <span className="ch-price-main">{formatPrice(product.price)}</span>
                      <span className="ch-unit">{product.unit}</span>
                    </div>
                    {product.originalPrice ? (
                      <div className="ch-savings">
                        <span className="ch-strike">{formatPrice(product.originalPrice)}</span>
                        <span className="ch-save">Ahorras {formatPrice(product.savings)}</span>
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
              ))}
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
          {featuredProducts.map((product) => (
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
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.borderColor = '#2E8B57';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              >
                {product.discount && (
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
                    -{product.discount}%
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
                    src={product.image} 
                    alt={product.name}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '8px'
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
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
                  {product.name}
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
                    {formatPrice(product.price)}
                  </span>
                  <span style={{ 
                    color: '#9ca3af', 
                    fontSize: '0.75rem',
                    fontWeight: 400
                  }}>
                    {product.unit}
                  </span>
                </div>
                {product.originalPrice ? (
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
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span style={{ 
                      color: '#2E8B57', 
                      fontWeight: 600, 
                      fontSize: '0.7rem',
                      display: 'inline-block'
                    }}>
                      Ahorras {formatPrice(product.savings)}
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
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f9fafb';
                      e.target.style.borderColor = '#2E8B57';
                      e.target.style.color = '#2E8B57';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#fff';
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.color = '#6b7280';
                    }}
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
                    onMouseEnter={(e) => {
                      e.target.style.background = '#257d4a';
                      e.target.style.boxShadow = '0 2px 6px rgba(33, 145, 80, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#2E8B57';
                      e.target.style.boxShadow = '0 1px 3px rgba(33, 145, 80, 0.3)';
                    }}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
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
