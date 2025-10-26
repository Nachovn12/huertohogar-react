
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import { Box, Typography, Grid, Button, Stack } from '@mui/material';

const ProductList = () => {
  const [filter, setFilter] = useState('all');

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
    <Box sx={{ py: 8, bgcolor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ color: '#27ae60', fontWeight: 700, mb: 4, textAlign: 'center', fontFamily: 'Montserrat, Arial, sans-serif' }}>
        Nuestros Productos
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4, flexWrap: 'wrap' }}>
        {categories.map(category => (
          <Button
            key={category.key}
            variant={filter === category.key ? 'contained' : 'outlined'}
            sx={{ bgcolor: filter === category.key ? '#27ae60' : '#fff', color: filter === category.key ? '#fff' : '#27ae60', borderRadius: 2, fontWeight: 600, borderColor: '#27ae60', textTransform: 'none' }}
            onClick={() => setFilter(category.key)}
          >
            {category.label}
          </Button>
        ))}
      </Stack>
      <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto' }}>
        <Grid container spacing={3} justifyContent="center">
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: 260 }}>
                <ProductCard product={product} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" sx={{ color: '#27ae60', mb: 2 }}>No hay productos en esta categoría</Typography>
          <Typography variant="body1">Intenta con otra categoría</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProductList;
