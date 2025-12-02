import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

// --- Iconos ---
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// --- Pasos del Checkout ---
const steps = [
  { id: 1, label: 'Datos Personales', icon: PersonOutlineIcon },
  { id: 2, label: 'Dirección', icon: LocalShippingOutlinedIcon },
  { id: 3, label: 'Pago', icon: CreditCardIcon },
  { id: 4, label: 'Confirmar', icon: CheckCircleOutlineIcon },
];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart, appliedCoupon, getCouponDiscount, getSubtotalAfterCoupon } = useCart() as {
    items: (Product & { quantity: number })[];
    getTotalPrice: () => number;
    clearCart: () => void;
    appliedCoupon: { code: string; discount: number } | null;
    getCouponDiscount: () => number;
    getSubtotalAfterCoupon: () => number;
  };
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  // Función para generar datos aleatorios basados en el usuario
  const generateUserData = () => {
    if (!user) {
      // Si no hay usuario, usar datos genéricos
      return {
        firstName: 'Invitado',
        lastName: 'Comprador',
        email: 'invitado@ejemplo.com',
        phone: '+56 9 0000 0000',
        address: 'Dirección sin especificar',
        city: 'Santiago',
        commune: 'Santiago Centro',
        zipCode: '8320000',
        notes: '',
        cardNumber: '',
        cardName: 'Titular de la tarjeta',
        cardExpiry: '',
        cardCVV: ''
      };
    }

    // Separar nombre completo del usuario
    const nameParts = user.nombre?.split(' ') || ['Usuario'];
    const firstName = nameParts[0] || 'Usuario';
    const lastName = nameParts.slice(1).join(' ') || 'HuertoHogar';

    // Generar datos aleatorios pero coherentes
    const direcciones = [
      'Av. Libertador Bernardo O\'Higgins',
      'Av. Providencia',
      'Av. Apoquindo',
      'Av. Pedro de Valdivia',
      'Av. Vicuña Mackenna',
      'Calle Huérfanos',
      'Calle Bandera',
      'Av. Manuel Montt'
    ];
    
    const ciudades = ['Santiago', 'Concepción', 'Valparaíso', 'La Serena', 'Antofagasta', 'Temuco', 'Puerto Montt', 'Viña del Mar'];
    const comunas = {
      'Santiago': ['Santiago Centro', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Reina', 'Vitacura'],
      'Concepción': ['Concepción Centro', 'San Pedro de la Paz', 'Talcahuano', 'Hualpén'],
      'Valparaíso': ['Valparaíso Centro', 'Viña del Mar', 'Con Con', 'Quilpué'],
      'La Serena': ['La Serena Centro', 'Coquimbo'],
      'Antofagasta': ['Antofagasta Centro', 'Mejillones'],
      'Temuco': ['Temuco Centro', 'Padre Las Casas'],
      'Puerto Montt': ['Puerto Montt Centro', 'Puerto Varas'],
      'Viña del Mar': ['Viña del Mar Centro', 'Reñaca']
    };

    const randomAddress = direcciones[Math.floor(Math.random() * direcciones.length)];
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const randomCity = ciudades[Math.floor(Math.random() * ciudades.length)];
    const randomCommune = comunas[randomCity][Math.floor(Math.random() * comunas[randomCity].length)];
    const randomPhone = `+56 9 ${Math.floor(10000000 + Math.random() * 90000000)}`;

    return {
      firstName,
      lastName,
      email: user.email, // Email real del usuario
      phone: randomPhone,
      address: `${randomAddress} ${randomNumber}`,
      city: randomCity,
      commune: randomCommune,
      zipCode: `${Math.floor(1000000 + Math.random() * 9000000)}`,
      notes: '',
      cardNumber: '4242 4242 4242 4242',
      cardName: `${firstName} ${lastName}`,
      cardExpiry: '12/26',
      cardCVV: '123'
    };
  };

  // Estado inicial del formulario
  const [formData, setFormData] = useState<any>(generateUserData());

  // Actualizar formData cuando cambie el usuario
  useEffect(() => {
    setFormData(generateUserData());
  }, [user]);

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const validateStep = (step: number) => {
    const newErrors: any = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'Requerido';
      if (!formData.email.trim()) newErrors.email = 'Requerido';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
      if (!formData.phone.trim()) newErrors.phone = 'Requerido';
    }
    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Requerido';
      if (!formData.city.trim()) newErrors.city = 'Requerido';
      if (!formData.commune.trim()) newErrors.commune = 'Requerido';
    }
    if (step === 3) {
      // Validar que se haya seleccionado un método de pago
      if (!paymentMethod) {
        alert('Por favor selecciona un método de pago');
        return false;
      }
      
      // Validar campos según el método de pago
      if (paymentMethod === 'credit-card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Requerido';
        if (!formData.cardName.trim()) newErrors.cardName = 'Requerido';
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Requerido';
        if (!formData.cardCVV.trim()) newErrors.cardCVV = 'Requerido';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== INICIANDO PROCESO DE PEDIDO ===');
    console.log('Usuario:', user);
    console.log('Items del carrito:', items);
    console.log('Método de pago:', paymentMethod);
    
    setProcessing(true);
    
    // Crear el pedido
    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      status: 'pending' as const,
      paymentMethod: paymentMethod,
      items: items.map(item => ({
        id: item.id,
        name: item.nombre,
        price: item.precio,
        quantity: item.quantity,
        image: item.imagen
      })),
      subtotal: subtotal,
      discount: couponDiscount,
      shipping: shippingCost,
      total: total,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: user?.email || formData.email, // Usar email del usuario logueado si existe
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        commune: formData.commune
      },
      couponCode: appliedCoupon?.code
    };

    // Guardar en localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
      clearCart && clearCart();
      setTimeout(() => navigate('/'), 3000);
    }, 2000);
  };

  // Obtener datos del item (soporta español e inglés)
  const getItemData = (item: any) => ({
    name: item.nombre || item.name || 'Producto',
    price: item.precio || item.price || 0,
    image: item.imagen || item.image || 'https://via.placeholder.com/60',
    quantity: item.quantity || 1
  });

  const totalItems = (items || []).reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  
  // Calcular descuento del cupón
  const couponDiscount = getCouponDiscount ? getCouponDiscount() : 0;
  const subtotalAfterCoupon = getSubtotalAfterCoupon ? getSubtotalAfterCoupon() : subtotal;
  
  // Configuración de envío
  const SHIPPING_FREE_THRESHOLD = 25000; // Envío gratis sobre este monto
  const SHIPPING_COST = 3990; // Costo de envío estándar
  const isCouponFreeShipping = appliedCoupon?.code === 'ENVIOGRATIS';
  const isFreeShipping = subtotalAfterCoupon >= SHIPPING_FREE_THRESHOLD || isCouponFreeShipping;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST;
  const total = subtotalAfterCoupon + shippingCost;
  const amountForFreeShipping = SHIPPING_FREE_THRESHOLD - subtotalAfterCoupon;

  // --- CARRITO VACÍO ---
  if ((!items || items.length === 0) && !showSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">
            <ShoppingCartOutlinedIcon />
          </div>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos para continuar con tu compra</p>
          <button className="checkout-empty-btn" onClick={() => navigate('/productos')}>
            <HomeIcon style={{ fontSize: '1.1rem' }} />
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  // --- ÉXITO ---
  if (showSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="checkout-success-icon">
            <CheckCircleOutlineIcon />
          </div>
          <h2>¡Pedido Confirmado!</h2>
          <p>Gracias por tu compra. Recibirás un email con los detalles.</p>
          <div className="checkout-success-loader"></div>
          <span className="checkout-success-redirect">Redirigiendo al inicio...</span>
        </div>
      </div>
    );
  }

  // --- CHECKOUT PRINCIPAL ---
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-secure">
            <LockIcon style={{ fontSize: '0.9rem' }} />
            <span>Pago Seguro</span>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Columna Izquierda - Formulario */}
          <div className="checkout-form-section">
            {/* Stepper */}
            <div className="checkout-stepper">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <React.Fragment key={step.id}>
                    <div className={`checkout-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                      <div className="checkout-step-icon">
                        {isCompleted ? <CheckCircleOutlineIcon style={{ fontSize: '1.1rem' }} /> : <StepIcon style={{ fontSize: '1.1rem' }} />}
                      </div>
                      <span className="checkout-step-label">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && <div className={`checkout-step-line ${isCompleted ? 'completed' : ''}`}></div>}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Formulario */}
            <form className="checkout-form" onSubmit={handleSubmit}>
              {/* Paso 1: Datos Personales */}
              {currentStep === 1 && (
                <div className="checkout-form-content">
                  <h3 className="checkout-form-title">
                    <PersonOutlineIcon />
                    Información Personal
                  </h3>
                  <div className="checkout-form-row">
                    <div className="checkout-field">
                      <label>Nombre</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'error' : ''} />
                      {errors.firstName && <span className="checkout-field-error">{errors.firstName}</span>}
                    </div>
                    <div className="checkout-field">
                      <label>Apellido</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'error' : ''} />
                      {errors.lastName && <span className="checkout-field-error">{errors.lastName}</span>}
                    </div>
                  </div>
                  <div className="checkout-field">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} />
                    {errors.email && <span className="checkout-field-error">{errors.email}</span>}
                  </div>
                  <div className="checkout-field">
                    <label>Teléfono</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? 'error' : ''} />
                    {errors.phone && <span className="checkout-field-error">{errors.phone}</span>}
                  </div>
                </div>
              )}

              {/* Paso 2: Dirección */}
              {currentStep === 2 && (
                <div className="checkout-form-content">
                  <h3 className="checkout-form-title">
                    <LocalShippingOutlinedIcon />
                    Dirección de Envío
                  </h3>
                  <div className="checkout-field">
                    <label>Dirección</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={errors.address ? 'error' : ''} placeholder="Calle, número, depto..." />
                    {errors.address && <span className="checkout-field-error">{errors.address}</span>}
                  </div>
                  <div className="checkout-form-row">
                    <div className="checkout-field">
                      <label>Ciudad</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'error' : ''} />
                      {errors.city && <span className="checkout-field-error">{errors.city}</span>}
                    </div>
                    <div className="checkout-field">
                      <label>Comuna</label>
                      <input type="text" name="commune" value={formData.commune} onChange={handleChange} className={errors.commune ? 'error' : ''} />
                      {errors.commune && <span className="checkout-field-error">{errors.commune}</span>}
                    </div>
                  </div>
                  <div className="checkout-field">
                    <label>Notas de entrega <span className="optional">(opcional)</span></label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Instrucciones especiales para la entrega..." rows={3}></textarea>
                  </div>
                </div>
              )}

              {/* Paso 3: Pago */}
              {currentStep === 3 && (
                <div className="checkout-form-content">
                  <h3 className="checkout-form-title">
                    <CreditCardIcon />
                    Método de Pago
                  </h3>

                  {/* Opciones de métodos de pago */}
                  <div className="checkout-payment-methods">
                    <div 
                      className={`checkout-payment-option ${paymentMethod === 'credit-card' ? 'active expanded' : ''}`}
                      onClick={() => setPaymentMethod(paymentMethod === 'credit-card' ? '' : 'credit-card')}
                    >
                      <div className="checkout-payment-option-row">
                        <div className="checkout-payment-option-header">
                          <div className="checkout-payment-radio">
                            {paymentMethod === 'credit-card' && <div className="checkout-payment-radio-dot" />}
                          </div>
                          <div className="checkout-payment-option-info">
                            <h4>Tarjeta de Crédito/Débito</h4>
                            <p>Visa, Mastercard, American Express</p>
                          </div>
                        </div>
                        <div className="checkout-payment-logos">
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
                          </div>
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                          </div>
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" />
                          </div>
                        </div>
                      </div>

                      {/* Formulario de tarjeta expandible dentro de la opción */}
                      {paymentMethod === 'credit-card' && (
                        <div className="checkout-payment-expanded-content">
                          <div className="checkout-card-preview">
                            <div className="checkout-card-chip"></div>
                            <div className="checkout-card-number">{formData.cardNumber || '•••• •••• •••• ••••'}</div>
                            <div className="checkout-card-info">
                              <div>
                                <span>Titular</span>
                                <p>{formData.cardName || 'NOMBRE APELLIDO'}</p>
                              </div>
                              <div>
                                <span>Expira</span>
                                <p>{formData.cardExpiry || 'MM/AA'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="checkout-field">
                            <label>Número de Tarjeta</label>
                            <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className={errors.cardNumber ? 'error' : ''} placeholder="1234 5678 9012 3456" />
                            {errors.cardNumber && <span className="checkout-field-error">{errors.cardNumber}</span>}
                          </div>
                          <div className="checkout-field">
                            <label>Nombre en la Tarjeta</label>
                            <input type="text" name="cardName" value={formData.cardName} onChange={handleChange} className={errors.cardName ? 'error' : ''} />
                            {errors.cardName && <span className="checkout-field-error">{errors.cardName}</span>}
                          </div>
                          <div className="checkout-form-row">
                            <div className="checkout-field">
                              <label>Fecha de Expiración</label>
                              <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} className={errors.cardExpiry ? 'error' : ''} placeholder="MM/AA" />
                              {errors.cardExpiry && <span className="checkout-field-error">{errors.cardExpiry}</span>}
                            </div>
                            <div className="checkout-field">
                              <label>CVV</label>
                              <input type="text" name="cardCVV" value={formData.cardCVV} onChange={handleChange} className={errors.cardCVV ? 'error' : ''} placeholder="123" maxLength={4} />
                              {errors.cardCVV && <span className="checkout-field-error">{errors.cardCVV}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div 
                      className={`checkout-payment-option ${paymentMethod === 'webpay' ? 'active expanded' : ''}`}
                      onClick={() => setPaymentMethod(paymentMethod === 'webpay' ? '' : 'webpay')}
                    >
                      <div className="checkout-payment-option-row">
                        <div className="checkout-payment-option-header">
                          <div className="checkout-payment-radio">
                            {paymentMethod === 'webpay' && <div className="checkout-payment-radio-dot" />}
                          </div>
                          <div className="checkout-payment-option-info">
                            <h4>WebPay</h4>
                            <p>Pago seguro a través de Transbank</p>
                          </div>
                        </div>
                        <div className="checkout-payment-logos">
                          <div className="checkout-payment-logo">
                            <img src="https://www.transbankdevelopers.cl/public/library/img/svg/logo_webpay.svg" alt="WebPay" />
                          </div>
                        </div>
                      </div>

                      {/* Información de WebPay expandible */}
                      {paymentMethod === 'webpay' && (
                        <div className="checkout-payment-expanded-content">
                          <div className="checkout-payment-info">
                            <CheckCircleOutlineIcon style={{ fontSize: '1.2rem', color: '#16a34a' }} />
                            <p>Serás redirigido a WebPay Plus para completar tu pago de forma segura.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div 
                      className={`checkout-payment-option ${paymentMethod === 'mercadopago' ? 'active expanded' : ''}`}
                      onClick={() => setPaymentMethod(paymentMethod === 'mercadopago' ? '' : 'mercadopago')}
                    >
                      <div className="checkout-payment-option-row">
                        <div className="checkout-payment-option-header">
                          <div className="checkout-payment-radio">
                            {paymentMethod === 'mercadopago' && <div className="checkout-payment-radio-dot" />}
                          </div>
                          <div className="checkout-payment-option-info">
                            <h4>Mercado Pago</h4>
                            <p>Paga con tu cuenta de Mercado Pago</p>
                          </div>
                        </div>
                        <div className="checkout-payment-logos">
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Mercado_Pago.svg" alt="Mercado Pago" className="mercadopago-logo" />
                          </div>
                        </div>
                      </div>

                      {/* Información de Mercado Pago expandible */}
                      {paymentMethod === 'mercadopago' && (
                        <div className="checkout-payment-expanded-content">
                          <div className="checkout-payment-info">
                            <CheckCircleOutlineIcon style={{ fontSize: '1.2rem', color: '#16a34a' }} />
                            <p>Serás redirigido a Mercado Pago para completar tu pago.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div 
                      className={`checkout-payment-option ${paymentMethod === 'transfer' ? 'active expanded' : ''}`}
                      onClick={() => setPaymentMethod(paymentMethod === 'transfer' ? '' : 'transfer')}
                    >
                      <div className="checkout-payment-option-row">
                        <div className="checkout-payment-option-header">
                          <div className="checkout-payment-radio">
                            {paymentMethod === 'transfer' && <div className="checkout-payment-radio-dot" />}
                          </div>
                          <div className="checkout-payment-option-info">
                            <h4>Transferencia Bancaria</h4>
                            <p>Banco de Chile, BCI, Santander, Estado</p>
                          </div>
                        </div>
                        <div className="checkout-payment-logos">
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Banco_de_Chile_Logotipo.svg" alt="Banco de Chile" className="banco-chile-logo" />
                          </div>
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Bci_Logotype.svg" alt="BCI" />
                          </div>
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/Banco_Santander_Logotipo.svg" alt="Santander" />
                          </div>
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Logo_BancoEstado.svg" alt="BancoEstado" />
                          </div>
                        </div>
                      </div>

                      {/* Información de Transferencia expandible */}
                      {paymentMethod === 'transfer' && (
                        <div className="checkout-payment-expanded-content">
                          <div className="checkout-payment-info">
                            <CheckCircleOutlineIcon style={{ fontSize: '1.2rem', color: '#16a34a' }} />
                            <p>Recibirás los datos bancarios por email para realizar la transferencia. Tu pedido se procesará al confirmar el pago.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div 
                      className={`checkout-payment-option ${paymentMethod === 'google-pay' ? 'active expanded' : ''}`}
                      onClick={() => setPaymentMethod(paymentMethod === 'google-pay' ? '' : 'google-pay')}
                    >
                      <div className="checkout-payment-option-row">
                        <div className="checkout-payment-option-header">
                          <div className="checkout-payment-radio">
                            {paymentMethod === 'google-pay' && <div className="checkout-payment-radio-dot" />}
                          </div>
                          <div className="checkout-payment-option-info">
                            <h4>Google Pay</h4>
                            <p>Pago rápido y seguro con Google</p>
                          </div>
                        </div>
                        <div className="checkout-payment-logos">
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" />
                          </div>
                        </div>
                      </div>

                      {/* Información de Google Pay expandible */}
                      {paymentMethod === 'google-pay' && (
                        <div className="checkout-payment-expanded-content">
                          <div className="checkout-payment-info">
                            <CheckCircleOutlineIcon style={{ fontSize: '1.2rem', color: '#16a34a' }} />
                            <p>Serás redirigido a Google Pay para completar tu pago de forma rápida y segura.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div 
                      className={`checkout-payment-option ${paymentMethod === 'apple-pay' ? 'active expanded' : ''}`}
                      onClick={() => setPaymentMethod(paymentMethod === 'apple-pay' ? '' : 'apple-pay')}
                    >
                      <div className="checkout-payment-option-row">
                        <div className="checkout-payment-option-header">
                          <div className="checkout-payment-radio">
                            {paymentMethod === 'apple-pay' && <div className="checkout-payment-radio-dot" />}
                          </div>
                          <div className="checkout-payment-option-info">
                            <h4>Apple Pay</h4>
                            <p>Pago seguro con Touch ID o Face ID</p>
                          </div>
                        </div>
                        <div className="checkout-payment-logos">
                          <div className="checkout-payment-logo">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" />
                          </div>
                        </div>
                      </div>

                      {/* Información de Apple Pay expandible */}
                      {paymentMethod === 'apple-pay' && (
                        <div className="checkout-payment-expanded-content">
                          <div className="checkout-payment-info">
                            <CheckCircleOutlineIcon style={{ fontSize: '1.2rem', color: '#16a34a' }} />
                            <p>Paga de forma segura usando Touch ID, Face ID o tu código de acceso.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 4: Confirmación */}
              {currentStep === 4 && (
                <div className="checkout-form-content">
                  <h3 className="checkout-form-title">
                    <CheckCircleOutlineIcon />
                    Confirma tu Pedido
                  </h3>
                  <div className="checkout-confirmation">
                    <div className="checkout-confirm-section">
                      <h4>Datos Personales</h4>
                      <p><strong>{formData.firstName} {formData.lastName}</strong></p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                    <div className="checkout-confirm-section">
                      <h4>Dirección de Envío</h4>
                      <p>{formData.address}</p>
                      <p>{formData.commune}, {formData.city}</p>
                      {formData.notes && <p className="checkout-notes">Notas: {formData.notes}</p>}
                    </div>
                    <div className="checkout-confirm-section">
                      <h4>Método de Pago</h4>
                      {paymentMethod === 'credit-card' && <p>Tarjeta terminada en •••• {formData.cardNumber.slice(-4)}</p>}
                      {paymentMethod === 'webpay' && <p>WebPay Plus (Transbank)</p>}
                      {paymentMethod === 'mercadopago' && <p>Mercado Pago</p>}
                      {paymentMethod === 'transfer' && <p>Transferencia Bancaria</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="checkout-buttons">
                <button type="button" className="checkout-btn-back" onClick={handleBack} disabled={currentStep === 1}>
                  <ArrowBackIcon style={{ fontSize: '1rem' }} />
                  Atrás
                </button>
                
                {currentStep < 4 ? (
                  <button type="button" className="checkout-btn-next" onClick={handleNext}>
                    {currentStep === 3 ? 'Revisar Pedido' : 'Continuar'}
                    <ArrowForwardIcon style={{ fontSize: '1rem' }} />
                  </button>
                ) : (
                  <button type="submit" className="checkout-btn-submit" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="checkout-spinner"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <LockIcon style={{ fontSize: '1rem' }} />
                        Pagar {formatPrice(total)}
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Columna Derecha - Resumen */}
          <div className="checkout-summary-section">
            <div className="checkout-summary">
              <div className="checkout-summary-header">
                <div className="checkout-summary-header-left">
                  <h3>Resumen del Pedido</h3>
                  <span className="checkout-summary-count">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
                </div>
                <button 
                  className="checkout-edit-cart-btn"
                  onClick={() => navigate('/carrito')}
                  title="Editar carrito"
                >
                  <EditOutlinedIcon style={{ fontSize: '1.1rem' }} />
                  <span>Editar</span>
                </button>
              </div>

              <div className="checkout-summary-items">
                {(items || []).map((item: any) => {
                  const data = getItemData(item);
                  return (
                    <div key={item.id} className="checkout-summary-item">
                      <img src={data.image} alt={data.name} onError={(e: any) => { e.target.src = 'https://via.placeholder.com/60/f0fdf4/16a34a?text=🌱'; }} />
                      <div className="checkout-summary-item-info">
                        <h4>{data.name}</h4>
                        <span className="checkout-summary-item-qty">Cant: {data.quantity}</span>
                      </div>
                      <span className="checkout-summary-item-price">{formatPrice(data.price * data.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Banner de envío */}
              {!isFreeShipping && (
                <div className="checkout-shipping-progress">
                  <div className="checkout-shipping-text">
                    <LocalShippingOutlinedIcon style={{ fontSize: '1rem' }} />
                    <span>¡Agrega <strong>{formatPrice(amountForFreeShipping)}</strong> más para envío gratis!</span>
                  </div>
                  <div className="checkout-shipping-bar">
                    <div className="checkout-shipping-bar-fill" style={{ width: `${(subtotalAfterCoupon / SHIPPING_FREE_THRESHOLD) * 100}%` }}></div>
                  </div>
                </div>
              )}
              {isFreeShipping && (
                <div className="checkout-shipping-free">
                  <CheckCircleOutlineIcon style={{ fontSize: '1rem' }} />
                  <span>¡Felicidades! Tienes envío gratis</span>
                </div>
              )}

              <div className="checkout-summary-totals">
                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="checkout-summary-row checkout-discount-row">
                    <span>Descuento ({Math.round(appliedCoupon.discount * 100)}%)</span>
                    <span className="checkout-discount-amount">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="checkout-summary-row">
                  <span>Envío</span>
                  {isFreeShipping ? (
                    <span className="checkout-free-shipping">Gratis</span>
                  ) : (
                    <span>{formatPrice(shippingCost)}</span>
                  )}
                </div>
                <div className="checkout-summary-row checkout-summary-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="checkout-summary-guarantee">
                <LockIcon style={{ fontSize: '1rem' }} />
                <span>Compra 100% segura y protegida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;