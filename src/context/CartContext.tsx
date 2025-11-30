import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '../types';

type CartEntry = Product & { quantity: number; discountedPrice?: number };

interface CartState {
  items: CartEntry[];
  isCartOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartEntry }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => String(item.id) === String(action.payload.id));
      const qtyToAdd = action.payload.quantity && action.payload.quantity > 0 ? action.payload.quantity : 1;
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            String(item.id) === String(action.payload.id) ? { ...item, quantity: item.quantity + qtyToAdd } : item
          ),
          isCartOpen: true
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: qtyToAdd }],
        isCartOpen: true
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => String(item.id) !== String(action.payload))
      };

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => String(item.id) !== String(action.payload.id))
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          String(item.id) === String(action.payload.id) ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item
        )
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isCartOpen: !state.isCartOpen };

    case 'OPEN_CART':
      return { ...state, isCartOpen: true };

    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };

    default:
      return state;
  }
};

export interface CartContextValue {
  items: CartEntry[];
  // legacy alias used in some components during migration
  cart: CartEntry[];
  isCartOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isCartOpen: false });

  const addToCart = (product: Product, quantity = 1) => {
    const discountedPrice = product.oferta ? (product.offerPrice ?? Math.round(product.precio * (1 - (product.descuento ?? 0) / 100))) : undefined;
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity, discountedPrice } as CartEntry });
  };

  const removeFromCart = (productId: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  const updateQuantity = (productId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  const getTotalItems = () => state.items.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => state.items.reduce((total, item) => {
    const price = (item.discountedPrice ?? item.offerPrice ?? item.precio) as number;
    return total + price * item.quantity;
  }, 0);

  const value: CartContextValue = {
    items: state.items,
    cart: state.items,
    isCartOpen: state.isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export default CartContext;
