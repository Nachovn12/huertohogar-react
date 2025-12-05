import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import People from '@mui/icons-material/People';
import Person from '@mui/icons-material/Person';
import PersonAdd from '@mui/icons-material/PersonAdd';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Block from '@mui/icons-material/Block';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import FilterList from '@mui/icons-material/FilterList';
import Email from '@mui/icons-material/Email';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { userService } from '../../service/api';

const UserManagement = () => {
  // Estado para usuarios desde la API
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    status: 'active'
  });

  // Cargar usuarios desde la API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      console.log('✅ Usuarios cargados desde API:', data);
      setUsers(data);
    } catch (err: any) {
      console.error('❌ Error cargando usuarios:', err);
      setError('Error al cargar usuarios de la API');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // No mostramos la contraseña
      role: user.role,
      status: user.status
    });
    setShowModal(true);
  };

  const handleOpenActions = (user) => {
    // Abrir edición directamente (sin modal de acciones intermedio)
    handleEditUser(user);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await userService.delete(userId);
        // Si llegamos aquí, la eliminación fue exitosa
        setUsers(users.filter(u => u.id !== userId));
        showAlertMessage('Usuario eliminado exitosamente', 'success');
        setShowModal(false);
      } catch (error: any) {
        console.error('Error eliminando usuario:', error);
        
        // Verificar si es error de endpoint no encontrado
        if (error.message?.includes('404') || error.message?.includes('Endpoint no encontrado')) {
          showAlertMessage('⚠️ La API no soporta eliminar usuarios. Contacta al administrador del servidor.', 'warning');
        } else {
          showAlertMessage('Error al eliminar usuario: ' + error.message, 'danger');
        }
      }
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === 'add') {
        // Crear usuario en la API
        console.log('📤 Creando usuario en la API...');
        const newUserData = {
          nombre: formData.name,
          email: formData.email,
          password: formData.password // ✅ REQUERIDO por la API
        };
        
        await userService.create(newUserData);
        console.log('✅ Usuario creado exitosamente');
        
        // Recargar usuarios desde la API
        await loadUsers();
        showAlertMessage('Usuario agregado exitosamente', 'success');
      } else {
        // Actualizar usuario en la API
        console.log('📤 Actualizando usuario en la API...');
        const updateData = {
          nombre: formData.name,
          email: formData.email,
          rol: formData.role,
          estado: formData.status
        };
        
        try {
          await userService.update((currentUser as any).id, updateData);
          console.log('✅ Usuario actualizado exitosamente');
          
          // Recargar usuarios desde la API
          await loadUsers();
          showAlertMessage('Usuario actualizado exitosamente', 'success');
        } catch (updateError: any) {
          // Si la API no soporta UPDATE (404), mostrar mensaje informativo
          if (updateError.response?.status === 404 || updateError.message?.includes('404')) {
            showAlertMessage('⚠️ La API no permite editar usuarios. Solo puedes crear nuevos usuarios.', 'warning');
          } else {
            throw updateError;
          }
        }
      }

      setShowModal(false);
    } catch (error: any) {
      console.error('Error guardando usuario:', error);
      showAlertMessage('Error: ' + error.message, 'danger');
    }
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const filteredUsers = users.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = name.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Estadísticas para KPIs
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const vendedorUsers = users.filter(u => u.role === 'vendedor').length;
  const clienteUsers = users.filter(u => u.role === 'customer').length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header mejorado */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700, 
              color: '#1e293b', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <People style={{ color: '#16a34a', fontSize: '2rem' }} />
              Gestión de Usuarios
            </h1>
            <p style={{ color: '#64748b', margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Administra los usuarios de la plataforma • {totalUsers} usuarios registrados
            </p>
          </div>
          <Button onClick={handleAddUser} className="btn-add-new">
            <Add /> Agregar Usuario
          </Button>
        </div>

        {/* KPIs Cards - En fila horizontal */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          {/* Total Usuarios */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <People style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{totalUsers}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Total Usuarios</div>
            </div>
          </div>
          
          {/* Usuarios Activos */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{activeUsers}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Activos</div>
            </div>
          </div>
          
          {/* Usuarios Inactivos */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Block style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{inactiveUsers}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Inactivos</div>
            </div>
          </div>
          
          {/* Administradores */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AdminPanelSettings style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{adminUsers}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Admins</div>
            </div>
          </div>
          
          {/* Vendedores */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Person style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{vendedorUsers}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Vendedores</div>
            </div>
          </div>
        </div>

        {/* Barra de filtros mejorada */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Búsqueda */}
          <div style={{ position: 'relative', flex: '1 1 250px', minWidth: '200px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.25rem' }} />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem 0.65rem 2.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          {/* Filtro por rol */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AdminPanelSettings style={{ color: '#64748b', fontSize: '1.25rem' }} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{
                padding: '0.65rem 2rem 0.65rem 0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem'
              }}
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="vendedor">Vendedor</option>
              <option value="customer">Cliente</option>
            </select>
          </div>
          
          {/* Filtro por estado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FilterList style={{ color: '#64748b', fontSize: '1.25rem' }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.65rem 2rem 0.65rem 0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          
          {/* Contador de resultados */}
          <div style={{ 
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#f8fafc',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#64748b',
            fontWeight: 500
          }}>
            <span style={{ fontWeight: 600, color: '#16a34a' }}>{filteredUsers.length}</span>
            <span>de {totalUsers} usuarios</span>
          </div>
        </div>
      </div>
      
      {showAlert && (
        <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)} style={{ marginBottom: '1rem' }}>
          {alertMessage}
        </Alert>
      )}

      <div className="admin-table-wrapper" style={{ 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Table hover responsive className="admin-table" style={{ marginBottom: 0 }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ width: '60px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem', padding: '1rem 0.75rem' }}>
                <People style={{ fontSize: '1rem', color: '#64748b' }} />
              </th>
              <th style={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>USUARIO</th>
              <th style={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>EMAIL</th>
              <th style={{ width: '120px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>ROL</th>
              <th style={{ width: '100px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>ESTADO</th>
              <th style={{ width: '130px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>REGISTRO</th>
              <th style={{ width: '100px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ transition: 'all 0.2s ease' }}>
                <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: user.role === 'admin' 
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                      : user.role === 'vendedor'
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: '1rem',
                    color: 'white',
                    fontWeight: 600
                  }}>
                    {user.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle', padding: '0.75rem' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.1rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {user.id?.substring(0, 8)}...</div>
                </td>
                <td style={{ verticalAlign: 'middle', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Email style={{ fontSize: '1rem', color: '#94a3b8' }} />
                    {user.email}
                  </div>
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: user.role === 'admin' 
                      ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' 
                      : user.role === 'vendedor'
                        ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                        : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                    color: user.role === 'admin' 
                      ? '#b45309' 
                      : user.role === 'vendedor' 
                        ? '#047857' 
                        : '#4338ca',
                    border: user.role === 'admin' 
                      ? '1px solid #fcd34d' 
                      : user.role === 'vendedor'
                        ? '1px solid #6ee7b7'
                        : '1px solid #a5b4fc'
                  }}>
                    {user.role === 'admin' ? (
                      <>
                        <AdminPanelSettings style={{ fontSize: '0.9rem' }} />
                        Admin
                      </>
                    ) : user.role === 'vendedor' ? (
                      <>
                        <Person style={{ fontSize: '0.9rem' }} />
                        Vendedor
                      </>
                    ) : (
                      <>
                        <People style={{ fontSize: '0.9rem' }} />
                        Cliente
                      </>
                    )}
                  </span>
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: user.status === 'active' ? '#dcfce7' : '#f1f5f9',
                    color: user.status === 'active' ? '#166534' : '#64748b',
                    border: user.status === 'active' ? '1px solid #86efac' : '1px solid #cbd5e1'
                  }}>
                    {user.status === 'active' ? (
                      <CheckCircle style={{ fontSize: '0.85rem' }} />
                    ) : (
                      <Block style={{ fontSize: '0.85rem' }} />
                    )}
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.85rem' }}>
                    <CalendarToday style={{ fontSize: '0.9rem', color: '#94a3b8' }} />
                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                  </div>
                </td>
                <td className="actions-cell" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                    {/* Botón Editar */}
                    <button 
                      onClick={() => handleEditUser(user)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#eff6ff',
                        border: '2px solid #3b82f6',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      title="Editar usuario"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#3b82f6';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#eff6ff';
                        e.currentTarget.style.color = '#3b82f6';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Edit style={{ fontSize: '16px' }} />
                    </button>
                    
                    {/* Botón Eliminar */}
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#fef2f2',
                        border: '2px solid #ef4444',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      title="Eliminar usuario"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.color = '#ef4444';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <Delete style={{ fontSize: '16px' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-text">
            No se encontraron usuarios
          </p>
        </div>
      )}

      {/* Eliminado modal de acciones: abrimos edición directamente */}

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered
        size="lg"
        backdrop="static"
      >
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          {/* Header del Modal */}
          <div style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {modalMode === 'add' ? (
                  <PersonAdd style={{ color: 'white', fontSize: '1.75rem' }} />
                ) : (
                  <Edit style={{ color: 'white', fontSize: '1.75rem' }} />
                )}
              </div>
              <div>
                <h4 style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: '1.35rem' }}>
                  {modalMode === 'add' ? 'Nuevo Usuario' : 'Editar Usuario'}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '0.9rem' }}>
                  {modalMode === 'add' ? 'Completa la información del usuario' : `Editando: ${currentUser?.name || ''}`}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              <span style={{ color: 'white', fontSize: '1.5rem', lineHeight: 1 }}>×</span>
            </button>
          </div>

          {/* Contenido del Modal */}
          <Form onSubmit={handleSaveUser} style={{ padding: '2rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              {/* Nombre */}
              <div>
                <Form.Label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <People style={{ fontSize: '1rem', color: '#16a34a' }} />
                  Nombre Completo *
                </Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Juan Pérez"
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <Form.Label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Email style={{ fontSize: '1rem', color: '#16a34a' }} />
                  Email *
                </Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@email.com"
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Password - Solo visible al crear */}
              {modalMode === 'add' && (
                <div>
                  <Form.Label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔒 Contraseña *
                  </Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '2px solid #e5e7eb',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              )}

              {/* Rol */}
              <div>
                <Form.Label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AdminPanelSettings style={{ fontSize: '1rem', color: '#16a34a' }} />
                  Rol *
                </Form.Label>
                <Form.Select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="customer">👤 Cliente</option>
                  <option value="vendedor">🏪 Vendedor</option>
                  <option value="admin">👑 Administrador</option>
                </Form.Select>
              </div>

              {/* Estado */}
              <div>
                <Form.Label style={{ fontWeight: 600, color: '#374151', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle style={{ fontSize: '1rem', color: '#16a34a' }} />
                  Estado *
                </Form.Label>
                <Form.Select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="active">✅ Activo</option>
                  <option value="inactive">⛔ Inactivo</option>
                </Form.Select>
              </div>
            </div>

            {/* Botones */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '0.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <Button 
                onClick={() => setShowModal(false)} 
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  color: '#64748b',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 600
                }}
              >
                Cancelar
              </Button>
              
              {modalMode === 'edit' && currentUser && (
                <Button 
                  onClick={() => handleDeleteUser(currentUser.id)} 
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Delete style={{ fontSize: '1.1rem' }} /> Eliminar
                </Button>
              )}
              
              <Button 
                type="submit" 
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 600
                }}
              >
                {modalMode === 'add' ? '+ Agregar Usuario' : '✓ Guardar Cambios'}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
