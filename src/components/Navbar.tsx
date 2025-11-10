import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FormControl } from 'react-bootstrap';
// --- CAMBIO: Importé 'Button' de Material-UI ---
import { Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const menuLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Productos', to: '/productos' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Blog', to: '/blog' }
];

const Navbar: React.FC = () => {
  const { getTotalItems, toggleCart, openCart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
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
    const handleClickOutside = (e: any) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchDropdown(value.length > 0);
  };

  const handleLogoutLocal = () => {
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
              // --- CAMBIO: Botón de HTML reemplazado por Button de Material-UI ---
              <Button
                variant="contained"
                startIcon={<i className="fas fa-user" style={{ fontSize: '0.9em' }} />}
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor: '#2E8B57', // Tu color verde principal
                  color: '#FFFFFF',           // Texto blanco
                  textTransform: 'none',     // Evita que el texto se ponga en MAYÚSCULAS
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  borderRadius: '50px',      // Bordes redondeados para que coincida con la barra de búsqueda
                  padding: '6px 20px',
                  boxShadow: 'none',         // Quita la sombra por defecto
                  whiteSpace: 'nowrap',      // Evita que el texto se divida en dos líneas
                  
                  // --- ESTA ES LA SOLUCIÓN ---
                  '&:hover': {
                    backgroundColor: '#1f6a3f', // Un verde un poco más oscuro
                    color: '#FFFFFF',           // Asegura que el texto SIGA SIENDO BLANCO
                    boxShadow: 'none',
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Carrito */}
            <button 
              className="cart-button"
              onClick={() => openCart && openCart()}
              aria-label="Carrito de compras"
            >
              <ShoppingCartIcon style={{ fontSize: '1.7rem' }} />
              {cartItemsCount > 0 && (
                <span className="cart-counter">{cartItemsCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;