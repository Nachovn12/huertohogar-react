import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Importar iconos y colores para el diseño
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';

// Paleta de colores moderna y elegante
const COLORS = {
    primary: '#16a34a', // Verde HuertoHogar moderno
    secondary: '#2563eb', // Azul profesional
    warning: '#f59e0b', // Naranja elegante
    textLight: '#ffffff',
};

const AdminDashboard = () => {
    // Datos de estadísticas
    const stats = [
        {
            title: 'Órdenes',
            value: '1,234',
            subtitle: 'Probabilidad de aumento: 20%',
            bgColor: COLORS.secondary, // Azul
            icon: <ShoppingCartIcon style={{ fontSize: 36, color: COLORS.textLight }} />
        },
        {
            title: 'Productos',
            value: '400',
            subtitle: 'Inventario actual: 500',
            bgColor: COLORS.primary, // Verde HuertoHogar
            icon: <InventoryIcon style={{ fontSize: 36, color: COLORS.textLight }} />
        },
        {
            title: 'Usuarios',
            value: '890',
            subtitle: 'Nuevos usuarios este mes: 120',
            bgColor: COLORS.warning, // Amarillo/Naranja
            icon: <PeopleIcon style={{ fontSize: 36, color: COLORS.textLight }} />
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
        { title: 'Dashboard', description: 'Visión general de actividades y estadísticas clave del sistema.', icon: <DashboardIcon style={{ fontSize: 42, color: '#2563eb' }} /> },
        { title: 'Órdenes', description: 'Gestión y seguimiento de todas las órdenes de compras realizadas.', icon: <ShoppingCartIcon style={{ fontSize: 42, color: '#2563eb' }} /> },
        { title: 'Productos', description: 'Administrar inventario y detalles de los productos disponibles.', icon: <InventoryIcon style={{ fontSize: 42, color: '#2563eb' }} /> },
        { title: 'Categorías', description: 'Organizar productos en categorías para facilitar su navegación.', icon: <CategoryIcon style={{ fontSize: 42, color: '#2563eb' }} /> },
        { title: 'Usuarios', description: 'Gestión de cuentas de usuario y sus roles dentro del sistema.', icon: <PeopleIcon style={{ fontSize: 42, color: '#2563eb' }} /> },
        { title: 'Reportes', description: 'Generación de informes detallados sobre las operaciones del sistema.', icon: <AssessmentIcon style={{ fontSize: 42, color: '#2563eb' }} /> },
        { title: 'Perfil', description: 'Administración de la información personal y configuraciones de cuenta.', icon: <PersonIcon style={{ fontSize: 42, color: '#2563eb' }} /> },
        { title: 'Tienda', description: 'Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios.', icon: <StoreIcon style={{ fontSize: 42, color: '#2563eb' }} /> }
    ];

    const navigate = useNavigate();

    const routeForModule = (title) => {
        const key = title.toLowerCase();
        if (key.includes('dashboard')) return '/admin/dashboard';
        if (key.includes('órden') || key.includes('orden')) return '/admin/ordenes';
        if (key.includes('producto')) return '/admin/productos';
        if (key.includes('categor')) return '/admin/categorias';
        if (key.includes('usuario')) return '/admin/usuarios';
        if (key.includes('reporte')) return '/admin/reportes';
        if (key.includes('perfil')) return '/admin/perfil';
        // tienda lleva a la ruta pública de productos
        if (key.includes('tienda')) return '/productos';
        return '/admin';
    };

    return (
        <Container fluid className="admin-dashboard p-4"> 
            {/* Header */}
            <div className="dashboard-header mb-5">
                <h1>Dashboard</h1>
                <p>Resumen de las actividades diarias</p>
            </div>

            {/* Tarjetas de Estadísticas (Key Performance Indicators) */}
            <Row className="mb-5 kpi-row">
                {stats.map((stat, index) => (
                    <Col key={index}>
                        <Card
                            className="stat-card text-white"
                            style={{
                                backgroundColor: stat.bgColor,
                                border: 'none'
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={`${stat.title} - ${stat.value}`}
                        >
                            <Card.Body>
                                <div className="stat-icon">
                                    {stat.icon}
                                </div>
                                <div className="stat-info text-start">
                                    <h6>{stat.title}</h6>
                                    <h1>{stat.value}</h1>
                                    <small>{stat.subtitle}</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Módulos del Sistema (Cards de Enlaces) */}
            <h3 style={{ fontWeight: 600, color: '#374151', marginBottom: '20px', marginTop: '40px', fontSize: '1.125rem' }}>Módulos del Sistema</h3>
            <div className="modules-grid">
                {modules.map((module, index) => {
                    const path = routeForModule(module.title);
                    return (
                        <div
                            className="module-card"
                            key={index}
                            role="link"
                            tabIndex={0}
                            aria-label={`Ir a ${module.title}`}
                            onClick={() => navigate(path)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(path); }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="module-left">
                                <div className="module-icon">{module.icon}</div>
                            </div>
                            <div className="module-body">
                                <div className="module-title">{module.title}</div>
                                <div className="module-description">{module.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Container>
    );
};

export default AdminDashboard;
