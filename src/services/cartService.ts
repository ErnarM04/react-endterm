import { CartItem } from '../types';
import { auth } from './firebase';

const API_URL = "https://fastapi-endterm.onrender.com/carts";
const CART_ID_KEY = 'cart_id';

const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

// Check if user is authenticated
function requireAuth(): void {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to use the cart. Please log in first.');
  }
}

// Get or create cart ID
async function getOrCreateCartId(): Promise<number> {
  requireAuth();
  // Check localStorage first
  const storedCartId = localStorage.getItem(CART_ID_KEY);
  if (storedCartId) {
    const cartId = parseInt(storedCartId, 10);
    // Verify cart still exists
    try {
      const response = await fetch(`${API_URL}/${cartId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (response.ok) {
        return cartId;
      }
    } catch {
      // Cart doesn't exist, create new one
    }
  }

  // Create new cart
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to create cart: ${response.statusText}`);
  }

  const cart = await response.json();
  const cartId = cart.id;
  localStorage.setItem(CART_ID_KEY, cartId.toString());
  return cartId;
}

export async function getCart(): Promise<CartItem[]> {
  requireAuth();
  const cartId = await getOrCreateCartId();
  const response = await fetch(`${API_URL}/${cartId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cart: ${response.statusText}`);
  }

  const cart = await response.json();
  // API returns CartSummary with items array
  // Add id to each item using product_id as id (since API doesn't provide item id)
  const items = (cart.items || []).map((item: any, index: number) => ({
    ...item,
    id: item.id || item.product_id || index, // Use product_id as id if no id provided
  }));
  return items;
}

export async function addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
  requireAuth();
  const cartId = await getOrCreateCartId();
  const response = await fetch(`${API_URL}/${cartId}/items`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add item to cart: ${response.statusText}`);
  }

  return response.json();
}

export async function updateCartItem(itemId: number, quantity: number): Promise<CartItem> {
  requireAuth();
  // Note: API doesn't have PUT for items, so we remove and re-add
  // First get the item to find product_id
  const cart = await getCart();
  const item = cart.find((i: CartItem) => i.id === itemId);
  
  if (!item) {
    throw new Error('Cart item not found');
  }

  // Remove old item by product_id
  await removeCartItem(item.product_id);
  
  // Add with new quantity
  return addToCart(item.product_id, quantity);
}

export async function removeCartItem(productId: number): Promise<void> {
  requireAuth();
  const cartId = await getOrCreateCartId();
  const response = await fetch(`${API_URL}/${cartId}/items/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to remove cart item: ${response.statusText}`);
  }
}

