import axios from 'axios';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

// Configuración base de la API
const API_BASE_URL = 'https://api-dfs2-dm-production.up.railway.app';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable para almacenar el token JWT en memoria
let authToken: string | null = null;

// Variable para rastrear si estamos en modo mock
let isUsingMockMode = false;

// Función para establecer el token
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Función para obtener el token actual
export const getAuthToken = () => authToken;

// Función para verificar si estamos en modo mock
export const isMockMode = () => isUsingMockMode;

// Función para establecer modo mock
export const setMockMode = (useMock: boolean) => {
  isUsingMockMode = useMock;
};

// Interceptor de REQUEST - Agregar JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - Manejo centralizado de errores
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('No autorizado - Token inválido');
          setAuthToken(null);
          break;
        case 403:
          console.error('Acceso prohibido');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error del servidor');
          break;
        default:
          console.error('Error en la petición:', error.response.status);
      }
    }
    return Promise.reject(error);
  }
);

// ==================== SERVICIOS ====================

// 🔐 AUTENTICACIÓN - Sistema Híbrido
export const authService = {
  // Login con validación contra API de usuarios
  login: async (credentials: { email: string; password: string }) => {
    try {
      // Determinar URL base dependiendo del entorno para evitar CORS en producción
      let url = `${API_BASE_URL}/api/usuarios`;
      
      // Si estamos en producción (GitHub Pages), usar un proxy CORS
      if (process.env.NODE_ENV === 'production') {
        console.log('🌍 Entorno de producción detectado: Usando Proxy CORS (CodeTabs)');
        url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      }

      const response = await axios.get(url);
      const usuarios = response.data as any[];
      
      // Buscar usuario por email
      const user = usuarios.find((u: any) => u.email === credentials.email);
      
      if (user) {
        // Validar password según el email (temporal hasta que la API tenga endpoint de login)
        const passwordsValidas: any = {
          'admin@huertohogar.com': 'admin123',
          'vendedor@huertohogar.com': 'vendedor123',
          'cliente@huertohogar.com': 'cliente123'
        };
        
        const passwordEsperada = passwordsValidas[credentials.email];
        
        if (credentials.password === passwordEsperada) {
          const token = `token-${user.id}-${Date.now()}`;
          setAuthToken(token);
          setMockMode(false);
          console.log('✅ Login exitoso con API REAL');
          
          // Asignar rol y nombre basado en el email (la API no tiene campo rol y nombres genéricos)
          let rol = 'Cliente';
          let nombreDisplay = user.nombre || user.name || 'Usuario';

          if (credentials.email === 'admin@huertohogar.com') {
            rol = 'Admin';
            nombreDisplay = 'Administrador';
          } else if (credentials.email === 'vendedor@huertohogar.com') {
            rol = 'Vendedor';
            nombreDisplay = 'Vendedor';
          }
          
          return {
            token,
            user: {
              id: user.id,
              nombre: nombreDisplay,
              email: user.email,
              rol: rol, // Rol asignado según email
              direccion: user.direccion || user.address,
              telefono: user.telefono || user.phone
            }
          };
        }
      }
      
      throw new Error('Credenciales inválidas');
    } catch (error: any) {
      console.error('Error en login con API:', error);
      throw new Error('Credenciales inválidas');
    }
  },

  register: async (userData: { nombre: string; email: string; password: string; rol?: string }) => {
    try {
      // Intentar crear usuario en la API
      const response = await api.post('/api/usuarios', {
        nombre: userData.nombre,
        email: userData.email,
        rol: userData.rol || 'Cliente',
        direccion: '',
        telefono: ''
      });
      
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      // Mock: Simular registro exitoso
      return {
        id: Math.floor(Math.random() * 1000),
        nombre: userData.nombre,
        email: userData.email,
        rol: 'Cliente'
      };
    }
  },

  logout: () => {
    setAuthToken(null);
  },

  getCurrentUser: async () => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token');
    }

    // Mock: Retornar usuario basado en el token
    if (token.includes('admin')) {
      return {
        id: 1,
        nombre: 'Administrador HuertoHogar',
        email: 'admin@admin.com',
        rol: 'Admin' as const
      };
    } else if (token.includes('vendedor')) {
      return {
        id: 2,
        nombre: 'Vendedor HuertoHogar',
        email: 'vendedor@vendedor.com',
        rol: 'Vendedor' as const
      };
    }
    
    return {
      id: 3,
      nombre: 'Cliente HuertoHogar',
      email: 'cliente@cliente.com',
      rol: 'Cliente' as const
    };
  },

  updateProfile: async (id: string | number, userData: any) => {
    try {
      const response = await api.put(`/api/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/api/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  },

  deleteUser: async (id: string | number) => {
    try {
      const response = await api.delete(`/api/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },
};

// 🛍️ PRODUCTOS (HuertoHogar) - API REAL con Fallback Local
export const productService = {
  getAll: async () => {
    try {
      console.log('🔄 Cargando productos desde API Pública (/api/productos)...');
      
      // Determinar URL base dependiendo del entorno para evitar CORS en producción
      let url = `${API_BASE_URL}/api/productos`;
      
      // Si estamos en producción (GitHub Pages), usar un proxy CORS
      if (process.env.NODE_ENV === 'production') {
        console.log('🌍 Entorno de producción detectado: Usando Proxy CORS (CodeTabs)');
        // Usamos corsproxy.io para evitar el bloqueo CORS
        url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      }

      // Usar el endpoint público /api/productos
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const productos = response.data;
      
      if (!productos || !Array.isArray(productos) || productos.length === 0) {
        console.warn('⚠️ No se recibieron productos de la API, usando datos locales...');
        return productService.getLocalProducts();
      }
      
      console.log(`📦 API devolvió ${productos.length} productos brutos`);

      // FILTRO ESTRICTO: Solo productos de "Huerto Orgánico del Profesor"
      const productosFinales = productos.filter((p: any) => {
        return p.tienda_slug === 'huerto' || p.tienda_nombre === 'Huerto Orgánico del Profesor';
      });
      
      console.log(`🎯 Filtrados ${productosFinales.length} productos de HuertoHogar`);
      
      // Adaptar estructura de la API al formato de la aplicación
      const productosAdaptados = productosFinales.map((p: any) => ({
        id: p.id.toString(), // Convertir a string para coincidir con el tipo Product
        nombre: p.nombre || 'Producto sin nombre',
        descripcion: p.descripcion || 'Sin descripción',
        precio: parseFloat(p.precio) || 0,
        categoria: p.categoria_nombre || p.categoria || 'General',
        categoriaId: p.categoria_id || p.categoriaId || 1,
        imagen: p.imagen || 'https://via.placeholder.com/150',
        stock: p.stock || 10,
        unidad: p.unidad || 'unidad',
        oferta: p.destacado || p.oferta || false,
        tiendaId: p.tienda_id || p.tiendaId,
        tiendaNombre: p.tienda_nombre || p.tiendaNombre || 'Tienda General'
      }));
      
      console.log(`✅ ${productosAdaptados.length} productos cargados y adaptados desde API Pública`);
      return productosAdaptados;
    } catch (error: any) {
      console.error('❌ Error obteniendo productos de la API:', error.message);
      console.log('📦 Usando datos locales como fallback...');
      return productService.getLocalProducts();
    }
  },

  // Método para obtener productos locales
  getLocalProducts: () => {
    console.log('📁 Cargando productos desde datos locales (products.json)...');
    const localProducts = productsData.map((p: any) => ({
      id: p.id,
      nombre: p.name || p.nombre,
      descripcion: p.description || p.descripcion || 'Sin descripción',
      precio: p.price || p.precio || 0,
      categoria: p.category || p.categoria || 'General',
      categoriaId: 1,
      imagen: p.image || p.imagen || 'https://via.placeholder.com/150',
      stock: p.stock || 10,
      unidad: 'unidad',
      oferta: p.offer || p.oferta || false,
      tiendaId: 1,
      tiendaNombre: 'HuertoHogar'
    }));
    console.log(`✅ ${localProducts.length} productos cargados desde datos locales`);
    return localProducts;
  },

  getById: async (id: string | number) => {
    try {
      const response = await api.get(`/api/huerto/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  },

  create: async (productData: any) => {
    try {
      console.log('🔄 Creando producto en API:', productData);
      
      const dataToSend = {
        nombre: productData.nombre,
        descripcion: productData.descripcion || '',
        precio: Number(productData.precio),
        categoria_id: productData.categoriaId || 1,
        imagen: productData.imagen,
        stock: Number(productData.stock),
        unidad: productData.unidad || 'unidad',
        destacado: productData.oferta || false,
        tienda_id: 1 // Forzar tienda HuertoHogar
      };

      // Determinar URL base dependiendo del entorno para evitar CORS en producción
      let url = `${API_BASE_URL}/api/productos`;
      
      // Si estamos en producción (GitHub Pages), usar un proxy CORS
      if (process.env.NODE_ENV === 'production') {
        console.log('🌍 Entorno de producción detectado en Create: Usando Proxy CORS (CodeTabs)');
        url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      }

      const response = await axios.post(url, dataToSend, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creando producto:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id: string | number, productData: any) => {
    try {
      console.log('🔄 Actualizando producto en API:', id, productData);
      
      // Adaptar datos para la API (camelCase -> snake_case)
      const dataToSend = {
        nombre: productData.nombre,
        descripcion: productData.descripcion || '',
        precio: Number(productData.precio),
        categoria_id: productData.categoriaId || productData.categoria_id || 1,
        imagen: productData.imagen,
        stock: Number(productData.stock),
        unidad: productData.unidad || 'unidad',
        destacado: productData.oferta || false,
        tienda_id: productData.tiendaId || productData.tienda_id || 1
      };

      console.log('📤 Datos enviados a la API:', dataToSend);

      // URL de la API
      const apiUrl = `${API_BASE_URL}/api/productos/${id}`;
      
      // En producción (GitHub Pages), usar fetch con mode no-cors NO funciona para PUT
      // Intentamos con la API directa primero, si falla usamos proxy
      try {
        const response = await axios.put(apiUrl, dataToSend, {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('✅ Producto actualizado exitosamente en API:', response.data);
        return response.data;
      } catch (corsError: any) {
        // Si falla por CORS en producción, intentar con proxy
        if (process.env.NODE_ENV === 'production') {
          console.log('🔄 Reintentando con proxy CORS...');
          
          // Usar thingproxy que soporta PUT/POST
          const proxyUrl = `https://thingproxy.freeboard.io/fetch/${apiUrl}`;
          
          const proxyResponse = await axios.put(proxyUrl, dataToSend, {
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          console.log('✅ Producto actualizado via proxy:', proxyResponse.data);
          return proxyResponse.data;
        }
        throw corsError;
      }
    } catch (error: any) {
      console.error('❌ Error actualizando producto:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Error al actualizar producto');
    }
  },

  delete: async (id: string | number) => {
    try {
      console.log('🔄 Eliminando producto en API:', id);
      
      // Determinar URL base dependiendo del entorno para evitar CORS en producción
      let url = `${API_BASE_URL}/api/productos/${id}`;
      
      // Si estamos en producción (GitHub Pages), usar un proxy CORS
      if (process.env.NODE_ENV === 'production') {
        console.log('🌍 Entorno de producción detectado en Delete: Usando Proxy CORS (CodeTabs)');
        url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      }

      const response = await axios.delete(url);
      return response.data;
    } catch (error: any) {
      console.error('Error eliminando producto:', error.response?.data || error.message);
      throw error;
    }
  },

  updateStock: async (id: string | number, stock: number) => {
    try {
      const response = await api.put(`/api/productos/${id}/stock`, { stock });
      return response.data;
    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw error;
    }
  },
};

// 📁 CATEGORÍAS - API REAL con Fallback Local
export const categoryService = {
  getAll: async () => {
    try {
      console.log('🔄 Cargando categorías desde API (sin autenticación)...');
      
      // Determinar URL base dependiendo del entorno para evitar CORS en producción
      let url = `${API_BASE_URL}/api/categorias`;
      
      // Si estamos en producción (GitHub Pages), usar un proxy CORS
      if (process.env.NODE_ENV === 'production') {
        // Usamos corsproxy.io para evitar el bloqueo CORS
        url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      }
      
      // Crear instancia de axios SIN el token de autenticación
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ ${(response.data as any[]).length} categorías cargadas desde API`);
      
      // FILTRO ESTRICTO: Solo categorías de "Huerto Orgánico del Profesor"
      const categoriasFiltradas = (response.data as any[]).filter((c: any) => {
        return c.tienda_slug === 'huerto' || c.tienda_nombre === 'Huerto Orgánico del Profesor';
      });
      
      console.log(`🎯 Filtradas ${categoriasFiltradas.length} categorías de HuertoHogar`);
      
      return categoriasFiltradas;
    } catch (error: any) {
      console.error('❌ Error obteniendo categorías de la API:', error.message);
      console.log('📦 Usando datos locales de categorías como fallback...');
      return categoryService.getLocalCategories();
    }
  },

  // Método para obtener categorías locales
  getLocalCategories: () => {
    console.log('📁 Cargando categorías desde datos locales (categories.json)...');
    const localCategories = categoriesData.map((c: any) => ({
      id: c.id,
      nombre: c.name || c.nombre || 'Sin nombre', // Mapear name a nombre
      descripcion: c.description || c.descripcion || '',
      tiendaId: 1,
      tiendaNombre: 'HuertoHogar'
    }));
    console.log(`✅ ${localCategories.length} categorías cargadas desde datos locales`);
    return localCategories;
  },

  getById: async (id: string | number) => {
    try {
      const response = await api.get(`/api/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      throw error;
    }
  },

  create: async (categoryData: { nombre: string; descripcion?: string }) => {
    try {
      const response = await api.post('/api/categorias', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creando categoría:', error);
      throw error;
    }
  },

  update: async (id: string | number, categoryData: any) => {
    try {
      const response = await api.put(`/api/categorias/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw error;
    }
  },

  delete: async (id: string | number) => {
    try {
      const response = await api.delete(`/api/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw error;
    }
  },
};

// 🛒 CARRITO - API REAL
export const cartService = {
  getCart: async () => {
    try {
      const response = await api.get('/api/carritos');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
      return { items: [], total: 0 };
    }
  },

  addItem: async (item: { productoId: number; cantidad: number }) => {
    try {
      const response = await api.post('/api/carritos', item);
      return response.data;
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      throw error;
    }
  },

  updateItem: async (id: string | number, cantidad: number) => {
    try {
      const response = await api.put(`/api/carritos/${id}`, { cantidad });
      return response.data;
    } catch (error) {
      console.error('Error actualizando carrito:', error);
      throw error;
    }
  },

  removeItem: async (id: string | number) => {
    try {
      const response = await api.delete(`/api/carritos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando del carrito:', error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/api/carritos/clear');
      return response.data;
    } catch (error) {
      console.error('Error limpiando carrito:', error);
      throw error;
    }
  },
};

// � USUARIOS - API REAL
export const userService = {
  getAll: async () => {
    try {
      console.log('🔄 Cargando usuarios desde API...');
      const response = await axios.get(`${API_BASE_URL}/api/usuarios`, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Adaptar estructura de la API
      const usuariosAdaptados = (response.data as any[]).map((u: any) => ({
        id: u.id,
        name: u.nombre || u.name || 'Usuario',
        email: u.email,
        role: u.rol || 'customer',
        status: u.estado || 'active',
        createdAt: u.fechaRegistro || u.createdAt || new Date().toISOString().split('T')[0]
      }));
      
      console.log(`✅ ${usuariosAdaptados.length} usuarios cargados desde API`);
      return usuariosAdaptados;
    } catch (error: any) {
      console.error('❌ Error obteniendo usuarios de la API:', error.message);
      console.log('⚠️ Retornando array vacío - No hay usuarios disponibles');
      return [];
    }
  },

  getById: async (id: string | number) => {
    try {
      const response = await api.get(`/api/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  update: async (id: string | number, userData: any) => {
    try {
      const response = await api.put(`/api/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  delete: async (id: string | number) => {
    try {
      const response = await api.delete(`/api/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },
};

// �📦 ÓRDENES - Mock (no hay endpoint en la API aún)
export const orderService = {
  create: async (orderData: any) => {
    console.log('Creando orden:', orderData);
    return { id: Math.floor(Math.random() * 1000), ...orderData, estado: 'pendiente' };
  },

  getAll: async () => {
    return [];
  },

  getById: async (id: string | number) => {
    return { id, items: [], total: 0, estado: 'pendiente' };
  },

  getUserOrders: async () => {
    return [];
  },

  updateStatus: async (id: string | number, status: string) => {
    return { id, status };
  },

  delete: async (id: string | number) => {
    return { id };
  },
};

export default api;
