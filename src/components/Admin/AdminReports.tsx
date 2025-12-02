import React, { useMemo, useState } from 'react';
import { Button, Table, Badge, ProgressBar } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import AttachMoney from '@mui/icons-material/AttachMoney';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Receipt from '@mui/icons-material/Receipt';
import FileDownload from '@mui/icons-material/FileDownload';
import BarChart from '@mui/icons-material/BarChart';
import PieChart from '@mui/icons-material/PieChart';

// Registrar locale español
registerLocale('es', es);

// Dataset de ventas de ejemplo (2025)
const sampleSales = [
  { id: 1, date: '2025-11-01', total: 15000, items: 8, category: 'Verduras', status: 'completado' },
  { id: 2, date: '2025-11-05', total: 8500, items: 5, category: 'Frutas', status: 'completado' },
  { id: 3, date: '2025-11-10', total: 4200, items: 3, category: 'Hierbas', status: 'completado' },
  { id: 4, date: '2025-11-15', total: 6200, items: 4, category: 'Verduras', status: 'completado' },
  { id: 5, date: '2025-11-20', total: 1900, items: 2, category: 'Legumbres', status: 'completado' },
  { id: 6, date: '2025-11-22', total: 12300, items: 7, category: 'Frutas', status: 'completado' },
  { id: 7, date: '2025-11-25', total: 9800, items: 6, category: 'Verduras', status: 'pendiente' },
  { id: 8, date: '2025-11-28', total: 5600, items: 4, category: 'Hierbas', status: 'completado' }
];

// Datos de categorías para el gráfico
const categoryData = [
  { name: 'Verduras', sales: 31000, percentage: 49, color: '#10b981' },
  { name: 'Frutas', sales: 20800, percentage: 33, color: '#f59e0b' },
  { name: 'Hierbas', sales: 9800, percentage: 15, color: '#8b5cf6' },
  { name: 'Legumbres', sales: 1900, percentage: 3, color: '#06b6d4' }
];

