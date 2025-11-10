import React from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, isCartOpen, closeCart, getTotalPrice } = useCart() as {
    items: (Product & { quantity: number; discountedPrice?: number })[];
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    isCartOpen: boolean;
    closeCart: (() => void) | null;
    getTotalPrice: () => number;
  };
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    closeCart && closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div className="cart-drawer-overlay" onClick={closeCart}></div>
      )}
      
      <aside className={`cart-drawer${isCartOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-title">
            <ShoppingCartIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} />
            Tu Carrito
          </h2>
          <button className="close-cart" onClick={closeCart} aria-label="Cerrar carrito">
            <span>&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCartIcon style={{ fontSize: '4rem', color: '#d1d5db', marginBottom: '1rem' }} />
              <h3 className="cart-empty-title">Tu carrito está vacío</h3>
              <p className="cart-empty-sub">Agrega algunos productos para comenzar</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item: any) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image-wrapper">
                    <img 
                      src={item.image || 'https://via.placeholder.com/80'} 
                      alt={item.name}
                      className="cart-item-image"
                    />
                    {item.discount && (
                      <span className="cart-discount-badge">-{item.discount}%</span>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    
                    <div className="cart-item-pricing">
                      {item.discount && item.discountedPrice ? (
                        <>
                          <span className="cart-price-current">{formatPrice(item.discountedPrice)}</span>
                          <span className="cart-discount-percentage">-{item.discount}%</span>
                          <span className="cart-price-original">{formatPrice(item.price)}</span>
                        </>
                      ) : (
                        <span className="cart-price-current">{formatPrice(item.price)}</span>
                      )}
                    </div>

                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn" 
                          onClick={() => {
                            if (item.quantity === 1) {
                              if (window.confirm('¿Deseas eliminar este producto del carrito?')) {
                                removeFromCart(item.id);
                              }
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          aria-label="Disminuir cantidad"
                        >
                          <RemoveIcon style={{ fontSize: '1rem' }} />
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          className="quantity-btn" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <AddIcon style={{ fontSize: '1rem' }} />
                        </button>
                      </div>

                      <button 
                        className="remove-btn" 
                        onClick={() => {
                          if (window.confirm(`¿Deseas eliminar "${item.name}" del carrito?`)) {
                            removeFromCart(item.id);
                          }
                        }}
                        aria-label="Eliminar producto"
                      >
                        <DeleteIcon style={{ fontSize: '1.1rem' }} />
                        <span>Eliminar</span>
                      </button>
                    </div>

                    <div className="cart-item-subtotal">
                      <span className="subtotal-label">Subtotal:</span>
                      <span className="subtotal-value">
                        {formatPrice((item.discountedPrice || item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="cart-drawer-footer">
          <div className="cart-total">
            <span className="total-label">Subtotal</span>
            <span className="total-value">{formatPrice(getTotalPrice && getTotalPrice())}</span>
          </div>
          <button 
            className="checkout-btn" 
            onClick={handleCheckout} 
            disabled={items.length === 0}
          >
            Finalizar Compra
          </button>
        </div>
      </aside>
    </>
  );
};

export default Cart;
