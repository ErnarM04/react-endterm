import { CartItem } from "../types";

const API_URL = "https://fastapi-endterm.onrender.com/carts";

// ---------- Helpers ----------
const getHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
});

const assertUser = (userId?: string): string => {
  if (!userId) {
    throw new Error("You must be logged in to use the cart.");
  }
  return userId;
};

// ---------- Create Cart for userId endpoint ----------
async function createCartForUser(userId: string): Promise<void> {
  const uid = assertUser(userId);
  const response = await fetch(`${API_URL}/${uid}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ user_id: uid }),
  });
  if (!response.ok && response.status !== 409) {
    throw new Error("Could not create cart");
  }
}

// ---------- Get Cart ----------
export async function getCart(userId?: string): Promise<CartItem[]> {
  const uid = assertUser(userId);

  let response = await fetch(`${API_URL}/${uid}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (response.status === 404) {
    await createCartForUser(uid);
    return [];
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch cart: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  // Handle different response structures
  const items = data.items || data || [];
  
  return items.map((item: any, index: number) => ({
    id: item.id ?? item.cart_item_id ?? item.product_id ?? index,
    product_id: item.product_id,
    quantity: item.quantity ?? 1,
    price: item.price ?? 0,
  }));
}

// ---------- Add Item ----------
export async function addToCart(
  userId: string | undefined,
  productId: number,
  quantity: number = 1
): Promise<CartItem> {
  const uid = assertUser(userId);

  let response = await fetch(`${API_URL}/${uid}/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  if (response.status === 404) {
    await createCartForUser(uid);
    response = await fetch(`${API_URL}/${uid}/items`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add item to cart: ${response.status} ${errorText}`);
  }

  const item = await response.json();

  // Handle different response structures
  return {
    id: item.id ?? item.cart_item_id ?? item.product_id ?? productId,
    product_id: item.product_id ?? productId,
    quantity: item.quantity ?? quantity,
    price: item.price ?? 0,
  };
}

// ---------- Update Item ----------
export async function updateCartItem(
  userId: string | undefined,
  itemId: number,
  quantity: number
): Promise<CartItem> {
  const uid = assertUser(userId);

  const cart = await getCart(uid);
  const item = cart.find((i) => i.id === itemId);
  if (!item) {
    throw new Error("Cart item not found");
  }

  let response = await fetch(`${API_URL}/${uid}/items/${item.product_id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ quantity }),
  });

  if (response.status === 404) {
    await createCartForUser(uid);
    response = await fetch(`${API_URL}/${uid}/items/${item.product_id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ quantity }),
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update cart item: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return {
    id: data.id ?? data.cart_item_id ?? data.product_id ?? itemId,
    product_id: data.product_id ?? item.product_id,
    quantity: data.quantity ?? quantity,
    price: data.price ?? item.price ?? 0,
  };
}

// ---------- Remove Item ----------
export async function removeCartItem(userId: string | undefined, productId: number): Promise<void> {
  const uid = assertUser(userId);

  const response = await fetch(`${API_URL}/${uid}/items/${productId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Failed to remove cart item: ${response.status} ${errorText}`);
  }
}
