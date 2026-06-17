import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { cartAPI } from '../api/cart';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total_price: 0, total_items: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (menuItemId, quantity = 1, specialInstructions = '') => {
    try {
      const response = await cartAPI.addToCart({
        menu_item_id: menuItemId,
        quantity,
        special_instructions: specialInstructions,
      });
      setCart(response.data);
      toast.success('Added to cart!');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
      throw error;
    }
  };

  const updateCartItem = async (itemId, data) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, data);
      await fetchCart();
      return response.data;
    } catch (error) {
      toast.error('Failed to update cart item');
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.removeCartItem(itemId);
      setCart(response.data);
      toast.success('Removed from cart');
      return response.data;
    } catch (error) {
      toast.error('Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartAPI.clearCart();
      setCart(response.data);
      toast.success('Cart cleared');
      return response.data;
    } catch (error) {
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    totalItems: cart.total_items || 0,
    totalPrice: cart.total_price || 0,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
