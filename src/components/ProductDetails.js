import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="container my-5">
        <h3>Producto no encontrado</h3>
        <p>El producto que buscas no existe o fue eliminado.</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6 text-center">
          <div className="product-image" style={{height: '300px'}}>
            <img src={product.image} alt={product.name} style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}} />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-primary">{formatPrice(product.price)} {product.unit}</h4>
          <p className="mt-3">Stock: {product.stock} {product.unit}</p>

          <div className="d-grid gap-2 mt-4">
            <button
              className="btn btn-primary"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
