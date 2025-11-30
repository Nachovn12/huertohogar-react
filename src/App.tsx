import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import ProductDetails from './components/ProductDetails';
import Login from './components/Login';
import Registro from './components/Registro';

import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import OrderManagement from './components/Admin/OrderManagement';
import ProductManagement from './components/Admin/ProductManagement';
import UserManagement from './components/Admin/UserManagement';
import AdminCategories from './components/Admin/AdminCategories';
import AdminReports from './components/Admin/AdminReports';
import AdminProfile from './components/Admin/AdminProfile';

// Importa tu hoja de estilos global
import './styles/App.css';

const AdminRoute: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'Admin';
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <Router basename="/huertohogar-react">
      {/* App Refresh Trigger - Force HMR */}
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="App" style={{ background: '#F7F7F7', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<><Navbar /><Hero /><Categories /><SpecialOffers /><FeaturedProducts /><Mission /><Footer /></>} />
              
              {/* Ruta de Login con Navbar y Footer */}
              <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />

              <Route path="/registro" element={<Registro />} />
              <Route path="/productos" element={<><Navbar /><ProductList /><Footer /></>} />
              <Route path="/productos/:id" element={<><Navbar /><ProductDetails /><Footer /></>} />
              <Route path="/ofertas" element={<><Navbar /><Offers /><Footer /></>} />
              <Route path="/categorias" element={<><Navbar /><CategoriesPage /><Footer /></>} />
              <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
              <Route path="/nosotros" element={<><Navbar /><Nosotros /><Footer /></>} />
              <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />

              <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="ordenes" element={<OrderManagement />} />
                  <Route path="productos" element={<ProductManagement />} />
                  <Route path="usuarios" element={<UserManagement />} />
                  <Route path="categorias" element={<AdminCategories />} />
                  <Route path="reportes" element={<AdminReports />} />
                  <Route path="perfil" element={<AdminProfile />} />
                </Route>
              </Route>

              <Route path="/admin-old" element={<><Navbar /><AdminPanel /><Footer /></>} />
            </Routes>
            <Cart />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;