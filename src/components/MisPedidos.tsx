import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    commune: string;
  };
  couponCode?: string;
}

const MisPedidos: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Cargar pedidos del localStorage
    const loadOrders = () => {
      try {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Filtrar pedidos del usuario actual
        const userOrders = allOrders.filter((order: Order) => 
          order.customerInfo.email === user?.email
        );
        
        // Ordenar por fecha descendente (más recientes primero)
        userOrders.sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(userOrders);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        setOrders([]);
      }
    };

    loadOrders();
  }, [isAuthenticated, user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
      pending: { 
        label: 'Pendiente', 
        icon: <AccessTimeIcon />, 
        className: 'status-pending' 
      },
      processing: { 
        label: 'En Proceso', 
        icon: <ShoppingBagOutlinedIcon />, 
        className: 'status-processing' 
      },
      shipped: { 
        label: 'Enviado', 
        icon: <LocalShippingOutlinedIcon />, 
        className: 'status-shipped' 
      },
      delivered: { 
        label: 'Entregado', 
        icon: <CheckCircleOutlineIcon />, 
        className: 'status-delivered' 
      },
      cancelled: { 
        label: 'Cancelado', 
        icon: <CancelOutlinedIcon />, 
        className: 'status-cancelled' 
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap: Record<string, string> = {
      'credit-card': 'Tarjeta de Crédito/Débito',
      'webpay': 'WebPay',
      'mercadopago': 'Mercado Pago',
      'transfer': 'Transferencia Bancaria',
      'google-pay': 'Google Pay',
      'apple-pay': 'Apple Pay'
    };
    return methodMap[method] || method;
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="mis-pedidos-page">
      <div className="mis-pedidos-container">
        <div className="mis-pedidos-header">
          <ShoppingBagOutlinedIcon style={{ fontSize: '2.5rem', color: '#16a34a' }} />
          <h1>Mis Pedidos</h1>
          <p>Revisa el historial de tus compras</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <ShoppingBagOutlinedIcon style={{ fontSize: '4rem', color: '#d1d5db' }} />
            <h2>No tienes pedidos aún</h2>
            <p>Cuando realices tu primera compra, aparecerá aquí</p>
            <button className="btn-primary" onClick={() => navigate('/productos')}>
              Ir a comprar
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-info">
                      <span className="order-id">Pedido #{order.id}</span>
                      <span className="order-date">{formatDate(order.date)}</span>
                    </div>
                    <div className={`order-status ${statusInfo.className}`}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-items">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="order-item-preview">
                          <img src={item.image} alt={item.name} />
                          <div className="order-item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="order-more-items">
                          +{order.items.length - 3} más
                        </div>
                      )}
                    </div>

                    <div className="order-summary">
                      <div className="order-total">
                        <span>Total</span>
                        <strong>{formatPrice(order.total)}</strong>
                      </div>
                      <div className="order-payment">
                        <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <button 
                      className="btn-view-details"
                      onClick={() => viewOrderDetails(order)}
                    >
                      <VisibilityOutlinedIcon />
                      Ver Detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de detalles del pedido */}
      {showModal && selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <h2>Detalles del Pedido</h2>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="order-modal-body">
              <div className="order-detail-section">
                <h3>Información del Pedido</h3>
                <div className="detail-row">
                  <span>Número de Pedido:</span>
                  <strong>#{selectedOrder.id}</strong>
                </div>
                <div className="detail-row">
                  <span>Fecha:</span>
                  <strong>{formatDate(selectedOrder.date)}</strong>
                </div>
                <div className="detail-row">
                  <span>Estado:</span>
                  <div className={`order-status ${getStatusInfo(selectedOrder.status).className}`}>
                    {getStatusInfo(selectedOrder.status).icon}
                    <span>{getStatusInfo(selectedOrder.status).label}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <span>Método de Pago:</span>
                  <strong>{getPaymentMethodLabel(selectedOrder.paymentMethod)}</strong>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Información de Envío</h3>
                <div className="detail-row">
                  <span>Nombre:</span>
                  <strong>{selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</strong>
                </div>
                <div className="detail-row">
                  <span>Teléfono:</span>
                  <strong>{selectedOrder.customerInfo.phone}</strong>
                </div>
                <div className="detail-row">
                  <span>Dirección:</span>
                  <strong>{selectedOrder.customerInfo.address}, {selectedOrder.customerInfo.commune}, {selectedOrder.customerInfo.city}</strong>
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Productos</h3>
                <div className="order-items-detail">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="order-item-detail">
                      <img src={item.image} alt={item.name} />
                      <div className="item-detail-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">Cantidad: {item.quantity}</span>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-detail-section">
                <h3>Resumen de Pago</h3>
                <div className="detail-row">
                  <span>Subtotal:</span>
                  <strong>{formatPrice(selectedOrder.subtotal)}</strong>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="detail-row discount">
                    <span>Descuento {selectedOrder.couponCode && `(${selectedOrder.couponCode})`}:</span>
                    <strong>-{formatPrice(selectedOrder.discount)}</strong>
                  </div>
                )}
                <div className="detail-row">
                  <span>Envío:</span>
                  <strong>{selectedOrder.shipping === 0 ? 'GRATIS' : formatPrice(selectedOrder.shipping)}</strong>
                </div>
                <div className="detail-row total">
                  <span>Total:</span>
                  <strong>{formatPrice(selectedOrder.total)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
