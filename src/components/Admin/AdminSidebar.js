import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import LogoutIcon from '@mui/icons-material/Logout';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/admin/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/admin/ordenes', icon: <ShoppingCartIcon />, label: 'Órdenes' },
    { path: '/admin/productos', icon: <InventoryIcon />, label: 'Productos' },
    { path: '/admin/categorias', icon: <CategoryIcon />, label: 'Categorías' },
    { path: '/admin/usuarios', icon: <PeopleIcon />, label: 'Usuarios' },
    { path: '/admin/reportes', icon: <AssessmentIcon />, label: 'Reportes' },
    { path: '/admin/perfil', icon: <PersonIcon />, label: 'Perfil' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      {/* Logo / Company Name */}
      <div className="sidebar-header">
        <h4>🌱 HuertoHogar</h4>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="sidebar-footer">
        <Link to="/" className="sidebar-item tienda-item">
          <span className="sidebar-icon"><StoreIcon /></span>
          <span className="sidebar-label">Tienda</span>
        </Link>
        
        <button 
          onClick={logout} 
          className="sidebar-item logout-item"
          style={{ 
            border: 'none', 
            background: 'transparent',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <span className="sidebar-icon"><LogoutIcon /></span>
          <span className="sidebar-label">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;