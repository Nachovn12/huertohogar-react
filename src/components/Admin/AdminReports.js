import React, { useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './AdminCommon.css';

// Sample sales dataset (actualizado a 2025)
const sampleSales = [
  { date: '2025-11-01', total: 15000 },
  { date: '2025-11-05', total: 8500 },
  { date: '2025-11-10', total: 4200 },
  { date: '2025-11-15', total: 6200 },
  { date: '2025-11-20', total: 1900 }
];

const AdminReports = () => {
  // por defecto al mes de noviembre 2025
  const [from, setFrom] = useState('2025-11-01');
  const [to, setTo] = useState('2025-11-30');

  const filtered = useMemo(() => {
    const f = new Date(from);
    const t = new Date(to);
    return sampleSales.filter(s => {
      const d = new Date(s.date);
      return d >= f && d <= t;
    });
  }, [from, to]);

  const totalSales = filtered.reduce((s, it) => s + it.total, 0);
  const totalOrders = filtered.length;

  const exportCSV = () => {
    const rows = [['date', 'total'], ...filtered.map(r => [r.date, r.total])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${from}_to_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reportes</h1>
        <div />
      </div>

      <div className="admin-filters" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Form.Label style={{ margin: 0 }}>Desde</Form.Label>
          <Form.Control type="date" value={from} onChange={e => setFrom(e.target.value)} style={{ width: 180 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Form.Label style={{ margin: 0 }}>Hasta</Form.Label>
          <Form.Control type="date" value={to} onChange={e => setTo(e.target.value)} style={{ width: 180 }} />
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button className="btn-modal-success" onClick={exportCSV}>Exportar CSV</Button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card-mini">
          <p>TOTAL VENTAS</p>
          <h3>${totalSales.toLocaleString('es-CL')}</h3>
        </div>
        <div className="stat-card-mini">
          <p>ÓRDENES</p>
          <h3>{totalOrders}</h3>
        </div>
        <div className="stat-card-mini">
          <p>PERÍODO</p>
          <h3>{from} → {to}</h3>
        </div>
        <div className="stat-card-mini">
          <p>REGISTROS</p>
          <h3>{filtered.length}</h3>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 20, borderRadius: 12, marginTop: 20 }}>
        <p style={{ margin: 0, color: '#6b7280' }}>Ventas filtradas (fecha / total):</p>
        <ul>
          {filtered.map(r => <li key={r.date}>{r.date} — ${r.total.toLocaleString('es-CL')}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default AdminReports;
