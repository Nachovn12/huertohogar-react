import React, { useState } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col, Alert } from 'react-bootstrap';
import { Edit, Delete, Add, Search, MoreVert } from '@mui/icons-material';
import { products as initialProducts } from '../../data/products';
import './AdminCommon.css';

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts.slice(0, 10)); // Primeros 10 para demo
  const [showModal, setShowModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

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

  // Abrir modal para agregar producto
  const handleAddProduct = () => {
    setModalMode('add');
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

  // Abrir modal para editar producto
  const handleEditProduct = (product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      unit: product.unit,
      description: product.description,
      image: product.image,
      offer: product.offer || false
    });
    setShowActionsModal(false);
    setShowModal(true);
  };

  // Abrir modal de acciones
  const handleOpenActions = (product) => {
    setCurrentProduct(product);
    setShowActionsModal(true);
  };

  // Eliminar producto
  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== productId));
      showAlertMessage('Producto eliminado exitosamente', 'danger');
    }
  };

  // Guardar producto (crear o actualizar)
  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (modalMode === 'add') {
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...formData,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock)
      };
      setProducts([...products, newProduct]);
      showAlertMessage('Producto agregado exitosamente', 'success');
    } else {
      setProducts(products.map(p => 
        p.id === currentProduct.id 
          ? { ...p, ...formData, price: parseInt(formData.price), stock: parseInt(formData.stock) }
          : p
      ));
      showAlertMessage('Producto actualizado exitosamente', 'info');
    }

    setShowModal(false);
  };

  // Mostrar alerta
  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Alerta de éxito/error */}
      {showAlert && (
        <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      {/* Barra de búsqueda */}
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

      {/* Tabla de productos */}
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
                  <Badge bg={product.stock > 20 ? 'success' : product.stock > 10 ? 'warning' : 'danger'} className="badge-custom">
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

      {/* Modal de Acciones */}
      <Modal show={showActionsModal} onHide={() => setShowActionsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Acciones - {currentProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-2">
            <Button 
              variant="outline-primary"
              onClick={() => handleEditProduct(currentProduct)}
              className="d-flex align-items-center justify-content-center gap-2 py-3"
              style={{ borderRadius: '10px', fontWeight: 600 }}
            >
              <Edit /> Editar Producto
            </Button>
            <Button 
              variant="outline-danger"
              onClick={() => {
                setShowActionsModal(false);
                handleDeleteProduct(currentProduct.id);
              }}
              className="d-flex align-items-center justify-content-center gap-2 py-3"
              style={{ borderRadius: '10px', fontWeight: 600 }}
            >
              <Delete /> Eliminar Producto
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal para agregar/editar producto */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Agregar Nuevo Producto' : 'Editar Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Producto *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Tomates Orgánicos"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Verduras">Verduras</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Lácteos">Lácteos</option>
                    <option value="Carnes">Carnes</option>
                    <option value="Pescados">Pescados</option>
                    <option value="Abarrotes">Abarrotes</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="2500"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="50"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
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
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descripción del producto..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="/img/producto.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Producto en oferta"
                checked={formData.offer}
                onChange={(e) => setFormData({...formData, offer: e.target.checked})}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button onClick={() => setShowModal(false)} className="btn-modal-secondary">
                Cancelar
              </Button>
              <Button type="submit" className="btn-modal-primary">
                {modalMode === 'add' ? 'Agregar Producto' : 'Guardar Cambios'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductManagement;
