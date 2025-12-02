import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Importar iconos
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WavingHandIcon from '@mui/icons-material/WavingHand';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    // Obtener hora para saludo
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    // Fecha actual formateada
    const currentDate = new Date().toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // KPIs principales
    const kpis = [
        {
            title: 'Ventas del Mes',
            value: '$2.450.000',
            change: '+12.5%',
            isPositive: true,
            subtitle: 'vs mes anterior',
            icon: <AttachMoneyIcon />,
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            title: 'Órdenes',
            value: '1,234',
            change: '+8.2%',
            isPositive: true,
            subtitle: 'este mes',
            icon: <ShoppingCartIcon />,
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            title: 'Productos',
            value: '400',
            change: '-2.1%',
            isPositive: false,
            subtitle: 'en inventario',
            icon: <InventoryIcon />,
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        },
        {
            title: 'Usuarios',
            value: '890',
            change: '+15.3%',
            isPositive: true,
            subtitle: 'registrados',
            icon: <PeopleIcon />,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        }
    ];

    // Actividad reciente
    const recentActivity = [
        { id: 1, type: 'order', message: 'Nueva orden #1234 recibida', time: 'Hace 5 min', icon: <ShoppingCartIcon />, color: '#3b82f6' },
        { id: 2, type: 'user', message: 'Nuevo usuario registrado: María G.', time: 'Hace 15 min', icon: <PeopleIcon />, color: '#10b981' },
        { id: 3, type: 'product', message: 'Stock bajo: Tomates Cherry', time: 'Hace 30 min', icon: <InventoryIcon />, color: '#f59e0b' },
        { id: 4, type: 'shipping', message: 'Pedido #1230 enviado', time: 'Hace 1 hora', icon: <LocalShippingIcon />, color: '#8b5cf6' },
        { id: 5, type: 'order', message: 'Orden #1229 completada', time: 'Hace 2 horas', icon: <ShoppingCartIcon />, color: '#10b981' }
    ];

    // Ventas de la semana (para mini gráfico)
    const weekSales = [
        { day: 'Lun', value: 85 },
        { day: 'Mar', value: 65 },
        { day: 'Mié', value: 90 },
        { day: 'Jue', value: 70 },
        { day: 'Vie', value: 95 },
        { day: 'Sáb', value: 100 },
        { day: 'Dom', value: 55 }
    ];
    const maxSale = Math.max(...weekSales.map(s => s.value));

    // Módulos del sistema
    const modules = [
        { title: 'Dashboard', description: 'Visión general y estadísticas', icon: <DashboardIcon />, color: '#3b82f6', path: '/admin/dashboard' },
        { title: 'Órdenes', description: 'Gestión de pedidos', icon: <ShoppingCartIcon />, color: '#10b981', path: '/admin/ordenes' },
        { title: 'Productos', description: 'Inventario y catálogo', icon: <InventoryIcon />, color: '#8b5cf6', path: '/admin/productos' },
        { title: 'Categorías', description: 'Organización de productos', icon: <CategoryIcon />, color: '#f59e0b', path: '/admin/categorias' },
        { title: 'Usuarios', description: 'Gestión de cuentas', icon: <PeopleIcon />, color: '#ec4899', path: '/admin/usuarios' },
        { title: 'Reportes', description: 'Análisis y métricas', icon: <AssessmentIcon />, color: '#06b6d4', path: '/admin/reportes' },
        { title: 'Perfil', description: 'Tu información', icon: <PersonIcon />, color: '#6366f1', path: '/admin/perfil' },
        { title: 'Tienda', description: 'Ver tienda en vivo', icon: <StoreIcon />, color: '#059669', path: '/productos' }
    ];

    return (
        <div style={{ padding: '0', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header con saludo */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '28px',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decoración de fondo */}
                <div style={{
                    position: 'absolute',
                    right: '-50px',
                    top: '-50px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)'
                }} />
                <div style={{
                    position: 'absolute',
                    right: '100px',
                    bottom: '-30px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)'
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <WavingHandIcon style={{ fontSize: '28px' }} />
                        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>
                            {getGreeting()}, Administrador
                        </h1>
                    </div>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', textTransform: 'capitalize' }}>
                        {currentDate}
                    </p>
                </div>
            </div>

            {/* KPIs Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
                marginBottom: '28px'
            }}>
                {kpis.map((kpi, index) => (
                    <div key={index} style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>
                                    {kpi.title}
                                </p>
                                <h2 style={{ margin: '0 0 12px 0', fontSize: '1.875rem', fontWeight: 700, color: '#1f2937' }}>
                                    {kpi.value}
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '2px',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        background: kpi.isPositive ? '#dcfce7' : '#fee2e2',
                                        color: kpi.isPositive ? '#16a34a' : '#dc2626'
                                    }}>
                                        {kpi.isPositive ? <TrendingUpIcon style={{ fontSize: '16px' }} /> : <TrendingDownIcon style={{ fontSize: '16px' }} />}
                                        {kpi.change}
                                    </span>
                                    <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{kpi.subtitle}</span>
                                </div>
                            </div>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: kpi.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff'
                            }}>
                                {React.cloneElement(kpi.icon, { style: { fontSize: '28px' } })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sección de gráficos y actividad */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 380px',
                gap: '24px',
                marginBottom: '28px'
            }}>
                {/* Gráfico de ventas de la semana */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                                Ventas de la Semana
                            </h3>
                            <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                                Rendimiento diario
                            </p>
                        </div>
                        <div style={{
                            background: '#f0fdf4',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            color: '#059669',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}>
                            +18.2% esta semana
                        </div>
                    </div>
                    
                    {/* Mini gráfico de barras */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'flex-end', 
                        justifyContent: 'space-between',
                        height: '180px',
                        padding: '0 10px'
                    }}>
                        {weekSales.map((sale, index) => (
                            <div key={index} style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                gap: '8px',
                                flex: 1
                            }}>
                                <div style={{
                                    width: '100%',
                                    maxWidth: '45px',
                                    height: `${(sale.value / maxSale) * 140}px`,
                                    background: index === weekSales.length - 2 
                                        ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' 
                                        : 'linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(180deg, #10b981 0%, #059669 100%)';
                                }}
                                onMouseLeave={(e) => {
                                    if (index !== weekSales.length - 2) {
                                        e.currentTarget.style.background = 'linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)';
                                    }
                                }}
                                />
                                <span style={{ 
                                    color: '#6b7280', 
                                    fontSize: '0.75rem',
                                    fontWeight: 500
                                }}>
                                    {sale.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                            Actividad Reciente
                        </h3>
                        <AccessTimeIcon style={{ color: '#9ca3af', fontSize: '20px' }} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recentActivity.map((activity) => (
                            <div key={activity.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '12px',
                                borderRadius: '12px',
                                background: '#f9fafb',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f0fdf4';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f9fafb';
                            }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: `${activity.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: activity.color,
                                    flexShrink: 0
                                }}>
                                    {React.cloneElement(activity.icon, { style: { fontSize: '20px' } })}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ 
                                        margin: 0, 
                                        fontSize: '0.875rem', 
                                        color: '#374151',
                                        fontWeight: 500,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {activity.message}
                                    </p>
                                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                        {activity.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Accesos Rápidos */}
            <div>
                <h3 style={{ 
                    margin: '0 0 20px 0', 
                    fontSize: '1.1rem', 
                    fontWeight: 700, 
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <div style={{
                        width: '4px',
                        height: '20px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '2px'
                    }} />
                    Accesos Rápidos
                </h3>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px'
                }}>
                    {modules.map((module, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(module.path)}
                            style={{
                                background: '#fff',
                                borderRadius: '14px',
                                padding: '20px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = module.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${module.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: module.color,
                                flexShrink: 0
                            }}>
                                {React.cloneElement(module.icon, { style: { fontSize: '24px' } })}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ 
                                    margin: '0 0 4px 0', 
                                    fontSize: '0.95rem', 
                                    fontWeight: 600,
                                    color: '#1f2937'
                                }}>
                                    {module.title}
                                </h4>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '0.8rem', 
                                    color: '#6b7280'
                                }}>
                                    {module.description}
                                </p>
                            </div>
                            <ArrowForwardIcon style={{ 
                                color: '#d1d5db', 
                                fontSize: '20px',
                                transition: 'all 0.2s ease'
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
