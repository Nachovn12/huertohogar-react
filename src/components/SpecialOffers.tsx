import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Box, Typography, Button, CircularProgress, Chip, Container } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useProductsOnOffer } from '../hooks/useApi';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ProductCard from './ProductCard';

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value);
};

// Componente de Countdown Timer
const CountdownTimer: React.FC<{ endDate: Date }> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      {[
        { label: 'Días', value: timeLeft.days },
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds }
      ].map((unit, index) => (
        <React.Fragment key={unit.label}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            bgcolor: '#dc2626',
            px: 1.5,
            py: 0.8,
            borderRadius: 2,
            minWidth: 50,
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
          }}>
            <Typography sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '1.2rem', md: '1.5rem' }, 
              color: '#fff',
              fontFamily: 'Montserrat, Arial, sans-serif',
              lineHeight: 1
            }}>
              {String(unit.value).padStart(2, '0')}
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#fecaca', fontWeight: 700, mt: 0.2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {unit.label}
            </Typography>
          </Box>
          {index < 3 && <Typography sx={{ color: '#dc2626', fontWeight: 900, fontSize: { xs: '1rem', md: '1.2rem' } }}>:</Typography>}
        </React.Fragment>
      ))}
    </Box>
  );
};

// Featured Deal Card NUEVO DISEÑO
const FeaturedDealCard: React.FC<{ product: Product; onAddToCart: () => void }> = ({ product, onAddToCart }) => {
  const isOffer = product.oferta && product.offerPrice && product.offerPrice < product.precio;
  const savings = isOffer ? product.precio - (product.offerPrice || 0) : 0;
  const savingsPercent = isOffer ? Math.round((savings / product.precio) * 100) : 0;
  
  const offerEndDate = new Date();
  offerEndDate.setDate(offerEndDate.getDate() + 3);

  return (
    <Box sx={{
      position: 'relative',
      borderRadius: 5,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #fff5f5 0%, #ffe4e6 100%)',
      border: '3px solid #dc2626',
      boxShadow: '0 20px 60px rgba(220, 38, 38, 0.25)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 25px 70px rgba(220, 38, 38, 0.35)'
      }
    }}>
      {/* Patrón de fondo decorativo */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        background: 'radial-gradient(circle at top right, rgba(220, 38, 38, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Badge flotante de oferta */}
      <Box sx={{
        position: 'absolute',
        top: -10,
        right: 30,
        zIndex: 3,
        transform: 'rotate(5deg)'
      }}>
        <Box sx={{
          bgcolor: '#dc2626',
          color: '#fff',
          px: 4,
          py: 2,
          borderRadius: 3,
          boxShadow: '0 8px 20px rgba(220, 38, 38, 0.5)',
          border: '3px solid #fff',
          textAlign: 'center'
        }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 28, mb: 0.5 }} />
          <Typography sx={{ fontWeight: 900, fontSize: '1.8rem', lineHeight: 1, fontFamily: 'Montserrat, Arial, sans-serif' }}>
            -{savingsPercent}%
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px' }}>
            OFF
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        position: 'relative',
        zIndex: 1
      }}>
        {/* Imagen con efecto */}
        <Box sx={{
          flex: 1,
          minHeight: { xs: 250, md: 280 },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 3 },
          background: 'linear-gradient(135deg, #fff 0%, #fef2f2 100%)'
        }}>
          {/* Círculos decorativos */}
          <Box sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'rgba(220, 38, 38, 0.05)',
            filter: 'blur(40px)'
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(251, 191, 36, 0.08)',
            filter: 'blur(50px)'
          }} />
          
          <img
            src={product.imagen}
            alt={product.nombre}
            style={{
              width: '100%',
              maxWidth: '220px',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.15))',
              position: 'relative',
              zIndex: 1,
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        </Box>

        {/* Contenido */}
        <Box sx={{ 
          flex: 1,
          p: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          bgcolor: '#fff'
        }}>
          {/* Chip de categoría */}
          <Chip
            label="🔥 OFERTA RELÁMPAGO"
            sx={{
              bgcolor: '#fef3c7',
              color: '#92400e',
              fontWeight: 800,
              fontSize: '0.75rem',
              height: '30px',
              mb: 2,
              width: 'fit-content',
              border: '2px solid #fbbf24',
              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
            }}
          />

          <Typography variant="h2" sx={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 900,
            color: '#1e293b',
            mb: 2,
            fontSize: { xs: '1.5rem', md: '1.8rem' },
            lineHeight: 1.1,
            letterSpacing: '-2px'
          }}>
            {product.nombre}
          </Typography>

          <Typography sx={{
            color: '#64748b',
            mb: 2,
            fontSize: '1.1rem',
            lineHeight: 1.7,
            fontFamily: 'Montserrat, Arial, sans-serif'
          }}>
            {product.descripcion || 'Producto fresco de la mejor calidad, directo del campo a tu mesa. ¡Aprovecha esta oferta limitada!'}
          </Typography>

          {/* Countdown con diseño mejorado */}
          <Box sx={{ 
            mb: 3,
            p: 2,
            bgcolor: '#fef2f2',
            borderRadius: 3,
            border: '2px dashed #dc2626'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
              <AccessTimeIcon sx={{ color: '#dc2626', fontSize: 28 }} />
              <Typography sx={{ 
                color: '#dc2626', 
                fontWeight: 900, 
                fontSize: '1.1rem', 
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}>
                La oferta termina en:
              </Typography>
            </Box>
            <CountdownTimer endDate={offerEndDate} />
          </Box>

          {/* Precios con diseño destacado */}
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Typography sx={{
                color: '#94a3b8',
                textDecoration: 'line-through',
                fontSize: '1.8rem',
                fontWeight: 600,
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}>
                {formatPrice(product.precio)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1.5 }}>
              <Typography sx={{
                color: '#16a34a',
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 900,
                fontFamily: 'Montserrat, Arial, sans-serif',
                lineHeight: 0.9,
                letterSpacing: '-3px'
              }}>
                {formatPrice(product.offerPrice || product.precio)}
              </Typography>
              <Chip
                label={`-${savingsPercent}%`}
                sx={{
                  bgcolor: '#dc2626',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                  height: '50px',
                  px: 2,
                  '& .MuiChip-label': { px: 2 }
                }}
              />
            </Box>
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#dcfce7',
              px: 3,
              py: 1,
              borderRadius: 2,
              border: '1px solid #86efac'
            }}>
              <Typography sx={{ fontSize: '1.3rem' }}>💰</Typography>
              <Typography sx={{ color: '#16a34a', fontSize: '1.1rem', fontWeight: 800 }}>
                ¡Ahorras {formatPrice(savings)}!
              </Typography>
            </Box>
          </Box>

          {/* Botón CTA mejorado */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<AddShoppingCartIcon sx={{ fontSize: 28 }} />}
            onClick={onAddToCart}
            sx={{
              bgcolor: '#16a34a',
              color: '#fff',
              fontWeight: 900,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 3,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.4)',
              fontFamily: 'Montserrat, Arial, sans-serif',
              border: '3px solid #15803d',
              '&:hover': {
                bgcolor: '#15803d',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 32px rgba(22, 163, 74, 0.5)'
              }
            }}
          >
            Agregar al Carrito Ahora
          </Button>
        </Box>
      </Box>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </Box>
  );
};

