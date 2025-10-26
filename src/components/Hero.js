
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Hero = () => (
  <Box sx={{ bgcolor: '#f7faf7', py: { xs: 6, md: 10 }, textAlign: 'center' }}>
    <Typography variant="h2" sx={{ fontWeight: 700, color: '#27ae60', fontFamily: 'Montserrat, Arial, sans-serif', mb: 3 }}>
      Bienvenido a HuertoHogar
    </Typography>
    <Typography variant="h5" sx={{ color: '#333', mb: 4 }}>
      Productos frescos, orgánicos y llenos de sabor, seleccionados para ti
    </Typography>
    <Button href="/productos" variant="contained" size="large" sx={{ bgcolor: '#27ae60', color: '#fff', fontWeight: 700, borderRadius: 2, px: 5, py: 2, fontSize: '1.2rem', boxShadow: 2 }}>
      Ver Productos
    </Button>
  </Box>
);

export default Hero;
