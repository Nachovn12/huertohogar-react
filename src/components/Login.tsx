import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Iconos
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const Login: React.FC = () => {
    const [role, setRole] = useState('Administrador');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones básicas
        if (!email || !password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Por favor, ingresa un correo electrónico válido');
            return;
        }

        try {
            await login({ email, password });
            
            // Redirección según rol seleccionado
            switch (role) {
                case 'Administrador':
                    navigate('/admin/dashboard');
                    break;
                case 'Vendedor':
                    navigate('/vendedor/dashboard');
                    break;
                case 'Cliente':
                default:
                    navigate('/productos');
                    break;
            }
        } catch (err: any) {
            console.error('Error en login:', err);
            setError(err.message || 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
        }
    };

    // Obtener credenciales de ejemplo según el rol
    const getCredentialsExample = () => {
        switch (role) {
            case 'Administrador':
                return { email: 'admin@huertohogar.com', password: 'admin123' };
            case 'Vendedor':
                return { email: 'vendedor@huertohogar.com', password: 'vendedor123' };
            case 'Cliente':
                return { email: 'cliente@huertohogar.com', password: 'cliente123' };
            default:
                return { email: 'admin@huertohogar.com', password: 'admin123' };
        }
    };

    const credentials = getCredentialsExample();

    return (
        <>
            <div className="login-container">
                <div className="login-wrapper">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="brand-logo">
                                <h1 className="brand-name">HuertoHogar</h1>
                            </div>
                            <h2 className="login-title">Bienvenido</h2>
                            <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            {error && (
                                <div className="error-message">
                                    <span className="error-icon">⚠️</span>
                                    {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="role" className="form-label">
                                    Tipo de Acceso
                                </label>
                                <div className="input-wrapper">
                                    <SupervisorAccountIcon className="input-icon" />
                                    <select
                                        id="role"
                                        className="form-select"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        disabled={isLoading}
                                        style={{ paddingLeft: '40px' }}
                                    >
                                        <option>Administrador</option>
                                        <option>Vendedor</option>
                                        <option>Cliente</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Correo Electrónico
                                </label>
                                <div className="input-wrapper">
                                    <AccountCircleIcon className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-input"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
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
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </form>

                        <div className="credentials-info">
                            <div>
                                <strong>Credenciales de prueba ({role}):</strong>
                                <div className="credentials-text">
                                    Email: <code>{credentials.email}</code> | Contraseña: <code>{credentials.password}</code>
                                </div>
                            </div>
                        </div>

                        <div className="register-section">
                            <span className="register-text">¿No tienes cuenta?</span>
                            <Link to="/registro" className="register-link">
                                Regístrate aquí
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;