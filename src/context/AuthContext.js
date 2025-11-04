import React, { createContext, useContext, useState, useEffect } from 'react';
// ¡IMPORTACIÓN CLAVE!
import { useNavigate } from 'react-router-dom';

// 1. Crear el Contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);

// 2. Componente Proveedor del Contexto
// Este componente AHORA debe estar DENTRO de <Router> en App.js
export const AuthProvider = ({ children }) => {
    
    // ¡NAVEGACIÓN!
    // Esto es lo que nos permite redirigir desde el contexto
    const navigate = useNavigate(); 

    // Intentar leer el rol y el estado del almacenamiento local al inicio
    const [user, setUser] = useState(null); // { role: 'admin' } o null

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
            setUser({ role: storedRole });
        }
    }, []);

    // Función para iniciar sesión
    const login = ({ username, password, role }) => {
        // Validación estricta para el administrador (admin/admin)
        if (role === 'Administrador' && username === 'admin' && password === 'admin') {
            const adminUser = { role: 'admin' };
            setUser(adminUser);
            localStorage.setItem('userRole', 'admin');
            
            // Redirección al Dashboard
            navigate('/admin/dashboard'); 
            
            return { success: true, user: adminUser };
        } 
        
        // Simulación de validación para otros usuarios (clientes)
        if (role === 'Cliente') {
            // **AQUÍ VA TU LÓGICA REAL DE API/BACKEND PARA CLIENTES**
            if (username === 'cliente' && password === 'cliente') { // EJEMPLO
                const clientUser = { role: 'client' };
                setUser(clientUser);
                localStorage.setItem('userRole', 'client');
                
                // Redirección al Inicio para clientes
                navigate('/');
                
                return { success: true, user: clientUser };
            }
        }

        return { success: false, message: "Credenciales incorrectas." };
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userRole');
        
        // ¡CAMBIO SOLICITADO!
        // Redirige al inicio de la página
        navigate('/'); 
    };

    // Verificar si el usuario actual es admin
    const isAdmin = user && user.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

