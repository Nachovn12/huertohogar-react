import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useProducts, useProductsOnOffer } from '../hooks/useApi';
import { Product } from '../types';
import { CircularProgress, Box, Card, CardContent, Button, Chip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const categoryNames: { [k: string]: string } = {
    'frutas': 'Frutas Frescas',
    'verduras': 'Verduras Orgánicas',
    'organicos': 'Productos Orgánicos',
    'lacteos': 'Productos Lácteos'
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
        {/* Header */}
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
        
        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2}
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
          loop={featuredProducts.length > 4}
          speed={800}
          grabCursor={true}
          breakpoints={{
            480: {
              slidesPerView: 1.8,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 18,
            },
            768: {
              slidesPerView: 2.8,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3.5,
              spaceBetween: 22,
            },
            1280: {
              slidesPerView: 4.2,
              spaceBetween: 24,
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

            return (
            <SwiperSlide key={product.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  minHeight: 520,
                  display: 'flex', 
                  flexDirection: 'column', 
                  bgcolor: '#fff', 
                  border: '1px solid #f0f0f0',
                  borderRadius: 4,
                  position: 'relative', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                    borderColor: '#e0e0e0',
                    '& .product-image': {
                      transform: 'scale(1.08)'
                    }
                  }
                }}
              >
                {/* Badge de oferta */}
                {isOffer && product.descuento && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    left: 12, 
                    zIndex: 3, 
                    bgcolor: '#dc2626', 
                    color: '#fff', 
                    px: 2, 
                    py: 0.8, 
                    borderRadius: 3, 
                    fontWeight: 700, 
                    fontSize: '0.7rem', 
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)', 
                    fontFamily: 'Montserrat, Arial, sans-serif', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    <LocalOfferIcon sx={{ fontSize: 12 }} />
                    -{product.descuento}% OFF
                  </Box>
                )}

                {/* Imagen del producto */}
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: '#fff',
                  height: 240,
                  minHeight: 240,
                  maxHeight: 240,
                  p: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                }}>
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="product-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                </Box>

                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  p: 3,
                  pt: 2,
                  pb: 2.5,
                  gap: 1
                }}>
                  {/* Nombre del producto */}
                  <Box 
                    sx={{ 
                      fontWeight: 600, 
                      textAlign: 'center', 
                      fontFamily: 'Montserrat, Arial, sans-serif', 
                      color: '#1a1a1a', 
                      fontSize: '1rem', 
                      lineHeight: 1.3,
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 0.5
                    }}
                  >
                    {product.nombre}
                  </Box>

                  {/* Categoría */}
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 0.5
                  }}>
                    <Chip 
                      label={categoryNames[product.categoria] || product.categoria}
                      size="small"
                      sx={{
                        bgcolor: '#f0f9f4',
                        color: '#2E8B57',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        height: '24px',
                        borderRadius: 2.5,
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        border: '1px solid #c8e6c9',
                        '& .MuiChip-label': {
                          px: 1.5
                        }
                      }}
                    />
                  </Box>

                  {/* Espacio vacío */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    my: 0.5
                  }} />

                  {/* Precios */}
                  <Box sx={{ 
                    mt: 'auto',
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 0.3,
                    mb: 1.5
                  }}>
                    <Box 
                      sx={{ 
                        color: '#999', 
                        fontSize: '0.7rem',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: 600
                      }}
                    >
                      POR {product.unidad?.toUpperCase() || 'KG'}
                    </Box>
                    {isOffer && originalPrice && (
                      <Box 
                        sx={{ 
                          color: '#9ca3af', 
                          textDecoration: 'line-through', 
                          fontWeight: 500, 
                          fontSize: '0.85rem',
                          fontFamily: 'Montserrat, Arial, sans-serif'
                        }}
                      >
                        Antes: {formatPrice(originalPrice)}
                      </Box>
                    )}
                    <Box 
                      sx={{ 
                        color: '#2E8B57', 
                        fontWeight: 700, 
                        fontSize: '1.5rem',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        letterSpacing: '-0.5px'
                      }}
                    >
                      {formatPrice(currentPrice || 0)}
                    </Box>
                    {isOffer && originalPrice && (
                      <Box 
                        sx={{ 
                          color: '#2E8B57', 
                          fontWeight: 600, 
                          fontSize: '0.75rem',
                          fontFamily: 'Montserrat, Arial, sans-serif',
                          mt: 0.3
                        }}
                      >
                        Ahorras {formatPrice((originalPrice || 0) - (currentPrice || 0))}
                      </Box>
                    )}
                  </Box>

                  {/* Botones de acción */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1, 
                    width: '100%'
                  }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleViewDetails(product)}
                      sx={{ 
                        bgcolor: '#fbbf24', 
                        color: '#1a1a1a', 
                        borderRadius: 3, 
                        fontWeight: 700, 
                        fontSize: '0.8rem', 
                        py: 1.2, 
                        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
                        textTransform: 'none',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { 
                          bgcolor: '#f59e0b',
                          boxShadow: '0 4px 16px rgba(251, 191, 36, 0.5)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Ver Detalles
                    </Button>
                    <Button 
                      variant="contained" 
                      fullWidth
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleAddToCart(product)}
                      sx={{ 
                        bgcolor: '#2E8B57', 
                        color: '#fff', 
                        borderRadius: 3, 
                        fontWeight: 700, 
                        fontSize: '0.8rem', 
                        py: 1.2, 
                        boxShadow: '0 2px 8px rgba(46, 139, 87, 0.3)',
                        textTransform: 'none',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': { 
                          bgcolor: '#257d4a',
                          boxShadow: '0 4px 16px rgba(46, 139, 87, 0.5)',
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          bgcolor: '#e0e0e0',
                          color: '#9ca3af'
                        }
                      }}
                      disabled={product.stock === 0}
                    >
                      Agregar al Carrito
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </SwiperSlide>
          )})}
        </Swiper>
      </div>

      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #374151;
          background: #ffffff;
          padding: 8px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
          top: 50%;
          transform: translateY(-50%);
          margin-top: -26px;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 14px;
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
