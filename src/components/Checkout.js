import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ShoppingCart, 
  Person, 
  LocalShipping, 
  Payment, 
  CheckCircle 
} from '@mui/icons-material';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Información personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Dirección de envío
    address: '',
    city: '',
    commune: '',
    zipCode: '',
    notes: '',
    // Información de pago
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: ''
  });

  const [errors, setErrors] = useState({});

  // Validar paso actual
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
      if (!formData.email.trim()) newErrors.email = 'El email es requerido';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
      if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
      if (!formData.commune.trim()) newErrors.commune = 'La comuna es requerida';
    }

    if (step === 3) {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'El número de tarjeta es requerido';
      else if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Número de tarjeta inválido';
      if (!formData.cardName.trim()) newErrors.cardName = 'El nombre del titular es requerido';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'La fecha de expiración es requerida';
      if (!formData.cardCVV.trim()) newErrors.cardCVV = 'El CVV es requerido';
      else if (formData.cardCVV.length !== 3) newErrors.cardCVV = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar al siguiente paso
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Retroceder al paso anterior
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Procesar pedido
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      setCurrentStep(4);
      setShowSuccess(true);
      
      // Simular procesamiento de pago
      setTimeout(() => {
        clearCart();
        // Después de 3 segundos, redirigir al inicio
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }, 2000);
    }
  };

  // Si el carrito está vacío
  if (cart.length === 0 && !showSuccess) {
    return (
      <div style={{ background: '#f7faf7', minHeight: '100vh', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <Container>
          <div className="text-center">
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '3rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <ShoppingCart style={{ fontSize: '5rem', color: '#ccc', marginBottom: '1rem' }} />
              <h2 style={{ color: '#2E8B57', marginBottom: '1rem' }}>Tu carrito está vacío</h2>
              <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Agrega productos a tu carrito para continuar con la compra
              </p>
              <Button 
                variant="success" 
                size="lg"
                onClick={() => navigate('/productos')}
                style={{ borderRadius: '12px', fontWeight: 600 }}
              >
                Ir a Productos
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Indicador de pasos
  const StepIndicator = () => (
    <div className="d-flex justify-content-center align-items-center mb-5">
      {[
        { num: 1, icon: <Person />, label: 'Datos' },
        { num: 2, icon: <LocalShipping />, label: 'Envío' },
        { num: 3, icon: <Payment />, label: 'Pago' },
        { num: 4, icon: <CheckCircle />, label: 'Confirmar' }
      ].map((step, index) => (
        <React.Fragment key={step.num}>
          <div className="text-center">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: currentStep >= step.num ? '#2E8B57' : '#e0e0e0',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
              transition: 'all 0.3s'
            }}>
              {step.icon}
            </div>
            <p style={{ 
              fontSize: '0.9rem', 
              color: currentStep >= step.num ? '#2E8B57' : '#999',
              fontWeight: currentStep === step.num ? 700 : 400,
              marginBottom: 0
            }}>
              {step.label}
            </p>
          </div>
          {index < 3 && (
            <div style={{
              width: '80px',
              height: '3px',
              background: currentStep > step.num ? '#2E8B57' : '#e0e0e0',
              marginBottom: '2rem',
              marginLeft: '1rem',
              marginRight: '1rem'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Resumen del pedido
  const OrderSummary = () => (
    <Card style={{ 
      borderRadius: '16px', 
      border: 'none', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: '2rem'
    }}>
      <Card.Body>
        <h5 style={{ color: '#2E8B57', marginBottom: '1.5rem', fontWeight: 700 }}>
          Resumen del Pedido
        </h5>
        
        <ListGroup variant="flush">
          {cart.map(item => (
            <ListGroup.Item key={item.id} className="px-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p style={{ marginBottom: '0.25rem', fontWeight: 600 }}>{item.name}</p>
                  <small style={{ color: '#666' }}>Cantidad: {item.quantity}</small>
                </div>
                <p style={{ marginBottom: 0, fontWeight: 600 }}>
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <div style={{ borderTop: '2px solid #f0f0f0', marginTop: '1rem', paddingTop: '1rem' }}>
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal:</span>
            <span style={{ fontWeight: 600 }}>${getTotalPrice().toLocaleString()}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span>Envío:</span>
            <span style={{ fontWeight: 600 }}>$3.000</span>
          </div>
          <div className="d-flex justify-content-between" style={{ 
            fontSize: '1.3rem', 
            fontWeight: 700, 
            color: '#2E8B57',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '2px solid #2E8B57'
          }}>
            <span>Total:</span>
            <span>${(getTotalPrice() + 3000).toLocaleString()}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  // Renderizar contenido según el paso
  const renderStepContent = () => {
    if (currentStep === 4 && showSuccess) {
      return (
        <Card style={{ 
          borderRadius: '16px', 
          border: 'none', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          textAlign: 'center',
          padding: '3rem'
        }}>
          <CheckCircle style={{ fontSize: '5rem', color: '#2E8B57', marginBottom: '1rem' }} />
          <h2 style={{ color: '#2E8B57', marginBottom: '1rem' }}>
            ¡Pedido Confirmado!
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem' }}>
            Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación pronto.
          </p>
          <Alert variant="success">
            <strong>Número de orden:</strong> #HH-{Math.floor(Math.random() * 10000)}
          </Alert>
          <p style={{ color: '#999', marginTop: '1rem' }}>
            Redirigiendo al inicio en unos segundos...
          </p>
        </Card>
      );
    }

    return (
      <Card style={{ 
        borderRadius: '16px', 
        border: 'none', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {/* Paso 1: Información Personal */}
            {currentStep === 1 && (
              <>
                <h4 style={{ color: '#2E8B57', marginBottom: '1.5rem' }}>
                  <Person /> Información Personal
                </h4>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        isInvalid={!!errors.firstName}
                        placeholder="Juan"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellido *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        isInvalid={!!errors.lastName}
                        placeholder="Pérez"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    isInvalid={!!errors.email}
                    placeholder="juan@email.com"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    isInvalid={!!errors.phone}
                    placeholder="+56 9 1234 5678"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}

            {/* Paso 2: Dirección de Envío */}
            {currentStep === 2 && (
              <>
                <h4 style={{ color: '#2E8B57', marginBottom: '1.5rem' }}>
                  <LocalShipping /> Dirección de Envío
                </h4>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    isInvalid={!!errors.address}
                    placeholder="Av. Principal 123, Depto. 4B"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        isInvalid={!!errors.city}
                        placeholder="Santiago"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Comuna *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.commune}
                        onChange={(e) => setFormData({...formData, commune: e.target.value})}
                        isInvalid={!!errors.commune}
                        placeholder="Providencia"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.commune}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    placeholder="7500000"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Notas de Entrega (Opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Instrucciones especiales para la entrega..."
                  />
                </Form.Group>
              </>
            )}

            {/* Paso 3: Información de Pago */}
            {currentStep === 3 && (
              <>
                <h4 style={{ color: '#2E8B57', marginBottom: '1.5rem' }}>
                  <Payment /> Información de Pago
                </h4>
                <Alert variant="info">
                  <small>🔒 Esta es una demostración. No ingreses datos reales de tarjeta.</small>
                </Alert>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Tarjeta *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    isInvalid={!!errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardNumber}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Titular *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => setFormData({...formData, cardName: e.target.value})}
                    isInvalid={!!errors.cardName}
                    placeholder="JUAN PEREZ"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Expiración *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.cardExpiry}
                        onChange={(e) => setFormData({...formData, cardExpiry: e.target.value})}
                        isInvalid={!!errors.cardExpiry}
                        placeholder="MM/AA"
                        maxLength="5"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardExpiry}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.cardCVV}
                        onChange={(e) => setFormData({...formData, cardCVV: e.target.value})}
                        isInvalid={!!errors.cardCVV}
                        placeholder="123"
                        maxLength="3"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cardCVV}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            {/* Botones de navegación */}
            {currentStep < 4 && (
              <div className="d-flex justify-content-between mt-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  style={{ borderRadius: '12px', fontWeight: 600 }}
                >
                  Atrás
                </Button>
                {currentStep < 3 ? (
                  <Button 
                    variant="success" 
                    onClick={handleNext}
                    style={{ borderRadius: '12px', fontWeight: 600 }}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button 
                    variant="success" 
                    type="submit"
                    style={{ borderRadius: '12px', fontWeight: 600 }}
                  >
                    Confirmar Pedido
                  </Button>
                )}
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div style={{ background: '#f7faf7', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Container>
        <div className="text-center mb-4">
          <h1 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontWeight: 700, 
            color: '#2E8B57',
            fontSize: '2.5rem'
          }}>
            Finalizar Compra
          </h1>
        </div>

        <StepIndicator />

        <Row>
          <Col lg={8}>
            {renderStepContent()}
          </Col>
          <Col lg={4}>
            {!showSuccess && <OrderSummary />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
