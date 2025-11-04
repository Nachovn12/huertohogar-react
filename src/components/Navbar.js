import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FormControl } from 'react-bootstrap';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';

const menuLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Productos', to: '/productos' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Blog', to: '/blog' }
];

const Navbar = () => {
  const { getTotalItems, toggleCart } = useCart();
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [adminBrowsing, setAdminBrowsing] = useState(false);

  useEffect(() => {
    try {
      const flag = localStorage.getItem('adminBrowsing') === 'true';
      setAdminBrowsing(flag);
    } catch (e) {
      setAdminBrowsing(false);
    }
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="main-header" style={{ 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="header-content" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '16px 40px',
        maxWidth: '1400px',
        margin: '0 auto',
        gap: '60px'
      }}>
        
        {/* Logo Container */}
        <Link to="/" className="logo-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          textDecoration: 'none',
          gap: '12px',
          flexShrink: 0
        }}>
          <img 
            src={process.env.PUBLIC_URL + '/img/Logo_HuertoHogar_Web.png'} 
            alt="HuertoHogar - Del Campo al Hogar" 
            className="logo"
            width="42"
            height="42"
            style={{ borderRadius: '6px' }}
          />
          <h2 style={{ 
            margin: 0,
            fontSize: '1.4rem', 
            fontWeight: '700', 
            color: '#8B4513',
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '-0.5px'
          }}>
            Huerto<span style={{ color: '#2E8B57' }}>Hogar</span>
          </h2>
        </Link>

        {/* Main Nav */}
        <nav className="main-nav" style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <div className="nav-links" style={{ display: 'flex', gap: '36px' }}>
            {menuLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: isActive(link.to) ? '#2E8B57' : '#666666',
                  fontWeight: isActive(link.to) ? '600' : '500',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  padding: '8px 0',
                  borderBottom: isActive(link.to) ? '2px solid #2E8B57' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Montserrat, Arial, sans-serif'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.to)) {
                    e.target.style.color = '#2E8B57';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to)) {
                    e.target.style.color = '#666666';
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Header Actions */}
        <div className="header-actions" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          flexShrink: 0
        }}>
          {/* Search Bar */}
          <div className="search-bar" style={{ position: 'relative' }}>
            <SearchIcon 
              sx={{ 
                position: 'absolute', 
                left: '14px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9ca3af',
                fontSize: 19
              }} 
            />
            <FormControl
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e);
                }
              }}
              style={{
                paddingLeft: '42px',
                paddingRight: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '0.9rem',
                height: '40px',
                width: '240px',
                backgroundColor: '#f9fafb',
                fontFamily: 'Roboto, Arial, sans-serif',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#2E8B57';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#e5e7eb';
              }}
            />
          </div>

          {/* Login Link */}
          <Link 
            to="/login" 
            className="login-link"
            style={{
              color: '#333333',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              padding: '9px 20px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontFamily: 'Montserrat, Arial, sans-serif',
              backgroundColor: '#ffffff'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.borderColor = '#2E8B57';
              e.target.style.color = '#2E8B57';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.color = '#333333';
            }}
          >
            Ingresar
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

          {/* Cart Button */}
          <IconButton
            onClick={toggleCart}
            className="cart-button"
            sx={{
              color: '#2E8B57',
              position: 'relative',
              bgcolor: '#f0fdf4',
              border: '1px solid rgba(33, 145, 80, 0.2)',
              '&:hover': { 
                bgcolor: '#dcfce7',
                borderColor: 'rgba(33, 145, 80, 0.3)'
              }
            }}
          >
            <Badge 
              badgeContent={getTotalItems()} 
              color="success"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#2E8B57',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '0.7rem'
                }
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
