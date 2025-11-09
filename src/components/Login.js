import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Login.css';

// Iconos
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const Login = () => {
    const [role, setRole] = useState('Administrador');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const result = await login({ username, password, role });
            if (!result || !result.success) {
                setError((result && result.message) || 'Credenciales incorrectas');
            }
        } catch (err) {
            console.error(err);
            setError('Ocurrió un error inesperado al iniciar sesión.');
        }
    };

    return (
        <>
            <Navbar />
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
                                    >
                                        <option>Administrador</option>
                                        <option>Cliente</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="username" className="form-label">
                                    Usuario
                                </label>
                                <div className="input-wrapper">
                                    <AccountCircleIcon className="input-icon" />
                                    <input
                                        type="text"
                                        id="username"
                                        className="form-input"
                                        placeholder="Ingresa tu usuario"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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
                            </div>

                            <button type="submit" className="submit-button">
                                Iniciar Sesión
                            </button>
                        </form>

                        {role === 'Administrador' && (
                            <div className="credentials-info">
                                <div>
                                    <strong>Credenciales de prueba:</strong>
                                    <div className="credentials-text">
                                        Usuario: <code>admin</code> | Contraseña: <code>admin</code>
                                    </div>
                                </div>
                            </div>
                        )}

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