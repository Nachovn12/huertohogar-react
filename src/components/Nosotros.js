
import React from "react";
import { Card, CardContent, Typography, Box, Divider, List, ListItem, ListItemIcon, ListItemText, Grid, Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const themeColor = '#27ae60'; // Verde HelloFresh

const missionItems = [
  "Frescura garantizada — Seleccionamos productos directamente desde el origen.",
  "Comercio justo — Apoyamos prácticas sostenibles y a pequeños productores.",
  "Compromiso — Entregas responsables y atención personalizada."
];

const valores = [
  { titulo: "Sostenibilidad", texto: "Promovemos prácticas agrícolas sostenibles que respetan el medio ambiente." },
  { titulo: "Calidad", texto: "Seleccionamos cuidadosamente cada producto para garantizar la mejor calidad." },
  { titulo: "Comunidad", texto: "Apoyamos a los agricultores locales y fortalecemos la economía regional." },
  { titulo: "Salud", texto: "Promovemos una alimentación saludable y consciente para toda la familia." }
];

const equipo = [
  { nombre: "Ignacio @Nachovn12", rol: "Desarrollador Frontend", desc: "Especialista en desarrollo web con React, responsable de crear una experiencia de usuario excepcional en nuestra plataforma." },
  { nombre: "Benjamin @BenjaFlores379", rol: "Desarrollador Backend", desc: "Experto en desarrollo backend, encargado de la infraestructura y lógica de negocio que hace posible nuestra plataforma." }
];

const Nosotros = () => (
  <Box sx={{ bgcolor: '#f7faf7', py: 6 }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
      <Typography variant="h3" sx={{ color: themeColor, fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif' }}>
        Sobre Nosotros
      </Typography>
    </Box>
    <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mb: 5 }}>
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 3, borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Nuestra Historia</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              HuertoHogar nació de la pasión por conectar el campo chileno con las familias, llevando productos frescos y de calidad directamente a tu hogar.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Desde nuestros inicios, hemos trabajado directamente con agricultores locales para ofrecerte la mejor selección de frutas, verduras y productos orgánicos, garantizando frescura y sabor auténtico en cada entrega.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ boxShadow: 3, borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: themeColor }}>Nuestra Misión</Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {missionItems.map((item, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: themeColor }} />
                  </ListItemIcon>
                  <ListItemText primary={item} sx={{ fontFamily: 'Montserrat, Arial, sans-serif', fontSize: '1.1rem' }} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 3, color: themeColor }}>Nuestros Valores</Typography>
      <Grid container spacing={4} justifyContent="center">
        {valores.map((val, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ boxShadow: 2, borderRadius: 3, textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{val.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{val.texto}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 3, color: themeColor }}>Nuestro Equipo</Typography>
      <Grid container spacing={4} justifyContent="center">
        {equipo.map((persona, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Card sx={{ boxShadow: 2, borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{persona.nombre}</Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>{persona.rol}</Typography>
                <Typography variant="body2">{persona.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      <Card sx={{ bgcolor: themeColor, color: '#fff', borderRadius: 3, boxShadow: 4, width: '100%', maxWidth: 600 }}>
        <CardContent sx={{ textAlign: 'center', p: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>¿Quieres Conocernos Mejor?</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Únete a nuestra comunidad y descubre más sobre nuestros productos y valores.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="inherit" sx={{ fontWeight: 700, borderRadius: 2 }}>Ver Nuestros Productos</Button>
            <Button variant="outlined" color="inherit" sx={{ fontWeight: 700, borderRadius: 2 }}>Contactar</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

export default Nosotros;
