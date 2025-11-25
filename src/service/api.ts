import { Product, Category } from '../types';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

// ============================================
// 🔧 CONFIGURACIÓN - Cambia aquí tu API
// ============================================
const API_URL = 'https://fakestoreapi.com'; // ← Cambia esta URL por la de tu API
const USE_API = true; // ← true = usar API, false = usar datos locales

// Datos locales como fallback
const localProducts = productsData as Product[];
const localCategories = categoriesData as Category[];

// Helper para detectar si hay conexión a internet
const isOnline = (): boolean => {
  return navigator.onLine;
};

// Helper para manejar errores de fetch con fallback automático
const handleResponse = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper para hacer fetch con timeout y fallback
const fetchWithFallback = async <T,>(
  url: string,
  fallbackData: T,
  timeout: number = 5000
): Promise<T> => {
  // Si está configurado para usar datos locales, retornar inmediatamente
  if (!USE_API) {
    console.log('📁 Using local data (USE_API = false)');
    return Promise.resolve(fallbackData);
  }

  // Si no hay conexión a internet, usar datos locales
  if (!isOnline()) {
    console.warn('📡 No internet connection detected, using local data');
    return Promise.resolve(fallbackData);
  }

  // Intentar fetch con timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const data = await handleResponse<T>(response);
    console.log(`✅ Data loaded from API: ${url}`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn(`⏱️ Request timeout for ${url}, using local data`);
      } else {
        console.warn(`❌ Error fetching from API: ${error.message}, using local data`);
      }
    }
    return fallbackData;
  }
};

// Adaptador para transformar datos de APIs externas al formato de la app
const adaptExternalProduct = (externalProduct: any): Product => {
  // Simular oferta para algunos productos (ej: IDs pares o aleatorio determinista)
  // Usamos el ID para que sea consistente (siempre el mismo producto es oferta)
  const idNum = Number(externalProduct.id) || 0;
  const isOffer = externalProduct.offer || (idNum % 3 === 0); // 1 de cada 3 productos es oferta
  const price = Number(externalProduct.price || 0);
  const discount = isOffer ? 20 : 0;
  const offerPrice = isOffer ? Math.round(price * 0.8) : undefined;

  return {
    id: String(externalProduct.id || externalProduct._id || Math.random()),
    name: externalProduct.name || externalProduct.title || 'Producto sin nombre',
    price: price, // Usar precio exacto de la API
    image: externalProduct.image || externalProduct.images?.[0] || externalProduct.thumbnail || '',
    description: externalProduct.description || '',
    category: externalProduct.category || 'general',
    stock: externalProduct.stock || externalProduct.quantity || 100,
    unit: externalProduct.unit || 'unidad',
    reviews: externalProduct.reviews || externalProduct.rating?.count || 0,
    offer: isOffer,
    offerPrice: offerPrice,
    discount: discount,
    rating: externalProduct.rating?.rate || externalProduct.rating || 4.5
  };
};

