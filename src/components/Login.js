import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importar el hook de autenticación
import { Link } from 'react-router-dom';

// Importar Iconos
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const Login = () => {
    // Estados del formulario
    const [role, setRole] = useState('Administrador');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Obtener la función de login desde el contexto
    const { login } = useAuth();

    // Manejador del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores previos

        try {
            // Llamar a la función de login del contexto
            const result = login({ username, password, role });

            // Si el login NO fue exitoso (el contexto se encarga de redirigir si SÍ lo fue)
            if (!result.success) {
                setError(result.message || "Error: Credenciales incorrectas.");
            }
            // No necesitamos 'navigate' aquí, ¡el AuthContext ya lo hace!
            
        } catch (err) {
            setError("Ocurrió un error inesperado al iniciar sesión.");
            console.error(err);
        }
    };

    return (
        <>
            {/* Estilos CSS en línea para asegurar que se apliquen */}
            <style>{`
                .login-page-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f0fdf4; // Verde muy claro de fondo
                    padding: 20px;
                    font-family: 'Inter', sans-serif;
                }
                .login-card {
                    background-color: #ffffff;
                    padding: 2.5rem;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
                    width: 100%;
                    max-width: 450px;
                    border: 1px solid #e2e8f0;
                }
                .login-card h2 {
                    text-align: center;
                    font-weight: 700;
                    color: #2E7D32; // Verde oscuro
                    margin-bottom: 0.5rem;
                }
                .login-card .subtitle {
                    text-align: center;
                    color: #555;
                    margin-bottom: 2rem;
                    font-size: 0.95rem;
                }
                .input-group {
                    position: relative;
                    margin-bottom: 1.5rem;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #333;
                    font-size: 0.9rem;
                }
                .input-group .icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(25%);
                    color: #999;
                    font-size: 1.2rem;
                }
                .input-field, .select-field {
                    width: 100%;
                    padding: 0.8rem 0.8rem 0.8rem 2.5rem; /* Espacio para el icono */
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .input-field:focus, .select-field:focus {
                    outline: none;
                    border-color: #2E7D32;
                    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.2);
                }
                .password-toggle {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(25%);
                    color: #999;
                    cursor: pointer;
                }
                .login-button {
                    width: 100%;
                    padding: 0.9rem;
                    border: none;
                    border-radius: 8px;
                    background-color: #2E7D32; // Verde oscuro
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .login-button:hover {
                    background-color: #1b5e20; // Verde más oscuro
                }
                .credentials-info {
                    background-color: #f0fdf4;
                    border: 1px solid #bbf7d0;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-top: 1.5rem;
                    text-align: center;
                    font-size: 0.9rem;
                    color: #2E7D32;
                }
                .credentials-info code {
                    font-weight: 600;
                    color: #1b5e20;
                }
                .login-error {
                    color: #dc3545;
                    text-align: center;
                    margin-bottom: 1rem;
                    font-weight: 500;
                }
            `}</style>

            <div className="login-page-container">
                <div className="login-card">
                    <h2>Iniciar Sesión</h2>
                    <p className="subtitle">Accede a tu cuenta de HuertoHogar</p>

                    <form onSubmit={handleSubmit}>
                        {/* Mensaje de Error */}
                        {error && <p className="login-error">{error}</p>}

                        {/* Tipo de Acceso */}
                        <div className="input-group">
                            <label htmlFor="role">Tipo de Acceso *</label>
                            <SupervisorAccountIcon className="icon" />
                            <select 
                                id="role" 
                                className="select-field"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option>Administrador</option>
                                <option>Cliente</option>
                            </select>
                        </div>

                        {/* Usuario */}
                        <div className="input-group">
                            <label htmlFor="username">Usuario *</label>
                            <AccountCircleIcon className="icon" />
                            <input 
                                type="text" 
                                id="username" 
                                className="input-field"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="input-group">
                            <label htmlFor="password">Contraseña *</label>
                            <LockIcon className="icon" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{paddingRight: '2.5rem'}} // Espacio para el ojo
                                required 
                            />
                            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </span>
                        </div>

                        {/* Botón Iniciar Sesión */}
                        <button type="submit" className="login-button">
                            Iniciar Sesión
                        </button>
                    </form>

                    {/* Información de Credenciales */}
                    <div className="credentials-info">
                        Credenciales de administrador: <br/>
                        Usuario: <code>admin</code> | Contraseña: <code>admin</code>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

