import React from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, Container } from '@mui/material';

import { useAvailableCategories, useProducts } from '../hooks/useApi';
import { CircularProgress } from '@mui/material';

interface CategoryDisplay {
  id: string;
  title: string;
  description: string;
  features: string[];
  productCount: number;
  imagen: string;
}

const Categories: React.FC = () => {
  const { categories: apiCategories, loading: loadingCategories } = useAvailableCategories();
  const { products: apiProducts, loading: loadingProducts } = useProducts();

  const categories: CategoryDisplay[] = React.useMemo(() => {
    if (!apiCategories.length) return [];

    return apiCategories.slice(0, 4).map(cat => {
      // Encontrar productos de esta categoría para obtener imagen y conteo
      const catProducts = apiProducts.filter(p => String(p.categoria) === String(cat.id));
      const firstProduct = catProducts[0];

      return {
        id: String(cat.id),
        title: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1),
        description: cat.descripcion || `Explora nuestra selección de ${cat.nombre} con la mejor calidad y frescura garantizada.`,
        features: ['Calidad Premium', 'Mejor Precio', 'Stock Disponible'],
        productCount: catProducts.length,
        imagen: firstProduct?.imagen || 'https://via.placeholder.com/400x300?text=No+Image'
      };
    });
  }, [apiCategories, apiProducts]);

  if (loadingCategories || loadingProducts) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#2E8B57' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#ffffff',
        py: { xs: 6, md: 10 },
        position: 'relative'
      }}
    >
      <Container maxWidth="xl">
        {/* Header mejorado */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              px: 3,
              py: 1,
              borderRadius: 8,
              bgcolor: 'rgba(46, 139, 87, 0.1)',
              border: '1px solid rgba(46, 139, 87, 0.2)'
            }}
          >
            <Typography sx={{ fontSize: '1.2rem' }}>🌿</Typography>
            <Typography
              sx={{
                color: '#2E8B57',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}
            >
              Explora por Categoría
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1a1a1a',
              mb: 2,
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '-1px',
              fontSize: { xs: '2rem', md: '2.8rem' }
            }}
          >
            Nuestras Categorías
          </Typography>
          <Typography
            sx={{
              color: '#666666',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              maxWidth: 650,
              mx: 'auto',
              fontFamily: 'Montserrat, Arial, sans-serif',
              lineHeight: 1.6
            }}
          >
            Descubre nuestra amplia selección de productos frescos, orgánicos y naturales organizados para tu conveniencia
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
            gap: { xs: 3, md: 4 },
            px: { xs: 2, md: 0 },
            maxWidth: 1000,
            mx: 'auto'
          }}
        >
          {categories.map((category, index) => (
            <Card
              key={category.id}
              elevation={0}
              sx={{
                borderRadius: 4,
                bgcolor: '#fff',
                border: '2px solid #f5f5f5',
                minHeight: 540,
                maxWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background:
                    index === 0
                      ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                      : index === 1
                      ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                      : index === 2
                      ? 'linear-gradient(90deg, #8B4513 0%, #a0522d 100%)'
                      : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.4s ease',
                  zIndex: 2
                },
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                  borderColor: '#2E8B57',
                  '&::before': {
                    transform: 'scaleX(1)'
                  },
                  '& .category-image': {
                    transform: 'scale(1.1)'
                  },
                  '& .category-overlay': {
                    opacity: 0.7
                  }
                }
              }}
            >
              {/* Imagen con overlay mejorado */}
              <Box
                sx={{
                  width: '100%',
                  height: 180,
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  bgcolor: '#ffffff' // Fondo blanco para resaltar el producto
                }}
              >
                <Box
                  className="category-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 100%)', // Overlay muy sutil
                    opacity: 1,
                    transition: 'opacity 0.4s ease',
                    zIndex: 1
                  }}
                />
                  <img
                    src={category.imagen}
                    alt={category.title}
                    className="category-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '10px',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                {/* Badge de contador flotante */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    px: 2,
                    py: 0.8,
                    borderRadius: 3,
                    zIndex: 2,
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  <Typography
                    sx={{
                      color: '#2E8B57',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      fontFamily: 'Montserrat, Arial, sans-serif'
                    }}
                  >
                    {category.productCount} productos
                  </Typography>
                </Box>
              </Box>

              <CardContent
                sx={{
                  flexGrow: 1,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  px: { xs: 2.5, md: 3 },
                  pt: 3,
                  pb: 2.5,
                  boxSizing: 'border-box'
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    color: '#1a1a1a',
                    fontSize: '1.2rem',
                    fontFamily: 'Playfair Display, serif',
                    textAlign: 'center',
                    lineHeight: 1.3
                  }}
                >
                  {category.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                    mb: 2.5,
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    fontFamily: 'Montserrat, Arial, sans-serif',
                    minHeight: 80
                  }}
                >
                  {category.description}
                </Typography>

                {/* Features mejorados */}
                <Box
                  sx={{
                    mb: 2.5,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 0.8
                  }}
                >
                  {category.features.map((feature, idx) => (
                    <Chip
                      key={idx}
                      label={feature}
                      size="small"
                      sx={{
                        bgcolor:
                          index === 0 ? '#fef3c7' : index === 1 ? '#d1fae5' : index === 2 ? '#fed7aa' : '#dbeafe',
                        color: index === 0 ? '#92400e' : index === 1 ? '#065f46' : index === 2 ? '#7c2d12' : '#1e40af',
                        fontWeight: 600,
                        borderRadius: 2,
                        fontSize: '0.7rem',
                        border: '1px solid',
                        borderColor: index === 0 ? '#fde68a' : index === 1 ? '#a7f3d0' : index === 2 ? '#fcd34d' : '#bfdbfe',
                        height: '24px',
                        px: 1.5,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  pb: 3,
                  px: { xs: 2.5, md: 3 },
                  mt: 'auto',
                  boxSizing: 'border-box'
                }}
              >
                <Button
                  variant="contained"
                  size="medium"
                  href={`/productos?categoria=${category.id}`}
                  sx={{
                    borderRadius: 3,
                    bgcolor: '#2E8B57',
                    color: '#fff',
                    fontWeight: 700,
                    width: '100%',
                    py: 1.4,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(46, 139, 87, 0.35)',
                    textTransform: 'none',
                    fontFamily: 'Montserrat, Arial, sans-serif',
                    letterSpacing: '0.3px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'left 0.5s ease'
                    },
                    '&:hover': {
                      bgcolor: '#257d4a',
                      boxShadow: '0 6px 20px rgba(46, 139, 87, 0.5)',
                      transform: 'translateY(-2px)',
                      '&::before': {
                        left: '100%'
                      }
                    }
                  }}
                >
                  Ver Productos
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Categories;
