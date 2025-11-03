import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Nosotros = () => {
  return (
    <Box sx={{ py: 8, bgcolor: '#fafafa' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          textAlign: 'center', 
          fontWeight: 700,
          color: '#2E8B57',
          mb: 4 
        }}>
          Sobre Nosotros
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          Nuestra Historia
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          HuertoHogar nace de la pasión por conectar a las familias chilenas con productos frescos, 
          orgánicos y de calidad directamente desde los huertos locales. Creemos en la agricultura 
          sostenible y en apoyar a los productores de nuestra tierra.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          Nuestra Misión
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          Facilitar el acceso a alimentos frescos y saludables, promoviendo un estilo de vida más 
          natural y consciente, mientras apoyamos a los agricultores locales y cuidamos el medio ambiente.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
          Nuestros Valores
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          - <strong>Calidad:</strong> Seleccionamos cuidadosamente cada producto<br/>
          - <strong>Frescura:</strong> De la huerta a tu hogar en el menor tiempo posible<br/>
          - <strong>Sostenibilidad:</strong> Prácticas agrícolas responsables con el medio ambiente<br/>
          - <strong>Comunidad:</strong> Apoyo directo a productores locales
        </Typography>
      </Container>
    </Box>
  );
};

export default Nosotros;
