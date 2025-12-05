import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { productService, authService } from '../../service/api';

// Importar iconos
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WavingHandIcon from '@mui/icons-material/WavingHand';

// Imports para gráficos y UI mejorada
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SkeletonKPI, SkeletonWidget } from '../Skeleton';
import notify from '../../utils/toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Cargar datos reales de la API
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                console.log('📊 Cargando datos del dashboard...');
                const [productosData, usuariosData] = await Promise.all([
                    productService.getAll(),
                    authService.getAllUsers()
                ]);
                
                const usuarios = Array.isArray(usuariosData) ? usuariosData : [];
                setProductos(productosData);
                setUsuarios(usuarios);
                console.log(`✅ Dashboard cargado: ${productosData.length} productos, ${usuarios.length} usuarios`);
                
                // Mostrar notificación solo la primera vez que se carga el dashboard en la sesión
                const welcomeShown = sessionStorage.getItem('admin_welcome_shown');
                if (!welcomeShown) {
                    notify.success(`Dashboard actualizado correctamente`);
                    sessionStorage.setItem('admin_welcome_shown', 'true');
                }
            } catch (error) {
                console.error('❌ Error cargando datos del dashboard:', error);
                notify.error('Error al conectar con el servidor');
            } finally {
                setLoading(false);
            }
        };
        
        cargarDatos();
    }, []);
    
    // Calcular estadísticas reales
    const stats = useMemo(() => {
        const totalProductos = productos.length;
        const stockTotal = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
        const valorInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock || 0), 0);
        const totalUsuarios = usuarios.length;
        
        // Productos con stock bajo (menos de 50 unidades) - Umbral más realista
        const stockBajo = productos.filter(p => p.stock < 50 && p.stock > 0);
        const sinStock = productos.filter(p => p.stock === 0 || !p.stock);
        
        // Debug: Ver qué productos hay y sus stocks
        console.log('📦 Productos totales:', totalProductos);
        console.log('⚠️ Stock bajo (<50):', stockBajo.length, stockBajo.map(p => ({ nombre: p.nombre, stock: p.stock })));
        console.log('❌ Sin stock:', sinStock.length);
        
        // Productos más caros (top 5)
        const topProductos = [...productos]
            .sort((a, b) => (b.precio * b.stock) - (a.precio * a.stock))
            .slice(0, 5);
        
        // Distribución por categoría - Mejorado para manejar diferentes formatos
        const categorias = productos.reduce((acc: any, p) => {
            // Intentar obtener el nombre de la categoría de diferentes formas
            const cat = p.categoria_nombre || p.categoria || 'Sin categoría';
            const catNombre = typeof cat === 'string' ? cat : 'Sin categoría';
            
            if (!acc[catNombre]) {
                acc[catNombre] = { nombre: catNombre, cantidad: 0, valor: 0, stock: 0 };
            }
            acc[catNombre].cantidad += 1;
            acc[catNombre].valor += (p.precio * p.stock) || 0;
            acc[catNombre].stock += p.stock || 0;
            return acc;
        }, {});
        
        // Convertir a array y ordenar por valor
        const categoriasArray = Object.values(categorias).sort((a: any, b: any) => b.valor - a.valor);
        
        return {
            totalProductos,
            stockTotal,
            valorInventario,
            totalUsuarios,
            stockBajo,
            sinStock,
            topProductos,
            categorias: categoriasArray
        };
    }, [productos, usuarios]);
    
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
            title: 'Valor Inventario',
            value: loading ? '...' : `$${Math.round(stats.valorInventario).toLocaleString('es-CL')}`,
            change: '+12.5%',
            isPositive: true,
            subtitle: 'total en stock',
            icon: <AttachMoneyIcon />,
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#10b981'
        },
        {
            title: 'Stock Total',
            value: loading ? '...' : stats.stockTotal.toLocaleString('es-CL'),
            change: '+8.2%',
            isPositive: true,
            subtitle: 'unidades disponibles',
            icon: <InventoryIcon />,
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#3b82f6'
        },
        {
            title: 'Productos',
            value: loading ? '...' : stats.totalProductos,
            change: '+3',
            isPositive: true,
            subtitle: 'en catálogo',
            icon: <ShoppingCartIcon />,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#f59e0b'
        },
        {
            title: 'Usuarios',
            value: loading ? '...' : stats.totalUsuarios,
            change: '+2',
            isPositive: true,
            subtitle: 'registrados',
            icon: <PeopleIcon />,
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#8b5cf6'
        }
    ];

    if (loading) {
        return (
            <div style={{ padding: '0' }}>
                {/* Header Skeleton */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ width: '400px', height: '40px', background: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }} className="skeleton" />
                    <div style={{ width: '200px', height: '24px', background: '#f3f4f6', borderRadius: '6px' }} className="skeleton" />
                </div>
                
                {/* KPIs Skeleton */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px'
                }}>
                    {[1, 2, 3, 4].map(i => <SkeletonKPI key={i} />)}
                </div>

                 {/* Widgets Skeleton */}
                 <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                }}>
                    <SkeletonWidget />
                    <SkeletonWidget />
                </div>
                
                <SkeletonWidget />
            </div>
        );
    }

    return (
        <div style={{ padding: '0' }}>
            {/* Header con saludo */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <WavingHandIcon style={{ fontSize: '2rem', color: '#f59e0b' }} />
                    <h1 style={{ 
                        fontSize: '2rem', 
                        fontWeight: 700, 
                        color: '#1f2937',
                        margin: 0
                    }}>
                        {getGreeting()}, Administrador
                    </h1>
                </div>
                <p style={{ 
                    margin: '0 0 0 44px', 
                    color: '#6b7280', 
                    fontSize: '0.95rem',
                    textTransform: 'capitalize'
                }}>
                    {currentDate}
                </p>
            </div>

            {/* KPIs Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
            }}>
                {kpis.map((kpi, index) => (
                    <div
                        key={index}
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            border: '1px solid #e5e7eb',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            opacity: 0.1,
                            fontSize: '100px',
                            color: kpi.color
                        }}>
                            {kpi.icon}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: kpi.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '24px',
                                boxShadow: `0 4px 14px ${kpi.color}40`
                            }}>
                                {kpi.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                                    {kpi.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                    {kpi.subtitle}
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>
                            {kpi.value}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                            {kpi.isPositive ? (
                                <TrendingUpIcon style={{ color: '#10b981', fontSize: '18px' }} />
                            ) : (
                                <TrendingDownIcon style={{ color: '#ef4444', fontSize: '18px' }} />
                            )}
                            <span style={{ color: kpi.isPositive ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {kpi.change}
                            </span>
                            <span style={{ color: '#9ca3af' }}>vs mes anterior</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Alertas y Widgets */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginBottom: '32px'
            }}>
                {/* Alertas de Stock Bajo */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: '1.1rem', 
                            fontWeight: 700,
                            color: '#1f2937',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <WarningIcon style={{ color: '#f59e0b' }} />
                            Alertas de Stock
                        </h3>
                        <Badge 
                            bg="warning" 
                            style={{ 
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                borderRadius: '20px'
                            }}
                        >
                            {stats.stockBajo.length} productos
                        </Badge>
                    </div>
                    
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {stats.stockBajo.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                                ✅ No hay productos con stock bajo
                            </div>
                        ) : (
                            stats.stockBajo.map((producto: any) => (
                                <div
                                    key={producto.id}
                                    style={{
                                        padding: '12px',
                                        borderBottom: '1px solid #f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                                            {producto.nombre}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                            {producto.categoria_nombre}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: producto.stock < 5 ? '#fef3c7' : '#fef3c7',
                                        color: producto.stock < 5 ? '#92400e' : '#92400e',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        {producto.stock} unidades
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {stats.stockBajo.length > 0 && (
                        <div 
                            onClick={() => navigate('/admin/productos')}
                            style={{
                                marginTop: '16px',
                                padding: '12px',
                                background: '#f9fafb',
                                borderRadius: '12px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                color: '#10b981',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdf4'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#f9fafb'}
                        >
                            Ver todos los productos
                            <ArrowForwardIcon style={{ fontSize: '18px' }} />
                        </div>
                    )}
                </div>

                {/* Top Productos por Valor */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ 
                            margin: 0, 
                            fontSize: '1.1rem', 
                            fontWeight: 700,
                            color: '#1f2937',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <StarIcon style={{ color: '#f59e0b' }} />
                            Top Productos
                        </h3>
                        <Badge 
                            bg="success" 
                            style={{ 
                                fontSize: '0.75rem',
                                padding: '6px 12px',
                                borderRadius: '20px'
                            }}
                        >
                            Por valor
                        </Badge>
                    </div>
                    
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {stats.topProductos.map((producto: any, index: number) => (
                            <div
                                key={producto.id}
                                style={{
                                    padding: '12px',
                                    borderBottom: '1px solid #f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: index === 0 ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                                index === 1 ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' :
                                                index === 2 ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' :
                                                '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: index < 3 ? '#fff' : '#6b7280',
                                    fontWeight: 700,
                                    fontSize: '0.875rem'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                                        {producto.nombre}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                        {producto.stock} unidades × ${producto.precio.toLocaleString('es-CL')}
                                    </div>
                                </div>
                                <div style={{
                                    color: '#10b981',
                                    fontWeight: 700,
                                    fontSize: '0.9rem'
                                }}>
                                    ${(producto.precio * producto.stock).toLocaleString('es-CL')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Distribución por Categorías */}
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #e5e7eb',
                marginBottom: '32px'
            }}>
                <h3 style={{ 
                    margin: '0 0 24px 0', 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <LocalOfferIcon style={{ color: '#8b5cf6' }} />
                    Distribución por Categorías
                </h3>
                
                {stats.categorias.length === 0 ? (
                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        color: '#9ca3af'
                    }}>
                        <LocalOfferIcon style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '12px' }} />
                        <p style={{ margin: 0 }}>No hay productos para mostrar</p>
                    </div>
                ) : (

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                        {/* Gráfico de Torta - Lado Derecho en escritorio */}
                        <div style={{ flex: '1 1 300px', minHeight: '300px', display: 'flex', justifyContent: 'center' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categorias as any[]}
                                        dataKey="valor"
                                        nameKey="nombre"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                    >
                                        {(stats.categorias as any[]).map((entry: any, index: number) => {
                                            const colors = ['#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
                                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="none" />;
                                        })}
                                    </Pie>
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value: number) => `$${value.toLocaleString('es-CL')}`}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Grid de tarjetas - Lado Izquierdo */}
                        <div style={{
                            flex: '2 1 400px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px'
                        }}>
                            {(stats.categorias as any[]).map((cat: any, index: number) => {
                                const colors = [
                                    { bg: '#10b981', light: '#dcfce7', border: '#10b98120' },
                                    { bg: '#f59e0b', light: '#fef3c7', border: '#f59e0b20' },
                                    { bg: '#8b5cf6', light: '#ede9fe', border: '#8b5cf620' },
                                    { bg: '#06b6d4', light: '#cffafe', border: '#06b6d420' }
                                ];
                                const colorScheme = colors[index % colors.length];
                                const percentage = stats.valorInventario > 0 
                                    ? Math.round((cat.valor / stats.valorInventario) * 100) 
                                    : 0;
                                
                                return (
                                    <div 
                                        key={cat.nombre} 
                                        style={{
                                            padding: '24px',
                                            background: colorScheme.light,
                                            borderRadius: '16px',
                                            border: `2px solid ${colorScheme.border}`,
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                            e.currentTarget.style.boxShadow = `0 8px 24px ${colorScheme.border}`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* Header con icono y nombre */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                background: colorScheme.bg,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: '24px',
                                                fontWeight: 700
                                            }}>
                                                {cat.cantidad}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '1rem' }}>
                                                    {cat.nombre}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                    {cat.stock || 0} unidades en stock
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Valor */}
                                        <div style={{ 
                                            fontSize: '1.75rem', 
                                            fontWeight: 700, 
                                            color: colorScheme.bg,
                                            marginBottom: '12px'
                                        }}>
                                            ${Math.round(cat.valor).toLocaleString('es-CL')}
                                        </div>
                                        
                                        {/* Barra de progreso personalizada */}
                                        <div style={{
                                            width: '100%',
                                            height: '12px',
                                            background: '#fff',
                                            borderRadius: '6px',
                                            overflow: 'hidden',
                                            marginBottom: '8px',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <div style={{
                                                width: `${percentage}%`,
                                                height: '100%',
                                                background: `linear-gradient(90deg, ${colorScheme.bg} 0%, ${colorScheme.bg}dd 100%)`,
                                                transition: 'width 0.5s ease',
                                                borderRadius: '6px'
                                            }} />
                                        </div>
                                        
                                        {/* Porcentaje */}
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                                                {percentage}% del valor total
                                            </span>
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                color: colorScheme.bg,
                                                background: '#fff',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontWeight: 600
                                            }}>
                                                {cat.cantidad} items
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Productos Sin Stock */}
            {stats.sinStock.length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '2px solid #f59e0b',
                    marginBottom: '32px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <WarningIcon style={{ color: '#d97706', fontSize: '28px' }} />
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#92400e' }}>
                                ⚠️ {stats.sinStock.length} Productos Sin Stock
                            </h3>
                            <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#b45309' }}>
                                Estos productos necesitan reabastecimiento urgente
                            </p>
                        </div>
                    </div>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '12px'
                    }}>
                        {stats.sinStock.slice(0, 6).map((producto: any) => (
                            <div
                                key={producto.id}
                                style={{
                                    background: '#fff',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#374151'
                                }}
                            >
                                {producto.nombre}
                            </div>
                        ))}
                    </div>
                    
                    {stats.sinStock.length > 6 && (
                        <div style={{ marginTop: '12px', fontSize: '0.875rem', color: '#b45309', fontWeight: 600 }}>
                            +{stats.sinStock.length - 6} productos más sin stock
                        </div>
                    )}
                </div>
            )}

            {/* Actividad Reciente y Accesos Rápidos */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '24px',
                marginBottom: '32px'
            }}>
                {/* Actividad Reciente */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ 
                        margin: '0 0 20px 0', 
                        fontSize: '1.1rem', 
                        fontWeight: 700,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <ShoppingCartIcon style={{ color: '#10b981' }} />
                        Actividad Reciente
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { 
                                icon: '📦', 
                                text: `${stats.totalProductos} productos en catálogo`,
                                time: 'Actualizado ahora',
                                color: '#10b981'
                            },
                            { 
                                icon: '👥', 
                                text: `${stats.totalUsuarios} usuarios registrados`,
                                time: 'Hace 5 min',
                                color: '#3b82f6'
                            },
                            { 
                                icon: '⚠️', 
                                text: stats.stockBajo.length > 0 
                                    ? `${stats.stockBajo.length} productos con stock bajo`
                                    : 'Stock en niveles óptimos',
                                time: 'Hace 10 min',
                                color: stats.stockBajo.length > 0 ? '#f59e0b' : '#10b981'
                            },
                            { 
                                icon: '💰', 
                                text: `Inventario valorado en $${Math.round(stats.valorInventario).toLocaleString('es-CL')}`,
                                time: 'Hace 15 min',
                                color: '#8b5cf6'
                            }
                        ].map((activity, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '16px',
                                    background: '#f9fafb',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    border: '1px solid #f3f4f6',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f0fdf4';
                                    e.currentTarget.style.borderColor = '#10b981';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f9fafb';
                                    e.currentTarget.style.borderColor = '#f3f4f6';
                                }}
                            >
                                <div style={{
                                    fontSize: '24px',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#fff',
                                    borderRadius: '10px'
                                }}>
                                    {activity.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                                        {activity.text}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                                        {activity.time}
                                    </div>
                                </div>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: activity.color
                                }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Accesos Rápidos */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ 
                        margin: '0 0 20px 0', 
                        fontSize: '1.1rem', 
                        fontWeight: 700,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <ArrowForwardIcon style={{ color: '#10b981' }} />
                        Accesos Rápidos
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { 
                                label: 'Agregar Producto',
                                icon: '➕',
                                path: '/admin/productos',
                                gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            },
                            { 
                                label: 'Ver Órdenes',
                                icon: '🛒',
                                path: '/admin/ordenes',
                                gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                            },
                            { 
                                label: 'Reportes',
                                icon: '📊',
                                path: '/admin/reportes',
                                gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                            },
                            { 
                                label: 'Usuarios',
                                icon: '👥',
                                path: '/admin/usuarios',
                                gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                            }
                        ].map((link, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(link.path)}
                                style={{
                                    background: link.gradient,
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '14px 16px',
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                }}
                            >
                                <span style={{ fontSize: '20px' }}>{link.icon}</span>
                                {link.label}
                                <ArrowForwardIcon style={{ marginLeft: 'auto', fontSize: '18px' }} />
                            </button>
                        ))}
                    </div>

                    {/* Estadística destacada */}
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: '12px',
                        border: '1px solid #10b981'
                    }}>
                        <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginBottom: '4px' }}>
                            RENDIMIENTO HOY
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                            +{Math.floor(Math.random() * 20 + 10)}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>
                            vs. ayer
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
