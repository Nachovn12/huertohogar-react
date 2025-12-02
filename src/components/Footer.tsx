import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import RoomIcon from '@mui/icons-material/Room';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';

const Footer: React.FC<{ noMargin?: boolean }> = ({ noMargin = false }) => {
  return (
    <Box component="footer" sx={{
      bgcolor: '#f8f9fa',
      color: '#1a1a1a',
      pt: { xs: 6, md: 8 },
      pb: 3,
      mt: noMargin ? 0 : { xs: 8, md: 12 },
      borderTop: '3px solid #2E8B57',
    }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, gap: { xs: 4, md: 5 }, mb: 5 }}>
          {/* Columna 1: Marca y newsletter */}
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              mb: 2, 
              color: '#1a1a1a',
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontSize: '1.5rem',
              letterSpacing: '-0.5px'
            }}>
              Huerto<span style={{ color: '#2E8B57' }}>Hogar</span>
            </Typography>
            <Typography variant="body2" sx={{ 
              mb: 3, 
              color: '#6b7280', 
              lineHeight: 1.7,
              fontSize: '0.95rem'
            }}>
              Productos frescos, locales y sostenibles para tu hogar. Conectamos el campo chileno con tu mesa.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
              <IconButton 
                href="https://instagram.com" 
                target="_blank" 
                sx={{ 
                  color: '#2E8B57', 
                  bgcolor: 'rgba(46, 139, 87, 0.08)', 
                  borderRadius: 2,
                  border: '1px solid rgba(46, 139, 87, 0.2)',
                  '&:hover': { 
                    bgcolor: '#2E8B57',
                    color: '#fff',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  } 
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                href="https://facebook.com" 
                target="_blank" 
                sx={{ 
                  color: '#2E8B57', 
                  bgcolor: 'rgba(46, 139, 87, 0.08)', 
                  borderRadius: 2,
                  border: '1px solid rgba(46, 139, 87, 0.2)',
                  '&:hover': { 
                    bgcolor: '#2E8B57',
                    color: '#fff',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  } 
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                href="mailto:info@huertohogar.com" 
                sx={{ 
                  color: '#2E8B57', 
                  bgcolor: 'rgba(46, 139, 87, 0.08)', 
                  borderRadius: 2,
                  border: '1px solid rgba(46, 139, 87, 0.2)',
                  '&:hover': { 
                    bgcolor: '#2E8B57',
                    color: '#fff',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  } 
                }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ 
                mb: 1.5, 
                color: '#1a1a1a', 
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                Recibe novedades y ofertas
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                bgcolor: '#ffffff', 
                borderRadius: 2, 
                overflow: 'hidden', 
                maxWidth: 360,
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <InputBase 
                  placeholder="Tu email" 
                  sx={{ 
                    px: 2, 
                    py: 1.2, 
                    flex: 1, 
                    color: '#1a1a1a', 
                    fontSize: '0.95rem',
                    '&::placeholder': { color: '#9ca3af' }
                  }} 
                />
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: '#2E8B57', 
                    color: '#fff', 
                    borderRadius: 0, 
                    px: 3, 
                    fontWeight: 600, 
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    boxShadow: 'none',
                    '&:hover': { 
                      bgcolor: '#257d4a',
                      boxShadow: 'none'
                    } 
                  }}
                >
                  Suscribirse
                </Button>
              </Box>
            </Box>
          </Box>
          {/* Columna 2: Navegación */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 700, 
              mb: 2, 
              color: '#1a1a1a',
              fontSize: '1.05rem',
              letterSpacing: '-0.3px'
            }}>
              Navegación
            </Typography>
            <Link href="/" color="#6b7280" underline="hover" sx={{ display: 'block', mb: 1.2, fontSize: '0.95rem', '&:hover': { color: '#2E8B57' } }}>Inicio</Link>
            <Link href="/productos" color="#6b7280" underline="hover" sx={{ display: 'block', mb: 1.2, fontSize: '0.95rem', '&:hover': { color: '#2E8B57' } }}>Productos</Link>
            <Link href="/nosotros" color="#6b7280" underline="hover" sx={{ display: 'block', mb: 1.2, fontSize: '0.95rem', '&:hover': { color: '#2E8B57' } }}>Nosotros</Link>
            <Link href="/blog" color="#6b7280" underline="hover" sx={{ display: 'block', mb: 1.2, fontSize: '0.95rem', '&:hover': { color: '#2E8B57' } }}>Blog</Link>
          </Box>
          {/* Columna 3: Enlaces útiles */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 700, 
              mb: 2, 
              color: '#1a1a1a',
              fontSize: '1.05rem',
              letterSpacing: '-0.3px'
            }}>
              Enlaces Útiles
            </Typography>
            <Link href="/ofertas" color="#6b7280" underline="hover" sx={{ display: 'block', mb: 1.2, fontSize: '0.95rem', '&:hover': { color: '#2E8B57' } }}>Ofertas</Link>
            <Link href="/categorias" color="#6b7280" underline="hover" sx={{ display: 'block', mb: 1.2, fontSize: '0.95rem', '&:hover': { color: '#2E8B57' } }}>Categorías</Link>
            <Link href="/recetas" color="#6b7280" underline="hover" sx={{ display: 'block', mb: 1.2, fontSize: '0.95rem', '&:hover': { color: '#2E8B57' } }}>Recetas</Link>
            <Link href="/impacto" color="#6b7280" underline="hover" sx={{ display: 'block', mb: 1.2, fontSize: '0.95rem', '&:hover': { color: '#2E8B57' } }}>Impacto Ambiental</Link>
          </Box>
          {/* Columna 4: Contacto */}
          <Box>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 700, 
              mb: 2, 
              color: '#1a1a1a',
              fontSize: '1.05rem',
              letterSpacing: '-0.3px'
            }}>
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.2 }}>
              <RoomIcon sx={{ fontSize: 18, color: '#2E8B57' }} />
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.95rem' }}>Concepción, Chile</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.2 }}>
              <EmailIcon sx={{ fontSize: 18, color: '#2E8B57' }} />
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.95rem' }}>contacto@huertohogar.cl</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.2 }}>
              <LocalPhoneIcon sx={{ fontSize: 18, color: '#2E8B57' }} />
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.95rem' }}>+56 9 1234 5678</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <AccessTimeIcon sx={{ fontSize: 18, color: '#2E8B57' }} />
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.95rem' }}>Lun a Sáb: 8:00 - 20:00</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: 4, bgcolor: '#e5e7eb' }} />
        <Box sx={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          fontSize: '0.9rem',
          letterSpacing: 0.3
        }}>
          © {new Date().getFullYear()} HuertoHogar. Todos los derechos reservados.
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
