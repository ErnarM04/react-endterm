import { CartItem } from '../types';
import { auth } from './firebase';

const API_URL = "https://fastapi-endterm.onrender.com/carts";
const CART_ID_KEY = 'cart_id';

const getHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

function requireAuth(): void {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to use the cart. Please log in first.');
  }
}

async function getOrCreateCartId(): Promise<number> {
  requireAuth();
  const storedCartId = localStorage.getItem(CART_ID_KEY);
  if (storedCartId) {
    const cartId = parseInt(storedCartId, 10);
    try {
      const response = await fetch(`${API_URL}/${cartId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (response.ok) {
        return cartId;
      }
    } catch {
    }
  }

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
  const items = (cart.items || []).map((item: any, index: number) => ({
    ...item,
    id: item.id || item.product_id || index,
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
  const cart = await getCart();
  const item = cart.find((i: CartItem) => i.id === itemId);
  
  if (!item) {
    throw new Error('Cart item not found');
  }

  await removeCartItem(item.product_id);
  
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

