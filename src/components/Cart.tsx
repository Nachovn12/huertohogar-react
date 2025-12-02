import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, isCartOpen, closeCart, getTotalPrice } = useCart() as {
    items: (Product & { quantity: number; discountedPrice?: number })[];
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    isCartOpen: boolean;
    closeCart: (() => void) | null;
    getTotalPrice: () => number;
  };
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Prevenir scroll cuando el modal está abierto
  React.useEffect(() => {
    if (showAuthModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAuthModal]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      closeCart && closeCart();
      navigate('/checkout');
    }
  };

  const handleGoToCart = () => {
    closeCart && closeCart();
    navigate('/carrito');
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    closeCart && closeCart();
    navigate('/login');
  };

  const handleRegister = () => {
    setShowAuthModal(false);
    closeCart && closeCart();
    navigate('/registro');
  };

  const handleContinueAsGuest = () => {
    setShowAuthModal(false);
    closeCart && closeCart();
    navigate('/checkout');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Configuración de envío
  const SHIPPING_FREE_THRESHOLD = 25000;
  const SHIPPING_COST = 3990;
  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  const isFreeShipping = subtotal >= SHIPPING_FREE_THRESHOLD;
  const total = subtotal;

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className={`cart-backdrop${isCartOpen ? ' active' : ''}`} 
        onClick={() => closeCart && closeCart()}
      />
      
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="auth-modal-image">
              <img 
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80" 
                alt="Productos frescos HuertoHogar"
              />
              <div className="auth-modal-image-overlay">
                <div className="auth-modal-brand">
                  <span className="auth-modal-logo">🌱</span>
                  <span>HuertoHogar</span>
                </div>
              </div>
            </div>
            
            <div className="auth-modal-content">
              <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>
                <CloseIcon style={{ fontSize: '1.25rem' }} />
              </button>
              
              <div className="auth-modal-header">
                <div className="auth-modal-icon">
                  <ShoppingBagOutlinedIcon />
                </div>
                <h2>Inicia sesión o regístrate</h2>
                <p>Crea una cuenta y accede a beneficios exclusivos</p>
              </div>
              
              <div className="auth-modal-benefits">
                <div className="auth-modal-benefit">
                  <LocalShippingOutlinedIcon />
                  <span>Seguimiento de tus pedidos</span>
                </div>
                <div className="auth-modal-benefit">
                  <GrassOutlinedIcon />
                  <span>Productos frescos y orgánicos</span>
                </div>
                <div className="auth-modal-benefit">
                  <CardGiftcardOutlinedIcon />
                  <span>Cupones y descuentos exclusivos</span>
                </div>
              </div>
              
              <div className="auth-modal-actions">
                <button className="auth-modal-btn auth-modal-btn-primary" onClick={handleRegister}>
                  Crear cuenta
                </button>
                <button className="auth-modal-btn auth-modal-btn-secondary" onClick={handleLogin}>
                  Iniciar sesión
                </button>
                <button className="auth-modal-btn-link" onClick={handleContinueAsGuest}>
                  Continuar como invitado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cart Drawer */}
      <aside className={`cart-drawer${isCartOpen ? ' open' : ''}`}>
        {/* Header minimalista */}
        <div className="cart-header">
          <h2 className="cart-title">Tus productos ({totalItems})</h2>
          <button className="cart-close" onClick={closeCart} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>

        {/* Products List */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCartOutlinedIcon className="cart-empty-icon" />
              <p className="cart-empty-text">Tu carrito está vacío</p>
              <button className="cart-empty-btn" onClick={closeCart}>
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="cart-products">
              {items.map((item: any) => {
                const itemName = item.nombre || item.name || 'Producto';
                const itemImage = item.imagen || item.image || '';
                const itemPrice = item.precio || item.price || 0;
                const finalPrice = item.discountedPrice || item.offerPrice || itemPrice;
                
                return (
                  <div key={item.id} className="cart-product">
                    <div className="cart-product-image">
                      <img 
                        src={itemImage} 
                        alt={itemName}
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80/f0fdf4/16a34a?text=🌱';
                        }}
                      />
                    </div>
                    
                    <div className="cart-product-info">
                      <div className="cart-product-header">
                        <h4 className="cart-product-name">{itemName}</h4>
                        <button 
                          className="cart-product-delete"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Eliminar producto"
                        >
                          <DeleteOutlineIcon />
                        </button>
                      </div>
                      
                      <div className="cart-product-price">
                        {formatPrice(finalPrice)}
                      </div>
                      
                      <div className="cart-product-controls">
                        <div className="cart-qty">
                          <button 
                            className="cart-qty-btn"
                            onClick={() => {
                              if (item.quantity === 1) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                          >
                            <RemoveIcon />
                          </button>
                          <span className="cart-qty-value">{item.quantity}</span>
                          <button 
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Total</span>
                <span className="cart-summary-total">{formatPrice(total)}</span>
              </div>
              {!isFreeShipping && (
                <p className="cart-shipping-note">
                  + Envío calculado en el checkout
                </p>
              )}
              {isFreeShipping && (
                <p className="cart-shipping-free">
                  🎉 ¡Envío gratis incluido!
                </p>
              )}
            </div>
            
            <div className="cart-actions">
              <button className="cart-btn-secondary" onClick={handleGoToCart}>
                Ir al carro
              </button>
              <button className="cart-btn-primary" onClick={handleCheckout}>
                Continuar con el pago
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Cart;
