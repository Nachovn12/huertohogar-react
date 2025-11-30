import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, setAuthToken } from '../service/api';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Claves para sessionStorage
const SESSION_USER_KEY = 'huertohogar_user';
const SESSION_TOKEN_KEY = 'huertohogar_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar la app, restaurar la sesión desde sessionStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Intentar recuperar token y usuario de sessionStorage
        const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
        const storedUser = sessionStorage.getItem(SESSION_USER_KEY);

        if (storedToken && storedUser) {
          setAuthToken(storedToken);
          // Restaurar usuario con tipado correcto
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          
          // NOTA: No llamamos a getCurrentUser() aquí porque la API no tiene endpoint /me real
          // y el mock sobrescribiría al usuario Admin con un usuario Cliente genérico.
          // Confiamos en los datos de sessionStorage hasta que expire la sesión.
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        // Limpiar sesión corrupta
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
        sessionStorage.removeItem(SESSION_USER_KEY);
        setAuthToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      // Validar que la respuesta tiene token y user
      const { token, user } = response as AuthResponse;
      setAuthToken(token);
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      setUser(user);
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
      console.log('Login exitoso:', user);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      sessionStorage.removeItem(SESSION_USER_KEY);
      setAuthToken(null);
      setUser(null);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      // Después del registro, hacer login automáticamente
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      console.error('Error al registrarse:', error);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setAuthToken(null);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_USER_KEY);
    setUser(null);
    console.log('Sesión cerrada correctamente');
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};