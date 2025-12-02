import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import { useCart } from '../context/CartContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PublicOutlinedIcon from '@mui/icons-material/Public';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useProduct } from '../hooks/useApi';

const formatPrice = (price: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(price);

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  
  const { product, loading } = useProduct(id);
  
  const [qty, setQty] = useState<number>(1);
  const [mainImage, setMainImage] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  React.useEffect(() => {
    if (product) {
      setMainImage(product.imagen || (product as any).images?.[0] || '');
    }
  }, [product]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#2E8B57' }} size={50} thickness={4} />
          <Typography sx={{ mt: 2, color: '#64748b', fontWeight: 500 }}>Cargando producto...</Typography>
        </Box>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%)'
      }}>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: '#fee2e2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <Typography sx={{ fontSize: '2.5rem' }}>😕</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Producto no encontrado
          </Typography>
          <Typography sx={{ color: '#64748b', mb: 3 }}>
            Lo sentimos, este producto no está disponible.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/productos')} 
            sx={{ 
              background: 'linear-gradient(135deg, #2E8B57 0%, #228B22 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 15px rgba(46, 139, 87, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #228B22 0%, #1e7a1e 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(46, 139, 87, 0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Ver todos los productos
          </Button>
        </Box>
      </Box>
    );
  }

  const isOffer = product.oferta && product.offerPrice && product.offerPrice < product.precio;

  const handleAddToCart = () => {
    addToCart(product, qty);
    if (openCart) openCart();
  };

  const increment = () => { if (product.stock && qty >= product.stock) return; setQty(q => q + 1); };
  const decrement = () => setQty(q => Math.max(1, q - 1));

  const images = ((product as any).images && (product as any).images.length) 
    ? (product as any).images 
    : [product.imagen];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #ffffff 0%, #f8faf9 100%)',
      py: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumb mejorado */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 3,
          flexWrap: 'wrap'
        }}>
          <Button 
            onClick={() => navigate(-1)} 
            startIcon={<ArrowBackIcon />} 
            sx={{ 
              color: '#64748b', 
              textTransform: 'none', 
              fontWeight: 500,
              borderRadius: '10px',
              px: 2,
              '&:hover': { 
                background: '#f1f5f9',
                color: '#2E8B57'
              }
            }}
          >
            Volver
          </Button>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: '#94a3b8',
            fontSize: '0.9rem'
          }}>
            <Typography 
              onClick={() => navigate('/')} 
              sx={{ cursor: 'pointer', '&:hover': { color: '#2E8B57' } }}
            >
              Inicio
            </Typography>
            <span>/</span>
            <Typography 
              onClick={() => navigate('/productos')} 
              sx={{ cursor: 'pointer', '&:hover': { color: '#2E8B57' } }}
            >
              Productos
            </Typography>
            <span>/</span>
            <Typography sx={{ color: '#2E8B57', fontWeight: 500 }}>
              {product.nombre}
            </Typography>
          </Box>
        </Box>

        {/* Card principal del producto */}
        <Box sx={{ 
          background: '#ffffff',
          borderRadius: { xs: '20px', md: '24px' },
          boxShadow: '0 4px 40px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.04)'
        }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            minHeight: { md: '600px' }
          }}>
            
            {/* Sección de imagen */}
            <Box sx={{ 
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              background: '#fafbfc',
              borderRight: { md: '1px solid #f1f5f9' }
            }}>
              {/* Imagen principal */}
              <Box sx={{ 
                position: 'relative',
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #f1f5f9'
              }}>
                {/* Badge de descuento */}
                {isOffer && (
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    px: 2,
                    py: 0.75,
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    zIndex: 2
                  }}>
                    -{product.descuento || Math.round((1 - (product.offerPrice || 0) / product.precio) * 100)}% OFF
                  </Box>
                )}
                
                {/* Botón favorito */}
                <Box 
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    zIndex: 2,
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon sx={{ color: '#ef4444', fontSize: 22 }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: '#94a3b8', fontSize: 22 }} />
                  )}
                </Box>

                {/* Imagen */}
                <Box
                  component="img"
                  src={mainImage}
                  alt={product.nombre}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/500x500/f8fafc/94a3b8?text=Sin+Imagen';
                  }}
                  sx={{
                    maxWidth: '85%',
                    maxHeight: '85%',
                    objectFit: 'contain',
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Box>

              {/* Miniaturas */}
              {images.length > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1.5, 
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {images.map((img: string, i: number) => (
                    <Box
                      key={i}
                      onClick={() => setMainImage(img)}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: img === mainImage 
                          ? '2px solid #2E8B57' 
                          : '2px solid transparent',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: img === mainImage 
                          ? '0 4px 12px rgba(46, 139, 87, 0.2)' 
                          : '0 2px 8px rgba(0,0,0,0.06)',
                        '&:hover': {
                          borderColor: '#2E8B57',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={img}
                        alt={`${product.nombre} ${i + 1}`}
                        onError={(e: any) => e.target.style.display = 'none'}
                        sx={{
                          maxWidth: '90%',
                          maxHeight: '90%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Información del producto */}
            <Box sx={{ 
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Categoría badge */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                  color: '#2E8B57',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'lowercase'
                }}>
                  {product.categoria}
                </Box>
              </Box>

              {/* Título del producto */}
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#1e293b', 
                  mb: 1.5,
                  fontSize: { xs: '1.5rem', md: '1.85rem' },
                  lineHeight: 1.3
                }}
              >
                {product.nombre}
              </Typography>

              {/* Rating */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 3 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon 
                      key={star} 
                      sx={{ 
                        fontSize: 18, 
                        color: star <= 5 ? '#fbbf24' : '#e2e8f0' 
                      }} 
                    />
                  ))}
                </Box>
                <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                  (0 reseñas)
                </Typography>
              </Box>

              {/* Precio */}
              <Box sx={{ mb: 3 }}>
                {isOffer ? (
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <Typography sx={{ 
                      fontSize: { xs: '2rem', md: '2.5rem' }, 
                      fontWeight: 800, 
                      color: '#2E8B57',
                      lineHeight: 1
                    }}>
                      {formatPrice(product.offerPrice!)}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '1.25rem', 
                      textDecoration: 'line-through', 
                      color: '#94a3b8',
                      fontWeight: 500 
                    }}>
                      {formatPrice(product.precio)}
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ 
                    fontSize: { xs: '2rem', md: '2.5rem' }, 
                    fontWeight: 800, 
                    color: '#2E8B57',
                    lineHeight: 1
                  }}>
                    {formatPrice(product.precio)}
                  </Typography>
                )}
              </Box>

              {/* Descripción */}
              <Typography sx={{ 
                color: '#64748b', 
                lineHeight: 1.8, 
                mb: 3,
                fontSize: '0.95rem'
              }}>
                {product.descripcion}
              </Typography>

              {/* Info cards - Origen y Stock */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                mb: 3
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#fafbfc'
                }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PublicOutlinedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Origen
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                      {product.origen || 'Chile'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#fafbfc'
                }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <InventoryOutlinedIcon sx={{ color: '#10b981', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Stock
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                      {product.stock ? `${product.stock} disponibles` : 'Disponible'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Separador */}
              <Box sx={{ 
                height: '1px', 
                background: 'linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)',
                my: 2
              }} />

              {/* Cantidad */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ 
                  fontWeight: 600, 
                  color: '#475569', 
                  mb: 1.5,
                  fontSize: '0.9rem'
                }}>
                  Cantidad
                </Typography>
                <Box sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#fff'
                }}>
                  <Box
                    onClick={decrement}
                    sx={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748b',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#f1f5f9',
                        color: '#2E8B57'
                      }
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box sx={{ 
                    width: 60, 
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#1e293b'
                  }}>
                    {qty}
                  </Box>
                  <Box
                    onClick={increment}
                    sx={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748b',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#f1f5f9',
                        color: '#2E8B57'
                      }
                    }}
                  >
                    <AddIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </Box>

              {/* Botón Agregar al carrito */}
              <Button
                onClick={handleAddToCart}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #2E8B57 0%, #228B22 100%)',
                  color: 'white',
                  py: 1.75,
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 20px rgba(46, 139, 87, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #228B22 0%, #1e7a1e 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(46, 139, 87, 0.45)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ShoppingCartOutlinedIcon sx={{ fontSize: 22 }} />
                Agregar al Carrito
              </Button>

              {/* Botones secundarios */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
                mb: 3
              }}>
                <Button
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    color: isFavorite ? '#ef4444' : '#64748b',
                    fontWeight: 600,
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    background: isFavorite ? '#fef2f2' : 'transparent',
                    '&:hover': {
                      background: '#fef2f2',
                      borderColor: '#fecaca',
                      color: '#ef4444'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                  )}
                  Favoritos
                </Button>
                <Button
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    color: '#64748b',
                    fontWeight: 600,
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      background: '#f8fafc',
                      borderColor: '#cbd5e1',
                      color: '#475569'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ShareOutlinedIcon sx={{ fontSize: 18 }} />
                  Compartir
                </Button>
              </Box>

              {/* Banner envío gratis */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1px solid #a7f3d0'
              }}>
                <Box sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
                }}>
                  <LocalShippingOutlinedIcon sx={{ color: '#10b981', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#065f46', fontSize: '0.95rem' }}>
                    Envío gratis
                  </Typography>
                  <Typography sx={{ color: '#059669', fontSize: '0.85rem' }}>
                    En compras sobre $30.000
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Sección de garantías/beneficios */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mt: 4,
          mb: 2
        }}>
          {[
            { icon: <VerifiedIcon />, title: '100% Orgánico', desc: 'Productos certificados' },
            { icon: <LocalShippingOutlinedIcon />, title: 'Envío Rápido', desc: 'Entrega en 24-48h' },
            { icon: '🌱', title: 'Eco-Friendly', desc: 'Packaging sostenible' }
          ].map((item, i) => (
            <Box key={i} sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2.5,
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
            }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2E8B57',
                fontSize: typeof item.icon === 'string' ? '1.5rem' : 'inherit'
              }}>
                {item.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                  {item.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;
