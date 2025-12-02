import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col, Alert, Spinner } from 'react-bootstrap';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import Category from '@mui/icons-material/Category';
import AttachMoney from '@mui/icons-material/AttachMoney';
import Inventory from '@mui/icons-material/Inventory';
import LocalOffer from '@mui/icons-material/LocalOffer';
import Warning from '@mui/icons-material/Warning';
import TrendingUp from '@mui/icons-material/TrendingUp';
import FilterList from '@mui/icons-material/FilterList';
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterOffer, setFilterOffer] = useState('all');
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
    oferta: false,
    descuento: ''
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
      oferta: false,
      descuento: ''
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    const categoryId = getCategoryId(product);
    
    // Cargar descuento desde localStorage
    const offersData = JSON.parse(localStorage.getItem('productOffers') || '{}');
    const productOffer = offersData[product.id];
    
    setFormData({
      nombre: product.nombre || '',
      precio: String(product.precio || ''),
      categoria: categoryId,
      stock: String(product.stock || ''),
      unidad: product.unidad || '',
      descripcion: product.descripcion || '',
      imagen: product.imagen || '',
      oferta: productOffer?.oferta || product.oferta || false,
      descuento: productOffer?.descuento ? String(productOffer.descuento) : ''
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
        
        const createdProduct = await productService.create(newProductData);
        
        // Guardar oferta en localStorage si está activada
        if (formData.oferta && formData.descuento) {
          const offersData = JSON.parse(localStorage.getItem('productOffers') || '{}');
          offersData[createdProduct.id] = {
            oferta: true,
            descuento: Number(formData.descuento),
            offerPrice: Number(formData.precio) * (1 - Number(formData.descuento) / 100)
          };
          localStorage.setItem('productOffers', JSON.stringify(offersData));
        }
        
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
          
          // Guardar/actualizar oferta en localStorage
          const offersData = JSON.parse(localStorage.getItem('productOffers') || '{}');
          
          if (formData.oferta && formData.descuento) {
            offersData[currentProduct.id] = {
              oferta: true,
              descuento: Number(formData.descuento),
              offerPrice: Number(formData.precio) * (1 - Number(formData.descuento) / 100)
            };
          } else {
            // Si se desactiva la oferta, eliminar del localStorage
            delete offersData[currentProduct.id];
          }
          
          localStorage.setItem('productOffers', JSON.stringify(offersData));
          
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

  // Calcular estadísticas para KPIs
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => (p.stock || 0) < 30).length;
  const productsOnOffer = products.filter(p => p.oferta === true).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0);
  
  // Colores por categoría
  const categoryColors: { [key: string]: { bg: string, text: string } } = {
    'Verduras': { bg: '#dcfce7', text: '#166534' },
    'Frutas': { bg: '#ffedd5', text: '#c2410c' },
    'Hierbas': { bg: '#e0f2fe', text: '#0369a1' },
    'Semillas': { bg: '#fef3c7', text: '#a16207' },
    'Herramientas': { bg: '#f3e8ff', text: '#7c3aed' },
    'Tierra y Abono': { bg: '#fce7f3', text: '#be185d' },
    'default': { bg: '#f3f4f6', text: '#374151' }
  };

  const getCategoryColor = (categoria: string) => {
    return categoryColors[categoria] || categoryColors['default'];
  };

  const filteredProducts = products.filter(product => {
    const nombre = product.nombre || '';
    const categoria = product.categoria || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = nombre.toLowerCase().includes(searchLower) || 
      categoria.toLowerCase().includes(searchLower) ||
      (product.descripcion || '').toLowerCase().includes(searchLower);
    
    const matchesCategory = filterCategory === 'all' || categoria === filterCategory;
    
    const matchesOffer = filterOffer === 'all' || 
      (filterOffer === 'offer' && product.oferta === true) ||
      (filterOffer === 'noOffer' && product.oferta !== true);
    
    return matchesSearch && matchesCategory && matchesOffer;
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
      {/* Header mejorado */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700, 
              color: '#1e293b', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <ShoppingCart style={{ color: '#16a34a', fontSize: '2rem' }} />
              Gestión de Productos
            </h1>
            <p style={{ color: '#64748b', margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              Administra tu inventario de productos • {totalProducts} productos en catálogo
            </p>
          </div>
          <Button onClick={handleAddProduct} className="btn-add-new">
            <Add /> Agregar Producto
          </Button>
        </div>

        {/* KPIs Cards - En fila horizontal */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          {/* Total Productos */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Inventory style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{totalProducts}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Total Productos</div>
            </div>
          </div>
          
          {/* Stock Bajo */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: lowStockProducts > 0 ? '1px solid #fecaca' : '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: lowStockProducts > 0 ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Warning style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: lowStockProducts > 0 ? '#dc2626' : '#1e293b', lineHeight: 1 }}>{lowStockProducts}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Stock Bajo (&lt;30)</div>
            </div>
          </div>
          
          {/* En Oferta */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <LocalOffer style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{productsOnOffer}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>En Oferta</div>
            </div>
          </div>
          
          {/* Valor Inventario */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <TrendingUp style={{ color: 'white', fontSize: '1.25rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>${totalInventoryValue.toLocaleString()}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Valor Inventario</div>
            </div>
          </div>
        </div>

        {/* Barra de filtros mejorada */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Búsqueda */}
          <div style={{ position: 'relative', flex: '1 1 250px', minWidth: '200px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.25rem' }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem 0.65rem 2.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          {/* Filtro por categoría */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Category style={{ color: '#64748b', fontSize: '1.25rem' }} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '0.65rem 2rem 0.65rem 0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem'
              }}
            >
              <option value="all">Todas las categorías</option>
              {apiCategories.map(cat => (
                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          
          {/* Filtro por oferta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FilterList style={{ color: '#64748b', fontSize: '1.25rem' }} />
            <select
              value={filterOffer}
              onChange={(e) => setFilterOffer(e.target.value)}
              style={{
                padding: '0.65rem 2rem 0.65rem 0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.95rem',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.25rem'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="offer">En oferta</option>
              <option value="noOffer">Sin oferta</option>
            </select>
          </div>
          
          {/* Contador de resultados */}
          <div style={{ 
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#f8fafc',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#64748b',
            fontWeight: 500
          }}>
            <span style={{ fontWeight: 600, color: '#16a34a' }}>{filteredProducts.length}</span>
            <span>de {totalProducts} productos</span>
          </div>
        </div>
      </div>
      
      {showAlert && (
        <Alert variant={alertType} dismissible onClose={() => setShowAlert(false)} style={{ marginBottom: '1rem' }}>
          {alertMessage}
        </Alert>
      )}
      
      <div className="admin-table-wrapper" style={{ 
        background: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <Table hover responsive className="admin-table" style={{ marginBottom: 0 }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ width: '60px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem', padding: '1rem 0.75rem' }}>ID</th>
              <th style={{ width: '80px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>IMAGEN</th>
              <th style={{ width: '200px', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>PRODUCTO</th>
              <th style={{ width: '140px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>CATEGORÍA</th>
              <th style={{ width: '100px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>PRECIO</th>
              <th style={{ width: '120px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>STOCK</th>
              <th style={{ width: '100px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>UNIDAD</th>
              <th style={{ width: '90px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>OFERTA</th>
              <th style={{ width: '100px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts
              .reduce((acc, product) => {
                const exists = acc.find(p => p.id === product.id);
                if (!exists) acc.push(product);
                return acc;
              }, [] as Product[])
              .map(product => {
                const catColor = getCategoryColor(product.categoria || '');
                const stockValue = product.stock || 0;
                const isLowStock = stockValue < 30;
                
                return (
                <tr key={product.id} style={{ 
                  transition: 'all 0.2s ease',
                  borderLeft: isLowStock ? '3px solid #ef4444' : '3px solid transparent'
                }}>
                  <td style={{ color: '#94a3b8', textAlign: 'center', verticalAlign: 'middle', fontSize: '0.9rem', fontWeight: 500 }}>#{product.id}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0.75rem' }}>
                    {isImageValid(product) ? (
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        style={{ 
                          width: '56px', 
                          height: '56px', 
                          objectFit: 'contain',
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          background: '#fff',
                          border: '2px solid #e5e7eb',
                          padding: '4px',
                          margin: '0 auto',
                          display: 'block'
                        }}
                        onError={() => handleImageError(String(product.id))}
                      />
                    ) : (
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                          color: '#fff',
                          fontWeight: 600,
                          margin: '0 auto'
                        }}
                      >
                        {product.nombre?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </td>
                  <td style={{ verticalAlign: 'middle', padding: '0.75rem' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.2rem' }}>{product.nombre}</div>
                    {product.descripcion && (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {product.descripcion}
                      </div>
                    )}
                  </td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: catColor.bg,
                      color: catColor.text,
                      border: `1px solid ${catColor.text}20`
                    }}>
                      {product.categoria}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#16a34a', verticalAlign: 'middle', textAlign: 'right', fontSize: '1rem', paddingRight: '1rem' }}>
                    ${(product.precio || 0).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      {isLowStock && (
                        <Warning style={{ color: '#ef4444', fontSize: '1rem' }} />
                      )}
                      <span style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: isLowStock ? '#fef2f2' : stockValue > 50 ? '#f0fdf4' : '#fefce8',
                        color: isLowStock ? '#dc2626' : stockValue > 50 ? '#16a34a' : '#ca8a04',
                        border: isLowStock ? '1px solid #fecaca' : stockValue > 50 ? '1px solid #bbf7d0' : '1px solid #fde047'
                      }}>
                        {stockValue} uds
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', color: '#64748b', fontSize: '0.9rem' }}>{product.unidad}</td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    {product.oferta ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        color: '#dc2626',
                        border: '1px solid #fecaca'
                      }}>
                        🔥 Sí
                      </span>
                    ) : (
                      <span style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        background: '#f1f5f9',
                        color: '#94a3b8'
                      }}>
                        No
                      </span>
                    )}
                  </td>
                  <td className="actions-cell" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      {/* Botón Editar */}
                      <button 
                        onClick={() => handleEditProduct(product)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#eff6ff',
                          border: '2px solid #3b82f6',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        title="Editar producto"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#eff6ff';
                          e.currentTarget.style.color = '#3b82f6';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Edit style={{ fontSize: '18px' }} />
                      </button>
                      
                      {/* Botón Eliminar */}
                      <button 
                        onClick={() => handleDeleteProduct(String(product.id))}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#fef2f2',
                          border: '2px solid #ef4444',
                          color: '#ef4444',
                          cursor: 'pointer',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        title="Eliminar producto"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ef4444';
                          e.currentTarget.style.color = '#ffffff';
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Delete style={{ fontSize: '18px' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
        size="xl"
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
        backdropClassName="modal-backdrop-dark"
        className="modal-product-edit"
      >
        <div style={{ 
          borderRadius: '20px', 
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}>
          {/* Header del Modal */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                {modalMode === 'add' ? <Add style={{ fontSize: '26px' }} /> : <Edit style={{ fontSize: '26px' }} />}
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '1.35rem', 
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {modalMode === 'add' ? 'Agregar Nuevo Producto' : 'Editar Producto'}
                </h3>
                {modalMode === 'edit' && currentProduct && (
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.8rem', 
                    color: 'rgba(255,255,255,0.8)',
                    marginTop: '2px'
                  }}>
                    Editando: {currentProduct.nombre} (ID: {currentProduct.id})
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                color: '#fff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              <Close style={{ fontSize: '26px' }} />
            </button>
          </div>

          <Form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{ 
              padding: '20px 28px', 
              flex: 1,
              overflowY: 'auto',
              background: '#f8fafc'
            }}>
              <Row>
                {/* Columna Izquierda - Información Principal */}
                <Col lg={7}>
                  {/* Sección: Información del Producto */}
                  <div style={{ 
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '18px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '16px',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #f0fdf4'
                    }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ShoppingCart style={{ fontSize: '17px', color: '#fff' }} />
                      </div>
                      <h5 style={{ 
                        margin: 0, 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        color: '#1f2937'
                      }}>
                        Información del Producto
                      </h5>
                    </div>
                    
                    <Form.Group style={{ marginBottom: '14px' }}>
                      <Form.Label style={{ 
                        fontWeight: 600, 
                        fontSize: '0.8rem',
                        color: '#374151',
                        marginBottom: '6px',
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
                          border: '2px solid #e5e7eb',
                          padding: '10px 14px',
                          fontSize: '0.95rem',
                          transition: 'all 0.2s',
                          boxShadow: 'none'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#10b981';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group>
                      <Form.Label style={{ 
                        fontWeight: 600, 
                        fontSize: '0.8rem',
                        color: '#374151',
                        marginBottom: '6px',
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
                          border: '2px solid #e5e7eb',
                          padding: '10px 14px',
                          fontSize: '0.95rem',
                          resize: 'none',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#10b981';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Group>
                  </div>

                  {/* Sección: Precio e Inventario */}
                  <div style={{ 
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '18px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '16px',
                      paddingBottom: '12px',
                      borderBottom: '2px solid #fef3c7'
                    }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <AttachMoney style={{ fontSize: '17px', color: '#fff' }} />
                      </div>
                      <h5 style={{ 
                        margin: 0, 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        color: '#1f2937'
                      }}>
                        Precio e Inventario
                      </h5>
                    </div>
                    
                    <Row>
                      <Col sm={4}>
                        <Form.Group style={{ marginBottom: '0' }}>
                          <Form.Label style={{ 
                            fontWeight: 600, 
                            fontSize: '0.8rem',
                            color: '#374151',
                            marginBottom: '6px',
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
                              border: '2px solid #e5e7eb',
                              padding: '10px 14px',
                              fontSize: '0.95rem',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = '#f59e0b';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = '#e5e7eb';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col sm={4}>
                        <Form.Group style={{ marginBottom: '0' }}>
                          <Form.Label style={{ 
                            fontWeight: 600, 
                            fontSize: '0.8rem',
                            color: '#374151',
                            marginBottom: '6px',
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
                              border: '2px solid #e5e7eb',
                              padding: '10px 14px',
                              fontSize: '0.95rem',
                              transition: 'all 0.2s'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = '#f59e0b';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = '#e5e7eb';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col sm={4}>
                        <Form.Group style={{ marginBottom: '0' }}>
                          <Form.Label style={{ 
                            fontWeight: 600, 
                            fontSize: '0.8rem',
                            color: '#374151',
                            marginBottom: '6px',
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
                              border: '2px solid #e5e7eb',
                              padding: '10px 14px',
                              fontSize: '0.95rem',
                              transition: 'all 0.2s',
                              cursor: 'pointer'
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = '#f59e0b';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = '#e5e7eb';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <option value="">Seleccionar</option>
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
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* Columna Derecha - Categoría, Imagen y Oferta */}
                <Col lg={5}>
                  {/* Sección: Categoría */}
                  <div style={{ 
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '18px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '14px',
                      paddingBottom: '10px',
                      borderBottom: '2px solid #ede9fe'
                    }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Category style={{ fontSize: '17px', color: '#fff' }} />
                      </div>
                      <h5 style={{ 
                        margin: 0, 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        color: '#1f2937'
                      }}>
                        Categoría
                      </h5>
                    </div>
                    
                    <Form.Select
                      required
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      style={{
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        padding: '10px 14px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#8b5cf6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">Seleccionar categoría</option>
                      {apiCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </div>

                  {/* Sección: Imagen */}
                  <div style={{ 
                    background: '#fff',
                    borderRadius: '14px',
                    padding: '18px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      marginBottom: '14px',
                      paddingBottom: '10px',
                      borderBottom: '2px solid #e0f2fe'
                    }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Inventory style={{ fontSize: '17px', color: '#fff' }} />
                      </div>
                      <h5 style={{ 
                        margin: 0, 
                        fontSize: '1rem', 
                        fontWeight: 700,
                        color: '#1f2937'
                      }}>
                        Imagen del Producto
                      </h5>
                    </div>
                    
                    {/* Preview de imagen */}
                    <div style={{
                      width: '100%',
                      height: '100px',
                      borderRadius: '10px',
                      border: '2px dashed #d1d5db',
                      background: '#f9fafb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px',
                      overflow: 'hidden'
                    }}>
                      {formData.imagen ? (
                        <img 
                          src={formData.imagen} 
                          alt="Preview" 
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                          <Inventory style={{ fontSize: '40px', marginBottom: '8px' }} />
                          <p style={{ margin: 0, fontSize: '0.875rem' }}>Vista previa de imagen</p>
                        </div>
                      )}
                    </div>
                    
                    <Form.Control
                      type="text"
                      value={formData.imagen}
                      onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      style={{
                        borderRadius: '10px',
                        border: '2px solid #e5e7eb',
                        padding: '10px 14px',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#06b6d4';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Sección: Oferta */}
                  <div 
                    style={{ 
                      background: formData.oferta 
                        ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' 
                        : '#fff',
                      borderRadius: '14px',
                      padding: '16px 18px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      border: formData.oferta ? '2px solid #fca5a5' : '1px solid #e5e7eb',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => setFormData({...formData, oferta: !formData.oferta})}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: formData.oferta 
                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            : '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}>
                          <span style={{ fontSize: '20px' }}>
                            {formData.oferta ? '🔥' : '🏷️'}
                          </span>
                        </div>
                        <div>
                          <h6 style={{ 
                            margin: 0, 
                            fontSize: '0.95rem', 
                            fontWeight: 700,
                            color: formData.oferta ? '#dc2626' : '#374151'
                          }}>
                            Producto en Oferta
                          </h6>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '0.8rem', 
                            color: '#6b7280',
                            marginTop: '2px'
                          }}>
                            {formData.oferta ? 'Producto destacado' : 'Activar para destacar'}
                          </p>
                        </div>
                      </div>
                      <div style={{
                        width: '46px',
                        height: '24px',
                        borderRadius: '12px',
                        background: formData.oferta ? '#10b981' : '#d1d5db',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#fff',
                          position: 'absolute',
                          top: '3px',
                          left: formData.oferta ? '25px' : '3px',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Campo de descuento - Solo visible cuando oferta está activada */}
              {formData.oferta && (
                <Row className="mb-3">
                  <Col>
                    <div style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '2px solid #fbbf24',
                      marginTop: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: '#fbbf24',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}>
                          💰
                        </div>
                        <div>
                          <h6 style={{ 
                            margin: 0, 
                            fontSize: '0.95rem', 
                            fontWeight: 700,
                            color: '#92400e'
                          }}>
                            Porcentaje de Descuento
                          </h6>
                          <p style={{ 
                            margin: 0, 
                            fontSize: '0.75rem', 
                            color: '#78350f',
                            marginTop: '2px'
                          }}>
                            Ingresa el % de descuento que deseas aplicar
                          </p>
                        </div>
                      </div>
                      <Form.Group>
                        <Form.Label style={{ 
                          fontWeight: 600, 
                          fontSize: '0.85rem', 
                          color: '#92400e',
                          marginBottom: '8px',
                          display: 'block'
                        }}>
                          Descuento (%)
                        </Form.Label>
                        <div style={{ position: 'relative' }}>
                          <Form.Control
                            type="number"
                            min="1"
                            max="99"
                            value={formData.descuento}
                            onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                            placeholder="Ej: 15"
                            required
                            style={{
                              padding: '12px 16px',
                              fontSize: '1rem',
                              border: '2px solid #fbbf24',
                              borderRadius: '8px',
                              background: '#fff',
                              fontWeight: 600,
                              color: '#92400e'
                            }}
                          />
                          <span style={{
                            position: 'absolute',
                            right: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#92400e'
                          }}>
                            %
                          </span>
                        </div>
                        {formData.descuento && formData.precio && (
                          <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '8px',
                            border: '1px dashed #fbbf24'
                          }}>
                            <div style={{ fontSize: '0.8rem', color: '#78350f', marginBottom: '4px' }}>
                              Precio original: <strong>${Number(formData.precio).toLocaleString('es-CL')}</strong>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#92400e', fontWeight: 700 }}>
                              Precio con descuento: <span style={{ color: '#15803d' }}>
                                ${(Number(formData.precio) * (1 - Number(formData.descuento) / 100)).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>
                        )}
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
              )}
            </div>

            {/* Footer del Modal */}
            <div style={{
              background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '14px 28px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0
            }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: '#fff',
                  border: '2px solid #e2e8f0',
                  color: '#64748b',
                  borderRadius: '10px',
                  padding: '10px 22px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#475569';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '10px 26px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.35)';
                }}
              >
                {modalMode === 'add' ? (
                  <>
                    <Add style={{ fontSize: '18px' }} /> Crear Producto
                  </>
                ) : (
                  <>
                    <Edit style={{ fontSize: '18px' }} /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManagement;