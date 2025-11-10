import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthResult {
  success: boolean;
  user?: User;
  message?: string;
  redirectTo?: string; // Informa a dónde redirigir
}

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  login: (payload: { username: string; password: string; role: string }) => AuthResult; // Tipo de retorno actualizado
  logout: () => void;
}

// 1. Definición del Contexto (NO se exporta aquí)
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// 2. Hook para usar el Contexto (NO se exporta aquí)
const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// 3. Componente Provider (NO se exporta aquí, se exporta al final)
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      // Simula la carga del usuario desde localStorage
      const storedUser: User = {
        id: 'local-' + storedRole,
        name: storedRole,
        email: `${storedRole}@local`,
        isAdmin: storedRole === 'admin'
      };
      setUser(storedUser);
    }
  }, []);

  const login = ({ username, password, role }: { username: string; password: string; role: string }): AuthResult => {
    if (role === 'Administrador' && username === 'admin' && password === 'admin') {
      const adminUser: User = { id: 'admin', name: 'Admin', email: 'admin@local', isAdmin: true };
      setUser(adminUser);
      localStorage.setItem('userRole', 'admin');
      
      // Devuelve el éxito y la ruta de redirección
      return { success: true, user: adminUser, redirectTo: '/admin/dashboard' };
    }

    if (role === 'Cliente') {
      if (username === 'cliente' && password === 'cliente') {
        const clientUser: User = { id: 'client', name: 'Cliente', email: 'cliente@local', isAdmin: false };
        setUser(clientUser);
        localStorage.setItem('userRole', 'client');
        
        // Devuelve el éxito y la ruta de redirección
        return { success: true, user: clientUser, redirectTo: '/' };
      }
    }

    return { success: false, message: 'Credenciales incorrectas.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminBrowsing');
    // La navegación ahora se maneja en el componente que llama a logout (ej. un Navbar)
  };

  const isAdmin = !!(user && user.isAdmin);

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth, AuthContext };