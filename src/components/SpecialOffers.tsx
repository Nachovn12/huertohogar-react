import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const formatPrice = (value: number) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const SpecialOffers: React.FC = () => {
  const { addToCart } = useCart() as { addToCart: (p: Product) => void };
  
  const declaredOffers = [
    { id: 'PO001', discount: 25 },
    { id: 'PO003', discount: 20 },
    { id: 'FR001', discount: 15 },
    { id: 'VR003', discount: 18 }
  ];

  const offers = declaredOffers
    .map(o => {
      const p = (products as Product[]).find(prod => prod.id === o.id);
      if (!p) return null;
      return {
        ...p,
        discount: o.discount,
        discountedPrice: Math.round(p.price * (1 - o.discount / 100))
      } as Product & { discountedPrice: number; discount: number };
    })
    .filter(Boolean) as (Product & { discountedPrice: number; discount: number })[];

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

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, sm: 2, md: 2.5 }, position: 'relative', zIndex: 1, width: '100%', boxSizing: 'border-box' }}>
          {offers.map((item) => (
            <Card key={item.id} elevation={0} sx={{ borderRadius: { xs: 2, md: 3 }, bgcolor: '#fff', border: '1px solid #e5e7eb', position: 'relative', padding: 0, minHeight: { xs: 400, sm: 420, md: 460 }, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, bgcolor: '#dc2626', color: '#fff', px: { xs: 1.2, md: 1.5 }, py: { xs: 0.4, md: 0.5 }, borderRadius: 2, fontWeight: 700, fontSize: { xs: '0.75rem', md: '0.85rem' }, zIndex: 10 }}>-{item.discount}% OFF</Box>
              <Box sx={{ position: 'relative', width: '100%', height: { xs: 140, sm: 160, md: 180 }, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#f9fafb', overflow: 'hidden', p: { xs: 1.5, md: 2 } }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
              <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 2.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: { xs: 0.5, md: 1 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: { xs: '0.9rem', md: '1rem' }, mb: 0.5 }}>{item.name}</Typography>
                <Typography variant="body2" sx={{ color: '#10b981', fontSize: { xs: '0.7rem', md: '0.8rem' }, fontWeight: 600, textTransform: 'uppercase', mb: { xs: 0.5, md: 1 } }}>{item.unit}</Typography>
                <Box sx={{ mb: { xs: 1, md: 1.5 }, bgcolor: '#f0fdf4', py: { xs: 1, md: 1.2 }, px: { xs: 1.5, md: 2 }, borderRadius: 2, border: '1px dashed #bbf7d0' }}>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>Precio Especial</Typography>
                  <Typography variant="h5" sx={{ color: '#2E8B57', fontWeight: 800 }}>${formatPrice(item.discountedPrice)}</Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#9ca3af', mt: 0.5 }}>Antes: ${formatPrice(item.price)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.8, md: 1 }, mt: 'auto', width: '100%' }}>
                  <Button component={Link} to={`/productos/${item.id}`} variant="outlined" size="small" sx={{ borderRadius: 2, color: '#d97706', fontWeight: 600 }}>Ver Detalles</Button>
                  <Button variant="contained" size="small" onClick={() => addToCart(item)} sx={{ bgcolor: '#2E8B57', color: '#fff', borderRadius: 2 }}>Agregar al Carrito</Button>
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
