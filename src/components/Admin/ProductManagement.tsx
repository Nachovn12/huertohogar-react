import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Edit, Delete, Add, Search, MoreVert } from '@mui/icons-material';
import { Product } from '../../types';
import { useProducts, useCategories } from '../../hooks/useApi';

const ProductManagement = () => {
  const { products: apiProducts, loading, error } = useProducts();
  const { categories: apiCategories } = useCategories();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Cargar productos cuando la API responda
  useEffect(() => {
    if (apiProducts.length > 0) {
      setProducts(apiProducts);
    }
  }, [apiProducts]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    unit: '',
    description: '',
    image: '',
    offer: false
  });
  
  // ---- Handlers (restaurados) ----
  const handleAddProduct = () => {
    setModalMode('add');
    setCurrentProduct(null);
    setFormData({
      name: '',
      price: '',
      category: '',
      stock: '',
      unit: '',
      description: '',
      image: '',
      offer: false
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setFormData({
      name: product.name || '',
      price: String(product.price || ''),
      category: product.category || '',
      stock: String(product.stock || ''),
      unit: product.unit || '',
      description: product.description || '',
      image: product.image || '',
      offer: product.offer || false
    });
    setShowModal(true);
  };

  const handleOpenActions = (product: Product) => {
    // For now open edit directly
    handleEditProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== productId));
      showAlertMessage('Producto eliminado exitosamente', 'danger');
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      // Generar un id simple
      const newProduct: Product = {
        id: `PR${Date.now().toString().slice(-5)}`,
        ...formData,
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0
      };
      setProducts(prev => [...prev, newProduct]);
      showAlertMessage('Producto agregado exitosamente', 'success');
    } else {
      if (currentProduct) {
        setProducts(prev => prev.map(p => p.id === currentProduct.id ? { ...p, ...formData, price: Number(formData.price) || 0, stock: Number(formData.stock) || 0 } : p));
        showAlertMessage('Producto actualizado exitosamente', 'info');
      }
    }
    setShowModal(false);
  };

  const showAlertMessage = (message: string, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Filtrado
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión de Productos</h1>
        <Button 
          onClick={handleAddProduct}
          className="btn-add-new"
        >
          <Add /> Agregar Producto
        </Button>
      </div>
      {showAlert && (
        <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}
      <div className="admin-filters">
        <Form.Group>
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <Form.Control
              type="text"
              placeholder="Buscar productos por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </Form.Group>
      </div>
      <div className="admin-table-wrapper">
        <Table hover responsive className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Unidad</th>
              <th>Oferta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td style={{ color: '#64748b' }}>{product.id}</td>
                <td style={{ fontWeight: 600 }}>{product.name}</td>
                <td>
                  <Badge bg="secondary" className="badge-custom">
                    {product.category}
                  </Badge>
                </td>
                <td style={{ fontWeight: 700, color: '#0f172a' }}>${product.price.toLocaleString()}</td>
                <td>
                  <Badge bg={(product.stock || 0) > 20 ? 'success' : (product.stock || 0) > 10 ? 'warning' : 'danger'} className="badge-custom">
                    {product.stock}
                  </Badge>
                </td>
                <td>{product.unit}</td>
                <td>
                  {product.offer ? (
                    <Badge bg="danger" className="badge-custom">🔥 Sí</Badge>
                  ) : (
                    <Badge bg="secondary" className="badge-custom">No</Badge>
                  )}
                </td>
                <td className="actions-cell">
                  <Button 
                    size="sm" 
                    onClick={() => handleOpenActions(product)}
                    className="action-btn action-btn-view"
                  >
                    <MoreVert fontSize="small" /> Acciones
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p className="empty-state-text">
            No se encontraron productos
          </p>
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className="modal-content">
          <div className="modal-header">
            {modalMode === 'edit' && currentProduct && (
              <span className="modal-product-id">{currentProduct.id}</span>
            )}
            <h4 style={{ fontWeight: 700, margin: 0 }}>
              {modalMode === 'add' ? 'Agregar Nuevo Producto' : 'Editar Producto'}
            </h4>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowModal(false)} />
          </div>
          <Form onSubmit={handleSaveProduct}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: 16 }}>
              <div>
                <Form.Label>Nombre del Producto *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Tomates Orgánicos"
                />
              </div>
              <div>
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Seleccionar categoría</option>
                  {apiCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </div>
              <div>
                <Form.Label>Precio ($) *</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="2500"
                />
              </div>
              <div>
                <Form.Label>Stock *</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="50"
                />
              </div>
              <div>
                <Form.Label>Unidad *</Form.Label>
                <Form.Select
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="">Seleccionar</option>
                  <option value="kg">Kilogramo (kg)</option>
                  <option value="unidad">Unidad</option>
                  <option value="litro">Litro</option>
                  <option value="gramos">Gramos</option>
                </Form.Select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descripción del producto..."
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="/img/producto.jpg"
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <Form.Check
                type="checkbox"
                label="Producto en oferta"
                checked={formData.offer}
                onChange={(e) => setFormData({...formData, offer: e.target.checked})}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 18 }}>
              <Button onClick={() => setShowModal(false)} className="btn-modal-cancel">
                Cancelar
              </Button>
              <Button type="submit" className="btn-modal-success">
                {modalMode === 'add' ? 'Agregar Producto' : 'Guardar Cambios'}
              </Button>
              {modalMode === 'edit' && currentProduct && (
                <Button 
                  onClick={() => handleDeleteProduct(currentProduct.id)}
                  className="btn-modal-danger"
                >
                  <Delete style={{ fontSize: '20px', marginRight: '8px' }} /> Eliminar Producto
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagement;
