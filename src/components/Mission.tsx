import type { FC } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const Mission: FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ 
      bgcolor: '#f0f9f4',
      background: 'linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%)',
      py: { xs: 8, md: 12 },
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46, 139, 87, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-50%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 69, 19, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          bgcolor: '#ffffff', 
          py: { xs: 6, md: 10 }, 
          px: { xs: 3, md: 8 }, 
          borderRadius: 5,
          border: '2px solid #f0f0f0',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #2E8B57 0%, #8B4513 50%, #FFD700 100%)'
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: 'center', 
            gap: { xs: 5, md: 8 } 
          }}>
            <Box sx={{ flex: 2 }}>
              {/* Badge */}
              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                px: 2.5,
                py: 0.8,
                borderRadius: 8,
                bgcolor: 'rgba(46, 139, 87, 0.1)',
                border: '1px solid rgba(46, 139, 87, 0.2)'
              }}>
                <Typography sx={{ fontSize: '1rem' }}>🌱</Typography>
                <Typography sx={{ 
                  color: '#2E8B57', 
                  fontWeight: 700,
                  fontSize: '0.8rem',
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
                color: '#1a1a1a',
                fontFamily: 'Playfair Display, serif',
                fontSize: { xs: '2rem', md: '2.5rem' },
                letterSpacing: '-1px',
                lineHeight: 1.2
              }}>
                Conectarte con la{' '}
                <span style={{ 
                  background: 'linear-gradient(135deg, #2E8B57 0%, #34d399 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Tierra
                </span>
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: '#666666', 
                mb: 4, 
                fontFamily: 'Montserrat, Arial, sans-serif',
                fontSize: '1.05rem',
                lineHeight: 1.8
              }}>
                Proporcionar productos <strong style={{ color: '#2E8B57' }}>frescos y de calidad</strong> directamente desde el campo chileno 
                hasta tu hogar, garantizando frescura y sabor en cada entrega. Apoyamos a 
                agricultores locales y promovemos prácticas <strong style={{ color: '#8B4513' }}>sostenibles</strong> para una vida saludable.
              </Typography>

              <Button 
                variant="contained" 
                size="large" 
                sx={{ 
                  bgcolor: '#2E8B57', 
                  color: '#fff', 
                  fontWeight: 700, 
                  borderRadius: 3, 
                  boxShadow: '0 6px 20px rgba(46, 139, 87, 0.35)', 
                  textTransform: 'none',
                  px: 5,
                  py: 1.8,
                  fontSize: '1.05rem',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.6s ease'
                  },
                  '&:hover': { 
                    bgcolor: '#257d4a',
                    boxShadow: '0 8px 28px rgba(46, 139, 87, 0.5)',
                    transform: 'translateY(-3px)',
                    '&::before': {
                      left: '100%'
                    }
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/nosotros')}
              >
                Conoce Más Sobre Nosotros
              </Button>
            </Box>

            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%)',
                borderRadius: '50%',
                p: 5,
                boxShadow: '0 10px 40px rgba(46, 139, 87, 0.25)',
                border: '4px solid #ffffff',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  borderRadius: '50%',
                  border: '2px dashed rgba(46, 139, 87, 0.3)',
                  animation: 'rotate 20s linear infinite'
                },
                '@keyframes rotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}>
                <AgricultureIcon sx={{ 
                  fontSize: 100, 
                  color: '#2E8B57'
                }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Mission;
