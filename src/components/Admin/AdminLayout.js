import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
// import './AdminLayout.css'; // Usaremos estilos inline simples

const AdminLayout = () => {
  return (
    <div className="admin-layout" style={{ display: 'flex' }}>
      <AdminSidebar />
      <div 
        className="admin-content" 
        style={{ 
          flexGrow: 1, 
          marginLeft: '240px', // Compensar el ancho del sidebar
          padding: '20px', // Espacio alrededor del contenido
          backgroundColor: '#f8f9fa' // Un fondo ligero para el contenido
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
