import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  isSideCartOpen: boolean;
}

type CartAction = 
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_SIDE_CART' }
  | { type: 'CLOSE_SIDE_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.product.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          isSideCartOpen: true
        };
      } else {
        const newItems = [...state.items, { ...action.product, quantity: 1 }];
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          isSideCartOpen: true
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const filteredItems = state.items.filter(item => item.id !== action.productId);
      return {
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        isSideCartOpen: state.isSideCartOpen
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity === 0) {
        const filteredItems = state.items.filter(item => item.id !== action.productId);
        return {
          items: filteredItems,
          total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          isSideCartOpen: state.isSideCartOpen
        };
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        isSideCartOpen: state.isSideCartOpen
      };
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, isSideCartOpen: false };
    
    case 'OPEN_SIDE_CART':
      return { ...state, isSideCartOpen: true };
    
    case 'CLOSE_SIDE_CART':
      return { ...state, isSideCartOpen: false };
    
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, isSideCartOpen: false });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}