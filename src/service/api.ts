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
      console.log('📤 Registrando usuario en la API...');
      
      // Datos a enviar a la API - incluir password que es requerido
      const dataToSend = {
        nombre: userData.nombre,
        email: userData.email,
        password: userData.password
      };

      const apiUrl = `${API_BASE_URL}/api/usuarios`;
      
      // Llamada directa a la API (sin proxy para desarrollo local)
      const response = await axios.post(apiUrl, dataToSend, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ Usuario registrado exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details?.join(', ') || error.message || 'Error al registrar usuario';
      throw new Error(errorMessage);
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
      // Determinar URL base dependiendo del entorno para evitar CORS en producción
      let url = `${API_BASE_URL}/api/productos`;
      
      // Si estamos en producción (GitHub Pages), usar un proxy CORS
      if (process.env.NODE_ENV === 'production') {
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
        return productService.getLocalProducts();
      }

      // FILTRO ESTRICTO: Solo productos de "Huerto Orgánico del Profesor"
      const productosFinales = productos.filter((p: any) => {
        return p.tienda_slug === 'huerto' || p.tienda_nombre === 'Huerto Orgánico del Profesor';
      });
      
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
      
      // Cargar también productos creados localmente
      const productosLocales = JSON.parse(localStorage.getItem('productos_locales') || '[]');
      
      if (productosLocales.length > 0) {
        console.log(`📦 ${productosLocales.length} productos locales encontrados`);
        // Combinar productos de la API con los locales
        return [...productosAdaptados, ...productosLocales];
      }
      
      return productosAdaptados;
    } catch (error: any) {
      console.error('Error obteniendo productos de la API:', error.message);
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
      console.log('🔄 Cargando producto por ID desde API:', id);
      
      // Determinar URL base dependiendo del entorno para evitar CORS en producción
      let url = `${API_BASE_URL}/api/productos/${id}`;
      
      // Si estamos en producción (GitHub Pages), usar un proxy CORS
      if (process.env.NODE_ENV === 'production') {
        console.log('🌍 Entorno de producción detectado: Usando Proxy CORS (CodeTabs)');
        url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      }

      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const p = response.data as any;
      
      if (!p) {
        console.warn('⚠️ Producto no encontrado en API, buscando en datos locales...');
        return productService.getLocalProductById(id);
      }
      
      // Adaptar estructura de la API al formato de la aplicación
      const productoAdaptado = {
        id: p.id.toString(),
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
      };
      
      console.log('✅ Producto cargado desde API:', productoAdaptado.nombre);
      return productoAdaptado;
    } catch (error: any) {
      console.error('❌ Error obteniendo producto de la API:', error.message);
      console.log('📦 Buscando en datos locales como fallback...');
      return productService.getLocalProductById(id);
    }
  },

  // Método para obtener un producto local por ID
  getLocalProductById: (id: string | number) => {
    console.log('📁 Buscando producto en datos locales por ID:', id);
    
    // Primero buscar en productos guardados en localStorage (ID >= 1000)
    const productosLocales = JSON.parse(localStorage.getItem('productos_locales') || '[]');
    const productoLocalGuardado = productosLocales.find((p: any) => 
      p.id === id || p.id === Number(id) || p.id?.toString() === id?.toString()
    );
    
    if (productoLocalGuardado) {
      console.log('✅ Producto encontrado en localStorage:', productoLocalGuardado.nombre);
      return productoLocalGuardado;
    }
    
    // Si no está en localStorage, buscar en products.json
    const localProduct = productsData.find((p: any) => 
      p.id === id || p.id === Number(id) || p.id?.toString() === id?.toString()
    );
    
    if (!localProduct) {
      console.warn('⚠️ Producto no encontrado en datos locales');
      return null;
    }
    
    const lp = localProduct as any;
    const productoAdaptado = {
      id: lp.id,
      nombre: lp.name || lp.nombre,
      descripcion: lp.description || lp.descripcion || 'Sin descripción',
      precio: lp.price || lp.precio || 0,
      categoria: lp.category || lp.categoria || 'General',
      categoriaId: 1,
      imagen: lp.image || lp.imagen || 'https://via.placeholder.com/150',
      stock: lp.stock || 10,
      unidad: 'unidad',
      oferta: lp.offer || lp.oferta || false,
      tiendaId: 1,
      tiendaNombre: 'HuertoHogar'
    };
    
    console.log('✅ Producto encontrado en datos locales:', productoAdaptado.nombre);
    return productoAdaptado;
  },

  create: async (productData: any) => {
    // ⚠️ NOTA: El endpoint POST /api/productos del backend tiene un bug
    // que causa error 500: "INSERT has more target columns than expressions"
    // Hasta que se solucione, guardamos los productos localmente
    
    console.warn('⚠️ Creando producto LOCALMENTE (API POST tiene bug en backend)');
    console.log('📦 Datos del producto:', productData);
    
    // Obtener productos locales existentes
    const productosLocales = JSON.parse(localStorage.getItem('productos_locales') || '[]');
    
    // Calcular el siguiente ID evitando conflictos con TODOS los productos de la API
    let newId = 1000; // Empezar desde 1000 para evitar conflictos con cualquier tienda
    
    try {
      // Obtener TODOS los productos de la API (todas las tiendas)
      const responseAPI = await axios.get(`${API_BASE_URL}/api/productos`, {
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      const todosProductosAPI = responseAPI.data as any[];
      
      // Encontrar el ID más alto de TODA la API
      if (todosProductosAPI.length > 0) {
        const maxIdAPI = Math.max(...todosProductosAPI.map((p: any) => {
          const id = typeof p.id === 'string' ? parseInt(p.id) : p.id;
          return isNaN(id) ? 0 : id;
        }));
        newId = Math.max(1000, maxIdAPI + 1);
      }
    } catch (error) {
      console.warn('⚠️ No se pudo obtener productos de la API, usando ID 1000+');
    }
    
    // Verificar IDs locales también
    if (productosLocales.length > 0) {
      const maxLocalId = Math.max(...productosLocales.map((p: any) => {
        const id = typeof p.id === 'string' ? parseInt(p.id) : p.id;
        return isNaN(id) ? 0 : id;
      }));
      newId = Math.max(newId, maxLocalId + 1);
    }
    
    // Obtener nombre de categoría
    const categorias = await categoryService.getAll();
    const categoriaEncontrada = categorias.find((c: any) => 
      c.id === Number(productData.categoriaId) || c.id === Number(productData.categoria_id)
    );
    
    const productoLocal = {
      id: newId,
      nombre: productData.nombre || 'Nuevo Producto',
      descripcion: productData.descripcion || 'Sin descripción',
      precio: Number(productData.precio) || 0,
      categoria: categoriaEncontrada?.nombre || productData.categoria || 'General',
      categoriaId: Number(productData.categoriaId) || Number(productData.categoria_id) || 1,
      imagen: productData.imagen || 'https://via.placeholder.com/300x200/10b981/FFFFFF?text=Producto',
      stock: Number(productData.stock) || 0,
      unidad: productData.unidad || 'unidad',
      oferta: Boolean(productData.oferta || productData.destacado || false),
      tiendaId: 1,
      tiendaNombre: 'HuertoHogar'
    };
    
    // Agregar a la lista y guardar
    productosLocales.push(productoLocal);
    localStorage.setItem('productos_locales', JSON.stringify(productosLocales));
    
    console.log(`✅ Producto guardado localmente con ID #${newId}:`, productoLocal);
    
    return {
      id: newId,
      nombre: productoLocal.nombre,
      ...productoLocal
    };
    
    /* CÓDIGO ORIGINAL (con bug en la API):
    try {
      console.log('🔄 Creando producto en API:', productData);
      
      const categoriaId = Number(productData.categoriaId) || Number(productData.categoria_id) || 1;
      const precioFormateado = Number(productData.precio).toFixed(2);
      
      const dataToSend = {
        nombre: productData.nombre || 'Nuevo Producto',
        descripcion: productData.descripcion || 'Sin descripción',
        precio: precioFormateado,
        categoria_id: categoriaId,
        imagen: productData.imagen || 'https://via.placeholder.com/300x200/10b981/FFFFFF?text=Producto',
        stock: Number(productData.stock) || 0,
        unidad: productData.unidad || 'unidad',
        tienda_id: 1
      };

      const response = await axios.post(`${API_BASE_URL}/api/productos`, dataToSend, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });
      
      const productoCreado = response.data as any;
      return {
        id: productoCreado.id || productoCreado.producto?.id,
        nombre: productoCreado.nombre || productoCreado.producto?.nombre,
        ...productoCreado
      };
    } catch (error: any) {
      console.error('❌ Error creando producto:', error.response?.data || error.message);
      throw new Error('Error del servidor: ' + (error.response?.data?.mensaje || 'Bug en POST /api/productos'));
    }
    */
  },

  update: async (id: string | number, productData: any) => {
    try {
      console.log('🔄 Actualizando producto en API:', id, productData);
      
      // Adaptar datos para la API (camelCase -> snake_case)
      const dataToSend = {
        nombre: productData.nombre,
        descripcion: productData.descripcion || '',
        precio: Number(productData.precio).toFixed(2), // Formatear como string con 2 decimales
        categoria_id: productData.categoriaId || productData.categoria_id || 1,
        imagen: productData.imagen,
        stock: Number(productData.stock),
        unidad: productData.unidad || 'unidad',
        destacado: productData.oferta || false,
        tienda_id: productData.tiendaId || productData.tienda_id || 1
      };

      console.log('📤 Datos enviados a la API:', dataToSend);

      // En producción, usar proxy CORS para PUT
      if (process.env.NODE_ENV === 'production') {
        console.log('🌍 Producción detectada: Usando proxy CORS para PUT');
        
        // AllOrigins soporta todos los métodos HTTP
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`${API_BASE_URL}/api/productos/${id}`)}`;
        
        const response = await axios.put(proxyUrl, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000
        });
        
        console.log('✅ Producto actualizado exitosamente en API (via proxy):', response.data);
        return response.data;
      }

      // En desarrollo, llamada directa
      const response = await api.put(`/api/productos/${id}`, dataToSend);
      
      console.log('✅ Producto actualizado exitosamente en API:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error actualizando producto:', error.response?.data || error.message);
      
      // Si el error es por falta de autenticación
      if (error.response?.status === 401) {
        throw new Error('No tienes permisos. Debes iniciar sesión como administrador.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Error al actualizar producto');
    }
  },

  delete: async (id: string | number) => {
    try {
      console.log('🔄 Eliminando producto:', id);
      
      // Verificar si es un producto local (ID >= 1000)
      const numId = typeof id === 'string' ? parseInt(id) : id;
      
      if (numId >= 1000) {
        console.log('📦 Eliminando producto LOCAL de localStorage...');
        
        // Eliminar de localStorage
        const productosLocales = JSON.parse(localStorage.getItem('productos_locales') || '[]');
        const productosFiltrados = productosLocales.filter((p: any) => {
          const pId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
          return pId !== numId;
        });
        
        localStorage.setItem('productos_locales', JSON.stringify(productosFiltrados));
        console.log(`✅ Producto local #${numId} eliminado de localStorage`);
        
        return { success: true, id: numId };
      }
      
      // En producción, usar proxy CORS para DELETE
      if (process.env.NODE_ENV === 'production') {
        console.log('🌍 Producción detectada: Usando proxy CORS para DELETE');
        
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`${API_BASE_URL}/api/productos/${id}`)}`;
        
        const response = await axios.delete(proxyUrl, {
          timeout: 15000
        });
        
        console.log('✅ Producto eliminado exitosamente de la API (via proxy)');
        return response.data;
      }
      
      // En desarrollo, llamada directa
      console.log('🔄 Eliminando producto de la API:', id);
      const response = await api.delete(`/api/productos/${id}`);
      
      console.log('✅ Producto eliminado exitosamente de la API');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error eliminando producto:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('No tienes permisos. Debes iniciar sesión como administrador.');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Error al eliminar producto');
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

// 👥 USUARIOS - API REAL
export const userService = {
  getAll: async () => {
    try {
      console.log('🔄 Cargando usuarios desde API...');
      
      let url = `${API_BASE_URL}/api/usuarios`;
      
      // En producción (GitHub Pages), usar proxy CORS
      if (process.env.NODE_ENV === 'production') {
        console.log('🌍 Producción: Usando proxy CORS para GET usuarios...');
        url = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
      }
      
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Función para determinar el rol basado en el email
      const getRoleFromEmail = (email: string): string => {
        if (email === 'admin@huertohogar.com') return 'admin';
        if (email === 'vendedor@huertohogar.com') return 'vendedor';
        return 'customer'; // Por defecto, todos los nuevos usuarios son clientes
      };
      
      // Adaptar estructura de la API
      const usuariosAdaptados = (response.data as any[]).map((u: any) => ({
        id: u.id,
        name: u.nombre || u.name || 'Usuario',
        email: u.email,
        role: getRoleFromEmail(u.email), // Asignar rol basado en email
        status: u.estado || 'active', // La API no tiene estado, asignamos active por defecto
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
      console.log('🔄 Eliminando usuario en API:', id);
      
      const apiUrl = `${API_BASE_URL}/api/usuarios/${id}`;
      
      // Llamada directa a la API
      const response = await axios.delete(apiUrl);
      console.log('✅ Usuario eliminado exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error eliminando usuario:', error);
      
      // Verificar si es error 404 (endpoint no existe)
      if (error.response?.status === 404) {
        const apiError = error.response?.data?.error || error.response?.data?.mensaje;
        if (apiError?.includes('Endpoint no encontrado')) {
          throw new Error('La API no tiene endpoint para eliminar usuarios (DELETE no soportado)');
        }
        throw new Error('Usuario no encontrado (404)');
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Error al eliminar usuario');
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
