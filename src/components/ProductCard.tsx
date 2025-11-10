import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';

import { Product } from '../types';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart() as { addToCart: (p: Product) => void };
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleViewDetails = () => {
    navigate(`/productos/${product.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const isOffer = product.offer && product.offerPrice && product.offerPrice < product.price;
  
  const categoryNames: { [k: string]: string } = {
    'frutas': 'Frutas Frescas',
    'verduras': 'Verduras Orgánicas',
    'organicos': 'Productos Orgánicos',
    'lacteos': 'Productos Lácteos'
  };
  
  return (
    <Card sx={{ 
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
    }}>
      {/* Badge de oferta o temporada */}
      {isOffer ? (
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
          -{product.discount}% OFF
        </Box>
      ) : product.seasonal && (
        <Chip
          label="TEMPORADA"
          sx={{
            position: 'absolute',
            top: 8,
            left: 12,
            zIndex: 3,
            bgcolor: '#16a34a',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.7rem',
            height: '26px',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.4)',
            '& .MuiChip-label': {
              px: 1.5,
              fontFamily: 'Montserrat, Arial, sans-serif'
            }
          }}
        />
      )}
      
      {isOffer && product.seasonal && (
        <Chip
          label="POPULAR"
          sx={{
            position: 'absolute',
            top: 8,
            right: 12,
            zIndex: 3,
            bgcolor: '#eab308',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.7rem',
            height: '26px',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(234, 179, 8, 0.4)',
            '& .MuiChip-label': {
              px: 1.5,
              fontFamily: 'Montserrat, Arial, sans-serif'
            }
          }}
        />
      )}
      
      {/* Imagen del producto */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        bgcolor: '#fafafa', 
        height: 180,
        minHeight: 180,
        maxHeight: 180,
        p: 2.5,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
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
          {product.name}
        </Typography>
        
        {/* Categoría */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mb: 0.5
        }}>
          <Chip 
            label={categoryNames[product.category] || product.category}
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
        
        {/* Región de origen */}
        {product.origin && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            bgcolor: '#f9fafb',
            py: 0.8,
            borderRadius: 2
          }}>
            <RoomIcon sx={{ fontSize: 14, color: '#2E8B57' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#666666',
                fontSize: '0.7rem',
                fontWeight: 500,
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}
            >
              Región {product.origin}
            </Typography>
          </Box>
        )}
        
        {/* Rating con estrellas */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          my: 0.5
        }}>
          {[...Array(5)].map((_, index) => (
            <StarIcon 
              key={index}
              sx={{ 
                fontSize: 14, 
                color: index < (product.rating || 4) ? '#fbbf24' : '#e5e7eb'
              }} 
            />
          ))}
          <Typography
            variant="caption"
            sx={{
              color: '#999',
              fontSize: '0.7rem',
              ml: 0.5,
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}
          >
            ({product.reviews || '89'} reseñas)
          </Typography>
        </Box>
        
        {/* Precios */}
        <Box sx={{ 
          mt: 'auto',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 0.3,
          mb: 1.5
        }}>
          {isOffer ? (
            <>
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
                POR KILO
              </Typography>
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
                Antes: {formatPrice(product.price)}
              </Typography>
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
                {formatPrice(product.offerPrice)}
              </Typography>
            </>
          ) : (
            <>
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
                {product.unit ? `POR ${String(product.unit).toUpperCase()}` : 'POR KILO'}
              </Typography>
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
                {formatPrice(product.price)}
              </Typography>
            </>
          )}
        </Box>
        
        {/* Badge de stock o estado */}
        {product.stock === 0 ? (
          <Chip
            label="Agotado"
            size="small"
            sx={{
              bgcolor: '#fee2e2',
              color: '#dc2626',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '24px',
              mb: 1.5,
              mx: 'auto',
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}
          />
        ) : product.stock && product.stock < 10 && (
          <Chip
            label={`Solo ${product.stock} disponibles`}
            size="small"
            sx={{
              bgcolor: '#fef3c7',
              color: '#d97706',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '24px',
              mb: 1.5,
              mx: 'auto',
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}
          />
        )}
          
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
            onClick={handleViewDetails}
          >
            Ver Detalles
          </Button>
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
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
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
          >
            Agregar al Carrito
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
