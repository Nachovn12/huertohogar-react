import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
// Importar iconos y colores para el diseño
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';

// Paleta de colores más moderna
const COLORS = {
    // Tonos de tu marca (Verde HuertoHogar)
    primary: '#4CAF50', // Verde vibrante para éxito
    secondary: '#1E88E5', // Azul fresco para información
    warning: '#FFA726', // Naranja/Amarillo para atención
    textLight: '#f8f9fa',
};

const AdminDashboard = () => {
    // Datos de estadísticas
    const stats = [
        {
            title: 'Órdenes',
            value: '1,234',
            subtitle: 'Probabilidad de aumento: 20%',
            bgColor: COLORS.secondary, // Azul
            icon: <ShoppingCartIcon style={{ fontSize: 40, color: COLORS.textLight }} />
        },
        {
            title: 'Productos',
            value: '400',
            subtitle: 'Inventario actual: 500',
            bgColor: COLORS.primary, // Verde HuertoHogar
            icon: <InventoryIcon style={{ fontSize: 40, color: COLORS.textLight }} />
        },
        {
            title: 'Usuarios',
            value: '890',
            subtitle: 'Nuevos usuarios este mes: 120',
            bgColor: COLORS.warning, // Amarillo/Naranja
            icon: <PeopleIcon style={{ fontSize: 40, color: COLORS.textLight }} />
        }
    ];

    // Estilos de la tarjeta de estadística para un look moderno
    const statCardStyle = {
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Sombra suave
        transition: 'transform 0.3s ease-in-out',
        cursor: 'pointer',
        // Efecto hover (ejemplo):
        // '&:hover': { transform: 'translateY(-5px)' } 
    };

    // Módulos del sistema
    const modules = [
        { title: 'Dashboard', description: 'Visión general de actividades y estadísticas clave del sistema.', icon: <DashboardIcon style={{ fontSize: 50, color: COLORS.secondary }} /> },
        { title: 'Órdenes', description: 'Gestión y seguimiento de todas las órdenes de compras realizadas.', icon: <ShoppingCartIcon style={{ fontSize: 50, color: COLORS.secondary }} /> },
        { title: 'Productos', description: 'Administrar inventario y detalles de los productos disponibles.', icon: <InventoryIcon style={{ fontSize: 50, color: COLORS.secondary }} /> },
        { title: 'Categorías', description: 'Organizar productos en categorías para facilitar su navegación.', icon: <CategoryIcon style={{ fontSize: 50, color: COLORS.secondary }} /> },
        { title: 'Usuarios', description: 'Gestión de cuentas de usuario y sus roles dentro del sistema.', icon: <PeopleIcon style={{ fontSize: 50, color: COLORS.secondary }} /> },
        { title: 'Reportes', description: 'Generación de informes detallados sobre las operaciones del sistema.', icon: <AssessmentIcon style={{ fontSize: 50, color: COLORS.secondary }} /> },
        { title: 'Perfil', description: 'Administración de la información personal y configuraciones de cuenta.', icon: <PersonIcon style={{ fontSize: 50, color: COLORS.secondary }} /> },
        { title: 'Tienda', description: 'Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios.', icon: <StoreIcon style={{ fontSize: 50, color: COLORS.secondary }} /> }
    ];

    return (
        <Container fluid className="p-4"> 
            {/* Header */}
            <div className="dashboard-header mb-5">
                <h1 style={{ fontWeight: 600, color: '#333' }}>Dashboard</h1>
                <p className="text-muted">Resumen de las actividades diarias</p>
            </div>

            {/* Tarjetas de Estadísticas (Key Performance Indicators) */}
            <Row className="mb-5">
                {stats.map((stat, index) => (
                    <Col lg={4} md={6} className="mb-4" key={index}>
                        <Card 
                            className="stat-card" 
                            style={{ 
                                ...statCardStyle,
                                backgroundColor: stat.bgColor, 
                                color: COLORS.textLight, 
                                border: 'none' 
                            }}
                        >
                            <Card.Body className="d-flex align-items-center justify-content-between p-4">
                                <div className="stat-info text-start">
                                    <h6 style={{ fontWeight: 400, opacity: 0.9 }}>{stat.title}</h6>
                                    <h1 className="mb-2" style={{ fontWeight: 700, fontSize: '2.5rem' }}>{stat.value}</h1>
                                    <small style={{ opacity: 0.8 }}>{stat.subtitle}</small>
                                </div>
                                <div className="stat-icon me-3">
                                    {stat.icon}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Módulos del Sistema (Cards de Enlaces) */}
            <h3 style={{ fontWeight: 500, color: '#555', marginBottom: '20px' }}>Módulos del Sistema</h3>
            <Row>
                {modules.map((module, index) => (
                    <Col lg={3} md={4} sm={6} className="mb-4" key={index}>
                        <Card 
                            className="module-card h-100 shadow-sm"
                            style={{ 
                                borderRadius: '8px', 
                                borderLeft: `5px solid ${COLORS.secondary}`, // Borde de acento
                                transition: 'box-shadow 0.3s',
                                cursor: 'pointer'
                            }}
                        >
                            <Card.Body className="text-start">
                                <div className="module-icon mb-3">
                                    {module.icon}
                                </div>
                                <h5 className="module-title" style={{ fontWeight: 600, color: '#333' }}>{module.title}</h5>
                                <p className="module-description text-muted small">
                                    {module.description}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AdminDashboard;
