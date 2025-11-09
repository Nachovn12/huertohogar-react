import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FormControl } from 'react-bootstrap';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Navbar.css';

const menuLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Productos', to: '/productos' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Blog', to: '/blog' }
];

const Navbar = () => {
  const { getTotalItems, toggleCart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [adminBrowsing, setAdminBrowsing] = useState(false);

  // total items in cart
  const cartItemsCount = getTotalItems ? getTotalItems() : 0;

  useEffect(() => {
    try {
      const flag = localStorage.getItem('adminBrowsing') === 'true';
      setAdminBrowsing(flag);
    } catch (e) {
      setAdminBrowsing(false);
    }
  }, [location]);
 

  // Manejar scroll para efectos del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.main-nav') && !e.target.closest('.hamburger')) {
        setIsMenuOpen(false);
      }
      if (isUserMenuOpen && !e.target.closest('.user-profile')) {
        setIsUserMenuOpen(false);
      }
      if (showSearchDropdown && !e.target.closest('.search-bar')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, isUserMenuOpen, showSearchDropdown]);

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchDropdown(value.length > 0);
  };

  const handleLogoutLocal = () => {
    // useAuth provider also exposes logout; call it if available
    try { if (logout) logout(); } catch (e) {}
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const suggestions = [
    'Tomate orgánico',
    'Lechuga fresca',
    'Zanahoria orgánica',
    'Manzana roja',
    'Quinua orgánica'
  ];

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Barra de información superior */}


      {/* Header principal */}
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          {/* Logo HuertoHogar */}
          <Link to="/" className="logo-container">
            <img 
              src="/img/Logo_HuertoHogar_Web.png" 
              alt="HuertoHogar - Del Campo al Hogar" 
              className="logo"
            />
            <h2 className="logo-title">HuertoHogar</h2>
          </Link>
          
          {/* Si el admin está navegando la tienda mostramos botón para volver al panel */}
          {isAdmin || adminBrowsing ? (
            <button
              onClick={() => {
                // Limpiar bandera y regresar al dashboard
                try { localStorage.removeItem('adminBrowsing'); } catch (e) {}
                navigate('/admin/dashboard');
              }}
              style={{
                background: '#2E8B57',
                color: '#fff',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Volver al Panel
            </button>
          ) : null}

          {/* Menú hamburguesa (móvil) */}
          <button 
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navegación principal */}
          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-home"></i> Inicio
            </Link>
            <Link to="/productos" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-shopping-basket"></i> Productos
            </Link>
            <Link to="/nosotros" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-leaf"></i> Nosotros
            </Link>
            <Link to="/blog" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-newspaper"></i> Blog
            </Link>
            
          </nav>

          {/* Acciones del header */}
          <div className="header-actions">
            {/* Barra de búsqueda */}
            <form className="search-bar" onSubmit={handleSearch}>
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
              />
              
              {/* Dropdown de búsqueda */}
              {showSearchDropdown && filteredSuggestions.length > 0 && (
                <div className="search-dropdown show">
                  {filteredSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="suggestion-text"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSearchDropdown(false);
                        navigate(`/productos?search=${encodeURIComponent(suggestion)}`);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Usuario / Login */}
            {user ? (
              <div className="user-profile">
                <span 
                  className="user-name"
                  onClick={toggleUserMenu}
                >
                  {user.name || user.email}
                </span>
                <div className={`user-menu ${isUserMenuOpen ? 'show' : ''}`}>
                  <Link to="/perfil" className="user-menu-item">
                    <i className="fas fa-user"></i> Mi Perfil
                  </Link>
                  <Link to="/mis-pedidos" className="user-menu-item">
                    <i className="fas fa-box"></i> Mis Pedidos
                  </Link>
                  <button 
                    className="user-menu-item logout-btn"
                    onClick={handleLogoutLocal}
                  >
                    <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="login-link"
                onClick={() => navigate('/login')}
              >
                <i className="fas fa-user"></i> Iniciar Sesión
              </button>
            )}

            {/* Carrito */}
            <button 
              className="cart-button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Carrito de compras"
            >
              <ShoppingCartIcon style={{ fontSize: '1.7rem' }} />
              {cartItemsCount > 0 && (
                <span className="cart-counter">{cartItemsCount}</span>
              )}
            </button>
          </div>
        </div>
        {/* Drawer lateral del carrito */}
        {cartDrawerOpen && (
          <div className="cart-drawer-overlay" onClick={() => setCartDrawerOpen(false)}></div>
        )}
        <aside className={`cart-drawer${cartDrawerOpen ? ' open' : ''}`}>
          <div className="cart-drawer-header-gradient">
            <h2 className="cart-title">Tu Carrito</h2>
            <button className="close-cart" onClick={() => setCartDrawerOpen(false)} aria-label="Cerrar carrito">
              <span>&times;</span>
            </button>
          </div>
          <div className="cart-drawer-content">
            <div className="cart-empty">
              <svg className="cart-empty-icon" width="80" height="80" viewBox="0 0 24 24" fill="none"><path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm1.83-2l1.72-7.45A1 1 0 0 0 19.56 7H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44A1.992 1.992 0 0 0 7 20h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 16h7.45c.75 0 1.41-.41 1.75-1.03z" fill="#d1d5db"/></svg>
              <h3 className="cart-empty-title">Tu carrito está vacío</h3>
              <p className="cart-empty-sub">Agrega algunos productos para comenzar</p>
            </div>
          </div>
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-box">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-value">$0 CLP</span>
            </div>
            <button className="cart-checkout-btn" disabled>Finalizar Compra</button>
          </div>
        </aside>
      </header>
    </>
  );
};

export default Navbar;