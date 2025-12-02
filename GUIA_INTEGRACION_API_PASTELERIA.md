# 🍰 Guía de Integración API Pastelería

**Autor:** Basado en la implementación de HuertoHogar por Ignacio Valeria  
**API:** Railway - Profesor Sting Parra Silva  
**Versión:** 2.0.0  
**Última actualización:** 1 de diciembre de 2025

---

## 📋 Índice

1. [Introducción](#introducción)
2. [Configuración Inicial](#configuración-inicial)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Implementación del Cliente API](#implementación-del-cliente-api)
5. [Context API para Autenticación](#context-api-para-autenticación)
6. [Context API para Carrito](#context-api-para-carrito)
7. [Tipos TypeScript](#tipos-typescript)
8. [Componentes de Ejemplo](#componentes-de-ejemplo)
9. [Sistema de Fallback](#sistema-de-fallback)
10. [Manejo de Errores](#manejo-de-errores)
11. [Testing y Validación](#testing-y-validación)

---

## 🎯 Introducción

Esta guía te enseñará a integrar la **API de Pastelería** en tu proyecto React + TypeScript, permitiéndote:

- ✅ Obtener productos de pastelería desde la API
- ✅ Gestionar usuarios (login, registro)
- ✅ Crear y gestionar carritos de compra
- ✅ Manejar categorías de productos
- ✅ Actualizar stock de productos
- ✅ Implementar sistema de fallback (si la API falla, usar datos locales)

### 🌐 Información de la API

```
Base URL: https://api-dfs2-dm-production.up.railway.app
Versión: 2.0.0
Tipo: REST API con PostgreSQL
```

### 📌 Endpoints Principales para Pastelería

```javascript
/api/pasteleria          // Productos de pastelería
/api/usuarios            // Gestión de usuarios
/api/carritos            // Carritos de compra
/api/categorias          // Categorías (filtrar por pastelería)
/api/productos/:id/stock // Actualizar stock
```

---

## 🛠️ Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install axios
npm install @types/axios --save-dev
```

### 2. Estructura de Carpetas Recomendada

```
src/
├── service/
│   └── api.ts              # Cliente API
├── context/
│   ├── AuthContext.tsx     # Autenticación
│   └── CartContext.tsx     # Carrito
├── types/
│   └── index.ts            # Tipos TypeScript
├── data/
│   ├── products.json       # Fallback productos
│   └── categories.json     # Fallback categorías
└── components/
    ├── Login.tsx
    ├── ProductList.tsx
    └── Cart.tsx
```

---

## 📦 Estructura de Archivos

### Archivos Necesarios

1. **`src/service/api.ts`** - Cliente API principal
2. **`src/context/AuthContext.tsx`** - Contexto de autenticación
3. **`src/context/CartContext.tsx`** - Contexto del carrito
4. **`src/types/index.ts`** - Definiciones de tipos
5. **`src/data/products.json`** - Datos de fallback

---

## 🔧 Implementación del Cliente API

### `src/service/api.ts`

```typescript
import axios from 'axios';

// URL base de la API
const API_BASE_URL = 'https://api-dfs2-dm-production.up.railway.app';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==============================================
// 🍰 PRODUCTOS DE PASTELERÍA
// ==============================================

/**
 * Obtener todos los productos de pastelería
 */
export const getPasteleriaProducts = async () => {
  try {
    const response = await apiClient.get('/api/pasteleria');
    console.log('✅ Productos de pastelería obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener productos de pastelería:', error);
    throw error;
  }
};

/**
 * Buscar productos de pastelería por nombre
 */
export const searchPasteleriaProducts = async (query: string) => {
  try {
    const response = await apiClient.get(`/api/pasteleria?search=${query}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
    throw error;
  }
};

/**
 * Obtener producto por ID
 */
export const getPasteleriaProductById = async (id: number) => {
  try {
    const response = await apiClient.get(`/api/pasteleria/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener producto:', error);
    throw error;
  }
};

// ==============================================
// 👤 USUARIOS
// ==============================================

/**
 * Login de usuario
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/api/usuarios/login', {
      email,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Login exitoso:', response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    throw error;
  }
};

/**
 * Registro de usuario
 */
export const registerUser = async (userData: {
  nombre: string;
  email: string;
  password: string;
  rol?: string;
}) => {
  try {
    const response = await apiClient.post('/api/usuarios/register', {
      nombre: userData.nombre,
      email: userData.email,
      password: userData.password,
      rol: userData.rol || 'cliente',
    });
    
    console.log('✅ Usuario registrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error en registro:', error);
    throw error;
  }
};

/**
 * Obtener todos los usuarios (requiere rol admin)
 */
export const getUsers = async () => {
  try {
    const response = await apiClient.get('/api/usuarios');
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Logout
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Sesión cerrada');
};

// ==============================================
// 🛒 CARRITO
// ==============================================

/**
 * Obtener carrito del usuario
 */
export const getCart = async (userId: number) => {
  try {
    const response = await apiClient.get(`/api/carritos/${userId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener carrito:', error);
    throw error;
  }
};

/**
 * Agregar producto al carrito
 */
export const addToCart = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  try {
    const response = await apiClient.post('/api/carritos', {
      usuario_id: userId,
      producto_id: productId,
      cantidad: quantity,
    });
    console.log('✅ Producto agregado al carrito:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al agregar al carrito:', error);
    throw error;
  }
};

/**
 * Actualizar cantidad en carrito
 */
export const updateCartItem = async (
  cartItemId: number,
  quantity: number
) => {
  try {
    const response = await apiClient.put(`/api/carritos/${cartItemId}`, {
      cantidad: quantity,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar carrito:', error);
    throw error;
  }
};

/**
 * Eliminar producto del carrito
 */
export const removeFromCart = async (cartItemId: number) => {
  try {
    const response = await apiClient.delete(`/api/carritos/${cartItemId}`);
    console.log('✅ Producto eliminado del carrito');
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar del carrito:', error);
    throw error;
  }
};

// ==============================================
// 📦 CATEGORÍAS
// ==============================================

/**
 * Obtener todas las categorías
 */
export const getCategories = async () => {
  try {
    const response = await apiClient.get('/api/categorias');
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    throw error;
  }
};

/**
 * Filtrar productos por categoría
 */
export const getProductsByCategory = async (categoryId: number) => {
  try {
    const response = await apiClient.get(`/api/pasteleria?categoria=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al filtrar por categoría:', error);
    throw error;
  }
};

// ==============================================
// 📊 STOCK
// ==============================================

/**
 * Obtener stock de un producto
 */
export const getProductStock = async (productId: number) => {
  try {
    const response = await apiClient.get(`/api/productos/${productId}/stock`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener stock:', error);
    throw error;
  }
};

/**
 * Actualizar stock de un producto
 */
export const updateProductStock = async (
  productId: number,
  newStock: number
) => {
  try {
    const response = await apiClient.put(`/api/productos/${productId}/stock`, {
      stock: newStock,
    });
    console.log('✅ Stock actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al actualizar stock:', error);
    throw error;
  }
};

// ==============================================
// 🔄 SISTEMA DE FALLBACK
// ==============================================

/**
 * Obtener productos con fallback a datos locales
 */
export const getProductsWithFallback = async () => {
  try {
    // Intentar obtener de la API
    const apiProducts = await getPasteleriaProducts();
    return { source: 'api', data: apiProducts };
  } catch (error) {
    console.warn('⚠️ API no disponible, usando datos locales');
    
    // Cargar datos de fallback
    const localProducts = await import('../data/products.json');
    return { source: 'local', data: localProducts.default };
  }
};

export default apiClient;
```

---

## 🔐 Context API para Autenticación

### `src/context/AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../service/api';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    nombre: string;
    email: string;
    password: string;
    rol?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      setUser(response.user);
      setToken(response.token);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const register = async (userData: {
    nombre: string;
    email: string;
    password: string;
    rol?: string;
  }) => {
    try {
      await registerUser(userData);
      // Después de registrar, hacer login automático
      await login(userData.email, userData.password);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

---

## 🛒 Context API para Carrito

### `src/context/CartContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem,
  removeFromCart as apiRemoveFromCart,
} from '../service/api';

interface CartItem {
  id: number;
  producto_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Cargar carrito del usuario
  useEffect(() => {
    if (user?.id) {
      loadCart();
    } else {
      // Si no hay usuario, cargar del localStorage
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setItems(JSON.parse(localCart));
      }
    }
  }, [user]);

  const loadCart = async () => {
    if (!user?.id) return;

    try {
      const cartData = await getCart(user.id);
      setItems(cartData.items || []);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    }
  };

  const addToCart = async (product: any, quantity: number = 1) => {
    if (user?.id) {
      // Usuario autenticado: usar API
      try {
        await apiAddToCart(user.id, product.id, quantity);
        await loadCart();
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        throw error;
      }
    } else {
      // Sin usuario: usar localStorage
      const existingItem = items.find((item) => item.producto_id === product.id);

      let newItems;
      if (existingItem) {
        newItems = items.map((item) =>
          item.producto_id === product.id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      } else {
        newItems = [
          ...items,
          {
            id: Date.now(),
            producto_id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            cantidad: quantity,
            imagen: product.imagen,
          },
        ];
      }

      setItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (user?.id) {
      try {
        await apiRemoveFromCart(itemId);
        await loadCart();
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
      }
    } else {
      const newItems = items.filter((item) => item.id !== itemId);
      setItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    if (user?.id) {
      try {
        await updateCartItem(itemId, quantity);
        await loadCart();
      } catch (error) {
        console.error('Error al actualizar cantidad:', error);
      }
    } else {
      const newItems = items.map((item) =>
        item.id === itemId ? { ...item, cantidad: quantity } : item
      );
      setItems(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
```

---

## 📝 Tipos TypeScript

### `src/types/index.ts`

```typescript
// Producto de Pastelería
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id: number;
  imagen?: string;
  descuento?: number;
  destacado?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Usuario
export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'vendedor' | 'cliente';
  created_at?: string;
}

// Categoría
export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
}

// Item del Carrito
export interface CartItem {
  id: number;
  usuario_id: number;
  producto_id: number;
  cantidad: number;
  producto?: Product;
  created_at?: string;
}

// Respuesta de Login
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Respuesta de Registro
export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}
```

---

## 🎨 Componentes de Ejemplo

### 1. Login Component

```typescript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/productos');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión - Pastelería</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
```

### 2. Product List Component

```typescript
import React, { useState, useEffect } from 'react';
import { getPasteleriaProducts } from '../service/api';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getPasteleriaProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product, 1);
      alert('Producto agregado al carrito');
    } catch (error) {
      alert('Error al agregar al carrito');
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="product-list">
      <h2>🍰 Productos de Pastelería</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.imagen && (
              <img src={product.imagen} alt={product.nombre} />
            )}
            <h3>{product.nombre}</h3>
            <p>{product.descripcion}</p>
            <p className="price">${product.precio}</p>
            <p className="stock">Stock: {product.stock}</p>
            <button onClick={() => handleAddToCart(product)}>
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
```

### 3. Cart Component

```typescript
import React from 'react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } =
    useCart();

  return (
    <div className="cart">
      <h2>🛒 Carrito ({totalItems} items)</h2>
      {items.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <h4>{item.nombre}</h4>
              <p>${item.precio}</p>
              <input
                type="number"
                value={item.cantidad}
                min="1"
                onChange={(e) =>
                  updateQuantity(item.id, parseInt(e.target.value))
                }
              />
              <button onClick={() => removeFromCart(item.id)}>
                Eliminar
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ${totalPrice}</h3>
            <button>Proceder al Pago</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
```

---

## 🔄 Sistema de Fallback

### `src/data/products.json`

```json
[
  {
    "id": 1,
    "nombre": "Torta de Chocolate",
    "descripcion": "Deliciosa torta de chocolate con ganache",
    "precio": 15000,
    "stock": 10,
    "categoria_id": 1,
    "imagen": "/img/torta-chocolate.jpg"
  },
  {
    "id": 2,
    "nombre": "Cupcakes Variados",
    "descripcion": "Set de 6 cupcakes con diferentes sabores",
    "precio": 8000,
    "stock": 20,
    "categoria_id": 2,
    "imagen": "/img/cupcakes.jpg"
  },
  {
    "id": 3,
    "nombre": "Pan de Pascua",
    "descripcion": "Pan de pascua tradicional con frutas confitadas",
    "precio": 12000,
    "stock": 15,
    "categoria_id": 3,
    "imagen": "/img/pan-pascua.jpg"
  }
]
```

### Hook para usar Fallback

```typescript
import { useState, useEffect } from 'react';
import { getProductsWithFallback } from '../service/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [source, setSource] = useState<'api' | 'local'>('api');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await getProductsWithFallback();
      setProducts(result.data);
      setSource(result.source);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { products, source, loading, reload: loadProducts };
};
```

---

## ⚠️ Manejo de Errores

### Interceptor de Errores Mejorado

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Error de la API
      switch (error.response.status) {
        case 401:
          console.error('No autorizado - Token inválido');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error del servidor');
          break;
        default:
          console.error('Error:', error.response.data);
      }
    } else if (error.request) {
      // Error de red
      console.error('Error de red - API no disponible');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);
```

---

## 🧪 Testing y Validación

### 1. Probar la Conexión a la API

```typescript
// En la consola del navegador
import { getPasteleriaProducts } from './service/api';

getPasteleriaProducts().then(data => {
  console.log('Productos:', data);
});
```

### 2. Probar el Login

```typescript
import { loginUser } from './service/api';

// Crear usuario de prueba primero con la API
loginUser('test@pasteleria.com', 'password123').then(response => {
  console.log('Login exitoso:', response);
});
```

### 3. Verificar el Token

```typescript
// Después del login
const token = localStorage.getItem('token');
console.log('Token:', token);
```

---

## 📚 Usuarios de Prueba para Pastelería

### Crear Usuarios de Ejemplo

Usa Postman o tu frontend para crear estos usuarios:

```javascript
// Admin
{
  "nombre": "Admin Pastelería",
  "email": "admin@pasteleria.com",
  "password": "admin123",
  "rol": "admin"
}

// Vendedor
{
  "nombre": "Vendedor Pastelería",
  "email": "vendedor@pasteleria.com",
  "password": "vendedor123",
  "rol": "vendedor"
}

// Cliente
{
  "nombre": "Cliente Pastelería",
  "email": "cliente@pasteleria.com",
  "password": "cliente123",
  "rol": "cliente"
}
```

---

## 🚀 Integración en App.tsx

```typescript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/carrito" element={<Cart />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Checklist de Implementación

- [ ] Instalar axios
- [ ] Crear carpetas `service/`, `context/`, `types/`, `data/`
- [ ] Crear `api.ts` con endpoints de pastelería
- [ ] Crear `AuthContext.tsx`
- [ ] Crear `CartContext.tsx`
- [ ] Crear `types/index.ts`
- [ ] Crear datos de fallback en `data/products.json`
- [ ] Implementar componente Login
- [ ] Implementar componente ProductList
- [ ] Implementar componente Cart
- [ ] Probar conexión a `/api/pasteleria`
- [ ] Crear usuarios de prueba
- [ ] Probar login
- [ ] Probar agregar al carrito
- [ ] Implementar manejo de errores
- [ ] Documentar tu implementación

---

## 🆘 Solución de Problemas

### Error: CORS

**Problema:** `Access-Control-Allow-Origin` error

**Solución:** La API ya tiene CORS habilitado. Verifica que estés usando la URL correcta.

### Error: 401 Unauthorized

**Problema:** Token inválido o expirado

**Solución:**
```typescript
localStorage.removeItem('token');
// Volver a hacer login
```

### Error: Network Error

**Problema:** API no responde

**Solución:** El sistema de fallback cargará datos locales automáticamente.

---

## 📞 Contacto y Soporte

- **API:** Profesor Sting Parra Silva
- **Implementación:** Basada en HuertoHogar por Ignacio Valeria
- **GitHub:** [Tu repositorio aquí]

---

## 📄 Licencia

MIT - Libre uso educativo

---

**¡Éxito con tu proyecto de Pastelería! 🍰**
