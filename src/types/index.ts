// ===================== USUARIO =====================
export interface User {
  id: number;
  nombre: string;
  email: string;
  password?: string; // No se devuelve en respuestas, solo para registro
  rol: 'Admin' | 'Vendedor' | 'Cliente';
  direccion?: string;
  telefono?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  rol?: 'Cliente'; // Por defecto cliente en registro
  direccion?: string;
  telefono?: string;
}

// ===================== PRODUCTO =====================
export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  categoriaId?: number;
  imagen: string;
  origen?: string;
  unidad?: string; // 'kg', 'unidad', 'bolsa', etc.
  destacado?: boolean;
  oferta?: boolean;
  descuento?: number;
  offerPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  tiendaId?: number;
  tiendaNombre?: string;
}

// ===================== CATEGORÍA =====================
export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ===================== CARRITO =====================
export interface CartItem {
  id: number;
  productoId: number;
  producto: Product; // Información completa del producto
  cantidad: number;
  precio: number; // Precio unitario al momento de agregar
  subtotal: number; // cantidad * precio
}

export interface Cart {
  id: number;
  usuarioId: number;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

// ===================== ORDEN/PEDIDO =====================
export interface OrderItem {
  id: number;
  productoId: number;
  producto: Product;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface Order {
  id: number;
  usuarioId: number;
  usuario?: User; // Información del usuario que hizo el pedido
  items: OrderItem[];
  subtotal: number;
  descuento?: number;
  impuestos?: number;
  envio?: number;
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  metodoPago?: string;
  direccionEnvio: string;
  notasEnvio?: string;
  fechaPedido: string;
  fechaEntrega?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderData {
  items: {
    productoId: number;
    cantidad: number;
    precio: number;
  }[];
  direccionEnvio: string;
  metodoPago: string;
  notasEnvio?: string;
}

// ===================== REVIEW/RESEÑA =====================
export interface Review {
  id: number;
  productoId: number;
  usuarioId: number;
  usuario?: User;
  calificacion: number; // 1-5
  comentario: string;
  createdAt: string;
  updatedAt?: string;
}

// ===================== ESTADÍSTICAS (Admin) =====================
export interface DashboardStats {
  totalProductos: number;
  totalUsuarios: number;
  totalOrdenes: number;
  ventasDelMes: number;
  productosDestacados: Product[];
  ordenesRecientes: Order[];
  usuariosRecientes: User[];
}

// ===================== UBICACIONES =====================
export interface StoreLocation {
  id: number;
  ciudad: string;
  direccion: string;
  lat: number;
  lng: number;
  telefono?: string;
  horario?: string;
}

// ===================== TIPOS DE UTILIDAD =====================
export type UserRole = 'Admin' | 'Vendedor' | 'Cliente';
export type OrderStatus = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
