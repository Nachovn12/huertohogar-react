import React, { useState } from 'react';
import { Table, Button, Modal, Form, Badge, Alert } from 'react-bootstrap';
import { Edit, Delete, Add, Search, MoreVert } from '@mui/icons-material';

const UserManagement = () => {
  // Usuarios de demostración
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'María González', email: 'maria@email.com', role: 'customer', status: 'active', createdAt: '2024-02-20' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@email.com', role: 'customer', status: 'active', createdAt: '2024-03-10' },
    { id: 4, name: 'Ana Martínez', email: 'ana@email.com', role: 'customer', status: 'inactive', createdAt: '2024-01-05' },
    { id: 5, name: 'Pedro López', email: 'pedro@email.com', role: 'customer', status: 'active', createdAt: '2024-04-01' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer',
    status: 'active'
  });

  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
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
      role: user.role,
      status: user.status
    });
    setShowModal(true);
  };

  const handleOpenActions = (user) => {
    // Abrir edición directamente (sin modal de acciones intermedio)
    handleEditUser(user);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== userId));
      showAlertMessage('Usuario eliminado exitosamente', 'danger');
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();

    if (modalMode === 'add') {
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      showAlertMessage('Usuario agregado exitosamente', 'success');
    } else {
      setUsers(users.map(u => 
        u.id === currentUser.id 
          ? { ...u, ...formData }
          : u
      ));
      showAlertMessage('Usuario actualizado exitosamente', 'info');
    }

    setShowModal(false);
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión de Usuarios</h1>
        <Button 
          onClick={handleAddUser}
          className="btn-add-new"
        >
          <Add /> Agregar Usuario
        </Button>
      </div>

      {showAlert && (
        <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      <div className="admin-filters">
        <Form.Group>
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <Form.Control
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </Form.Group>
      </div>

      <div className="admin-table-wrapper">
        <Table hover responsive className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td style={{ color: '#64748b' }}>{user.id}</td>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td style={{ color: '#64748b' }}>{user.email}</td>
                <td>
                  <Badge bg={user.role === 'admin' ? 'danger' : 'primary'} className="badge-custom">
                    {user.role === 'admin' ? '👑 Admin' : '👤 Cliente'}
                  </Badge>
                </td>
                <td>
                  <Badge bg={user.status === 'active' ? 'success' : 'secondary'} className="badge-custom">
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                <td className="actions-cell">
                  <Button 
                    size="sm" 
                    onClick={() => handleOpenActions(user)}
                    className="action-btn action-btn-view"
                  >
                    <MoreVert fontSize="small" /> Acciones
                  </Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className="modal-content">
          <div className="modal-header">
            {modalMode === 'edit' && currentUser && (
              <span className="modal-product-id">{currentUser.id}</span>
            )}
            <h4 style={{ fontWeight: 700, margin: 0 }}>
              {modalMode === 'add' ? 'Agregar Nuevo Usuario' : 'Editar Usuario'}
            </h4>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowModal(false)} />
          </div>
          <Form onSubmit={handleSaveUser}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: 12 }}>
              <div>
                <Form.Label>Nombre Completo *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@email.com"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <Form.Label>Rol *</Form.Label>
                <Form.Select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </div>
              <div>
                <Form.Label>Estado *</Form.Label>
                <Form.Select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </Form.Select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 18 }}>
              <Button onClick={() => setShowModal(false)} className="btn-modal-cancel">
                Cancelar
              </Button>
              <Button type="submit" className="btn-modal-success">
                {modalMode === 'add' ? 'Agregar Usuario' : 'Guardar Cambios'}
              </Button>
              {modalMode === 'edit' && currentUser && (
                <Button onClick={() => handleDeleteUser(currentUser.id)} className="btn-modal-danger">
                  <Delete style={{ fontSize: '18px', marginRight: 8 }} /> Eliminar
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
