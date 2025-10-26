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

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Categories />
                <SpecialOffers />
                <FeaturedProducts />
                <Mission />
              </>
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
