import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Rating } from '@mui/material';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Producto no encontrado</Typography>
        <Button variant="contained" onClick={() => navigate('/productos')} sx={{ mt: 2 }}>
          Ver todos los productos
        </Button>
      </Container>
    );
  }

  const isOffer = product.offer && product.offerPrice && product.offerPrice < product.price;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#fafafa', minHeight: '80vh' }}>
      <Container maxWidth="lg">
        <Button 
          onClick={() => navigate(-1)} 
          sx={{ mb: 3, color: '#2E8B57' }}
        >
          ← Volver
        </Button>

        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              width: '100%', 
              height: 400, 
              bgcolor: '#fff',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem'
            }}>
              {product.image}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({product.reviews || 0} reseñas)
              </Typography>
            </Box>

            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary', mb: 3 }}>
              {product.description}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Categoría: <strong>{product.category}</strong> | Unidad: <strong>{product.unit}</strong>
            </Typography>

            {isOffer && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ 
                  bgcolor: '#dc2626', 
                  color: 'white', 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontWeight: 600
                }}>
                  -{product.discount}% OFF
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 4 }}>
              {isOffer ? (
                <>
                  <Typography variant="h4" sx={{ color: '#2E8B57', fontWeight: 700, mb: 0.5 }}>
                    {formatPrice(product.offerPrice)}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    textDecoration: 'line-through', 
                    color: 'text.secondary' 
                  }}>
                    Antes: {formatPrice(product.price)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#2E8B57', fontWeight: 600 }}>
                    ¡Ahorra {formatPrice(product.savings || 0)}!
                  </Typography>
                </>
              ) : (
                <Typography variant="h4" sx={{ color: '#2E8B57', fontWeight: 700 }}>
                  {formatPrice(product.price)}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleAddToCart}
              sx={{
                bgcolor: '#2E8B57',
                color: 'white',
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: '#236B43'
                }
              }}
            >
              Agregar al Carrito
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetails;
