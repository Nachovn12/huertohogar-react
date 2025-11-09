import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';

const tiendas = [
  { ciudad: 'Santiago', direccion: 'Av. Providencia 1234, Providencia' },
  { ciudad: 'Puerto Montt', direccion: 'Av. Diego Portales 567, Puerto Montt' },
  { ciudad: 'Villarrica', direccion: 'Av. Bernardo O’Higgins 890, Villarrica' },
  { ciudad: 'Nacimiento', direccion: 'Av. Manuel Rodríguez 234, Nacimiento' },
  { ciudad: 'Viña del Mar', direccion: 'Av. Libertad 456, Viña del Mar' },
  { ciudad: 'Valparaíso', direccion: 'Av. Argentina 789, Valparaíso' },
  { ciudad: 'Concepción', direccion: 'Av. Pedro de Valdivia 321, Concepción' },
  { ciudad: 'La Serena', direccion: 'Av. Francisco de Aguirre 654, La Serena' },
  { ciudad: 'Antofagasta', direccion: 'Av. Argentina 987, Antofagasta' },
];

const Nosotros = () => {
  return (
    <Box sx={{ py: { xs: 3, md: 6 }, bgcolor: '#F7F7F7', fontFamily: 'Montserrat, Arial, sans-serif' }}>
      <Container maxWidth="md">
        {/* Hero / Intro */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, mb: 6, bgcolor: '#f3f6f4', borderRadius: 4, boxShadow: '0 8px 32px rgba(46,139,87,0.08)' }}>
          <Typography variant="h2" sx={{ textAlign: 'center', fontWeight: 700, color: '#2E8B57', fontFamily: 'Playfair Display, serif', mb: 2, letterSpacing: '-1px', fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Conectamos el Campo Chileno Contigo
          </Typography>
          <Typography sx={{ textAlign: 'center', color: '#666', fontSize: { xs: '1rem', md: '1.15rem' }, maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
            HuertoHogar es una tienda online dedicada a llevar la frescura y calidad de los productos del campo directamente a la puerta de nuestros clientes en Chile. Con más de 6 años de experiencia, operamos en más de 9 puntos a lo largo del país, incluyendo ciudades clave como Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar, Valparaíso y Concepción. Nuestra misión es conectar a las familias chilenas con el campo, promoviendo un estilo de vida saludable y sostenible.
          </Typography>
        </Paper>

        {/* Misión y Visión */}
        <Grid container spacing={4} sx={{ mb: 6, maxWidth: 900, mx: 'auto' }} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, textAlign: 'center', boxShadow: '0 8px 32px rgba(46,139,87,0.10)', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#eafbe7', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, boxShadow: '0 8px 20px rgba(46,139,87,0.15)' }}>
                <span style={{ fontSize: 38, color: '#2E8B57' }}>🌱</span>
              </Box>
              <Typography variant="h3" sx={{ color: '#2E8B57', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif', mb: 2, fontSize: { xs: '1.3rem', md: '1.7rem' } }}>
                Nuestra Misión
              </Typography>
              <Typography sx={{ color: '#666', fontSize: { xs: '0.98rem', md: '1.08rem' }, lineHeight: 1.7, textAlign: 'center' }}>
                Nuestra misión es proporcionar productos frescos y de calidad directamente desde el campo hasta la puerta de nuestros clientes, garantizando la frescura y el sabor en cada entrega. Nos comprometemos a fomentar una conexión más cercana entre los consumidores y los agricultores locales, apoyando prácticas agrícolas sostenibles y promoviendo una alimentación saludable en todos los hogares chilenos.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, textAlign: 'center', boxShadow: '0 8px 32px rgba(46,139,87,0.10)', minHeight: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: '#eafbe7', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, boxShadow: '0 8px 20px rgba(46,139,87,0.15)' }}>
                <PublicIcon sx={{ color: '#2E8B57', fontSize: 38 }} />
              </Box>
              <Typography variant="h3" sx={{ color: '#2E8B57', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif', mb: 2, fontSize: { xs: '1.3rem', md: '1.7rem' } }}>
                Nuestra Visión
              </Typography>
              <Typography sx={{ color: '#666', fontSize: { xs: '0.98rem', md: '1.08rem' }, lineHeight: 1.7, textAlign: 'center' }}>
                Nuestra visión es ser la tienda online líder en la distribución de productos frescos y naturales en Chile, reconocida por nuestra calidad excepcional, servicio al cliente y compromiso con la sostenibilidad. Aspiramos a expandir nuestra presencia a nivel nacional e internacional, estableciendo un nuevo estándar en la distribución de productos agrícolas directos del productor al consumidor.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Mapa embebido */}
        <Paper elevation={3} sx={{ mb: 6, borderRadius: 4, overflow: 'hidden', boxShadow: '0 8px 32px rgba(46,139,87,0.12)', border: '2px solid #e9ecef', p: { xs: 2, md: 4 } }}>
          <Typography variant="h3" sx={{ textAlign: 'center', color: '#2E8B57', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif', mb: 2, fontSize: { xs: '1.3rem', md: '1.7rem' } }}>
            Nuestras Tiendas
          </Typography>
          <Typography sx={{ textAlign: 'center', color: '#666', mb: 2, fontSize: { xs: '0.98rem', md: '1.08rem' } }}>
            Operamos en más de 9 puntos a lo largo del país, incluyendo Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar, Valparaíso y Concepción.
          </Typography>
          <Box sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 2px 8px rgba(46,139,87,0.08)' }}>
            <iframe
              title="Mapa HuertoHogar"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-75.0%2C-40.0%2C-68.0%2C-32.0&layer=mapnik"
              style={{ width: '100%', height: '350px', border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Box>
        </Paper>

        {/* Ubicaciones de tiendas */}
        <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, mb: 2, boxShadow: '0 8px 32px rgba(46,139,87,0.10)' }}>
          <Typography variant="h3" sx={{ textAlign: 'center', color: '#2E8B57', fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif', mb: 2, fontSize: { xs: '1.3rem', md: '1.7rem' } }}>
            Ubicaciones de Nuestras Tiendas
          </Typography>
          <Typography sx={{ textAlign: 'center', color: '#666', fontSize: '1rem', mb: 3, fontStyle: 'italic' }}>
            Haz clic en cualquier tienda para verla en el mapa
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {tiendas.map((tienda, idx) => (
              <Grid item xs={12} sm={6} md={4} key={tienda.ciudad}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, mb: 1, bgcolor: '#fff', boxShadow: '0 1px 6px rgba(46,139,87,0.07)', cursor: 'pointer', transition: 'all 0.3s', '&:hover': { boxShadow: '0 8px 20px rgba(46,139,87,0.15)', borderColor: '#2E8B57', transform: 'translateY(-3px)' } }}>
                  <LocationOnIcon sx={{ color: '#2E8B57', fontSize: 28 }} />
                  <Box>
                    <Typography sx={{ color: '#2E8B57', fontWeight: 700, fontSize: '1.08rem' }}>{tienda.ciudad}</Typography>
                    <Typography sx={{ color: '#333', fontSize: '0.98rem' }}>{tienda.direccion}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Nosotros;
