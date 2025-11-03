
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import { Box, Typography, Grid, Button, Container } from '@mui/material';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get('categoria') || 'all');

  useEffect(() => {
    const categoria = searchParams.get('categoria');
    if (categoria) {
      setFilter(categoria);
    }
  }, [searchParams]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: newFilter });
    }
  };

  const categories = [
    { key: 'all', label: 'Todos' },
    { key: 'frutas', label: 'Frutas Frescas' },
    { key: 'verduras', label: 'Verduras Orgánicas' },
    { key: 'organicos', label: 'Productos Orgánicos' },
    { key: 'lacteos', label: 'Productos Lácteos' }
  ];

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(product => product.category === filter);

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#F7F7F7', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#8B4513', 
              fontWeight: 700, 
              mb: 2, 
              fontFamily: 'Playfair Display, serif',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              letterSpacing: '-0.5px'
            }}
          >
            Nuestros Productos
          </Typography>
          <Typography 
            sx={{ 
              color: '#666666', 
              fontSize: '1.05rem', 
              maxWidth: 700, 
              mx: 'auto', 
              fontFamily: 'Montserrat, Arial, sans-serif',
              mb: 4
            }}
          >
            Descubre nuestra selección de productos frescos, orgánicos y llenos de sabor
          </Typography>
        </Box>

        {/* Filtros de categorías */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 6,
          flexWrap: 'wrap',
          gap: 1.5
        }}>
          {categories.map(category => (
            <Button
              key={category.key}
              variant={filter === category.key ? 'contained' : 'outlined'}
              sx={{ 
                bgcolor: filter === category.key ? '#2E8B57' : '#fff', 
                color: filter === category.key ? '#fff' : '#2E8B57', 
                borderRadius: 3, 
                fontWeight: 600, 
                borderColor: '#2E8B57',
                px: 3,
                py: 1,
                fontSize: '0.9rem',
                textTransform: 'none',
                fontFamily: 'Montserrat, Arial, sans-serif',
                boxShadow: filter === category.key ? '0 2px 8px rgba(46, 139, 87, 0.3)' : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: filter === category.key ? '#257d4a' : 'rgba(46, 139, 87, 0.08)',
                  borderColor: '#2E8B57',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(46, 139, 87, 0.2)'
                }
              }}
              onClick={() => handleFilterChange(category.key)}
            >
              {category.label}
            </Button>
          ))}
        </Box>

        {/* Grid de productos - 3 columnas FIJAS */}
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 } }}>
          <Grid 
            container 
            spacing={3}
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)' 
              },
              gap: 3
            }}
          >
            {filteredProducts.map((product) => {
              // Orden personalizado según la imagen
              let orderValue = 1;
              
              if (product.id === 'FR001') orderValue = 1; // Manzanas - Fila 1, Col 1
              if (product.id === 'OR001') orderValue = 2; // Quinua - Fila 1, Col 2
              if (product.id === 'VR002') orderValue = 3; // Espinacas - Fila 1, Col 3
              if (product.id === 'FR003') orderValue = 4; // Plátanos - Fila 2, Col 1
              if (product.id === 'LC001') orderValue = 5; // Leche - Fila 2, Col 2
              if (product.id === 'OR002') orderValue = 6; // Miel - Fila 2, Col 3
              if (product.id === 'FR002') orderValue = 7; // Naranjas - Fila 3, Col 1
              if (product.id === 'VR001') orderValue = 8; // Zanahorias - Fila 3, Col 2
              if (product.id === 'VR003') orderValue = 9; // Pimientos - Fila 3, Col 3
              
              return (
                <Box
                  key={product.id}
                  sx={{
                    order: orderValue
                  }}
                >
                  <ProductCard product={product} />
                </Box>
              );
            })}
          </Grid>
        </Box>

        {/* Mensaje cuando no hay productos */}
        {filteredProducts.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 8, 
            py: 6,
            bgcolor: '#fff',
            borderRadius: 3,
            mx: { xs: 2, md: 0 }
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#8B4513', 
                mb: 2,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 600
              }}
            >
              No hay productos en esta categoría
            </Typography>
            <Typography 
              variant="body1"
              sx={{
                color: '#666666',
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}
            >
              Intenta con otra categoría para ver más productos
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ProductList;
