import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/UserDropdown.css';

const UserDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Cerrar dropdown al presionar Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    if (logout) logout();
    setIsOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  if (!user) return null;

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Definir color según rol
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return '#2E8B57'; // Verde esmeralda
      case 'Vendedor':
        return '#FFD700'; // Amarillo mostaza
      case 'Cliente':
        return '#8B4513'; // Marrón
      default:
        return '#666666';
    }
  };

  // Icono según rol
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return '👑';
      case 'Vendedor':
        return '💼';
      case 'Cliente':
        return '🛒';
      default:
        return '👤';
    }
  };

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <button 
        className="user-dropdown-trigger" 
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menú de usuario"
      >
        <div 
          className="user-avatar" 
          style={{ backgroundColor: getRoleColor(user.rol) }}
        >
          {getInitials(user.nombre || user.email)}
        </div>
        <div className="user-trigger-info">
          <span className="user-trigger-role">{getRoleIcon(user.rol)} {user.rol}</span>
        </div>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1 1L6 6L11 1" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="dropdown-overlay" onClick={closeDropdown}></div>
          <div className="user-dropdown-menu">
            {/* Header del dropdown con info del usuario */}
            <div className="dropdown-header">
              <div 
                className="dropdown-avatar" 
                style={{ backgroundColor: getRoleColor(user.rol) }}
              >
                {getInitials(user.nombre || user.email)}
              </div>
              <div className="dropdown-user-info">
                <p className="dropdown-user-name">{user.nombre || 'Usuario'}</p>
                <p className="dropdown-user-email">{user.email}</p>
                <span 
                  className="dropdown-user-badge" 
                  style={{ backgroundColor: getRoleColor(user.rol) }}
                >
                  {getRoleIcon(user.rol)} {user.rol}
                </span>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            {/* Opciones del menú */}
            <div className="dropdown-menu-items">
              {/* Opciones para CLIENTES */}
              {user.rol === 'Cliente' && (
                <>
                  <Link 
                    to="/perfil" 
                    className="dropdown-menu-item"
                    onClick={closeDropdown}
                  >
                    <span className="dropdown-item-icon">👤</span>
                    <div className="dropdown-item-content">
                      <span className="dropdown-item-title">Mi Perfil</span>
                      <span className="dropdown-item-desc">Ver y editar información</span>
                    </div>
                  </Link>

                  <Link 
                    to="/mis-pedidos" 
                    className="dropdown-menu-item"
                    onClick={closeDropdown}
                  >
                    <span className="dropdown-item-icon">📦</span>
                    <div className="dropdown-item-content">
                      <span className="dropdown-item-title">Mis Pedidos</span>
                      <span className="dropdown-item-desc">Historial de compras</span>
                    </div>
                  </Link>
                </>
              )}

              {/* Opciones para ADMINISTRADOR */}
              {user.rol === 'Admin' && (
                <Link 
                  to="/admin/dashboard" 
                  className="dropdown-menu-item dropdown-menu-item-featured"
                  onClick={closeDropdown}
                >
                  <span className="dropdown-item-icon">👑</span>
                  <div className="dropdown-item-content">
                    <span className="dropdown-item-title">Panel de Administración</span>
                    <span className="dropdown-item-desc">Gestionar toda la tienda</span>
                  </div>
                </Link>
              )}

              {/* Opciones para VENDEDOR */}
              {user.rol === 'Vendedor' && (
                <Link 
                  to="/vendedor/dashboard" 
                  className="dropdown-menu-item dropdown-menu-item-featured"
                  onClick={closeDropdown}
                >
                  <span className="dropdown-item-icon">💼</span>
                  <div className="dropdown-item-content">
                    <span className="dropdown-item-title">Panel de Vendedor</span>
                    <span className="dropdown-item-desc">Ver productos y órdenes</span>
                  </div>
                </Link>
              )}
            </div>

            <div className="dropdown-divider"></div>

            {/* Botón de cerrar sesión */}
            <button 
              className="dropdown-logout-btn" 
              onClick={handleLogout}
            >
              <span className="dropdown-item-icon">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;
