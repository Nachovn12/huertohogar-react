import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, Chip, Rating, IconButton, Tooltip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RoomIcon from '@mui/icons-material/Room';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import InventoryIcon from '@mui/icons-material/Inventory';

import { Product } from '../types';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart() as { addToCart: (p: Product) => void };
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

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

  const isOffer = product.oferta && product.offerPrice && product.offerPrice < product.precio;
  
  // Simular rating (en producción vendría de la API)
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 50) + 10;
  
  // Determinar badge de estado
  const isNew = Math.random() > 0.7; // 30% de productos son "nuevos"
  const isPopular = Math.random() > 0.6; // 40% son "populares"
  const isLowStock = product.stock && product.stock < 10 && product.stock > 0;
  
  const categoryNames: { [k: string]: string } = {
    'frutas': 'Frutas Frescas',
    'verduras': 'Verduras Orgánicas',
    'organicos': 'Productos Orgánicos',
    'lacteos': 'Productos Lácteos'
  };
  
  return (
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
          borderColor: '#16a34a',
          '& .product-image': {
            transform: 'scale(1.08)'
          },
          '& .quick-actions': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      }}
      onMouseEnter={() => setShowQuickView(true)}
      onMouseLeave={() => setShowQuickView(false)}
    >
      {/* Badges superiores */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isOffer && (
          <Chip
            icon={<LocalOfferIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
            label={`-${product.descuento}% OFF`}
            size="small"
            sx={{
              bgcolor: '#dc2626',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: '28px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
              fontFamily: 'Montserrat, Arial, sans-serif',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        )}
        {isNew && !isOffer && (
          <Chip
            icon={<NewReleasesIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
            label="NUEVO"
            size="small"
            sx={{
              bgcolor: '#3b82f6',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: '26px',
              fontFamily: 'Montserrat, Arial, sans-serif',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        )}
        {isPopular && !isOffer && !isNew && (
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
            label="POPULAR"
            size="small"
            sx={{
              bgcolor: '#f59e0b',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: '26px',
              fontFamily: 'Montserrat, Arial, sans-serif',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        )}
      </Box>

      {/* Botón de favorito */}
      <IconButton
        onClick={() => setIsFavorite(!isFavorite)}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 3,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            bgcolor: '#fff',
            transform: 'scale(1.1)'
          }
        }}
      >
        {isFavorite ? (
          <FavoriteIcon sx={{ color: '#dc2626', fontSize: 20 }} />
        ) : (
          <FavoriteBorderIcon sx={{ color: '#64748b', fontSize: 20 }} />
        )}
      </IconButton>
      
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
          onError={e => { e.currentTarget.src = '/img/placeholder.png'; }}
        />
        
        {/* Quick View Button */}
        <Box
          className="quick-actions"
          sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%) translateY(10px)',
            opacity: 0,
            transition: 'all 0.3s ease',
            zIndex: 2
          }}
        >
          <Button
            variant="contained"
            size="small"
            startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
            onClick={handleViewDetails}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              color: '#1e293b',
              backdropFilter: 'blur(8px)',
              fontWeight: 700,
              fontSize: '0.75rem',
              px: 2,
              py: 0.8,
              borderRadius: 50,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: '#fff',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
              }
            }}
          >
            Vista Rápida
          </Button>
        </Box>
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
        {/* Categoría */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
          <Chip 
            label={categoryNames[product.categoria] || product.categoria}
            size="small"
            sx={{
              bgcolor: '#f0fdf4',
              color: '#16a34a',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: '22px',
              borderRadius: 1.5,
              fontFamily: 'Montserrat, Arial, sans-serif',
              border: '1px solid #bbf7d0',
              '& .MuiChip-label': { px: 1.5 }
            }}
          />
        </Box>

        {/* Nombre del producto */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            textAlign: 'center', 
            fontFamily: 'Montserrat, Arial, sans-serif', 
            color: '#1e293b', 
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
        </Typography>
        
        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
          <Rating 
            value={rating} 
            precision={0.5} 
            size="small" 
            readOnly 
            sx={{ 
              '& .MuiRating-iconFilled': { color: '#fbbf24' },
              '& .MuiRating-iconEmpty': { color: '#e5e7eb' }
            }}
          />
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
            ({reviewCount})
          </Typography>
        </Box>

        {/* Región de origen */}
        {product.origen && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            bgcolor: '#f8fafc',
            py: 0.6,
            px: 1.5,
            borderRadius: 2,
            border: '1px solid #e2e8f0'
          }}>
            <RoomIcon sx={{ fontSize: 14, color: '#16a34a' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#475569',
                fontSize: '0.7rem',
                fontWeight: 600,
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}
            >
              {product.origen}
            </Typography>
          </Box>
        )}
        
        {/* Indicador de stock */}
        {isLowStock && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
            <InventoryIcon sx={{ fontSize: 14, color: '#d97706' }} />
            <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700, fontSize: '0.7rem' }}>
              ¡Solo quedan {product.stock}!
            </Typography>
          </Box>
        )}
        
        {/* Precios */}
        <Box sx={{ 
          mt: 'auto',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 0.3,
          mb: 1.5,
          pt: 1
        }}>
          {isOffer ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#94a3b8', 
                    textDecoration: 'line-through', 
                    fontWeight: 500, 
                    fontSize: '0.9rem',
                    fontFamily: 'Montserrat, Arial, sans-serif'
                  }}
                >
                  {formatPrice(product.precio)}
                </Typography>
                <Chip
                  label={`Ahorra ${formatPrice(product.precio - (product.offerPrice || 0))}`}
                  size="small"
                  sx={{
                    bgcolor: '#fef3c7',
                    color: '#92400e',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    height: '20px'
                  }}
                />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#16a34a', 
                  fontWeight: 800, 
                  fontSize: '1.75rem',
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  letterSpacing: '-0.5px'
                }}
              >
                {formatPrice(product.offerPrice)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 500 }}>
                {product.unidad ? `por ${product.unidad}` : 'por kilo'}
              </Typography>
            </>
          ) : (
            <>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#16a34a', 
                  fontWeight: 800, 
                  fontSize: '1.75rem',
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  letterSpacing: '-0.5px'
                }}
              >
                {formatPrice(product.precio)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 500 }}>
                {product.unidad ? `por ${product.unidad}` : 'por kilo'}
              </Typography>
            </>
          )}
        </Box>
          
        {/* Botón de acción principal */}
        <Button 
          variant="contained" 
          fullWidth
          startIcon={<AddShoppingCartIcon sx={{ fontSize: 18 }} />}
          sx={{ 
            bgcolor: '#16a34a', 
            color: '#fff', 
            borderRadius: 3, 
            fontWeight: 700, 
            fontSize: '0.85rem', 
            py: 1.3, 
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
            textTransform: 'none',
            fontFamily: 'Montserrat, Arial, sans-serif',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { 
              bgcolor: '#15803d',
              boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)',
              transform: 'translateY(-2px)'
            },
            '&:disabled': {
              bgcolor: '#e5e7eb',
              color: '#9ca3af',
              boxShadow: 'none'
            }
          }} 
          onClick={handleAddToCart} 
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
