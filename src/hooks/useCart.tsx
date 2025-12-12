import { useState, useEffect, useCallback } from "react";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../services/cartService";
import { CartItem } from "../types";
import { useAuth } from "../services/AuthContext";
import { notifyItemAddedToCart } from "../services/notificationService";

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const cartData = await getCart(user.uid);
      setItems(cartData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load cart";
      setError(errorMessage);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addItem = useCallback(async (productId: number, quantity: number = 1, productName?: string) => {
    if (!user) {
      const error = new Error('You must be logged in to add items to cart');
      setError(error.message);
      throw error;
    }
    try {
      setError(null);
      const newItem = await addToCart(user.uid, productId, quantity);
      
      // Refresh cart from server to ensure consistency
      await fetchCart();
      
      // Show notification
      try {
        if (productName) {
          await notifyItemAddedToCart(productName);
        } else {
          await notifyItemAddedToCart(`Product #${productId}`);
        }
      } catch (notifError) {
        // Don't fail the add operation if notification fails
        console.warn('Failed to show notification:', notifError);
      }
      
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add item to cart";
      setError(errorMessage);
      throw err;
    }
  }, [user, fetchCart]);

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    try {
      setError(null);
      const updatedItem = await updateCartItem(user?.uid, itemId, quantity);
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update item";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    try {
      setError(null);
      const item = items.find((i) => i.id === itemId);
      if (!item) {
        throw new Error('Item not found in cart');
      }
      await removeCartItem(user?.uid, item.product_id);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove item";
      setError(errorMessage);
      throw err;
    }
  }, [items]);

  const total = items.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    return sum + itemPrice * (item.quantity || 1);
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  return {
    items,
    loading,
    error,
    total,
    itemCount,
    addItem,
    updateItem,
    removeItem,
    refreshCart: fetchCart,
  };
}
