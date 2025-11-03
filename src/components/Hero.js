import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const Hero = () => (
  <Box
    sx={{
      minHeight: { xs: 400, md: 480 },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      py: { xs: 10, md: 14 },
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* Video de fondo */}
    <Box
      component="video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.6,
        zIndex: 0,
        pointerEvents: 'none',
        transform: 'translateZ(0)',
        willChange: 'opacity'
      }}
    >
      <source src="/img/hero-background.mp4" type="video/mp4" />
    </Box>
    
    {/* Capa overlay con gradiente para legibilidad del texto */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(46, 139, 87, 0.3) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          color: '#ffffff',
          fontFamily: 'Playfair Display, serif',
          mb: 2,
          fontSize: { xs: '2rem', md: '3rem' },
          letterSpacing: '-0.5px',
          lineHeight: 1.2,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}
      >
        Bienvenido a <span style={{ color: '#FFD700' }}>HuertoHogar</span>
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: '#f5f5f5',
          mb: 4,
          fontWeight: 400,
          fontFamily: 'Montserrat, Arial, sans-serif',
          maxWidth: 650,
          mx: 'auto',
          fontSize: { xs: '1.1rem', md: '1.3rem' },
          lineHeight: 1.6,
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.4)'
        }}
      >
        Productos frescos, orgánicos y llenos de sabor,<br />
        seleccionados para ti
      </Typography>
      <Button
        href="/productos"
        variant="contained"
        size="large"
        sx={{
          bgcolor: '#2E8B57',
          color: '#fff',
          fontWeight: 600,
          borderRadius: 2,
          px: 6,
          py: 1.8,
          fontSize: '1.05rem',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          fontFamily: 'Montserrat, Arial, sans-serif',
          '&:hover': {
            bgcolor: '#257d4a',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        Ver Productos
      </Button>
    </Container>
  </Box>
);

export default Hero;
