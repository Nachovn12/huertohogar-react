import React, { useState } from 'react';
import { Table, Button, Modal, Badge, Card, Row, Col, Form, Alert } from 'react-bootstrap';
import { Visibility, Search } from '@mui/icons-material';

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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
          <h3 style={{ color: '#16a34a' }}>{stats.total}</h3>
        </div>
        <div className="stat-card-mini">
          <p>Pendientes</p>
          <h3 style={{ color: '#f59e0b' }}>{stats.pending}</h3>
        </div>
        <div className="stat-card-mini">
          <p>Procesando</p>
          <h3 style={{ color: '#06b6d4' }}>{stats.processing}</h3>
        </div>
        <div className="stat-card-mini">
          <p>Completadas</p>
          <h3 style={{ color: '#16a34a' }}>{stats.completed}</h3>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="admin-filters">
        <Row className="g-4 align-items-center">
          <Col lg={8} md={12}>
            <Form.Group className="mb-0">
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
          <Col lg={4} md={12}>
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
                  <td style={{ fontWeight: 700, color: '#16a34a' }}>#{order.id}</td>
                  <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                  <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>{order.customerEmail}</td>
                  <td>{new Date(order.date).toLocaleDateString('es-ES')}</td>
                  <td>
                    <Badge bg="secondary" className="badge-custom">
                      {order.items} items
                    </Badge>
                  </td>
                  <td style={{ fontWeight: 700, color: '#111827' }}>
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
                      onClick={() => handleViewOrder(order)}
                      className="action-btn action-btn-view"
                    >
                      <Visibility fontSize="small" /> Ver Detalles
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

      {/* Modal de detalles de orden */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg" 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton style={{ 
          borderBottom: '2px solid #f3f4f6',
          padding: '24px',
          background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            minWidth: '56px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.15rem',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(22,163,74,0.12)',
            padding: '0 12px',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            #{selectedOrder?.id}
          </div>
          <Modal.Title style={{ 
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#111827',
            margin: 0
          }}>
            Detalles de la Orden
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '28px' }}>
          {selectedOrder && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                  <h6 style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.05rem', marginBottom: '12px' }}>Información del Cliente</h6>
                  <div style={{ fontSize: '0.97rem', color: '#374151', marginBottom: '6px' }}><strong style={{ color: '#16a34a' }}>Nombre:</strong> {selectedOrder.customerName}</div>
                  <div style={{ fontSize: '0.97rem', color: '#374151', marginBottom: '6px' }}><strong style={{ color: '#16a34a' }}>Email:</strong> {selectedOrder.customerEmail}</div>
                  <div style={{ fontSize: '0.97rem', color: '#374151' }}><strong style={{ color: '#16a34a' }}>Dirección:</strong> {selectedOrder.shippingAddress}</div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                  <h6 style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.05rem', marginBottom: '12px' }}>Información de la Orden</h6>
                  <div style={{ fontSize: '0.97rem', color: '#374151', marginBottom: '6px' }}><strong style={{ color: '#16a34a' }}>Fecha:</strong> {new Date(selectedOrder.date).toLocaleDateString('es-ES')}</div>
                  <div style={{ fontSize: '0.97rem', color: '#374151', marginBottom: '6px' }}><strong style={{ color: '#16a34a' }}>Total Items:</strong> {selectedOrder.items}</div>
                  <div style={{ fontSize: '0.97rem', color: '#16a34a', fontWeight: 700 }}><strong>Total:</strong> ${selectedOrder.total.toLocaleString()}</div>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '20px' }}>
                  <h6 style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.05rem', marginBottom: '12px' }}>Productos de la Orden</h6>
                  <Table hover responsive style={{ marginBottom: '0' }}>
                    <thead style={{ background: '#f9fafb' }}>
                      <tr>
                        <th style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 14px', borderBottom: '2px solid #e5e7eb' }}>Producto</th>
                        <th style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 14px', borderBottom: '2px solid #e5e7eb' }}>Cantidad</th>
                        <th style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 14px', borderBottom: '2px solid #e5e7eb' }}>Precio Unit.</th>
                        <th style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 14px', borderBottom: '2px solid #e5e7eb' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((product, index) => (
                        <tr key={index}>
                          <td style={{ padding: '14px', fontSize: '0.9375rem', color: '#374151', fontWeight: 500 }}>{product.name}</td>
                          <td style={{ padding: '14px', fontSize: '0.9375rem', color: '#374151' }}>{product.quantity}</td>
                          <td style={{ padding: '14px', fontSize: '0.9375rem', color: '#374151' }}>${product.price.toLocaleString()}</td>
                          <td style={{ padding: '14px', fontSize: '0.9375rem', color: '#16a34a', fontWeight: 600 }}>${(product.price * product.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                marginTop: '20px'
              }}>
                <h6 style={{ 
                  color: '#16a34a', 
                  marginBottom: '16px', 
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    width: '4px',
                    height: '20px',
                    background: '#16a34a',
                    borderRadius: '2px'
                  }}></span>
                  Actualizar Estado de la Orden
                </h6>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                    disabled={selectedOrder.status === 'pending'}
                    style={{
                      background: selectedOrder.status === 'pending' ? '#d1d5db' : 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'white',
                      cursor: selectedOrder.status === 'pending' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ⏳ Pendiente
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                    disabled={selectedOrder.status === 'processing'}
                    style={{
                      background: selectedOrder.status === 'processing' ? '#d1d5db' : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'white',
                      cursor: selectedOrder.status === 'processing' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    📦 Procesando
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                    disabled={selectedOrder.status === 'completed'}
                    style={{
                      background: selectedOrder.status === 'completed' ? '#d1d5db' : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'white',
                      cursor: selectedOrder.status === 'completed' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ✅ Completada
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                    disabled={selectedOrder.status === 'cancelled'}
                    style={{
                      background: selectedOrder.status === 'cancelled' ? '#d1d5db' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'white',
                      cursor: selectedOrder.status === 'cancelled' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ❌ Cancelar
                  </Button>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ 
          borderTop: '2px solid #f3f4f6',
          padding: '20px 24px',
          background: '#f9fafb'
        }}>
          <Button 
            onClick={() => setShowModal(false)}
            style={{
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
