import React from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, Container } from '@mui/material';

const Categories = () => {
  // Orden y cantidad de categorías igual al sitio original
  // Solo las 4 principales: Frutas Frescas, Verduras Orgánicas, Productos Orgánicos, Productos Lácteos
  const categories = [
    {
      id: 'frutas',
      title: 'Frutas Frescas',
      description: 'Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura.',
      features: ['Fresco', 'De Temporada', 'Nutritivo'],
      productCount: 3,
      image: 'https://media.istockphoto.com/id/467652436/es/foto/mezcla-de-frutas-frescas.jpg?s=612x612&w=0&k=20&c=CJEx3NOdOKNzJ_1XokafBhz84h8_J6OOXvp1cfmIogQ='
    },
    {
      id: 'verduras',
      title: 'Verduras Orgánicas',
      description: 'Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural.',
      features: ['Orgánico', 'Sin Pesticidas', 'Sostenible'],
      productCount: 3,
      image: 'https://media.istockphoto.com/id/1203599923/es/foto/fondo-gastron%C3%B3mico-con-surtido-de-verduras-org%C3%A1nicas-frescas.jpg?s=170667a&w=0&k=20&c=1VdiE2kPhNDVbws9bEanQA2JEMR6xrBjrq1PHvkhLp0='
    },
    {
      id: 'organicos',
      title: 'Productos Orgánicos',
      description: 'Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables.',
      features: ['Natural', 'Responsable', 'Saludable'],
      productCount: 2,
      image: 'https://natureganix.store/cdn/shop/articles/Natural_1024x.jpg?v=1618006760'
    },
    {
      id: 'lacteos',
      title: 'Productos Lácteos',
      description: 'Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad.',
      features: ['Local', 'Fresco', 'Nutritivo'],
      productCount: 1,
      image: 'https://images.ecestaticos.com/5R1YUlQPhHlncdmKDsmSByzzAD4=/42x19:661x483/1200x899/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2F773%2F094%2F19d%2F77309419d4585c2d4a3590623d2e9170.jpg'
    }
  ];

  return (
    <Box sx={{ 
      bgcolor: '#ffffff',
      py: { xs: 6, md: 10 },
      position: 'relative'
    }}>
      <Container maxWidth="xl">
        {/* Header mejorado */}
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            px: 3,
            py: 1,
            borderRadius: 8,
            bgcolor: 'rgba(46, 139, 87, 0.1)',
            border: '1px solid rgba(46, 139, 87, 0.2)'
          }}>
            <Typography sx={{ fontSize: '1.2rem' }}>🌿</Typography>
            <Typography sx={{ 
              color: '#2E8B57', 
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}>
              Explora por Categoría
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ 
            fontWeight: 800, 
            color: '#1a1a1a',
            mb: 2, 
            fontFamily: 'Playfair Display, serif', 
            letterSpacing: '-1px',
            fontSize: { xs: '2rem', md: '2.8rem' }
          }}>
            Nuestras Categorías
          </Typography>
          <Typography sx={{ 
            color: '#666666', 
            fontSize: { xs: '0.95rem', md: '1.05rem' }, 
            maxWidth: 650, 
            mx: 'auto', 
            fontFamily: 'Montserrat, Arial, sans-serif',
            lineHeight: 1.6
          }}>
            Descubre nuestra amplia selección de productos frescos, orgánicos y naturales organizados para tu conveniencia
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' }, 
          gap: { xs: 3, md: 4 }, 
          px: { xs: 2, md: 0 },
          maxWidth: 1000,
          mx: 'auto'
        }}>
        {categories.map((category, index) => (
          <Card key={category.id} elevation={0} sx={{ 
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
              background: index === 0 ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' :
                         index === 1 ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' :
                         index === 2 ? 'linear-gradient(90deg, #8B4513 0%, #a0522d 100%)' :
                         'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
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
          }}>
            {/* Imagen con overlay mejorado */}
            <Box sx={{ 
              width: '100%', 
              height: 180, 
              overflow: 'hidden', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              position: 'relative',
              bgcolor: '#000'
            }}>
              <Box
                className="category-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                  opacity: 0.5,
                  transition: 'opacity 0.4s ease',
                  zIndex: 1
                }}
              />
              <img 
                src={category.image} 
                alt={category.title}
                className="category-image"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} 
              />
              {/* Badge de contador flotante */}
              <Box sx={{
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
              }}>
                <Typography sx={{
                  color: '#2E8B57',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  fontFamily: 'Montserrat, Arial, sans-serif'
                }}>
                  {category.productCount} productos
                </Typography>
              </Box>
            </Box>

            <CardContent sx={{ 
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
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                mb: 1.5, 
                color: '#1a1a1a', 
                fontSize: '1.2rem', 
                fontFamily: 'Playfair Display, serif',
                textAlign: 'center',
                lineHeight: 1.3
              }}>
                {category.title}
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: '#666666', 
                mb: 2.5, 
                textAlign: 'center',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                fontFamily: 'Montserrat, Arial, sans-serif',
                minHeight: 80
              }}>
                {category.description}
              </Typography>

              {/* Features mejorados */}
              <Box sx={{ 
                mb: 2.5, 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                gap: 0.8
              }}>
                {category.features.map((feature, idx) => (
                  <Chip 
                    key={idx} 
                    label={feature} 
                    size="small" 
                    sx={{ 
                      bgcolor: index === 0 ? '#fef3c7' :
                              index === 1 ? '#d1fae5' :
                              index === 2 ? '#fed7aa' : '#dbeafe',
                      color: index === 0 ? '#92400e' :
                             index === 1 ? '#065f46' :
                             index === 2 ? '#7c2d12' : '#1e40af',
                      fontWeight: 600, 
                      borderRadius: 2, 
                      fontSize: '0.7rem',
                      border: '1px solid',
                      borderColor: index === 0 ? '#fde68a' :
                                  index === 1 ? '#a7f3d0' :
                                  index === 2 ? '#fcd34d' : '#bfdbfe',
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

            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              pb: 3,
              px: { xs: 2.5, md: 3 },
              mt: 'auto',
              boxSizing: 'border-box'
            }}>
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
