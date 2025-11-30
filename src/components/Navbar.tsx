import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@mui/material';
import UserDropdown from './UserDropdown';

const Navbar: React.FC = () => {
  const { getTotalItems, openCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // total items in cart
  const cartItemsCount = getTotalItems ? getTotalItems() : 0;

  // Manejar scroll para efectos del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect mobile breakpoint to hide desktop search input when on small screens
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (isMenuOpen && !e.target.closest('.main-nav') && !e.target.closest('.hamburger')) {
        setIsMenuOpen(false);
      }
      if (showSearchDropdown && !e.target.closest('.search-bar')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, showSearchDropdown]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
      setSearchQuery('');
      // If we're on a small screen, close the hamburger menu after searching
      try {
        if (window.innerWidth <= 768) setIsMenuOpen(false);
      } catch (err) {
        // ignore in SSR or environments without window
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchDropdown(value.length > 0);
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
              {/* Mobile search shown inside hamburger menu on small screens */}
              {isMenuOpen && (
                <div className="mobile-search">
                  <form className="search-bar" onSubmit={handleSearch}>
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </form>
                </div>
              )}
          </nav>

          {/* Acciones del header */}
          <div className="header-actions">
            {/* Barra de búsqueda (solo desktop) */}
            {!isMobile && (
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
            )}

            {/* Usuario / Login */}
            {user ? (
              <UserDropdown />
            ) : (
              <Button
                variant="contained"
                startIcon={<i className="fas fa-user" style={{ fontSize: '0.9em' }} />}
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor: '#2E8B57',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  borderRadius: '50px',
                  padding: '6px 20px',
                  boxShadow: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: '#1f6a3f',
                    color: '#FFFFFF',
                    boxShadow: 'none',
                  }
                }}
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Carrito de compras */}
            <button 
              className="cart-button"
              onClick={() => openCart && openCart()}
              aria-label="Carrito de compras"
              style={{
                background: '#43a047',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginLeft: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(67,160,71,0.2)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(67,160,71,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(67,160,71,0.2)';
              }}
            >
              {/* SVG del carrito */}
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                <path 
                  d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" 
                  fill="white"
                />
              </svg>
              
              {cartItemsCount > 0 && (
                <span
                  className="cart-counter"
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#fff',
                    color: '#43a047',
                    borderRadius: '50%',
                    minWidth: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    border: '2px solid #43a047',
                  }}
                >
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;