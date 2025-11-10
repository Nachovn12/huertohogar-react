import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card, Badge } from 'react-bootstrap';
import { 
  Dashboard as DashboardIcon, 
  Inventory2 as ProductIcon, 
  People as UsersIcon, 
  ShoppingCart as OrdersIcon,
  TrendingUp,
  AttachMoney
} from '@mui/icons-material';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estadísticas simuladas (en un proyecto real vendrían de una API)
  const stats = {
    totalProducts: 100,
    totalUsers: 250,
    totalOrders: 89,
    revenue: 1250000
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'dashboard':
      default:
        return (
          <div>
            <h2 style={{ 
              fontFamily: 'Playfair Display, serif', 
              color: '#2E8B57',
              marginBottom: '2rem'
            }}>
              Dashboard General
            </h2>
            
            {/* Tarjetas de estadísticas */}
            <Row className="g-4 mb-4">
              <Col xs={12} md={6} lg={3}>
                <Card style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                          Total Productos
                        </p>
                        <h3 style={{ fontWeight: 700, marginBottom: 0 }}>
                          {stats.totalProducts}
                        </h3>
                      </div>
                      <ProductIcon style={{ fontSize: '3rem', opacity: 0.7 }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Card style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white'
                }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                          Total Usuarios
                        </p>
                        <h3 style={{ fontWeight: 700, marginBottom: 0 }}>
                          {stats.totalUsers}
                        </h3>
                      </div>
                      <UsersIcon style={{ fontSize: '3rem', opacity: 0.7 }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Card style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white'
                }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                          Total Órdenes
                        </p>
                        <h3 style={{ fontWeight: 700, marginBottom: 0 }}>
                          {stats.totalOrders}
                        </h3>
                      </div>
                      <OrdersIcon style={{ fontSize: '3rem', opacity: 0.7 }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Card style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white'
                }}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                          Ingresos
                        </p>
                        <h3 style={{ fontWeight: 700, marginBottom: 0 }}>
                          ${(stats.revenue / 1000).toFixed(0)}K
                        </h3>
                      </div>
                      <AttachMoney style={{ fontSize: '3rem', opacity: 0.7 }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Información adicional */}
            <Row className="g-4">
              <Col xs={12} lg={6}>
                <Card style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  height: '100%'
                }}>
                  <Card.Body>
                    <h5 style={{ color: '#2E8B57', marginBottom: '1rem', fontWeight: 700 }}>
                      <TrendingUp /> Actividad Reciente
                    </h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      <li style={{ padding: '0.8rem 0', borderBottom: '1px solid #f0f0f0' }}>
                        ✅ 5 nuevos productos agregados hoy
                      </li>
                      <li style={{ padding: '0.8rem 0', borderBottom: '1px solid #f0f0f0' }}>
                        👥 12 nuevos usuarios registrados
                      </li>
                      <li style={{ padding: '0.8rem 0', borderBottom: '1px solid #f0f0f0' }}>
                        📦 23 órdenes procesadas esta semana
                      </li>
                      <li style={{ padding: '0.8rem 0' }}>
                        💰 Ingresos aumentaron 15% este mes
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} lg={6}>
                <Card style={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  height: '100%'
                }}>
                  <Card.Body>
                    <h5 style={{ color: '#2E8B57', marginBottom: '1rem', fontWeight: 700 }}>
                      📊 Acciones Rápidas
                    </h5>
                    <div className="d-flex flex-column gap-2">
                      <button 
                        className="btn btn-outline-success"
                        onClick={() => setActiveTab('products')}
                        style={{ borderRadius: '12px', fontWeight: 600 }}
                      >
                        Agregar Nuevo Producto
                      </button>
                      <button 
                        className="btn btn-outline-success"
                        onClick={() => setActiveTab('orders')}
                        style={{ borderRadius: '12px', fontWeight: 600 }}
                      >
                        Ver Órdenes Pendientes
                      </button>
                      <button 
                        className="btn btn-outline-success"
                        onClick={() => setActiveTab('users')}
                        style={{ borderRadius: '12px', fontWeight: 600 }}
                      >
                        Gestionar Usuarios
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );
    }
  };

  return (
    <div style={{ background: '#f7faf7', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col xs={12} lg={2} className="mb-4">
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: '2rem'
            }}>
              <h4 style={{ 
                color: '#2E8B57', 
                marginBottom: '1.5rem',
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700
              }}>
                Admin Panel
              </h4>
              
              <Nav className="flex-column gap-2">
                <Nav.Link
                  active={activeTab === 'dashboard'}
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    borderRadius: '12px',
                    color: activeTab === 'dashboard' ? 'white' : '#2E8B57',
                    background: activeTab === 'dashboard' ? '#2E8B57' : 'transparent',
                    fontWeight: 600,
                    padding: '0.8rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <DashboardIcon fontSize="small" /> Dashboard
                </Nav.Link>

                <Nav.Link
                  active={activeTab === 'products'}
                  onClick={() => setActiveTab('products')}
                  style={{
                    borderRadius: '12px',
                    color: activeTab === 'products' ? 'white' : '#2E8B57',
                    background: activeTab === 'products' ? '#2E8B57' : 'transparent',
                    fontWeight: 600,
                    padding: '0.8rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <ProductIcon fontSize="small" /> Productos
                </Nav.Link>

                <Nav.Link
                  active={activeTab === 'users'}
                  onClick={() => setActiveTab('users')}
                  style={{
                    borderRadius: '12px',
                    color: activeTab === 'users' ? 'white' : '#2E8B57',
                    background: activeTab === 'users' ? '#2E8B57' : 'transparent',
                    fontWeight: 600,
                    padding: '0.8rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <UsersIcon fontSize="small" /> Usuarios
                </Nav.Link>

                <Nav.Link
                  active={activeTab === 'orders'}
                  onClick={() => setActiveTab('orders')}
                  style={{
                    borderRadius: '12px',
                    color: activeTab === 'orders' ? 'white' : '#2E8B57',
                    background: activeTab === 'orders' ? '#2E8B57' : 'transparent',
                    fontWeight: 600,
                    padding: '0.8rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <OrdersIcon fontSize="small" /> Órdenes
                </Nav.Link>
              </Nav>
            </div>
          </Col>

          {/* Contenido principal */}
          <Col xs={12} lg={10}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              minHeight: '600px'
            }}>
              {renderContent()}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPanel;
