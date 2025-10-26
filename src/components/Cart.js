import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card">
              <div className="card-body">
                <h3>🛒 Tu carrito está vacío</h3>
                <p>Agrega algunos productos para comenzar</p>
                <Link to="/" className="btn btn-primary">
                  Ver Productos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h2>Mi Carrito</h2>
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {items.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <div className="text-center" style={{ fontSize: '3rem' }}>
                      {item.image}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <h5>{item.name}</h5>
                    <p className="text-muted small">{item.description}</p>
                  </div>
                  
                  <div className="col-md-2">
                    <span className="h6">{formatPrice(item.price)}</span>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="input-group">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        min="1"
                      />
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h6">{formatPrice(item.price * item.quantity)}</span>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5>Resumen del Pedido</h5>
              <hr />
              
              <div className="d-flex justify-content-between">
                <span>Total ({items.reduce((sum, item) => sum + item.quantity, 0)} productos):</span>
                <span className="h5 text-primary">{formatPrice(getTotalPrice())}</span>
              </div>
              
              <hr />
              
              <div className="d-grid gap-2">
                <button className="btn btn-success btn-lg">
                  Proceder al Pago
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={clearCart}
                >
                  Vaciar Carrito
                </button>
                <Link to="/" className="btn btn-outline-primary">
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
