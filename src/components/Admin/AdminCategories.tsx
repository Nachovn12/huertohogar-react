import React, { useEffect, useState } from 'react';
import { Button, Table, Form, Badge, Modal, Spinner } from 'react-bootstrap';
import { useCategories, useProducts } from '../../hooks/useApi';
import { Category } from '../../types';

const AdminCategories = () => {
  const { categories: apiCategories, loading: loadingCategories } = useCategories();
  const { products: apiProducts, loading: loadingProducts } = useProducts();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [current, setCurrent] = useState<any>(null);
  const [formName, setFormName] = useState('');

  useEffect(() => {
    if (apiCategories.length > 0) {
      // Mapear categorías y contar productos
      const categoriesWithCount = apiCategories.map(cat => {
        const count = apiProducts.filter(p => p.category === cat.id).length;
        return {
          id: cat.id,
          name: cat.name,
          products: count
        };
      });
      setCategories(categoriesWithCount);
    }
  }, [apiCategories, apiProducts]);

  const openAdd = () => {
    setModalMode('add');
    setFormName('');
    setCurrent(null);
    setShowModal(true);
  };

  const openEdit = (cat: any) => {
    setModalMode('edit');
    setCurrent(cat);
    setFormName(cat.name);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
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

  const handleDelete = (id: string) => {
    if (!window.confirm('Eliminar categoría?')) return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()));

  if (loadingCategories || loadingProducts) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando categorías...</p>
      </div>
    );
  }

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
