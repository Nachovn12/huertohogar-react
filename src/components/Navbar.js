import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';

const Navbar = () => {
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', to: '/' },
    { label: 'Productos', to: '/productos' },
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Blog', to: '/blog' }
  ];

  return (
    <AppBar position="static" elevation={2} sx={{ bgcolor: '#fff', color: '#27ae60', boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 }, minHeight: 72 }}>
        {/* Logo y nombre */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
            <img src="/img/Logo_HuertoHogar_Web.png" alt="HuertoHogar" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', marginRight: 10, boxShadow: '0 2px 8px rgba(39,174,96,0.08)' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif', color: '#27ae60', letterSpacing: 1, fontSize: { xs: '1.2rem', md: '1.7rem' } }}>
              HuertoHogar
            </Typography>
          </Link>
        </Box>
        {/* Links desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
          {navLinks.map(link => (
            <Button key={link.to} component={Link} to={link.to} sx={{ color: '#27ae60', fontWeight: 600, fontSize: '1.08rem', textTransform: 'none', px: 2, transition: 'background 0.2s', '&:hover': { bgcolor: '#eafaf1' } }}>
              {link.label}
            </Button>
          ))}
          <Divider orientation="vertical" flexItem sx={{ mx: 2, bgcolor: '#e0e0e0' }} />
          <Button component={Link} to="/login" variant="contained" sx={{ borderRadius: 2, fontWeight: 700, ml: 1, color: '#fff', bgcolor: '#27ae60', boxShadow: 2, textTransform: 'none', px: 3, fontSize: '1.05rem', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4, bgcolor: '#219150' } }}>
            Ingresar
          </Button>
          <IconButton component={Link} to="/cart" size="large" sx={{ color: '#27ae60', bgcolor: '#f7faf7', borderRadius: 2, ml: 2, position: 'relative', zIndex: 1000, overflow: 'visible', boxShadow: '0 2px 8px rgba(39,174,96,0.08)', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4, bgcolor: '#eafaf1' } }}>
            <Badge badgeContent={getTotalItems()} color="success" sx={{ zIndex: 1001, position: 'relative' }}>
              <ShoppingCartIcon fontSize="inherit" />
            </Badge>
          </IconButton>
        </Box>
        {/* Mobile menu toggler */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <IconButton onClick={() => setIsMenuOpen(!isMenuOpen)} sx={{ color: '#27ae60' }}>
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
      </Toolbar>
      {/* Mobile menu animado */}
      {isMenuOpen && (
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', bgcolor: '#fff', px: 2, py: 2, boxShadow: 2, animation: 'fadeIn 0.3s', zIndex: 10 }}>
          {navLinks.map(link => (
            <Button key={link.to} component={Link} to={link.to} sx={{ color: '#27ae60', fontWeight: 600, fontSize: '1rem', textTransform: 'none', mb: 1, px: 2 }} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </Button>
          ))}
          <Divider sx={{ my: 1, bgcolor: '#e0e0e0' }} />
          <Button component={Link} to="/login" variant="contained" sx={{ borderRadius: 2, fontWeight: 700, color: '#fff', bgcolor: '#27ae60', boxShadow: 1, mb: 1, textTransform: 'none', px: 3 }} onClick={() => setIsMenuOpen(false)}>
            Ingresar
          </Button>
          <IconButton component={Link} to="/cart" size="large" sx={{ color: '#27ae60', bgcolor: '#f7faf7', borderRadius: 2 }} onClick={() => setIsMenuOpen(false)}>
            <Badge badgeContent={getTotalItems()} color="success">
              <ShoppingCartIcon fontSize="inherit" />
            </Badge>
          </IconButton>
        </Box>
      )}
      {/* Animación para el menú móvil */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AppBar>
  );
};

export default Navbar;
