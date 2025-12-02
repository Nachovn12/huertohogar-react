import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, appliedCoupon, applyCoupon, removeCoupon, getCouponDiscount, getSubtotalAfterCoupon } = useCart() as {
    items: (Product & { quantity: number; discountedPrice?: number })[];
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    getTotalPrice: () => number;
    appliedCoupon: { code: string; discount: number } | null;
    applyCoupon: (code: string, discount: number) => void;
    removeCoupon: () => void;
    getCouponDiscount: () => number;
    getSubtotalAfterCoupon: () => number;
  };
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
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

  // Cupones de ejemplo - en producción vendrían de la API
  const validCoupons: { [key: string]: number } = {
    'HUERTO10': 0.10,         // 10% descuento
    'HUERTO15': 0.15,         // 15% descuento
    'HUERTO20': 0.20,         // 20% descuento
    'ENVIOGRATIS': 0,         // Envío gratis
    'PRIMERA5': 0.05,         // 5% descuento
    'HUERTOHOGAR2025': 0.12,  // 12% descuento - Cupón especial 2025
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleApplyCoupon = () => {
    const upperCode = couponCode.toUpperCase().trim();
    
    if (!upperCode) {
      setCouponError('Por favor ingresa un cupón');
      return;
    }

    if (validCoupons[upperCode] !== undefined) {
      applyCoupon(upperCode, validCoupons[upperCode]);
      setCouponError('');
      setCouponCode('');
      setShowCouponInput(false);
    } else {
      setCouponError('Cupón inválido o expirado');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponError('');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate('/checkout');
    }
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  const handleRegister = () => {
    setShowAuthModal(false);
    navigate('/registro');
  };

  const handleContinueAsGuest = () => {
    setShowAuthModal(false);
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/productos');
  };

  // Configuración de envío
  const SHIPPING_FREE_THRESHOLD = 25000;
  const SHIPPING_COST = 3990;
  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  
  // Calcular descuento del cupón usando las funciones del contexto
  const couponDiscount = getCouponDiscount ? getCouponDiscount() : 0;
  const subtotalAfterCoupon = getSubtotalAfterCoupon ? getSubtotalAfterCoupon() : subtotal;
  
  // Verificar si el cupón es de envío gratis
  const isCouponFreeShipping = appliedCoupon?.code === 'ENVIOGRATIS';
  const isFreeShipping = subtotalAfterCoupon >= SHIPPING_FREE_THRESHOLD || isCouponFreeShipping;
  const shipping = isFreeShipping ? 0 : SHIPPING_COST;
  
  const total = subtotalAfterCoupon + shipping;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="cart-page-container">
        {/* Header */}
        <div className="cart-page-header">
          <button className="cart-page-back" onClick={handleContinueShopping}>
            <ArrowBackIcon />
            <span>Continuar comprando</span>
          </button>
          <h1 className="cart-page-title">
            <ShoppingCartOutlinedIcon />
            Mi Carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
          </h1>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="cart-page-empty">
            <div className="cart-page-empty-content">
              <ShoppingCartOutlinedIcon className="cart-page-empty-icon" />
              <h2>Tu carrito está vacío</h2>
              <p>¡Agrega productos frescos y orgánicos de HuertoHogar!</p>
              <button className="cart-page-empty-btn" onClick={handleContinueShopping}>
                Explorar productos
              </button>
            </div>
          </div>
        ) : (
          /* Cart Content */
          <div className="cart-page-content">
            {/* Products Section */}
            <div className="cart-page-products">
              <div className="cart-page-products-header">
                <h2>Productos</h2>
                <button className="cart-page-clear" onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    items.forEach(item => removeFromCart(item.id));
                  }
                }}>
                  Vaciar carrito
                </button>
              </div>

              {/* Column Headers - Desktop */}
              <div className="cart-page-columns">
                <div className="cart-page-col-product">Producto</div>
                <div className="cart-page-col-quantity">Cantidad</div>
                <div className="cart-page-col-price">Precio</div>
                <div className="cart-page-col-total">Total</div>
                <div className="cart-page-col-actions"></div>
              </div>

              <div className="cart-page-products-list">
                {items.map((item: any) => {
                  const itemName = item.nombre || item.name || 'Producto';
                  const itemImage = item.imagen || item.image || '';
                  const itemPrice = item.precio || item.price || 0;
                  const finalPrice = item.discountedPrice || item.offerPrice || itemPrice;

                  return (
                    <div key={item.id} className="cart-page-item">
                      <div className="cart-page-item-image">
                        <img
                          src={itemImage}
                          alt={itemName}
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/120/f0fdf4/16a34a?text=🌱';
                          }}
                        />
                      </div>

                      <div className="cart-page-item-details">
                        <h3 className="cart-page-item-name">{itemName}</h3>
                        <p className="cart-page-item-category">Productos Frescos</p>
                        <div className="cart-page-item-price-mobile">
                          {formatPrice(finalPrice)}
                        </div>
                      </div>

                      <div className="cart-page-item-quantity">
                        <div className="cart-page-qty">
                          <button
                            className="cart-page-qty-btn"
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
                          <span className="cart-page-qty-value">{item.quantity}</span>
                          <button
                            className="cart-page-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </button>
                        </div>
                      </div>

                      <div className="cart-page-item-price">
                        {formatPrice(finalPrice)}
                      </div>

                      <div className="cart-page-item-total">
                        {formatPrice(finalPrice * item.quantity)}
                      </div>

                      <button
                        className="cart-page-item-delete"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Eliminar producto"
                      >
                        <DeleteOutlineIcon />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Section */}
            <div className="cart-page-summary">
              <div className="cart-page-summary-card">
                <h3 className="cart-page-summary-title">Resumen de Compra</h3>

                <div className="cart-page-summary-row">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && appliedCoupon.discount > 0 && (
                  <div className="cart-page-summary-row cart-page-discount">
                    <span>Descuento ({Math.round(appliedCoupon.discount * 100)}%)</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="cart-page-summary-row">
                  <span>Envío</span>
                  <span className={isFreeShipping ? 'cart-page-free' : ''}>
                    {isFreeShipping ? '¡Gratis!' : formatPrice(shipping)}
                  </span>
                </div>

                {!isFreeShipping && subtotalAfterCoupon > 0 && (
                  <div className="cart-page-shipping-progress">
                    <div className="cart-page-shipping-bar">
                      <div
                        className="cart-page-shipping-fill"
                        style={{ width: `${Math.min((subtotalAfterCoupon / SHIPPING_FREE_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="cart-page-shipping-text">
                      Te faltan {formatPrice(SHIPPING_FREE_THRESHOLD - subtotalAfterCoupon)} para envío gratis
                    </p>
                  </div>
                )}

                <div className="cart-page-summary-divider" />

                <div className="cart-page-summary-total">
                  <span>Total</span>
                  <span className="cart-page-summary-total-price">{formatPrice(total)}</span>
                </div>

                {/* Cupón de descuento - Después del total */}
                {appliedCoupon && (
                  <div className="cart-page-coupon-applied">
                    <div className="cart-page-coupon-applied-info">
                      <CardGiftcardOutlinedIcon />
                      <span>Cupón: {appliedCoupon.code}</span>
                    </div>
                    <button 
                      className="cart-page-coupon-remove"
                      onClick={handleRemoveCoupon}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {!appliedCoupon && (
                  <div className="cart-page-coupon-section">
                    {!showCouponInput ? (
                      <button 
                        className="cart-page-coupon-toggle"
                        onClick={() => setShowCouponInput(true)}
                      >
                        <CardGiftcardOutlinedIcon />
                        <span>¿Tienes un cupón de descuento?</span>
                      </button>
                    ) : (
                      <div className="cart-page-coupon-input-wrapper">
                        <div className="cart-page-coupon-input-group">
                          <input
                            type="text"
                            className="cart-page-coupon-input"
                            placeholder="Código de cupón"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError('');
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          />
                          <button 
                            className="cart-page-coupon-apply"
                            onClick={handleApplyCoupon}
                          >
                            Aplicar
                          </button>
                        </div>
                        {couponError && (
                          <p className="cart-page-coupon-error">{couponError}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button className="cart-page-checkout-btn" onClick={handleCheckout}>
                  <LockOutlinedIcon />
                  Proceder al pago
                </button>

                <button className="cart-page-continue-btn" onClick={handleContinueShopping}>
                  Continuar comprando
                </button>

                {/* Trust Badges */}
                <div className="cart-page-trust">
                  <div className="cart-page-trust-item">
                    <LocalShippingOutlinedIcon />
                    <span>Envío gratis desde ${SHIPPING_FREE_THRESHOLD.toLocaleString()}</span>
                  </div>
                  <div className="cart-page-trust-item">
                    <VerifiedUserOutlinedIcon />
                    <span>Compra 100% segura</span>
                  </div>
                  <div className="cart-page-trust-item">
                    <ShoppingCartOutlinedIcon />
                    <span>Productos frescos garantizados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default CartPage;
