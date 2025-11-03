import React, { useState } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col, Alert } from 'react-bootstrap';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { products as initialProducts } from '../../data/products';

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts.slice(0, 10)); // Primeros 10 para demo
  const [showModal, setShowModal] = useState(false);
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
    setShowModal(true);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ 
          fontFamily: 'Playfair Display, serif', 
          color: '#2E8B57',
          marginBottom: 0
        }}>
          Gestión de Productos
        </h2>
        <Button 
          variant="success" 
          onClick={handleAddProduct}
          style={{ borderRadius: '12px', fontWeight: 600 }}
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
      <div className="mb-4">
        <Form.Group>
          <div style={{ position: 'relative' }}>
            <Search style={{ 
              position: 'absolute', 
              left: '15px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#999'
            }} />
            <Form.Control
              type="text"
              placeholder="Buscar productos por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '12px',
                paddingLeft: '45px',
                border: '2px solid #e0e0e0'
              }}
            />
          </div>
        </Form.Group>
      </div>

      {/* Tabla de productos */}
      <div style={{ overflowX: 'auto' }}>
        <Table hover responsive style={{ minWidth: '800px' }}>
          <thead style={{ background: '#f7faf7', borderRadius: '12px' }}>
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
                <td>{product.id}</td>
                <td style={{ fontWeight: 600 }}>{product.name}</td>
                <td>
                  <Badge bg="secondary" style={{ borderRadius: '8px' }}>
                    {product.category}
                  </Badge>
                </td>
                <td>${product.price.toLocaleString()}</td>
                <td>
                  <Badge bg={product.stock > 20 ? 'success' : product.stock > 10 ? 'warning' : 'danger'}>
                    {product.stock}
                  </Badge>
                </td>
                <td>{product.unit}</td>
                <td>
                  {product.offer ? (
                    <Badge bg="danger">🔥 Sí</Badge>
                  ) : (
                    <Badge bg="secondary">No</Badge>
                  )}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline-primary"
                      onClick={() => handleEditProduct(product)}
                      style={{ borderRadius: '8px' }}
                    >
                      <Edit fontSize="small" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ borderRadius: '8px' }}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <p style={{ color: '#999', fontSize: '1.1rem' }}>
            No se encontraron productos
          </p>
        </div>
      )}

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
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                {modalMode === 'add' ? 'Agregar' : 'Guardar Cambios'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductManagement;
