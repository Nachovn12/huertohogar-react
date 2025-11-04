import React, { useState } from 'react';
import { Table, Button, Modal, Badge, Card, Row, Col, Form, Alert } from 'react-bootstrap';
import { Visibility, Edit, Search, MoreVert } from '@mui/icons-material';
import './AdminCommon.css';

const OrderManagement = () => {
  // Órdenes de demostración
  const [orders, setOrders] = useState([
    { 
      id: 1001, 
      customerName: 'Juan Pérez', 
      customerEmail: 'juan@email.com',
      total: 15000, 
      status: 'pending', 
      items: 3,
      date: '2024-11-20',
      shippingAddress: 'Av. Principal 123, Santiago',
      products: [
        { name: 'Tomates Orgánicos', quantity: 2, price: 2500 },
        { name: 'Lechugas Frescas', quantity: 3, price: 1500 },
        { name: 'Manzanas Rojas', quantity: 1, price: 3000 }
      ]
    },
    { 
      id: 1002, 
      customerName: 'María González', 
      customerEmail: 'maria@email.com',
      total: 28500, 
      status: 'processing', 
      items: 5,
      date: '2024-11-19',
      shippingAddress: 'Calle Los Pinos 456, Providencia',
      products: [
        { name: 'Plátanos', quantity: 2, price: 2000 },
        { name: 'Leche Fresca', quantity: 3, price: 1800 },
        { name: 'Pollo Orgánico', quantity: 1, price: 8500 }
      ]
    },
    { 
      id: 1003, 
      customerName: 'Carlos Rodríguez', 
      customerEmail: 'carlos@email.com',
      total: 42000, 
      status: 'completed', 
      items: 7,
      date: '2024-11-18',
      shippingAddress: 'Pasaje Las Rosas 789, Las Condes',
      products: [
        { name: 'Carne de Res', quantity: 2, price: 12000 },
        { name: 'Papas', quantity: 3, price: 1500 },
        { name: 'Cebollas', quantity: 2, price: 800 }
      ]
    },
    { 
      id: 1004, 
      customerName: 'Ana Martínez', 
      customerEmail: 'ana@email.com',
      total: 19500, 
      status: 'cancelled', 
      items: 4,
      date: '2024-11-17',
      shippingAddress: 'Av. Libertador 321, Ñuñoa',
      products: [
        { name: 'Zanahorias', quantity: 2, price: 1200 },
        { name: 'Brócoli', quantity: 3, price: 2500 }
      ]
    },
    { 
      id: 1005, 
      customerName: 'Pedro López', 
      customerEmail: 'pedro@email.com',
      total: 35000, 
      status: 'pending', 
      items: 6,
      date: '2024-11-21',
      shippingAddress: 'Calle Esperanza 654, Maipú',
      products: [
        { name: 'Salmón Fresco', quantity: 1, price: 15000 },
        { name: 'Espárragos', quantity: 2, price: 4500 }
      ]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowActionsModal(false);
    setShowModal(true);
  };

  const handleOpenActions = (order) => {
    setSelectedOrder(order);
    setShowActionsModal(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    showAlertMessage(`Estado de orden #${orderId} actualizado a: ${getStatusLabel(newStatus)}`, 'info');
    setShowModal(false);
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: '⏳ Pendiente' },
      processing: { bg: 'info', text: '📦 Procesando' },
      completed: { bg: 'success', text: '✅ Completada' },
      cancelled: { bg: 'danger', text: '❌ Cancelada' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      processing: 'Procesando',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return labels[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Estadísticas de órdenes
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión de Órdenes</h1>
      </div>

      {showAlert && (
        <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      {/* Estadísticas de órdenes */}
      <div className="stats-grid">
        <div className="stat-card-mini">
          <p>Total</p>
          <h3 style={{ color: '#4CAF50' }}>{stats.total}</h3>
        </div>
        <div className="stat-card-mini">
          <p>Pendientes</p>
          <h3 style={{ color: '#ffc107' }}>{stats.pending}</h3>
        </div>
        <div className="stat-card-mini">
          <p>Procesando</p>
          <h3 style={{ color: '#0dcaf0' }}>{stats.processing}</h3>
        </div>
        <div className="stat-card-mini">
          <p>Completadas</p>
          <h3 style={{ color: '#198754' }}>{stats.completed}</h3>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="admin-filters">
        <Row className="g-3">
          <Col md={8}>
            <Form.Group>
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <Form.Control
                  type="text"
                  placeholder="Buscar por ID, nombre o email del cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-select"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="processing">Procesando</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Tabla de órdenes */}
      <div className="admin-table-wrapper">
        <Table hover responsive className="admin-table">
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Fecha</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => {
              const statusBadge = getStatusBadge(order.status);
              return (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: '#4CAF50' }}>#{order.id}</td>
                  <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                  <td style={{ fontSize: '0.9rem', color: '#64748b' }}>{order.customerEmail}</td>
                  <td>{new Date(order.date).toLocaleDateString('es-ES')}</td>
                  <td>
                    <Badge bg="secondary" className="badge-custom">
                      {order.items} items
                    </Badge>
                  </td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>
                    ${order.total.toLocaleString()}
                  </td>
                  <td>
                    <Badge bg={statusBadge.bg} className="badge-custom">
                      {statusBadge.text}
                    </Badge>
                  </td>
                  <td className="actions-cell">
                    <Button 
                      size="sm" 
                      onClick={() => handleOpenActions(order)}
                      className="action-btn action-btn-view"
                    >
                      <MoreVert fontSize="small" /> Acciones
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p className="empty-state-text">
            No se encontraron órdenes
          </p>
        </div>
      )}

      {/* Modal de Acciones */}
      <Modal show={showActionsModal} onHide={() => setShowActionsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Acciones - Orden #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            <Button 
              variant="outline-primary"
              onClick={() => handleViewOrder(selectedOrder)}
              className="d-flex align-items-center justify-content-center gap-2 py-3"
              style={{ borderRadius: '10px', fontWeight: 600 }}
            >
              <Visibility /> Ver Detalles de la Orden
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal de detalles de orden */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Orden #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6 style={{ color: '#4CAF50', marginBottom: '1rem', fontWeight: 700 }}>Información del Cliente</h6>
                  <p><strong>Nombre:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong>Dirección:</strong> {selectedOrder.shippingAddress}</p>
                </Col>
                <Col md={6}>
                  <h6 style={{ color: '#4CAF50', marginBottom: '1rem', fontWeight: 700 }}>Información de la Orden</h6>
                  <p><strong>Fecha:</strong> {new Date(selectedOrder.date).toLocaleDateString('es-ES')}</p>
                  <p><strong>Total Items:</strong> {selectedOrder.items}</p>
                  <p><strong>Total:</strong> <span style={{ color: '#4CAF50', fontWeight: 700 }}>${selectedOrder.total.toLocaleString()}</span></p>
                </Col>
              </Row>

              <h6 style={{ color: '#4CAF50', marginBottom: '1rem', fontWeight: 700 }}>Productos</h6>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>${product.price.toLocaleString()}</td>
                      <td>${(product.price * product.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <h6 style={{ color: '#4CAF50', marginTop: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Actualizar Estado</h6>
              <div className="d-flex gap-2 flex-wrap">
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                  disabled={selectedOrder.status === 'pending'}
                  className="btn-modal-warning"
                >
                  ⏳ Pendiente
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                  disabled={selectedOrder.status === 'processing'}
                  className="btn-modal-info"
                >
                  📦 Procesando
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                  disabled={selectedOrder.status === 'completed'}
                  className="btn-modal-success"
                >
                  ✅ Completada
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  disabled={selectedOrder.status === 'cancelled'}
                  className="btn-modal-danger"
                >
                  ❌ Cancelar
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} className="btn-modal-secondary">
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
