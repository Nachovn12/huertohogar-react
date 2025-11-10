export interface Product {
  id: string;
  name: string;
  price: number;
  offer?: boolean;
  offerPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  description?: string;
  category?: string;
  stock?: number;
  unit?: string;
  reviews?: number;
  origin?: string;
  certification?: string;
  benefits?: string[];
  savings?: number;
  rating?: number;
  seasonal?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export default {};
