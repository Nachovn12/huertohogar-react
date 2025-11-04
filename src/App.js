import React from 'react';
// Asegúrate de importar BrowserRouter como Router
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
import Login from './components/Login'; // Importación del componente Login

// Contextos
import { CartProvider } from './context/CartContext';
// ¡IMPORTACIÓN CLAVE!
import { AuthProvider, useAuth } from './context/AuthContext'; 

// Componentes Admin (Asegúrate de que estas rutas sean correctas)
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './components/Admin/AdminDashboard';
import OrderManagement from './components/Admin/OrderManagement';
import ProductManagement from './components/Admin/ProductManagement';
import UserManagement from './components/Admin/UserManagement';

// ===================================================================
// COMPONENTE DE RUTA PROTEGIDA (Protege el acceso al Admin Layout)
// ===================================================================
const AdminRoute = () => {
    // Usamos useAuth para verificar si el rol es 'admin'
    // Esto funciona porque <AdminRoute> está dentro de <AuthProvider>
    const { isAdmin } = useAuth(); 
    
    // Si el usuario NO es admin, lo redirige a la página de login
    if (!isAdmin) {
        return <Navigate to="/login" replace />; 
    }
    
    // Si es admin, permite que se renderice el contenido anidado (AdminLayout)
    return <Outlet />; 
};


function App() {
    return (
        // 1. <Router> DEBE envolver a AuthProvider
        <Router>
            {/* 2. <AuthProvider> DEBE envolver a CartProvider y Routes */}
            <AuthProvider> 
                <CartProvider>
                    <ScrollToTop />
                    <div className="App" style={{ background: '#F7F7F7', minHeight: '100vh' }}>
                        {/* 3. <Routes> DEBE estar dentro de AuthProvider */}
                        <Routes>
                            {/* ========== RUTAS PÚBLICAS (con Navbar y Footer) ========== */}
                            <Route path="/" element={
                                <>
                                    <Navbar />
                                    <Hero />
                                    <Categories />
                                    <SpecialOffers />
                                    <FeaturedProducts />
                                    <Mission />
                                    <Footer />
                                </>
                            } />

                            {/* Ruta de Login (Renderiza el componente Login) */}
                            {/* Esto funciona porque <Login> está dentro de <AuthProvider> */}
                            <Route path="/login" element={<Login />} />
                            
                            {/* Rutas de Contenido de la Tienda */}
                            <Route path="/productos" element={<><Navbar /><ProductList /><Footer /></>} />
                            <Route path="/productos/:id" element={<><Navbar /><ProductDetails /><Footer /></>} />
                            <Route path="/ofertas" element={<><Navbar /><Offers /><Footer /></>} />
                            <Route path="/categorias" element={<><Navbar /><CategoriesPage /><Footer /></>} />
                            <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
                            <Route path="/nosotros" element={<><Navbar /><Nosotros /><Footer /></>} />
                            <Route path="/blog" element={<><Navbar /><Blog /><Footer /></>} />

                            {/* ========== RUTAS DE ADMINISTRADOR (PROTEGIDAS) ========== */}
                            {/* Usa AdminRoute como elemento para proteger todas las rutas anidadas */}
                            <Route path="/admin" element={<AdminRoute />}>
                                {/* El contenido de AdminLayout se renderiza si el AdminRoute permite el acceso */}
                                <Route element={<AdminLayout />}> 
                                    <Route index element={<AdminDashboard />} />
                                    <Route path="dashboard" element={<AdminDashboard />} />
                                    <Route path="ordenes" element={<OrderManagement />} />
                                    <Route path="productos" element={<ProductManagement />} />
                                    <Route path="usuarios" element={<UserManagement />} />
                                    <Route path="categorias" element={<div style={{padding: '20px'}}>Categorías - Próximamente</div>} />
                                    <Route path="reportes" element={<div style={{padding: '20px'}}>Reportes - Próximamente</div>} />
                                    <Route path="perfil" element={<div style={{padding: '20px'}}>Perfil - Próximamente</div>} />
                                </Route>
                            </Route>

                            {/* Ruta antigua de admin panel (opcional - puedes eliminarla) */}
                            <Route path="/admin-old" element={
                                <>
                                    <Navbar />
                                    <AdminPanel />
                                    <Footer />
                                </>
                            } />
                        </Routes>
                        
                        {/* Cart Offcanvas - Always available */}
                        <Cart />
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

