
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleViewDetails = () => {
    navigate(`/productos/${product.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const isOffer = product.offer && product.offerPrice && product.offerPrice < product.price;
  return (
    <Card sx={{ height: '100%', boxShadow: 2, borderRadius: 3, display: 'flex', flexDirection: 'column', p: 1, minWidth: 0, bgcolor: '#F7F7F7', border: '1px solid #eee', position: 'relative', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      {/* Badge de oferta */}
      {isOffer && (
        <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, bgcolor: '#FFD700', color: '#8B4513', px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 700, fontSize: '0.85rem', boxShadow: 1, fontFamily: 'Montserrat, Arial, sans-serif' }}>
          Oferta
        </Box>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#fff', borderRadius: 2, height: 140, mb: 1 }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', background: '#fff', borderRadius: 8 }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, textAlign: 'center', fontFamily: 'Playfair Display, serif', color: '#8B4513', fontSize: '1.15rem', lineHeight: 1.2 }}>{product.name}</Typography>
        <Typography variant="body2" sx={{ mb: 1, color: '#666', textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '0.95rem', lineHeight: 1.2 }}>{product.description}</Typography>
        {/* Origen y stock */}
        {product.origin && (
          <Typography variant="caption" sx={{ color: '#2E8B57', textAlign: 'center', fontSize: '0.85rem', mb: 0.5, fontWeight: 500 }}>
            Origen: {product.origin}
          </Typography>
        )}
        {typeof product.stock !== 'undefined' && (
          <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', fontSize: '0.85rem', mb: 0.5 }}>
            Stock: {product.stock} {product.unit || ''}
          </Typography>
        )}
        <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          {/* Precio y oferta */}
          {isOffer ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666', textDecoration: 'line-through', fontWeight: 500, fontSize: '0.95rem', mb: 0.5 }}>
                {formatPrice(product.price)}
              </Typography>
              <Typography variant="h6" sx={{ color: '#2E8B57', fontWeight: 700, fontSize: '1.1rem' }}>
                {formatPrice(product.offerPrice)}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ color: '#2E8B57', fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(product.price)}</Typography>
          )}
          <Button variant="contained" size="small" sx={{ bgcolor: '#2E8B57', color: '#fff', borderRadius: 2, fontWeight: 600, fontSize: '0.9rem', minWidth: 90, py: 0.5, boxShadow: 1, mt: 1 }} onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Sin Stock' : 'Agregar'}
          </Button>
          <Button variant="text" size="small" sx={{ color: '#2E8B57', fontWeight: 500, fontSize: '0.9rem', textTransform: 'none' }} onClick={handleViewDetails}>
            Ver Detalles
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
