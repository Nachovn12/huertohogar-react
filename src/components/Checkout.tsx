import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

// --- Iconos y Componentes de Material-UI ---
import {
  Box, Typography, Container, TextField, Button, Stepper, Step, StepLabel,
  Paper, CircularProgress, Divider, List, ListItem, ListItemText
} from '@mui/material';
import {
  ShoppingCart, Person, LocalShipping, Payment, CheckCircle, Home
} from '@mui/icons-material';

// --- Pasos del Checkout ---
const steps = ['Información Personal', 'Dirección de Envío', 'Método de Pago', 'Confirmación'];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart() as {
    cart: (Product & { quantity: number })[];
    getTotalPrice: () => number;
    clearCart: () => void;
  };
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  // --- DATOS DE PROTOTIPO PRECARGADOS ---
  const [formData, setFormData] = useState<any>({
    firstName: 'Ana',
    lastName: 'González',
    email: 'ana.gonzalez@email.com',
    phone: '+56 9 1234 5678',
    address: 'Av. Siempre Viva 742',
    city: 'Concepción',
    commune: 'Concepción Centro',
    zipCode: '4030000',
    notes: 'Dejar en conserjería, por favor.',
    cardNumber: '4242 4242 4242 4242', // Número de tarjeta de prueba
    cardName: 'Ana González',
    cardExpiry: '12/26',
    cardCVV: '123'
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number) => {
    const newErrors: any = {};
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
      else if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Número de tarjeta inválido (deben ser 16 dígitos)';
      if (!formData.cardName.trim()) newErrors.cardName = 'El nombre del titular es requerido';
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'La fecha de expiración es requerida (MM/AA)';
      if (!formData.cardCVV.trim()) newErrors.cardCVV = 'El CVV es requerido';
      else if (formData.cardCVV.length < 3 || formData.cardCVV.length > 4) newErrors.cardCVV = 'CVV inválido (3 o 4 dígitos)';
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
    setProcessing(true);
    // Simula una llamada a la API
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
      clearCart && clearCart();
      // Redirige al inicio después de 3 segundos
      setTimeout(() => navigate('/'), 3000);
    }, 2000);
  };

  // --- Sub-componente: Resumen del Pedido (Columna Derecha) ---
  const OrderSummary = () => (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#2E8B57', fontWeight: 700 }}>
        Resumen del Pedido
      </Typography>
      <List disablePadding>
        {(cart || []).map((item: any) => (
          <ListItem key={item.id} disableGutters>
            <ListItemText
              primary={item.name}
              secondary={`Cantidad: ${item.quantity}`}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
            <Typography variant="body1" fontWeight={700}>
              ${(item.price * item.quantity).toLocaleString()}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6">Subtotal</Typography>
        <Typography variant="h6">${(getTotalPrice && getTotalPrice()).toLocaleString()}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body1">Envío</Typography>
        <Typography variant="body1" sx={{ color: '#2E8B57', fontWeight: 600 }}>GRATIS</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" fontWeight={700}>Total</Typography>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#2E8B57' }}>
          ${(getTotalPrice && getTotalPrice()).toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );

  // --- Sub-componente: Renderiza el contenido del paso actual ---
  const renderStepContent = (step: number) => {
    switch (step) {
      case 1: // Información Personal
        return (
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} fullWidth />
              <TextField label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} fullWidth />
            </Box>
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} fullWidth sx={{ mb: 2 }} />
            <TextField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} fullWidth />
          </Box>
        );
      case 2: // Dirección de Envío
        return (
          <Box>
            <TextField label="Dirección (Calle y Número)" name="address" value={formData.address} onChange={handleChange} error={!!errors.address} helperText={errors.address} fullWidth sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField label="Ciudad" name="city" value={formData.city} onChange={handleChange} error={!!errors.city} helperText={errors.city} fullWidth />
              <TextField label="Comuna" name="commune" value={formData.commune} onChange={handleChange} error={!!errors.commune} helperText={errors.commune} fullWidth />
            </Box>
            <TextField label="Notas Adicionales (Opcional)" name="notes" value={formData.notes} onChange={handleChange} fullWidth multiline rows={3} />
          </Box>
        );
      case 3: // Método de Pago
        return (
          <Box>
            <TextField label="Número de Tarjeta" name="cardNumber" value={formData.cardNumber} onChange={handleChange} error={!!errors.cardNumber} helperText={errors.cardNumber} fullWidth placeholder="4242 4242 4242 4242" sx={{ mb: 2 }} />
            <TextField label="Nombre en la Tarjeta" name="cardName" value={formData.cardName} onChange={handleChange} error={!!errors.cardName} helperText={errors.cardName} fullWidth sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField label="Expiración (MM/AA)" name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} error={!!errors.cardExpiry} helperText={errors.cardExpiry} fullWidth placeholder="12/26" />
              <TextField label="CVV" name="cardCVV" value={formData.cardCVV} onChange={handleChange} error={!!errors.cardCVV} helperText={errors.cardCVV} fullWidth placeholder="123" />
            </Box>
          </Box>
        );
      case 4: // Confirmación
        return (
          <Box>
            <Typography variant="h6" gutterBottom>1. Información Personal</Typography>
            <TextInfo label="Nombre" value={`${formData.firstName} ${formData.lastName}`} />
            <TextInfo label="Email" value={formData.email} />
            <TextInfo label="Teléfono" value={formData.phone} />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>2. Dirección de Envío</Typography>
            <TextInfo label="Dirección" value={formData.address} />
            <TextInfo label="Comuna" value={formData.commune} />
            <TextInfo label="Ciudad" value={formData.city} />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>3. Método de Pago</Typography>
            <TextInfo label="Tarjeta" value={`**** **** **** ${formData.cardNumber.slice(-4)}`} />
          </Box>
        );
      default:
        return null;
    }
  };

  // --- Componente de utilidad para la confirmación ---
  const TextInfo = ({ label, value }: { label: string, value: string }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="body1" sx={{ color: '#666' }}>{label}:</Typography>
      <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'right' }}>{value}</Typography>
    </Box>
  );

  // --- Renderizado Principal ---

  // 1. Pantalla de Carrito Vacío
  if ((cart && cart.length === 0) && !showSuccess) {
    return (
      <Box sx={{ background: '#f7faf7', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: 'center', maxWidth: 600 }}>
          <ShoppingCart sx={{ fontSize: '5rem', color: '#ccc', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: '#2E8B57', fontWeight: 700 }}>Tu carrito está vacío</Typography>
          <Typography variant="h6" sx={{ color: '#666', mb: 3, fontWeight: 400 }}>Agrega productos a tu carrito para continuar.</Typography>
          <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/productos')} sx={{ borderRadius: 50, fontWeight: 600, padding: '12px 24px', background: '#2E8B57', '&:hover': { background: '#1f6a3f' } }}>
            Ir a Productos
          </Button>
        </Paper>
      </Box>
    );
  }

  // 2. Pantalla de Éxito
  if (showSuccess) {
    return (
      <Box sx={{ background: '#f7faf7', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, maxWidth: 600 }}>
          <CheckCircle sx={{ fontSize: '6rem', color: 'green', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ color: '#2E8B57', fontWeight: 700 }}>¡Gracias por tu compra!</Typography>
          <Typography variant="h6" sx={{ color: '#666', mb: 3, fontWeight: 400 }}>Tu pedido ha sido procesado con éxito.</Typography>
          <Typography variant="body1" sx={{ color: '#888' }}>Serás redirigido al inicio en 3 segundos...</Typography>
          <CircularProgress sx={{ color: '#2E8B57', mt: 3 }} />
        </Paper>
      </Box>
    );
  }

  // 3. Flujo de Checkout
  return (
    <Box sx={{ background: '#f7faf7', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#2E8B57', fontWeight: 800, mb: 4 }}>
          Checkout
        </Typography>

        {/* --- CORRECCIÓN: Layout principal con Flexbox en lugar de Grid --- */}
        <Box sx={{ 
          display: 'flex', 
          gap: 4, 
          flexDirection: { xs: 'column-reverse', md: 'row' } // En móvil, el resumen va arriba
        }}>
          
          {/* --- Columna Izquierda: Formulario y Pasos --- */}
          <Box sx={{ flex: '1 1 65%' }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
              {/* Stepper */}
              <Stepper activeStep={currentStep - 1} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Formulario del Paso Actual */}
              <form onSubmit={handleSubmit}>
                {renderStepContent(currentStep)}

                {/* Botones de Navegación */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button variant="outlined" disabled={currentStep === 1} onClick={handleBack}>
                    Atrás
                  </Button>
                  
                  {currentStep < 3 && (
                    <Button variant="contained" onClick={handleNext} sx={{ background: '#2E8B57', '&:hover': { background: '#1f6a3f' } }}>
                      Siguiente
                    </Button>
                  )}
                  
                  {currentStep === 3 && (
                    <Button variant="contained" onClick={handleNext} sx={{ background: '#2E8B57', '&:hover': { background: '#1f6a3f' } }}>
                      Revisar Pedido
                    </Button>
                  )}
                  
                  {currentStep === 4 && (
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      disabled={processing}
                      startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                      sx={{ background: '#2E8B57', '&:hover': { background: '#1f6a3f' } }}
                    >
                      {processing ? 'Procesando...' : 'Finalizar Compra'}
                    </Button>
                  )}
                </Box>
              </form>
            </Paper>
          </Box>

          {/* --- Columna Derecha: Resumen del Pedido --- */}
          <Box sx={{ flex: '1 1 35%' }}>
            <OrderSummary />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Checkout;