import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Registro.css';

// Iconos
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Validación de fortaleza de contraseña
  const getPasswordStrength = (pass) => {
    if (!pass) return { level: 0, text: '', color: '' };
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    const levels = [
      { level: 0, text: '', color: '' },
      { level: 1, text: 'Débil', color: '#ef4444' },
      { level: 2, text: 'Media', color: '#f59e0b' },
      { level: 3, text: 'Buena', color: '#10b981' },
      { level: 4, text: 'Fuerte', color: '#059669' }
    ];
    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!nombre || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (nombre.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un email válido.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Simulación de registro exitoso
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const content = (
    <>
        <div className="registro-header">
        <div className="brand-logo">
          <h1 className="brand-name">HuertoHogar</h1>
        </div>
        <h2 className="registro-title">Crear Cuenta</h2>
        <p className="registro-subtitle">Únete a nuestra comunidad</p>
      </div>

      <form onSubmit={handleSubmit} className="registro-form" autoComplete="off">
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <CheckCircleIcon className="success-icon" />
            <span>¡Registro exitoso! Redirigiendo...</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="nombre" className="form-label">
            Nombre Completo
          </label>
          <div className="input-wrapper">
            <PersonIcon className="input-icon" />
            <input
              type="text"
              id="nombre"
              className="form-input"
              placeholder="Ingresa tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo Electrónico
          </label>
          <div className="input-wrapper">
            <EmailIcon className="input-icon" />
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <div className="input-wrapper">
            <LockIcon className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="form-input"
              placeholder="Crea una contraseña segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
          {password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill" 
                  style={{ 
                    width: `${(passwordStrength.level / 4) * 100}%`,
                    backgroundColor: passwordStrength.color 
                  }}
                />
              </div>
              <span className="strength-text" style={{ color: passwordStrength.color }}>
                {passwordStrength.text}
              </span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar Contraseña
          </label>
          <div className="input-wrapper">
            <LockIcon className="input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="form-input"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
          {confirmPassword && password === confirmPassword && (
            <div className="password-match">
              <CheckCircleIcon className="match-icon" />
              <span>Las contraseñas coinciden</span>
            </div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={success}>
          {success ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>

      <div className="login-section">
        <span className="login-text">¿Ya tienes cuenta?</span>
        <Link to="/login" className="login-link">
          Inicia sesión aquí
        </Link>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="registro-container">
        <div className="registro-wrapper">
          <div className="registro-card">
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default Registro;