const AdminReports = () => {
  const [fromDate, setFromDate] = useState<Date>(new Date(2025, 10, 1)); // Nov 1, 2025
  const [toDate, setToDate] = useState<Date>(new Date(2025, 10, 30)); // Nov 30, 2025

  const filtered = useMemo(() => {
    return sampleSales.filter(s => {
      const d = new Date(s.date);
      return d >= fromDate && d <= toDate;
    });
  }, [fromDate, toDate]);

  const formatDateStr = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const totalSales = filtered.reduce((s, it) => s + it.total, 0);
  const totalOrders = filtered.length;
  const totalItems = filtered.reduce((s, it) => s + it.items, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  // Comparación con período anterior (simulado)
  const previousPeriodSales = 52000;
  const salesGrowth = ((totalSales - previousPeriodSales) / previousPeriodSales * 100).toFixed(1);
  const isPositiveGrowth = parseFloat(salesGrowth) >= 0;

  const exportCSV = () => {
    const rows = [
      ['ID', 'Fecha', 'Total', 'Items', 'Categoría', 'Estado'],
      ...filtered.map(r => [r.id, r.date, r.total, r.items, r.category, r.status])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_ventas_${formatDateStr(fromDate)}_${formatDateStr(toDate)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            Reportes y Análisis
          </h1>
          <p style={{ margin: '8px 0 0 16px', color: '#6b7280', fontSize: '0.9rem' }}>
            Analiza el rendimiento de tu tienda
          </p>
        </div>
        <Button 
          onClick={exportCSV}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}
        >
          <FileDownload style={{ fontSize: '20px' }} />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros de fecha */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarMonth style={{ color: '#10b981', fontSize: '24px' }} />
          <span style={{ fontWeight: 600, color: '#374151' }}>Período:</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="custom-datepicker-wrapper">
            <DatePicker
              selected={fromDate}
              onChange={(date: Date | null) => date && setFromDate(date)}
              selectsStart
              startDate={fromDate}
              endDate={toDate}
              locale="es"
              dateFormat="dd/MM/yyyy"
              className="custom-datepicker-input"
              calendarClassName="custom-datepicker-calendar"
              showPopperArrow={false}
              popperPlacement="bottom-start"
            />
          </div>
          <span style={{ color: '#9ca3af', fontWeight: 500 }}>hasta</span>
          <div className="custom-datepicker-wrapper">
            <DatePicker
              selected={toDate}
              onChange={(date: Date | null) => date && setToDate(date)}
              selectsEnd
              startDate={fromDate}
              endDate={toDate}
              minDate={fromDate}
              locale="es"
              dateFormat="dd/MM/yyyy"
              className="custom-datepicker-input"
              calendarClassName="custom-datepicker-calendar"
              showPopperArrow={false}
              popperPlacement="bottom-start"
            />
          </div>
        </div>
        <div style={{ 
          marginLeft: 'auto', 
          background: '#f0fdf4', 
          padding: '8px 16px', 
          borderRadius: '20px',
          color: '#059669',
          fontWeight: 600,
          fontSize: '0.875rem'
        }}>
          {filtered.length} registros encontrados
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Total Ventas */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', 
            right: '-20px', 
            top: '-20px', 
            opacity: 0.2,
            fontSize: '120px'
          }}>
            <AttachMoney style={{ fontSize: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AttachMoney style={{ fontSize: '24px' }} />
            </div>
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Ventas</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
            ${totalSales.toLocaleString('es-CL')}
          </h2>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            marginTop: '12px',
            fontSize: '0.875rem'
          }}>
            {isPositiveGrowth ? <TrendingUp /> : <TrendingDown />}
            <span>{isPositiveGrowth ? '+' : ''}{salesGrowth}% vs período anterior</span>
          </div>
        </div>

        {/* Órdenes */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <ShoppingCart style={{ fontSize: '22px' }} />
            </div>
            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Órdenes Totales</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>
            {totalOrders}
          </h2>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
            {totalItems} productos vendidos
          </p>
        </div>

        {/* Ticket Promedio */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Receipt style={{ fontSize: '22px' }} />
            </div>
            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Ticket Promedio</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>
            ${avgOrderValue.toLocaleString('es-CL')}
          </h2>
          <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Por orden
          </p>
        </div>

        {/* Tasa de Completado */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <BarChart style={{ fontSize: '22px' }} />
            </div>
            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Tasa Completado</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>
            87.5%
          </h2>
          <div style={{ marginTop: '12px' }}>
            <ProgressBar 
              now={87.5} 
              style={{ height: '8px', borderRadius: '4px', background: '#e5e7eb' }}
              variant="success"
            />
          </div>
        </div>
      </div>

      {/* Sección de gráficos y tabla */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: '24px'
      }}>
        {/* Tabla de ventas */}
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
              <Receipt style={{ color: '#10b981' }} />
              Detalle de Ventas
            </h3>
            <Badge bg="light" style={{ color: '#6b7280', fontWeight: 500 }}>
              Últimas {filtered.length} transacciones
            </Badge>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <Table hover style={{ marginBottom: 0 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Fecha</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Categoría</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Items</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(sale => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#374151' }}>#{sale.id}</td>
                    <td style={{ padding: '14px 16px', color: '#6b7280' }}>{formatDate(sale.date)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge 
                        style={{ 
                          background: sale.category === 'Verduras' ? '#dcfce7' : 
                                     sale.category === 'Frutas' ? '#fef3c7' :
                                     sale.category === 'Hierbas' ? '#ede9fe' : '#cffafe',
                          color: sale.category === 'Verduras' ? '#166534' : 
                                 sale.category === 'Frutas' ? '#92400e' :
                                 sale.category === 'Hierbas' ? '#5b21b6' : '#0e7490',
                          fontWeight: 500,
                          padding: '6px 12px',
                          borderRadius: '6px'
                        }}
                      >
                        {sale.category}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#6b7280' }}>{sale.items}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#059669' }}>
                      ${sale.total.toLocaleString('es-CL')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge 
                        style={{ 
                          background: sale.status === 'completado' ? '#dcfce7' : '#fef3c7',
                          color: sale.status === 'completado' ? '#166534' : '#92400e',
                          fontWeight: 500,
                          padding: '6px 12px',
                          borderRadius: '20px'
                        }}
                      >
                        {sale.status === 'completado' ? '✓ Completado' : '⏳ Pendiente'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Ventas por categoría */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb'
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
            <PieChart style={{ color: '#8b5cf6' }} />
            Ventas por Categoría
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {categoryData.map(cat => (
              <div key={cat.name}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      background: cat.color
                    }} />
                    <span style={{ fontWeight: 600, color: '#374151' }}>{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#9ca3af',
                      background: '#f3f4f6',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {cat.percentage}%
                    </span>
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>
                      ${cat.sales.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
                <div style={{
                  height: '10px',
                  background: '#f3f4f6',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${cat.percentage}%`,
                    height: '100%',
                    background: cat.color,
                    borderRadius: '5px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '12px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#6b7280', fontWeight: 500 }}>Total</span>
              <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '1.25rem' }}>
                ${categoryData.reduce((s, c) => s + c.sales, 0).toLocaleString('es-CL')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
