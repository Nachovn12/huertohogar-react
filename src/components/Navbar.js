
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
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#fff', color: '#27ae60', boxShadow: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/img/Logo_HuertoHogar_Web.png" alt="HuertoHogar" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', marginRight: 16 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Montserrat, Arial, sans-serif', color: '#27ae60' }}>
              HuertoHogar
            </Typography>
          </Link>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
          {navLinks.map(link => (
            <Button key={link.to} component={Link} to={link.to} sx={{ color: '#27ae60', fontWeight: 600, fontSize: '1rem', textTransform: 'none' }}>
              {link.label}
            </Button>
          ))}
          <Button component={Link} to="/login" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600, ml: 2, color: '#27ae60', borderColor: '#27ae60' }}>
            Ingresar
          </Button>
          <IconButton component={Link} to="/cart" size="large" sx={{ color: '#27ae60', bgcolor: '#f7faf7', borderRadius: 2 }}>
            <Badge badgeContent={getTotalItems()} color="success">
              <ShoppingCartIcon fontSize="inherit" />
            </Badge>
          </IconButton>
        </Box>
        {/* Mobile menu toggler */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <IconButton onClick={() => setIsMenuOpen(!isMenuOpen)} sx={{ color: '#27ae60' }}>
            <span className="material-icons">menu</span>
          </IconButton>
        </Box>
      </Toolbar>
      {/* Mobile menu */}
      {isMenuOpen && (
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', bgcolor: '#fff', px: 2, py: 2, boxShadow: 2 }}>
          {navLinks.map(link => (
            <Button key={link.to} component={Link} to={link.to} sx={{ color: '#27ae60', fontWeight: 600, fontSize: '1rem', textTransform: 'none', mb: 1 }} onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </Button>
          ))}
          <Button component={Link} to="/login" variant="outlined" sx={{ borderRadius: 2, fontWeight: 600, color: '#27ae60', borderColor: '#27ae60', mb: 1 }} onClick={() => setIsMenuOpen(false)}>
            Ingresar
          </Button>
          <IconButton component={Link} to="/cart" size="large" sx={{ color: '#27ae60', bgcolor: '#f7faf7', borderRadius: 2 }} onClick={() => setIsMenuOpen(false)}>
            <Badge badgeContent={getTotalItems()} color="success">
              <ShoppingCartIcon fontSize="inherit" />
            </Badge>
          </IconButton>
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;
