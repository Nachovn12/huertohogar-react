import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Badge, Form } from 'react-bootstrap';
import Visibility from '@mui/icons-material/Visibility';
import Search from '@mui/icons-material/Search';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import LocalShipping from '@mui/icons-material/LocalShipping';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Cancel from '@mui/icons-material/Cancel';
import AccessTime from '@mui/icons-material/AccessTime';
import TrendingUp from '@mui/icons-material/TrendingUp';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Person from '@mui/icons-material/Person';
import Email from '@mui/icons-material/Email';
import LocationOn from '@mui/icons-material/LocationOn';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Inventory from '@mui/icons-material/Inventory';
import Close from '@mui/icons-material/Close';
import FilterList from '@mui/icons-material/FilterList';

const OrderManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Cargar pedidos del localStorage
  useEffect(() => {
    const loadOrders = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        // Transformar los pedidos al formato esperado por el componente
        const transformedOrders = storedOrders.map((order: any) => ({
          id: order.id,
          customerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
          customerEmail: order.customerInfo.email,
          total: order.total,
          status: order.status,
          items: order.items.length,
          date: new Date(order.date).toISOString().split('T')[0],
          shippingAddress: `${order.customerInfo.address}, ${order.customerInfo.commune}, ${order.customerInfo.city}`,
          products: order.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          paymentMethod: order.paymentMethod,
          subtotal: order.subtotal,
          discount: order.discount,
          shipping: order.shipping,
          couponCode: order.couponCode,
          phone: order.customerInfo.phone
        }));
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        setOrders([]);
      }
    };

    loadOrders();
    
    // Recargar cada 5 segundos para ver nuevos pedidos
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdateStatus = (orderId: any, newStatus: string) => {
    try {
      // Actualizar en localStorage
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = storedOrders.map((order: any) => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Actualizar estado local
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    const config: any = {
      pending: { 
        label: 'Pendiente', 
        color: '#f59e0b', 
        bg: '#fef3c7',
        icon: <AccessTime style={{ fontSize: '16px' }} />
      },
      processing: { 
        label: 'Procesando', 
        color: '#3b82f6', 
        bg: '#dbeafe',
        icon: <LocalShipping style={{ fontSize: '16px' }} />
      },
      completed: { 
        label: 'Completada', 
        color: '#10b981', 
        bg: '#dcfce7',
        icon: <CheckCircle style={{ fontSize: '16px' }} />
      },
      cancelled: { 
        label: 'Cancelada', 
        color: '#ef4444', 
        bg: '#fee2e2',
        icon: <Cancel style={{ fontSize: '16px' }} />
      }
    };
    return config[status] || config.pending;
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchLower) ||
      order.id.toString().includes(searchTerm) ||
      order.customerEmail.toLowerCase().includes(searchLower);
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Estadísticas
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0)
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            color: '#1f2937',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '4px',
              height: '28px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '2px'
            }} />
            Gestión de Órdenes
          </h1>
          <p style={{ margin: '8px 0 0 16px', color: '#6b7280', fontSize: '0.9rem' }}>
            Administra y da seguimiento a todos los pedidos
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Total Órdenes */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: '16px',
          padding: '20px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.2 }}>
            <ShoppingCart style={{ fontSize: '80px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShoppingCart style={{ fontSize: '20px' }} />
            <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Total Órdenes</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>{stats.total}</h2>
        </div>

        {/* Pendientes */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <AccessTime style={{ fontSize: '20px' }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Pendientes</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</h2>
        </div>

        {/* Procesando */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6'
            }}>
              <LocalShipping style={{ fontSize: '20px' }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>En Proceso</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#3b82f6' }}>{stats.processing}</h2>
        </div>

        {/* Completadas */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <CheckCircle style={{ fontSize: '20px' }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Completadas</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>{stats.completed}</h2>
        </div>

        {/* Ingresos */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '20px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.2 }}>
            <AttachMoney style={{ fontSize: '80px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <AttachMoney style={{ fontSize: '20px' }} />
            <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>Ingresos</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>${stats.totalRevenue.toLocaleString('es-CL')}</h2>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '20px'
          }} />
          <input
            type="text"
            placeholder="Buscar por ID, nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px 12px 44px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FilterList style={{ color: '#6b7280', fontSize: '20px' }} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '0.9rem',
              outline: 'none',
              cursor: 'pointer',
              background: '#fff',
              minWidth: '180px'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="processing">En Proceso</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>

        <div style={{
          background: '#f0fdf4',
          padding: '10px 18px',
          borderRadius: '20px',
          color: '#059669',
          fontWeight: 600,
          fontSize: '0.875rem'
        }}>
          {filteredOrders.length} órdenes
        </div>
      </div>

      {/* Tabla de órdenes */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        <Table hover responsive style={{ marginBottom: 0 }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>ID Orden</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Cliente</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Fecha</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Items</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Total</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb' }}>Estado</th>
              <th style={{ padding: '16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 700, color: '#10b981' }}>#{order.id}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, color: '#1f2937' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{order.customerEmail}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>{formatDate(order.date)}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{
                      background: '#f3f4f6',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: '#374151'
                    }}>
                      {order.items}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 700, color: '#1f2937' }}>
                    ${order.total.toLocaleString('es-CL')}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: statusConfig.bg,
                      color: statusConfig.color,
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleViewOrder(order)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 16px',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Visibility style={{ fontSize: '18px' }} />
                      Ver
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        
        {filteredOrders.length === 0 && (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
              No se encontraron órdenes
            </p>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg" 
        centered
        backdrop="static"
        dialogClassName="modal-90w"
        backdropClassName="modal-backdrop-dark"
      >
        {selectedOrder && (
          <>
            {/* Header del Modal */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '24px 32px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingCart style={{ fontSize: '26px' }} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                    Orden #{selectedOrder.id}
                  </h2>
                  <span style={{ opacity: 0.9, fontSize: '0.9rem' }}>
                    {formatDate(selectedOrder.date)}
                  </span>
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
                  color: '#fff'
                }}
              >
                <Close style={{ fontSize: '24px' }} />
              </button>
            </div>

            {/* Cuerpo del Modal */}
            <div style={{ 
              padding: '28px 32px',
              background: '#f9fafb',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              {/* Estado actual */}
              <div style={{
                background: '#fff',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#374151' }}>Estado actual:</span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: getStatusConfig(selectedOrder.status).bg,
                    color: getStatusConfig(selectedOrder.status).color,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 600
                  }}>
                    {getStatusConfig(selectedOrder.status).icon}
                    {getStatusConfig(selectedOrder.status).label}
                  </span>
                </div>
              </div>

              {/* Grid de 2 columnas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Info Cliente */}
                <div style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Person style={{ color: '#10b981', fontSize: '20px' }} />
                    Información del Cliente
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Person style={{ color: '#9ca3af', fontSize: '18px' }} />
                      <span style={{ color: '#374151' }}>{selectedOrder.customerName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Email style={{ color: '#9ca3af', fontSize: '18px' }} />
                      <span style={{ color: '#374151' }}>{selectedOrder.customerEmail}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <LocationOn style={{ color: '#9ca3af', fontSize: '18px' }} />
                      <span style={{ color: '#374151' }}>{selectedOrder.shippingAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Resumen */}
                <div style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ 
                    margin: '0 0 16px 0', 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Inventory style={{ color: '#10b981', fontSize: '20px' }} />
                    Resumen del Pedido
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Fecha:</span>
                      <span style={{ fontWeight: 500, color: '#374151' }}>{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Items:</span>
                      <span style={{ fontWeight: 500, color: '#374151' }}>{selectedOrder.items} productos</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Total:</span>
                      <span style={{ fontWeight: 700, color: '#10b981', fontSize: '1.25rem' }}>
                        ${selectedOrder.total.toLocaleString('es-CL')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div style={{
                background: '#fff',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #e5e7eb',
                marginBottom: '20px'
              }}>
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShoppingCart style={{ color: '#10b981', fontSize: '20px' }} />
                  Productos
                </h4>
                <Table hover style={{ marginBottom: 0 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '12px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem' }}>Producto</th>
                      <th style={{ padding: '12px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textAlign: 'center' }}>Cantidad</th>
                      <th style={{ padding: '12px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textAlign: 'right' }}>Precio</th>
                      <th style={{ padding: '12px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((product: any, index: number) => (
                      <tr key={index}>
                        <td style={{ padding: '12px', fontWeight: 500, color: '#374151' }}>{product.name}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#6b7280' }}>{product.quantity}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#6b7280' }}>${product.price.toLocaleString('es-CL')}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#10b981' }}>
                          ${(product.price * product.quantity).toLocaleString('es-CL')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Cambiar estado */}
              <div style={{
                background: '#fff',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <TrendingUp style={{ color: '#10b981', fontSize: '20px' }} />
                  Actualizar Estado
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {[
                    { status: 'pending', label: 'Pendiente', icon: '⏳', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
                    { status: 'processing', label: 'Procesando', icon: '📦', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
                    { status: 'completed', label: 'Completada', icon: '✓', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                    { status: 'cancelled', label: 'Cancelar', icon: '✕', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
                  ].map(item => (
                    <button
                      key={item.status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, item.status)}
                      disabled={selectedOrder.status === item.status}
                      style={{
                        background: selectedOrder.status === item.status ? '#d1d5db' : item.gradient,
                        border: 'none',
                        borderRadius: '10px',
                        padding: '10px 18px',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: selectedOrder.status === item.status ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        opacity: selectedOrder.status === item.status ? 0.6 : 1
                      }}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div style={{
              padding: '20px 32px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#fff'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: '#6b7280',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Close style={{ fontSize: '18px' }} />
                Cerrar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
