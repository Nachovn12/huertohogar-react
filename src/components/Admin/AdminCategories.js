import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Badge, Modal } from 'react-bootstrap';
import './AdminCommon.css';
import { products } from '../../data/products';

const STORAGE_KEY = 'adminCategories_v1';

// Build default categories dynamically from products data
const defaultCategories = (() => {
  try {
    const map = {};
    products.forEach(p => {
      const key = (p.category || 'sin_categoria').toString().toLowerCase();
      if (!map[key]) map[key] = { id: `CAT_${key.toUpperCase()}`, name: capitalize(key), products: 0 };
      map[key].products += 1;
    });
    return Object.values(map);
  } catch (e) {
    // fallback static list
    return [
      { id: 'C001', name: 'Frutas', products: 24 },
      { id: 'C002', name: 'Verduras', products: 18 },
      { id: 'C003', name: 'Lácteos', products: 6 },
      { id: 'C004', name: 'Abarrotes', products: 42 }
    ];
  }
})();

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [current, setCurrent] = useState(null);
  const [formName, setFormName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If stored is a non-empty array, respect it. If it's empty, fall back to product-derived categories.
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed);
          return;
        }
      } catch (e) {
        // continue to fallback
      }
    }

    // If no stored categories or stored was empty, build from products data (actual site data)
    setCategories(defaultCategories);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const openAdd = () => {
    setModalMode('add');
    setFormName('');
    setCurrent(null);
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setModalMode('edit');
    setCurrent(cat);
    setFormName(cat.name);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const name = formName.trim();
    if (!name) return;

    if (modalMode === 'add') {
      const nextId = `C${String(Date.now()).slice(-6)}`;
      setCategories(prev => [...prev, { id: nextId, name, products: 0 }]);
    } else if (modalMode === 'edit' && current) {
      setCategories(prev => prev.map(c => c.id === current.id ? { ...c, name } : c));
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Eliminar categoría?')) return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categorías</h1>
        <Button onClick={openAdd} className="btn-add-new"><span style={{fontSize:18}}>+</span> Agregar Categoría</Button>
      </div>

      <div className="admin-filters">
        <Form.Group>
          <div className="search-input-wrapper">
            <input value={search} onChange={e => setSearch(e.target.value)} className="admin-search-input" placeholder="Buscar categorías..." />
          </div>
        </Form.Group>
      </div>

      <div className="admin-table-wrapper">
        <Table hover responsive className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(cat => (
              <tr key={cat.id}>
                <td style={{ color: '#64748b' }}>{cat.id}</td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td><Badge bg="secondary">{cat.products}</Badge></td>
                <td>
                  <Button size="sm" onClick={() => openEdit(cat)} className="action-btn action-btn-edit" style={{ marginRight: 8 }}>Editar</Button>
                  <Button size="sm" onClick={() => handleDelete(cat.id)} className="action-btn action-btn-delete">Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className="modal-content">
          <div className="modal-header">
            <h4 style={{ fontWeight: 700, margin: 0 }}>{modalMode === 'add' ? 'Agregar Categoría' : 'Editar Categoría'}</h4>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowModal(false)} />
          </div>
          <Form onSubmit={handleSave} style={{ paddingTop: 12 }}>
            <Form.Group>
              <Form.Label>Nombre de la Categoría</Form.Label>
              <Form.Control value={formName} onChange={e => setFormName(e.target.value)} />
            </Form.Group>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
              <Button onClick={() => setShowModal(false)} className="btn-modal-cancel">Cancelar</Button>
              <Button type="submit" className="btn-modal-success">{modalMode === 'add' ? 'Agregar' : 'Guardar'}</Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminCategories;