const SpecialOffers: React.FC = () => {
  const { addToCart } = useCart() as { addToCart: (p: Product) => void };
  const { products, loading } = useProductsOnOffer();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#16a34a' }} />
      </Box>
    );
  }

  const featuredDeal = products[0];
  const otherOffers = products.slice(1, 4);

  return (
    <Box sx={{ 
      bgcolor: '#ffffff',
      py: { xs: 6, md: 10 }
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ fontSize: 18, color: '#fff !important' }} />}
            label="OFERTAS LIMITADAS"
            sx={{
              bgcolor: '#dc2626',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.85rem',
              height: '36px',
              mb: 2,
              '& .MuiChip-label': { px: 2 }
            }}
          />
          <Typography variant="h3" sx={{
            fontWeight: 800,
            color: '#1e293b',
            mb: 2,
            fontFamily: 'Playfair Display, serif',
            fontSize: { xs: '2rem', md: '2.8rem' },
            letterSpacing: '-1px'
          }}>
            Ofertas Especiales de la Semana
          </Typography>
          <Typography sx={{
            color: '#64748b',
            fontSize: '1.05rem',
            maxWidth: 650,
            mx: 'auto',
            fontFamily: 'Montserrat, Arial, sans-serif'
          }}>
            Aprovecha estos descuentos exclusivos en productos frescos y de temporada
          </Typography>
        </Box>

        {/* Featured Deal */}
        {featuredDeal && (
          <Box sx={{ mb: 8 }}>
            <FeaturedDealCard 
              product={featuredDeal} 
              onAddToCart={() => addToCart(featuredDeal)}
            />
          </Box>
        )}

        {/* Other Offers */}
        {otherOffers.length > 0 && (
          <>
            <Typography variant="h5" sx={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              color: '#1e293b',
              mb: 4,
              textAlign: 'center'
            }}>
              Más Ofertas Destacadas
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 6
            }}>
              {otherOffers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Box>
          </>
        )}

        {/* Ver todas las ofertas */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={Link}
            to="/ofertas"
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderColor: '#16a34a',
              color: '#16a34a',
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 3,
              textTransform: 'none',
              borderWidth: 2,
              fontFamily: 'Montserrat, Arial, sans-serif',
              '&:hover': {
                borderWidth: 2,
                bgcolor: '#16a34a',
                color: '#fff'
              }
            }}
          >
            Ver Todas las Ofertas
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SpecialOffers;
