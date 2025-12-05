import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Box, Typography, Card, CardContent, Button, CircularProgress, Chip } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useProductsOnOffer } from '../hooks/useApi';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

const SpecialOffers: React.FC = () => {
  const { addToCart } = useCart() as { addToCart: (p: Product) => void };
  const { products, loading } = useProductsOnOffer();
  
  // Mostrar loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#2E8B57' }} />
      </Box>
    );
  }

  // Usar directamente los productos que vienen del hook (ya filtrados por oferta en la API/adaptador)
  // Tomamos solo los primeros 3 para mostrar en una fila de 3 cards
  const offers = products.slice(0, 3);

  return (
    <Box sx={{ 
      bgcolor: 'linear-gradient(135deg, #f0f9f4 0%, #ffffff 100%)',
      background: 'linear-gradient(135deg, #f0f9f4 0%, #ffffff 100%)',
      py: { xs: 4, md: 8 },
      position: 'relative',
      overflow: 'hidden',
      width: '100%'
    }}>
      <Box sx={{ maxWidth: 1300, mx: 'auto', px: { xs: 2, sm: 3, md: 3 }, width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2, px: 3, py: 1, borderRadius: 8, bgcolor: 'rgba(255, 215, 0, 0.15)', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
            <Typography sx={{ fontSize: '1.2rem' }}>🔥</Typography>
            <Typography sx={{ color: '#d97706', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Montserrat, Arial, sans-serif' }}>Ofertas Especiales</Typography>
          </Box>
          
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 2, fontFamily: 'Playfair Display, serif', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, letterSpacing: '-1px' }}>Productos con Descuentos Exclusivos</Typography>
          
          <Typography sx={{ color: '#666666', fontSize: { xs: '0.85rem', md: '1rem' }, fontFamily: 'Montserrat, Arial, sans-serif', maxWidth: 600, mx: 'auto', lineHeight: 1.6, px: { xs: 2, md: 0 } }}>Aprovecha estas ofertas limitadas en nuestros productos más frescos y de mejor calidad</Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: { xs: 2, sm: 2.5, md: 3 }, position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box', maxWidth: '100%', mx: 'auto' }}>
          {offers.map((item) => {
            const isOffer = item.oferta && item.offerPrice && item.offerPrice < item.precio;
            const currentPrice = isOffer ? item.offerPrice : item.precio;
            const originalPrice = isOffer ? item.precio : null;

            return (
            <Card 
              key={item.id}
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
              {isOffer && (
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
                  -{item.descuento}% OFF
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
                  src={item.imagen}
                  alt={item.nombre}
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
                <Typography 
                  variant="h6" 
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
                  {item.nombre}
                </Typography>

                {/* Categoría */}
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 0.5
                }}>
                  <Chip 
                    label={categoryNames[item.categoria] || item.categoria}
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
                  <Typography 
                    variant="caption"
                    sx={{ 
                      color: '#999', 
                      fontSize: '0.7rem',
                      fontFamily: 'Montserrat, Arial, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: 600
                    }}
                  >
                    POR KG
                  </Typography>
                  {isOffer && originalPrice && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#9ca3af', 
                        textDecoration: 'line-through', 
                        fontWeight: 500, 
                        fontSize: '0.85rem',
                        fontFamily: 'Montserrat, Arial, sans-serif'
                      }}
                    >
                      Antes: {formatPrice(originalPrice)}
                    </Typography>
                  )}
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#2E8B57', 
                      fontWeight: 700, 
                      fontSize: '1.5rem',
                      fontFamily: 'Montserrat, Arial, sans-serif',
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {formatPrice(currentPrice || 0)}
                  </Typography>
                  {isOffer && originalPrice && (
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: '#2E8B57', 
                        fontWeight: 600, 
                        fontSize: '0.75rem',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        mt: 0.3
                      }}
                    >
                      Ahorras {formatPrice((originalPrice || 0) - (currentPrice || 0))}
                    </Typography>
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
                    component={Link}
                    to={`/productos/${item.id}`}
                    variant="contained" 
                    fullWidth
                    startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
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
                    onClick={() => addToCart(item)}
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
                    disabled={item.stock === 0}
                  >
                    Agregar al Carrito
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )})}
        </Box>

        {/* Botón Ver Todas las Ofertas - Profesional */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: { xs: 4, md: 6 },
          position: 'relative',
          zIndex: 1
        }}>
          <Button
            component={Link}
            to="/ofertas"
            variant="contained"
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #2E8B57 0%, #1f6a3f 100%)',
              color: 'white',
              px: { xs: 4, md: 6 },
              py: { xs: 1.5, md: 2 },
              borderRadius: 50,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              fontWeight: 700,
              textTransform: 'none',
              fontFamily: 'Montserrat, Arial, sans-serif',
              boxShadow: '0 8px 24px rgba(46, 139, 87, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.6s',
              },
              '&:hover': {
                transform: 'translateY(-4px) scale(1.02)',
                boxShadow: '0 12px 32px rgba(46, 139, 87, 0.45)',
                background: 'linear-gradient(135deg, #257d4a 0%, #1a5a35 100%)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'translateY(-2px) scale(1.01)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <i className="fas fa-tags" style={{ fontSize: '18px' }}></i>
              <span>Ver Todas las Ofertas</span>
              <i className="fas fa-arrow-right" style={{ fontSize: '14px' }}></i>
            </Box>
          </Button>
        </Box>

        {/* Texto informativo adicional */}
        <Box sx={{ 
          textAlign: 'center', 
          mt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}>
          <Typography sx={{ 
            color: '#666', 
            fontSize: '0.85rem',
            fontFamily: 'Montserrat, Arial, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <i className="fas fa-clock" style={{ color: '#2E8B57', fontSize: '14px' }}></i>
            Ofertas por tiempo limitado
          </Typography>
          <Typography sx={{ 
            color: '#999', 
            fontSize: '0.75rem',
            fontFamily: 'Montserrat, Arial, sans-serif'
          }}>
            ¡No te pierdas nuestros descuentos exclusivos!
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SpecialOffers;
