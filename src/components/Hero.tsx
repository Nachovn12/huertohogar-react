import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, Chip } from '@mui/material';

const Hero: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: { xs: 500, md: 600 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 10, md: 14 },
        pt: { xs: '220px', md: 14 },
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
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: 'none',
          transform: 'translateZ(0)',
          willChange: 'opacity'
        }}
      >
        <source src={`${process.env.PUBLIC_URL}/img/hero-background.mp4`} type="video/mp4" />
      </Box>
      
      {/* Capa overlay mejorada */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(22, 163, 74, 0.75) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Elementos decorativos */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, transparent 70%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Badge superior */}
        <Chip 
          label="🌱 100% Productos Orgánicos Certificados" 
          sx={{ 
            bgcolor: 'rgba(74, 222, 128, 0.2)', 
            color: '#4ade80', 
            fontWeight: 700, 
            mb: 4,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            fontSize: '0.95rem',
            px: 3,
            py: 3
          }} 
        />

        <Typography
          variant="h1"
          sx={{
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: 'Playfair Display, serif',
            mb: 3,
            fontSize: { xs: '2.75rem', md: '4.5rem' },
            letterSpacing: '-2px',
            lineHeight: 1.1,
            textShadow: '2px 4px 8px rgba(0, 0, 0, 0.3)'
          }}
        >
          Del Campo Chileno<br />
          Directo a <span style={{ color: '#4ade80', fontStyle: 'italic' }}>Tu Mesa</span>
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: '#e2e8f0',
            mb: 6,
            fontWeight: 400,
            fontFamily: 'Montserrat, Arial, sans-serif',
            maxWidth: 750,
            mx: 'auto',
            fontSize: { xs: '1.15rem', md: '1.5rem' },
            lineHeight: 1.7,
            textShadow: '1px 2px 4px rgba(0, 0, 0, 0.4)'
          }}
        >
          Productos frescos, orgánicos y llenos de sabor.<br />
          Apoyamos a agricultores locales y promovemos una vida saludable.
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/productos"
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#16a34a',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 50,
              px: 7,
              py: 2.2,
              fontSize: '1.15rem',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.4)',
              transition: 'all 0.3s ease',
              textTransform: 'none',
              fontFamily: 'Montserrat, Arial, sans-serif',
              '&:hover': {
                bgcolor: '#15803d',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 32px rgba(22, 163, 74, 0.5)',
              },
            }}
          >
            Explorar Productos
          </Button>
          <Button
            component={Link}
            to="/ofertas"
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#fff',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 50,
              px: 7,
              py: 2.2,
              fontSize: '1.15rem',
              borderWidth: 2,
              transition: 'all 0.3s ease',
              textTransform: 'none',
              fontFamily: 'Montserrat, Arial, sans-serif',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                borderColor: '#4ade80',
                bgcolor: 'rgba(74, 222, 128, 0.15)',
                borderWidth: 2,
                transform: 'translateY(-3px)',
              },
            }}
          >
            Ver Ofertas
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;