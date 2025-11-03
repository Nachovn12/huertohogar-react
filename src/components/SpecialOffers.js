import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useCart } from '../context/CartContext';

const formatPrice = (value) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const SpecialOffers = () => {
  const { addToCart } = useCart();
  
  const declaredOffers = [
    { id: 'PO001', discount: 25 },
    { id: 'PO003', discount: 20 },
    { id: 'FR001', discount: 15 },
    { id: 'VR003', discount: 18 }
  ];

  const offers = declaredOffers
    .map(o => {
      const p = products.find(prod => prod.id === o.id);
      if (!p) return null;
      return {
        ...p,
        discount: o.discount,
        discountedPrice: Math.round(p.price * (1 - o.discount / 100))
      };
    })
    .filter(Boolean);

  return (
    <Box sx={{ 
      bgcolor: 'linear-gradient(135deg, #f0f9f4 0%, #ffffff 100%)',
      background: 'linear-gradient(135deg, #f0f9f4 0%, #ffffff 100%)',
      py: { xs: 4, md: 8 },
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(46, 139, 87, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Box sx={{ 
        maxWidth: 1300, 
        mx: 'auto', 
        px: { xs: 2, sm: 3, md: 3 },
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Header mejorado */}
        <Box sx={{ 
          textAlign: 'center',
          mb: { xs: 4, md: 6 },
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            px: 3,
            py: 1,
            borderRadius: 8,
            bgcolor: 'rgba(255, 215, 0, 0.15)',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <Typography sx={{
              fontSize: '1.2rem'
            }}>
              🔥
            </Typography>
            <Typography sx={{ 
              color: '#d97706', 
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}>
              Ofertas Especiales
            </Typography>
          </Box>
          
          <Typography variant="h3" sx={{ 
            fontWeight: 800, 
            color: '#1a1a1a',
            mb: 2, 
            fontFamily: 'Playfair Display, serif',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #8B4513 0%, #2E8B57 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Productos con Descuentos Exclusivos
          </Typography>
          
          <Typography sx={{ 
            color: '#666666', 
            fontSize: { xs: '0.85rem', md: '1rem' },
            fontFamily: 'Montserrat, Arial, sans-serif',
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6,
            px: { xs: 2, md: 0 }
          }}>
            Aprovecha estas ofertas limitadas en nuestros productos más frescos y de mejor calidad
          </Typography>
        </Box>

        {/* Grid de ofertas con diseño mejorado */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          }, 
          gap: { xs: 2, sm: 2, md: 2.5 },
          position: 'relative',
          zIndex: 1,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {offers.map((item) => (
            <Card 
              key={item.id} 
              elevation={0} 
              sx={{ 
                borderRadius: { xs: 2, md: 3 }, 
                bgcolor: '#fff', 
                border: '1px solid #e5e7eb',
                position: 'relative', 
                padding: 0,
                minHeight: { xs: 400, sm: 420, md: 460 }, 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                height: '100%',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                '&:hover': { 
                  transform: 'translateY(-6px)', 
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                  borderColor: '#d1d5db',
                  '& .product-img': {
                    transform: 'scale(1.05)'
                  }
                } 
              }}
            >
              {/* Badge de descuento esquina superior derecha */}
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: { xs: 8, md: 12 }, 
                  right: { xs: 8, md: 12 }, 
                  bgcolor: '#dc2626',
                  color: '#fff',
                  px: { xs: 1.2, md: 1.5 },
                  py: { xs: 0.4, md: 0.5 },
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '0.85rem' },
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                  letterSpacing: '0.3px'
                }}
              >
                -{item.discount}% OFF
              </Box>

              {/* Imagen del producto */}
              <Box sx={{ 
                position: 'relative', 
                width: '100%', 
                height: { xs: 140, sm: 160, md: 180 }, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                bgcolor: '#f9fafb',
                overflow: 'hidden',
                p: { xs: 1.5, md: 2 }
              }}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="product-img"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} 
                />
              </Box>

              <CardContent sx={{ 
                textAlign: 'center', 
                p: { xs: 2, md: 2.5 },
                flexGrow: 1, 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                gap: { xs: 0.5, md: 1 },
                boxSizing: 'border-box'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  color: '#1a1a1a',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  lineHeight: 1.3,
                  mb: 0.5,
                  minHeight: { xs: 36, md: 42 }
                }}>
                  {item.name}
                </Typography>
                
                <Typography variant="body2" sx={{ 
                  color: '#10b981', 
                  fontSize: { xs: '0.7rem', md: '0.8rem' },
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: { xs: 0.5, md: 1 }
                }}>
                  {item.unit}
                </Typography>

                {/* Precios */}
                <Box sx={{ 
                  mb: { xs: 1, md: 1.5 },
                  bgcolor: '#f0fdf4',
                  py: { xs: 1, md: 1.2 },
                  px: { xs: 1.5, md: 2 },
                  borderRadius: 2,
                  border: '1px dashed #bbf7d0'
                }}>
                  <Typography variant="caption" sx={{
                    color: '#6b7280',
                    fontSize: { xs: '0.65rem', md: '0.7rem' },
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'block',
                    mb: 0.5
                  }}>
                    Precio Especial
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    color: '#2E8B57', 
                    fontWeight: 800,
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                    letterSpacing: '-0.5px',
                    fontFamily: 'Montserrat, Arial, sans-serif',
                    lineHeight: 1
                  }}>
                    ${formatPrice(item.discountedPrice)}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    textDecoration: 'line-through', 
                    color: '#9ca3af',
                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                    mt: 0.5,
                    fontFamily: 'Montserrat, Arial, sans-serif',
                    fontWeight: 500
                  }}>
                    Antes: ${formatPrice(item.price)}
                  </Typography>
                </Box>

                {/* Botones */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: { xs: 0.8, md: 1 }, 
                  mt: 'auto', 
                  width: '100%' 
                }}>
                  <Button 
                    component={Link} 
                    to={`/productos/${item.id}`} 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      borderRadius: 2,
                      borderColor: '#fbbf24',
                      color: '#d97706',
                      textTransform: 'none',
                      fontWeight: 600,
                      py: { xs: 0.8, md: 1 },
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      fontFamily: 'Montserrat, Arial, sans-serif',
                      borderWidth: 1.5,
                      '&:hover': {
                        borderColor: '#f59e0b',
                        bgcolor: 'rgba(251, 191, 36, 0.08)',
                        borderWidth: 1.5
                      }
                    }}
                  >
                    Ver Detalles
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => addToCart(item)}
                    sx={{ 
                      bgcolor: '#2E8B57', 
                      color: '#fff', 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      py: { xs: 0.8, md: 1 },
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      fontFamily: 'Montserrat, Arial, sans-serif',
                      boxShadow: '0 2px 8px rgba(46, 139, 87, 0.3)',
                      '&:hover': { 
                        bgcolor: '#257d4a',
                        boxShadow: '0 4px 12px rgba(46, 139, 87, 0.4)'
                      } 
                    }}
                  >
                    Agregar al Carrito
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SpecialOffers;
