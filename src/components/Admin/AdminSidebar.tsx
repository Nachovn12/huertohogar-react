import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/admin/ordenes', icon: <ShoppingCartIcon />, label: 'Órdenes' },
    { path: '/admin/productos', icon: <InventoryIcon />, label: 'Productos' },
    { path: '/admin/usuarios', icon: <PeopleIcon />, label: 'Usuarios' },
    { path: '/admin/reportes', icon: <AssessmentIcon />, label: 'Reportes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-sidebar" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      width: '240px',
      minHeight: 0
    }}>
      {/* Logo / Company Name */}
      <div className="sidebar-header" style={{ 
        padding: '1.25rem 1rem',
        flexShrink: 0,
        borderBottom: '1px solid #f1f5f9'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }} aria-label="HuertoHogar - Ir al inicio">
          <div className="logo-card" style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
          }}>
            <img 
              src={process.env.PUBLIC_URL + '/img/Logo_HuertoHogar_Web.png'} 
              alt="HuertoHogar" 
              style={{ width: '75px', height: 'auto' }}
            />
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="sidebar-menu-nav" style={{ 
        flex: 1, 
        padding: '1rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        overflowY: 'auto',
        minHeight: 0,
        scrollbarWidth: 'none', // Firefox - oculto por defecto
        msOverflowStyle: 'none' // IE/Edge - oculto por defecto
      }}>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.8rem 1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: isActive(item.path) 
                ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' 
                : 'transparent',
              color: isActive(item.path) ? '#16a34a' : '#64748b',
              fontWeight: isActive(item.path) ? 600 : 500,
              borderLeft: isActive(item.path) ? '3px solid #22c55e' : '3px solid transparent',
              fontSize: '0.95rem',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#1e293b';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }
            }}
          >
            <span style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontSize: '1.3rem'
            }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions - Siempre visible */}
      <div style={{ 
        padding: '0.5rem 0.75rem',
        borderTop: '1px solid #f1f5f9',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem'
      }}>
        {/* Botón Tienda */}
        <button
          onClick={() => {
            try {
              localStorage.setItem('adminBrowsing', 'true');
            } catch (e) {}
            navigate('/');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'transparent',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#3b82f6',
            fontWeight: 500,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#eff6ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <StoreIcon style={{ fontSize: '1.3rem' }} />
          <span>Tienda</span>
        </button>
        
        {/* Botón Cerrar Sesión */}
        <button 
          onClick={() => {
            sessionStorage.removeItem('admin_welcome_shown');
            logout();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.7rem 1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'transparent',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            color: '#ef4444',
            fontWeight: 500,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogoutIcon style={{ fontSize: '1.3rem' }} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* User Info Footer - Siempre visible */}
      {user && (
        <div style={{
          padding: '0.85rem',
          borderTop: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.95rem',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
            }}>
              {user.nombre?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: 600, 
                color: '#1e293b', 
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {user.nombre || 'Administrador'}
              </div>
              <div style={{ 
                fontSize: '0.7rem', 
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginTop: '0.1rem'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.2)'
                }} />
                {user.rol === 'Admin' ? 'Administrador' : user.rol}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
