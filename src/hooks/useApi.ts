import { useState, useEffect } from 'react';
import { productService, categoryService } from '../service/api';
import { Product, Category } from '../types';

/**
 * Hook para obtener todos los productos
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        
        // Cargar ofertas desde localStorage
        const offersData = JSON.parse(localStorage.getItem('productOffers') || '{}');
        
        // Combinar datos de la API con datos de ofertas de localStorage
        const productsWithOffers = (data as Product[]).map((product: Product) => {
          const localOffer = offersData[product.id];
          
          // Si existe una oferta en localStorage para este producto, usarla
          if (localOffer && localOffer.oferta) {
            return {
              ...product,
              oferta: true,
              descuento: localOffer.descuento,
              offerPrice: localOffer.offerPrice
            };
          }
          
          // Si no hay oferta en localStorage, retornar el producto sin modificar
          return product;
        });
        
        setProducts(productsWithOffers);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

/**
 * Hook para obtener un producto por ID
 */
export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id);
        
        // Cargar ofertas desde localStorage
        const offersData = JSON.parse(localStorage.getItem('productOffers') || '{}');
        const localOffer = offersData[id];
        
        // Si existe una oferta en localStorage para este producto, aplicarla
        let productWithOffer = data as Product;
        if (localOffer && localOffer.oferta) {
          productWithOffer = {
            ...productWithOffer,
            oferta: true,
            descuento: localOffer.descuento,
            offerPrice: localOffer.offerPrice
          };
        }
        
        setProduct(productWithOffer);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

/**
 * Hook para obtener productos por categoría
 */
export const useProductsByCategory = (categoryId: string | undefined) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        
        // Cargar ofertas desde localStorage
        const offersData = JSON.parse(localStorage.getItem('productOffers') || '{}');
        
        // Combinar datos de la API con datos de ofertas de localStorage
        const productsWithOffers = (data as Product[]).map((product: Product) => {
          const localOffer = offersData[product.id];
          
          // Si existe una oferta en localStorage para este producto, usarla
          if (localOffer && localOffer.oferta) {
            return {
              ...product,
              oferta: true,
              descuento: localOffer.descuento,
              offerPrice: localOffer.offerPrice
            };
          }
          
          return product;
        });
        
        // Filtrar productos por categoría localmente
        const filtered = productsWithOffers.filter(
          (p: Product) => p.categoria === categoryId || p.categoriaId?.toString() === categoryId
        );
        setProducts(filtered);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
};

/**
 * Hook para buscar productos
 */
export const useProductSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setQuery(searchQuery);
      // Si tienes un endpoint de búsqueda en productService, úsalo aquí
      // const data = await productService.search(searchQuery);
      setResults([]); // Implementar si existe en el servicio
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { query, results, loading, error, search };
};

/**
 * Hook para obtener productos en oferta
 */
export const useProductsOnOffer = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        
        // Cargar ofertas desde localStorage
        const offersData = JSON.parse(localStorage.getItem('productOffers') || '{}');
        
        // Combinar datos de la API con datos de ofertas de localStorage
        const productsWithOffers = (data as Product[]).map((product: Product) => {
          const localOffer = offersData[product.id];
          
          // Si existe una oferta en localStorage para este producto, usarla
          if (localOffer && localOffer.oferta) {
            return {
              ...product,
              oferta: true,
              descuento: localOffer.descuento,
              offerPrice: localOffer.offerPrice
            };
          }
          
          // Si no hay oferta en localStorage pero el producto tiene oferta en API, mantenerla
          return product;
        });
        
        // Filtrar solo productos que tienen oferta activa
        const offerProducts = productsWithOffers.filter((p: Product) => p.oferta === true);
        
        setProducts(offerProducts);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

/**
 * Hook para obtener todas las categorías
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAll();
        setCategories(data as Category[]);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

/**
 * Hook para obtener una categoría por ID
 */
export const useCategory = (id: string | undefined) => {
  const [category, setCategory] = useState<Category | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getById(id);
        setCategory(data as Category);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  return { category, loading, error };
};

/**
 * Hook para obtener categorías disponibles (con productos)
 */
export const useAvailableCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAll();
        setCategories(data as Category[]);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
