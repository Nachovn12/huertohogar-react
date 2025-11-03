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
import Offers from './components/Offers';
import CategoriesPage from './components/CategoriesPage';
import AdminPanel from './components/Admin/AdminPanel';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="App" style={{ background: '#F7F7F7', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                {/* Hero/banner principal */}
                <Hero />
                {/* Sección de categorías */}
                <Categories />
                {/* Ofertas exclusivas */}
                <SpecialOffers />
                {/* Productos destacados */}
                <FeaturedProducts />
                {/* Nuestra misión */}
                <Mission />
              </>
            } />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/productos/:id" element={<ProductDetails />} />
            <Route path="/ofertas" element={<Offers />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
          <Footer />
          {/* Cart Offcanvas - Always available */}
          <Cart />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
