import type { FC } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Mission: FC = () => {
  const navigate = useNavigate();
  
  const values = [
    'Productos 100% orgánicos certificados',
    'Apoyo directo a agricultores locales',
    'Entrega fresca en 24-48 horas',
    'Prácticas sostenibles y ecológicas'
  ];

  return (
    <Box sx={{ 
      bgcolor: '#ffffff',
      py: { xs: 8, md: 12 }
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'center', 
          gap: { xs: 6, md: 8 },
          bgcolor: '#f8fafc',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          {/* Imagen profesional */}
          <Box sx={{ 
            flex: 1,
            width: '100%',
            minHeight: { xs: 350, md: 500 },
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
              alt="Vegetales frescos del campo chileno"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            />
            
            {/* Overlay con gradiente */}
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(22, 163, 74, 0.85) 0%, rgba(22, 163, 74, 0.4) 50%, transparent 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              p: 4
            }}>
              <Box>
                <Typography sx={{
                  color: '#fff',
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  fontWeight: 900,
                  fontFamily: 'Playfair Display, serif',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                  lineHeight: 1.2,
                  mb: 0.5
                }}>
                  Del Campo Chileno
                </Typography>
                <Typography sx={{
                  color: '#dcfce7',
                  fontSize: { xs: '1.4rem', md: '1.6rem' },
                  fontWeight: 600,
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  fontStyle: 'italic',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
                }}>
                  Directo a Tu Mesa
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Contenido */}
          <Box sx={{ 
            flex: 1,
            p: { xs: 4, md: 6 }
          }}>
            {/* Badge */}
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              mb: 3,
              px: 3,
              py: 1,
              borderRadius: 8,
              bgcolor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.2)'
            }}>
              <Typography sx={{ fontSize: '1.1rem' }}>🌱</Typography>
              <Typography sx={{ 
                color: '#16a34a', 
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}>
                Nuestra Misión
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              mb: 3, 
              color: '#1e293b',
              fontFamily: 'Playfair Display, serif',
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
              letterSpacing: '-1px'
            }}>
              Conectando el Campo con Tu Hogar
            </Typography>

            <Typography sx={{ 
              color: '#64748b', 
              mb: 4,
              fontSize: '1.05rem',
              lineHeight: 1.8,
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}>
              En HuertoHogar creemos en un futuro más saludable y sostenible. 
              Trabajamos directamente con agricultores locales para traerte los 
              productos más frescos y nutritivos, mientras apoyamos la economía 
              de nuestras comunidades rurales.
            </Typography>

            {/* Lista de valores */}
            <Box sx={{ mb: 4 }}>
              {values.map((value, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    mb: 2
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ 
                    color: '#16a34a', 
                    fontSize: 24,
                    flexShrink: 0
                  }} />
                  <Typography sx={{ 
                    color: '#475569',
                    fontSize: '1rem',
                    fontWeight: 500,
                    fontFamily: 'Montserrat, Arial, sans-serif'
                  }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CTA */}
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/nosotros')}
              sx={{
                bgcolor: '#16a34a',
                color: '#fff',
                fontWeight: 700,
                px: 5,
                py: 2,
                fontSize: '1.05rem',
                borderRadius: 3,
                textTransform: 'none',
                fontFamily: 'Montserrat, Arial, sans-serif',
                boxShadow: '0 4px 16px rgba(22, 163, 74, 0.3)',
                '&:hover': {
                  bgcolor: '#15803d',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)'
                }
              }}
            >
              Conoce Nuestra Historia
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Mission;