export const api = {
  // ==================== PRODUCTOS ====================
  
  /**
   * Obtener todos los productos
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      const data = await fetchWithFallback<any[]>(
        `${API_URL}/products`,
        localProducts
      );
      
      // Si los datos vienen de la API externa, adaptarlos
      if (data && data.length > 0 && data !== localProducts) {
        // Verificar si necesita adaptación (si tiene 'title' en lugar de 'name')
        if (data[0].title && !data[0].name) {
          console.log('🔄 Adapting external API data to app format');
          return data.map(adaptExternalProduct);
        }
      }
      
      return data as Product[];
    } catch (error) {
      console.warn('Error in getProducts, using local data:', error);
      return localProducts;
    }
  },

  /**
   * Obtener un producto por ID
   */
  getProductById: async (id: string): Promise<Product | undefined> => {
    const fallback = localProducts.find(p => p.id === id);
    
    if (!USE_API || !isOnline()) {
      return Promise.resolve(fallback);
    }

    try {
      const data = await fetchWithFallback<any>(
        `${API_URL}/products/${id}`,
        fallback
      );

      if (data && data !== fallback) {
        // Si tiene title pero no name, adaptar
        if (data.title && !data.name) {
          return adaptExternalProduct(data);
        }
        // Si ya tiene el formato correcto o es el fallback
        return data as Product;
      }
      
      return data as Product;
    } catch (error) {
      console.warn(`Error getting product ${id}, using local data:`, error);
      return fallback;
    }
  },

  /**
   * Obtener productos por categoría
   */
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const fallback = localProducts.filter(p => p.category === category);
    
    return fetchWithFallback<Product[]>(
      `${API_URL}/products/category/${category}`,
      fallback
    );
  },

  /**
   * Buscar productos por término de búsqueda
   */
  searchProducts: async (query: string): Promise<Product[]> => {
    const lowerQuery = query.toLowerCase();
    const fallback = localProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
    );
    
    return fetchWithFallback<Product[]>(
      `${API_URL}/products/search?q=${encodeURIComponent(query)}`,
      fallback
    );
  },

  /**
   * Obtener productos en oferta
   */
  getProductsOnOffer: async (): Promise<Product[]> => {
    // FakeStoreAPI no tiene endpoint de ofertas, así que obtenemos todos y filtramos
    // La lógica de "qué es oferta" ya está en adaptExternalProduct
    const allProducts = await api.getProducts();
    return allProducts.filter(p => p.offer === true);
  },

  // ==================== CATEGORÍAS ====================
  
  /**
   * Obtener todas las categorías
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      // Primero intentar obtener categorías desde el endpoint de categorías
      const categoriesFromAPI = await fetchWithFallback<any[]>(
        `${API_URL}/categories`,
        []
      );

      // Si la API devuelve categorías, adaptarlas
      if (categoriesFromAPI && categoriesFromAPI.length > 0 && categoriesFromAPI !== localCategories) {
        console.log('✅ Using categories from API');
        
        // Si son strings simples (como FakeStoreAPI), convertirlos a objetos Category
        if (typeof categoriesFromAPI[0] === 'string') {
          return categoriesFromAPI.map((cat: string) => ({
            id: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            description: `Productos de ${cat}`
          }));
        }
        
        // Si ya son objetos, adaptarlos si es necesario
        return categoriesFromAPI.map((cat: any) => ({
          id: cat.id || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'unknown',
          name: cat.name || cat.title || cat.id || 'Sin nombre',
          description: cat.description || `Categoría ${cat.name || cat.id}`
        }));
      }

      // Si no hay categorías desde la API, generarlas desde los productos
      const products = await api.getProducts();
      
      if (products && products.length > 0 && products !== localProducts) {
        console.log('🔄 Generating categories from API products');
        
        // Extraer categorías únicas de los productos
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        
        return uniqueCategories.map(cat => ({
          id: cat!,
          name: cat!.charAt(0).toUpperCase() + cat!.slice(1),
          description: `Productos de ${cat}`
        }));
      }

      // Fallback a categorías locales
      console.log('📁 Using local categories');
      return localCategories;
      
    } catch (error) {
      console.warn('Error getting categories, using local data:', error);
      return localCategories;
    }
  },

  /**
   * Obtener una categoría por ID
   */
  getCategoryById: async (id: string): Promise<Category | undefined> => {
    const fallback = localCategories.find(c => c.id === id);
    
    if (!USE_API || !isOnline()) {
      return Promise.resolve(fallback);
    }

    try {
      return await fetchWithFallback<Category>(
        `${API_URL}/categories/${id}`,
        fallback as Category
      );
    } catch {
      return fallback;
    }
  },

  /**
   * Obtener categorías que tienen productos disponibles
   */
  getAvailableCategories: async (): Promise<Category[]> => {
    const [categories, products] = await Promise.all([
      api.getCategories(),
      api.getProducts()
    ]);
    
    return categories.filter(cat => 
      products.some(p => p.category === cat.id)
    );
  },

  /**
   * Obtener conteo de productos por categoría
   */
  getCategoryProductCount: async (categoryId: string): Promise<number> => {
    const products = await api.getProductsByCategory(categoryId);
    return products.length;
  }
};

export default api;
