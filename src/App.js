import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import SpecialOffers from './components/SpecialOffers';
import FeaturedProducts from './components/FeaturedProducts';
import Mission from './components/Mission';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Nosotros from './components/Nosotros';
import Blog from './components/Blog';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import ProductDetails from './components/ProductDetails';
import InicioCard from './components/InicioCard';
import Box from '@mui/material/Box';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', bgcolor: '#fff' }}>
                <Hero />
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mt: { xs: 1, md: 3 }, mb: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
                  <InicioCard title="Calidad Orgánica" description="Solo productos certificados y frescos, directo del campo a tu mesa." icon={<span role="img" aria-label="hoja">🌱</span>} />
                  <InicioCard title="Envíos Rápidos" description="Recibe tu pedido en menos de 24 horas en la RM y hasta 48h en regiones." icon={<span role="img" aria-label="camión">🚚</span>} />
                  <InicioCard title="Ofertas Exclusivas" description="Descuentos especiales cada semana en productos seleccionados." icon={<span role="img" aria-label="descuento">💸</span>} />
                </Box>
                <Categories />
                <SpecialOffers />
                <FeaturedProducts />
                <Mission />
              </Box>
            } />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/productos/:id" element={<ProductDetails />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
