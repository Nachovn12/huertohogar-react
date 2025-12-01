import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Edit, Delete, Add, Search, MoreVert, Close, ShoppingCart, Category, AttachMoney, Inventory } from '@mui/icons-material';
import { Product } from '../../types';
import { useProducts, useCategories } from '../../hooks/useApi';
import { productService } from '../../service/api';

const ProductManagement = () => {
  const { products: apiProducts, loading, error } = useProducts();
  const { categories: apiCategories } = useCategories();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (apiProducts.length > 0) {
      setProducts(apiProducts);
    }
  }, [apiProducts]);

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    stock: '',
    unidad: '',
    descripcion: '',
    imagen: '',
    oferta: false
  });

  const showAlertMessage = (message: string, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    // Mostrar alerta por 5 segundos para que el usuario pueda leerla
    setTimeout(() => setShowAlert(false), 5000);
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error recargando productos:', error);
    }
  };
  
  const getCategoryId = (product: Product): string => {
    if (product.categoriaId) {
      return String(product.categoriaId);
    }
    const foundCategory = apiCategories.find(
      cat => cat.nombre.toLowerCase() === String(product.categoria).toLowerCase()
    );
    return foundCategory ? String(foundCategory.id) : '';
  };

  const handleAddProduct = () => {
    setModalMode('add');
    setCurrentProduct(null);
    setFormData({
      nombre: '',
      precio: '',
      categoria: '',
      stock: '',
      unidad: '',
      descripcion: '',
      imagen: '',
      oferta: false
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    const categoryId = getCategoryId(product);
    setFormData({
      nombre: product.nombre || '',
      precio: String(product.precio || ''),
      categoria: categoryId,
      stock: String(product.stock || ''),
      unidad: product.unidad || '',
      descripcion: product.descripcion || '',
      imagen: product.imagen || '',
      oferta: product.oferta || false
    });
    setShowModal(true);
  };

  const handleOpenActions = (product: Product) => {
    handleEditProduct(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productService.delete(productId);
        showAlertMessage('✅ Producto eliminado exitosamente', 'success');
        await fetchProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        showAlertMessage('❌ Error al eliminar el producto', 'danger');
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'add') {
        const newProductData = {
          nombre: formData.nombre,
          precio: Number(formData.precio) || 0,
          categoriaId: Number(formData.categoria),
          stock: Number(formData.stock) || 0,
          unidad: formData.unidad,
          descripcion: formData.descripcion,
          imagen: formData.imagen,
          oferta: formData.oferta
        };
        
        await productService.create(newProductData);
        showAlertMessage('✅ Producto agregado correctamente a la API', 'success');
      } else {
        if (currentProduct) {
          console.log('📤 Enviando actualización para producto ID:', currentProduct.id);
          
          await productService.update(currentProduct.id, {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: Number(formData.precio),
            categoriaId: Number(formData.categoria),
            stock: Number(formData.stock),
            unidad: formData.unidad,
            imagen: formData.imagen,
            oferta: formData.oferta,
            tiendaId: currentProduct.tiendaId || 1
          });
          
          showAlertMessage('✅ Se han guardado los cambios correctamente en la API', 'success');
        }
      }
      
      // Recargar productos desde la API para reflejar cambios
      await fetchProducts();
      setShowModal(false);
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      showAlertMessage(`❌ Error al guardar cambios: ${error.message || 'Error desconocido'}`, 'danger');
    }
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const isImageValid = (product: Product) => {
    if (!product.imagen || product.imagen.trim() === '') return false;
    if (product.imagen.includes('placeholder')) return false;
    if (imageErrors.has(String(product.id))) return false;
    return true;
  };

  const filteredProducts = products.filter(product => {
    const nombre = product.nombre || '';
    const categoria = product.categoria || '';
    const searchLower = searchTerm.toLowerCase();
    return nombre.toLowerCase().includes(searchLower) || categoria.toLowerCase().includes(searchLower);
  });

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
        <Button onClick={handleAddProduct} className="btn-add-new">
          <Add /> Agregar Producto
        </Button>
      </div>
      
      {showAlert && (
        <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}
      
      <div className="admin-table-wrapper">
        <Table hover responsive className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>ID</th>
              <th style={{ width: '100px', textAlign: 'center' }}>IMAGEN</th>
              <th style={{ width: '200px' }}>NOMBRE</th>
              <th style={{ width: '150px' }}>CATEGORÍA</th>
              <th style={{ width: '120px' }}>PRECIO</th>
              <th style={{ width: '100px', textAlign: 'center' }}>STOCK</th>
              <th style={{ width: '120px', textAlign: 'center' }}>UNIDAD</th>
              <th style={{ width: '100px', textAlign: 'center' }}>OFERTA</th>
              <th style={{ textAlign: 'center' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts
              .reduce((acc, product) => {
                const exists = acc.find(p => p.id === product.id);
                if (!exists) acc.push(product);
                return acc;
              }, [] as Product[])
              .map(product => (
                <tr key={product.id}>
                  <td style={{ color: '#64748b', textAlign: 'center', verticalAlign: 'middle', width: '80px' }}>{product.id}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '100px' }}>
                    {isImageValid(product) ? (
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          objectFit: 'contain',
                          borderRadius: '10px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          padding: '4px',
                          margin: '0 auto',
                          display: 'block'
                        }}
                        onError={() => handleImageError(String(product.id))}
                      />
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          color: '#fff',
                          fontWeight: 600,
                          border: '1px solid #e5e7eb',
                          margin: '0 auto'
                        }}
                      >
                        {product.nombre?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, verticalAlign: 'middle', width: '200px', textAlign: 'center' }}>{product.nombre}</td>
                  <td style={{ verticalAlign: 'middle', width: '150px', textAlign: 'center' }}>
                    <Badge bg="secondary" className="badge-custom">
                      {product.categoria}
                    </Badge>
                  </td>
                  <td style={{ fontWeight: 700, color: '#0f172a', verticalAlign: 'middle', width: '120px', textAlign: 'center' }}>${(product.precio || 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '100px' }}>
                    <Badge bg={(product.stock || 0) > 20 ? 'success' : (product.stock || 0) > 10 ? 'warning' : 'danger'} className="badge-custom">
                      {product.stock || 0}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '120px' }}>{product.unidad}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', width: '100px' }}>
                    {product.oferta ? (
                      <Badge bg="danger" className="badge-custom">🔥 Sí</Badge>
                    ) : (
                      <Badge bg="secondary" className="badge-custom">No</Badge>
                    )}
                  </td>
                  <td className="actions-cell" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
      
      {filteredProducts.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p className="empty-state-text">No se encontraron productos</p>
        </div>
      )}

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        centered 
        size="lg"
        backdrop="static"
        style={{ zIndex: 1055 }}
      >
        <div style={{ 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            background: '#fff',
            padding: '24px 32px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: modalMode === 'add' ? '#10b981' : '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                {modalMode === 'add' ? <Add style={{ fontSize: '28px' }} /> : <Edit style={{ fontSize: '28px' }} />}
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '1.5rem', 
                  fontWeight: 700,
                  color: '#111827'
                }}>
                  {modalMode === 'add' ? 'Nuevo Producto' : 'Editar Producto'}
                </h3>
                {modalMode === 'edit' && currentProduct && (
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    marginTop: '4px'
                  }}>
                    ID: {currentProduct.id}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Close style={{ fontSize: '24px', color: '#6b7280' }} />
            </button>
          </div>

          <Form onSubmit={handleSaveProduct}>
            <div style={{ padding: '32px', maxHeight: '70vh', overflowY: 'auto' }}>
              
              <div style={{ marginBottom: '28px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <ShoppingCart style={{ fontSize: '20px', color: '#10b981' }} />
                  <h5 style={{ 
                    margin: 0, 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    color: '#374151'
                  }}>
                    Información del Producto
                  </h5>
                </div>
                
                <Row>
                  <Col md={12} style={{ marginBottom: '20px' }}>
                    <Form.Label style={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Nombre del Producto <span style={{ color: '#ef4444' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej: Tomates Cherry Orgánicos"
                      style={{
                        borderRadius: '10px',
                        border: '1.5px solid #d1d5db',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </Col>
                  
                  <Col md={12} style={{ marginBottom: '20px' }}>
                    <Form.Label style={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Descripción
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      placeholder="Describe las características y beneficios del producto..."
                      style={{
                        borderRadius: '10px',
                        border: '1.5px solid #d1d5db',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <Category style={{ fontSize: '20px', color: '#8b5cf6' }} />
                  <h5 style={{ 
                    margin: 0, 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    color: '#374151'
                  }}>
                    Categorización
                  </h5>
                </div>
                
                <Row>
                  <Col md={12}>
                    <Form.Label style={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Categoría <span style={{ color: '#ef4444' }}>*</span>
                    </Form.Label>
                    <Form.Select
                      required
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      style={{
                        borderRadius: '10px',
                        border: '1.5px solid #d1d5db',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    >
                      <option value="">Seleccionar categoría</option>
                      {apiCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <AttachMoney style={{ fontSize: '20px', color: '#f59e0b' }} />
                  <h5 style={{ 
                    margin: 0, 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    color: '#374151'
                  }}>
                    Precio e Inventario
                  </h5>
                </div>
                
                <Row>
                  <Col md={4} style={{ marginBottom: '20px' }}>
                    <Form.Label style={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Precio ($) <span style={{ color: '#ef4444' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      required
                      value={formData.precio}
                      onChange={(e) => setFormData({...formData, precio: e.target.value})}
                      placeholder="2500"
                      style={{
                        borderRadius: '10px',
                        border: '1.5px solid #d1d5db',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </Col>
                  
                  <Col md={4} style={{ marginBottom: '20px' }}>
                    <Form.Label style={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Stock <span style={{ color: '#ef4444' }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="50"
                      style={{
                        borderRadius: '10px',
                        border: '1.5px solid #d1d5db',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </Col>
                  
                  <Col md={4} style={{ marginBottom: '20px' }}>
                    <Form.Label style={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      Unidad <span style={{ color: '#ef4444' }}>*</span>
                    </Form.Label>
                    <Form.Select
                      required
                      value={formData.unidad}
                      onChange={(e) => setFormData({...formData, unidad: e.target.value})}
                      style={{
                        borderRadius: '10px',
                        border: '1.5px solid #d1d5db',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    >
                      <option value="">Seleccionar unidad</option>
                      <option value="kg">Kilogramo (kg)</option>
                      <option value="unidad">Unidad</option>
                      <option value="manojo">Manojo</option>
                      <option value="litro">Litro (L)</option>
                      <option value="gramos">Gramos (g)</option>
                      <option value="docena">Docena</option>
                      <option value="atado">Atado</option>
                      <option value="bolsa">Bolsa</option>
                      <option value="caja">Caja</option>
                      <option value="bandeja">Bandeja</option>
                    </Form.Select>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: '0' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '20px'
                }}>
                  <Inventory style={{ fontSize: '20px', color: '#06b6d4' }} />
                  <h5 style={{ 
                    margin: 0, 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    color: '#374151'
                  }}>
                    Multimedia y Promoción
                  </h5>
                </div>
                
                <Row>
                  <Col md={12} style={{ marginBottom: '20px' }}>
                    <Form.Label style={{ 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      URL de la Imagen
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.imagen}
                      onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      style={{
                        borderRadius: '10px',
                        border: '1.5px solid #d1d5db',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                  </Col>
                  
                  <Col md={12}>
                    <div style={{
                      background: formData.oferta ? '#fef2f2' : '#f9fafb',
                      border: formData.oferta ? '1.5px solid #fca5a5' : '1.5px solid #e5e7eb',
                      borderRadius: '10px',
                      padding: '16px',
                      transition: 'all 0.2s'
                    }}>
                      <Form.Check
                        type="checkbox"
                        checked={formData.oferta}
                        onChange={(e) => setFormData({...formData, oferta: e.target.checked})}
                        label={
                          <span style={{ 
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            color: formData.oferta ? '#dc2626' : '#6b7280'
                          }}>
                            {formData.oferta ? '🔥 ' : ''}Producto en oferta
                          </span>
                        }
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '20px 32px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}>
              {modalMode === 'edit' && currentProduct ? (
                <Button
                  type="button"
                  onClick={() => handleDeleteProduct(String(currentProduct.id))}
                  style={{
                    background: 'transparent',
                    border: '1.5px solid #ef4444',
                    color: '#ef4444',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                >
                  <Delete style={{ fontSize: '20px' }} /> Eliminar
                </Button>
              ) : <div></div>}
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #d1d5db',
                    color: '#374151',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = modalMode === 'add' ? '#059669' : '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = modalMode === 'add' ? '#10b981' : '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {modalMode === 'add' ? 'Crear Producto' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagement;