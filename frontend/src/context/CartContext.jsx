import React, { createContext, useContext, useState, useEffect } from 'react';
import { carritoAPI, handleApiError } from '../services/apiService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Load cart from backend when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromBackend();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  // Load cart from backend
  const loadCartFromBackend = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await carritoAPI.get();
      
      // Transform backend cart data to frontend format
      const backendItems = response.data.items || [];
      const transformedItems = backendItems.map(item => ({
        id: item.producto.id,
        nombre: item.producto.nombre,
        precio: item.producto.precio,
        imagen_url: item.producto.imagen_url,
        categoria: item.producto.categoria,
        quantity: item.cantidad,
        cartItemId: item.id, // Store the cart item ID for updates/deletes
        stock: item.producto.stock
      }));
      
      setCartItems(transformedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      setError(handleApiError(error));
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para agregar productos al carrito');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      await carritoAPI.addItem(product.id, quantity);
      
      // Reload cart to get updated data
      await loadCartFromBackend();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(handleApiError(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      setLoading(true);
      setError(null);
      
      // Find the cart item ID
      const cartItem = cartItems.find(item => item.id === productId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      await carritoAPI.removeItem(cartItem.cartItemId);
      
      // Reload cart to get updated data
      await loadCartFromBackend();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(handleApiError(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return false;

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      setLoading(true);
      setError(null);
      
      // Find the cart item ID
      const cartItem = cartItems.find(item => item.id === productId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      await carritoAPI.updateItem(cartItem.cartItemId, quantity);
      
      // Reload cart to get updated data
      await loadCartFromBackend();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError(handleApiError(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return false;

    try {
      setLoading(true);
      setError(null);
      await carritoAPI.clear();
      
      // Clear local state
      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(handleApiError(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (Number(item.precio) * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    loadCartFromBackend,
    setError // Allow components to clear errors
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
