import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';

const blogPosts = [
  {
    id: 1,
    title: "Beneficios de los Alimentos Orgánicos",
    date: "1 de Noviembre, 2025",
    excerpt: "Descubre por qué elegir alimentos orgánicos es beneficioso para tu salud y el medio ambiente."
  },
  {
    id: 2,
    title: "Cómo Almacenar Frutas y Verduras Frescas",
    date: "28 de Octubre, 2025",
    excerpt: "Consejos prácticos para mantener tus productos frescos por más tiempo."
  },
  {
    id: 3,
    title: "Recetas Saludables con Productos de Temporada",
    date: "25 de Octubre, 2025",
    excerpt: "Ideas deliciosas y nutritivas usando los mejores productos de la estación."
  }
];

const Blog = () => {
  return (
    <Box sx={{ py: 8, bgcolor: '#fafafa' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          textAlign: 'center', 
          fontWeight: 700,
          color: '#2E8B57',
          mb: 6 
        }}>
          Blog HuertoHogar
        </Typography>

        <Grid container spacing={4}>
          {blogPosts.map((post) => (
            <Grid item xs={12} md={4} key={post.id}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ 
                    fontWeight: 600,
                    color: '#2E8B57'
                  }}>
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    {post.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.excerpt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body1" sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
          Próximamente más artículos sobre alimentación saludable y sostenible
        </Typography>
      </Container>
    </Box>
  );
};

export default Blog;
