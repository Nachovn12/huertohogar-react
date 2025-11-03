import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, isCartOpen, closeCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={closeCart}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1040,
          display: isCartOpen ? 'block' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Cart Offcanvas */}
      <div 
        id="cart-offcanvas" 
        style={{
          position: 'fixed',
          top: 0,
          right: isCartOpen ? 0 : '-400px',
          width: '400px',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          transition: 'right 0.3s ease'
        }}
      >
        {/* Header */}
        <div 
          className="cart-header" 
          style={{
            padding: '20px',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2E8B57',
            color: '#fff'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Tu Carrito</h3>
          <button 
            onClick={closeCart}
            className="close-btn"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              color: '#fff',
              cursor: 'pointer',
              padding: 0,
              lineHeight: 1,
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div 
          id="cart-items" 
          className="cart-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: items.length === 0 ? '40px 20px' : '20px'
          }}
        >
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6c757d' }}>
              <p style={{ fontSize: '1.1rem' }}>Tu carrito está vacío</p>
              <p style={{ fontSize: '0.9rem' }}>Agrega productos para comenzar</p>
            </div>
          ) : (
            items.map(item => (
              <div 
                key={item.id}
                className="cart-item" 
                data-id={item.id}
                style={{
                  display: 'flex',
                  gap: '15px',
                  padding: '15px',
                  borderBottom: '1px solid #e9ecef',
                  backgroundColor: '#fff'
                }}
              >
                {/* Image */}
                <div 
                  className="cart-item-image"
                  style={{
                    width: '80px',
                    height: '80px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={item.image || 'https://via.placeholder.com/80'} 
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {/* Badge de oferta en la imagen */}
                  {item.discount && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: '#ffc107',
                        color: '#000',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '2px 5px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      -{item.discount}%
                    </span>
                  )}
                </div>

                {/* Details */}
                <div 
                  className="cart-item-details"
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <h4 
                    className="cart-item-name"
                    style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#333'
                    }}
                  >
                    {item.name}
                  </h4>
                  
                  {/* Mostrar precio con oferta si existe */}
                  {item.discount && item.discountedPrice ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                          className="cart-item-price"
                          style={{
                            fontSize: '1rem',
                            color: '#dc3545',
                            fontWeight: '700'
                          }}
                        >
                          {formatPrice(item.discountedPrice)}
                        </div>
                        <span 
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#ffc107',
                            color: '#000',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '700'
                          }}
                        >
                          -{item.discount}%
                        </span>
                      </div>
                      <div 
                        style={{
                          fontSize: '0.85rem',
                          color: '#999',
                          textDecoration: 'line-through'
                        }}
                      >
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="cart-item-price"
                      style={{
                        fontSize: '0.95rem',
                        color: '#2E8B57',
                        fontWeight: '600'
                      }}
                    >
                      {formatPrice(item.price)}
                    </div>
                  )}
                  
                  <div 
                    className="cart-item-total"
                    style={{
                      fontSize: '0.9rem',
                      color: '#666',
                      fontWeight: '600'
                    }}
                  >
                    Subtotal: {formatPrice((item.discountedPrice || item.price) * item.quantity)}
                  </div>
                </div>

                {/* Controls */}
                <div 
                  className="cart-item-controls"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Quantity Controls */}
                  <div 
                    className="quantity-controls"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      border: '1px solid #dee2e6',
                      borderRadius: '6px',
                      padding: '4px',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <button 
                      className="quantity-btn decrease-btn"
                      onClick={() => {
                        if (item.quantity === 1) {
                          if (window.confirm('¿Deseas eliminar este producto del carrito?')) {
                            removeFromCart(item.id);
                          }
                        } else {
                          updateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                      disabled={item.quantity === 0}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: item.quantity === 0 ? 'not-allowed' : 'pointer',
                        padding: '5px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        color: item.quantity === 1 ? '#dc3545' : '#666',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (item.quantity > 0) {
                          e.target.style.backgroundColor = '#e9ecef';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      title={item.quantity === 1 ? 'Eliminar producto' : 'Disminuir cantidad'}
                    >
                      <RemoveIcon style={{ fontSize: '1.1rem' }} />
                    </button>
                    <span 
                      className="quantity-display"
                      style={{
                        minWidth: '35px',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '1rem',
                        color: '#333',
                        padding: '0 5px'
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button 
                      className="quantity-btn increase-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#2E8B57',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e9ecef';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      title="Aumentar cantidad"
                    >
                      <AddIcon style={{ fontSize: '1.1rem' }} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    className="remove-btn"
                    onClick={() => {
                      if (window.confirm(`¿Deseas eliminar "${item.name}" del carrito?`)) {
                        removeFromCart(item.id);
                      }
                    }}
                    title="Eliminar producto"
                    style={{
                      background: 'none',
                      border: '1px solid #dc3545',
                      cursor: 'pointer',
                      color: '#dc3545',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#dc3545';
                      e.target.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#dc3545';
                    }}
                  >
                    <DeleteIcon style={{ fontSize: '1rem' }} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div 
            className="cart-footer"
            style={{
              padding: '20px',
              borderTop: '1px solid #e9ecef',
              backgroundColor: '#f8f9fa'
            }}
          >
            {/* Summary */}
            <div 
              className="summary-line"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
            >
              <span>Subtotal</span>
              <span id="cart-total" style={{ color: '#2E8B57' }}>
                {formatPrice(getTotalPrice())}
              </span>
            </div>

            {/* Checkout Button */}
            <button 
              className="btn btn-primary checkout-btn"
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2E8B57',
                border: 'none',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#246d43'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2E8B57'}
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
