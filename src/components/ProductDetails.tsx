import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Rating, Chip, Divider } from '@mui/material';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Product } from '../types';

const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const product = products.find((p) => p.id === id) as Product | undefined;
  const [qty, setQty] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>((product && (product.image || (product as any).images && (product as any).images[0])) || '');

  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Producto no encontrado</Typography>
        <Button variant="contained" onClick={() => navigate('/productos')} sx={{ mt: 2 }}>Ver todos los productos</Button>
      </Container>
    );
  }

  const isOffer = product.offer && product.offerPrice && product.offerPrice < product.price;

  const handleAddToCart = () => {
    addToCart(product, qty);
    if (openCart) openCart();
  };

  const increment = () => { if (product.stock && qty >= product.stock) return; setQty(q => q + 1); };
  const decrement = () => setQty(q => Math.max(1, q - 1));

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 500 }}>
            Volver a productos
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, ml: 0.5 }}>
            <Typography onClick={() => navigate('/productos')} sx={{ color: '#94a3b8', cursor: 'pointer' }}>Productos</Typography>
            <Typography sx={{ color: '#cbd5e1' }}>/</Typography>
            <Typography sx={{ color: '#2E8B57' }}>{product.name}</Typography>
          </Box>
        </Box>

        <Box className="pd-content-wrapper">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 5 }}>
            <Box>
              <Box className="pd-image-section">
                {isOffer && (
                  <Box className="pd-discount-badge"><Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>-{product.discount}%</Typography></Box>
                )}
                <Box className="pd-main-image-container">
                  <img src={mainImage} alt={product.name} onError={(e:any) => (e.target.style.display = 'none')} />
                </Box>
                <Box className="pd-thumbnails-container">
                  {(((product as any).images && (product as any).images.length) ? (product as any).images : [product.image]).map((img: string, i: number) => (
                    <button key={i} className={`pd-thumb-btn ${img === mainImage ? 'active' : ''}`} onClick={() => setMainImage(img)}>
                      <img src={img} alt={`${product.name} ${i}`} onError={(e:any) => (e.target.style.display = 'none')} />
                    </button>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box>
              <Box className="pd-product-info">
                <Box sx={{ mb: 2 }}>
                  <Chip label={product.category} size="small" sx={{ bgcolor: '#e8f5e9', color: '#2E8B57', fontWeight: 600, fontSize: '0.75rem', height: '24px' }} />
                </Box>

                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>{product.name}</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Rating value={5} readOnly size="small" sx={{ color: '#facc15' }} />
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>({product.reviews || 0} reseñas)</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  {isOffer ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                        <Typography variant="h3" sx={{ color: '#2E8B57', fontWeight: 800 }}>{formatPrice(product.offerPrice!)}</Typography>
                        <Typography variant="h6" sx={{ textDecoration: 'line-through', color: '#94a3b8', fontWeight: 500 }}>{formatPrice(product.price)}</Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="h3" sx={{ color: '#2E8B57', fontWeight: 800 }}>{formatPrice(product.price)}</Typography>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 3 }}>{product.description}</Typography>

                <Box className="pd-info-cards">
                  <Box className="pd-info-card-item">
                    <PublicOutlinedIcon sx={{ fontSize: 22, color: '#2E8B57' }} />
                    <Box>
                      <Typography className="pd-info-label">Origen</Typography>
                      <Typography className="pd-info-value">{product.origin || 'Chile'}</Typography>
                    </Box>
                  </Box>

                  <Box className="pd-info-card-item">
                    <LocalShippingOutlinedIcon sx={{ fontSize: 22, color: '#2E8B57' }} />
                    <Box>
                      <Typography className="pd-info-label">Stock</Typography>
                      <Typography className="pd-info-value">{product.stock ?? 'Disponible'}</Typography>
                    </Box>
                  </Box>

                  {product.certification && (
                    <Box className="pd-info-card-item">
                      <VerifiedOutlinedIcon sx={{ fontSize: 22, color: '#2E8B57' }} />
                      <Box>
                        <Typography className="pd-info-label">Certificación</Typography>
                        <Typography className="pd-info-value">{product.certification}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {product.benefits && product.benefits.length > 0 && (
                  <Box className="pd-benefits-box">
                    <Typography className="pd-benefits-title">✨ Beneficios principales</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {product.benefits.map((benefit, i) => (
                        <Box key={i} className="pd-benefit-item">
                          <Box className="pd-benefit-check">✓</Box>
                          <Typography className="pd-benefit-text">{benefit}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography className="pd-section-label">Cantidad</Typography>
                  <Box className="pd-quantity-control">
                    <button className="pd-qty-btn" onClick={decrement}>−</button>
                    <Box className="pd-qty-value">{qty}</Box>
                    <button className="pd-qty-btn" onClick={increment}>+</button>
                  </Box>
                </Box>

                <Box className="pd-action-buttons">
                  <button className="pd-btn-primary" onClick={handleAddToCart}><ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} /> Agregar al Carrito</button>
                </Box>

                <Box className="pd-secondary-buttons">
                  <button className="pd-btn-secondary"><FavoriteBorderIcon sx={{ fontSize: 18 }} /> Favoritos</button>
                  <button className="pd-btn-secondary"><ShareOutlinedIcon sx={{ fontSize: 18 }} /> Compartir</button>
                </Box>

                <Box className="pd-shipping-banner">
                  <LocalShippingOutlinedIcon sx={{ fontSize: 22, color: '#2E8B57' }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>Envío gratis</Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>En compras sobre $30.000</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;
