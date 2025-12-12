const API_BASE_URL = "https://fastapi-endterm.onrender.com/favorites";
const LOCAL_STORAGE_KEY = 'favorites';

export interface FavoriteItem {
  id?: number;
  product_id: number;
  created_at?: string;
  added_at?: string;
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

function getLocalStorageFavorites(): number[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalStorageFavorites(productIds: number[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(productIds));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
}

function addToLocalStorageFavorites(productId: number): void {
  const favorites = getLocalStorageFavorites();
  if (!favorites.includes(productId)) {
    favorites.push(productId);
    setLocalStorageFavorites(favorites);
  }
}

function removeFromLocalStorageFavorites(productId: number): void {
  const favorites = getLocalStorageFavorites();
  const filtered = favorites.filter((id) => id !== productId);
  setLocalStorageFavorites(filtered);
}

async function getAPIFavorites(userId: string): Promise<FavoriteItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error(`Favorites API error (${response.status}):`, await response.text());
      throw new Error(`Failed to fetch favorites: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    let favorites: any[] = [];
    if (Array.isArray(data)) {
      favorites = data;
    } else if (data.items && Array.isArray(data.items)) {
      favorites = data.items;
    } else if (data.favorites && Array.isArray(data.favorites)) {
      favorites = data.favorites;
    } else if (data && typeof data === 'object') {
      favorites = [data];
    }
    
    const normalized = favorites.map((item: any) => {
      const productId = item.product_id || item.productId || item.id;
      return {
        id: item.id,
        product_id: productId,
        created_at: item.created_at,
        added_at: item.added_at || item.created_at,
      };
    }).filter((item: any) => item.product_id !== undefined && item.product_id !== null);
    
    return normalized;
  } catch (error) {
    console.error('Error fetching favorites from API:', error);
    throw error;
  }
}

async function addToAPIFavorites(userId: string, productId: number): Promise<FavoriteItem> {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/${productId}`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to add favorite: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error adding favorite to API:', error);
    throw error;
  }
}

async function removeFromAPIFavorites(userId: string, productId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to remove favorite: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error removing favorite from API:', error);
    throw error;
  }
}

async function checkIsFavoriteInAPI(userId: string, productId: number): Promise<boolean> {
  try {
    const favorites = await getAPIFavorites(userId);
    return favorites.some((fav) => fav.product_id === productId);
  } catch {
    return false;
  }
}

export async function syncLocalStorageToAPI(userId: string): Promise<void> {
  try {
    const localFavorites = getLocalStorageFavorites();
    if (localFavorites.length === 0) return;

    const apiFavorites = await getAPIFavorites(userId);
    const apiProductIds = new Set(apiFavorites.map((fav) => fav.product_id));

    const promises = localFavorites
      .filter((productId) => !apiProductIds.has(productId))
      .map((productId) => addToAPIFavorites(userId, productId));
    
    await Promise.all(promises);

    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('Error syncing favorites to API:', error);
    throw error;
  }
}

export async function getFavorites(userId: string | null): Promise<FavoriteItem[]> {
  if (userId) {
    return await getAPIFavorites(userId);
  } else {
    const productIds = getLocalStorageFavorites();
    return productIds.map((id) => ({
      product_id: id,
      added_at: new Date().toISOString(),
    }));
  }
}

export async function addToFavorites(userId: string | null, productId: number): Promise<void> {
  if (userId) {
    await addToAPIFavorites(userId, productId);
  } else {
    addToLocalStorageFavorites(productId);
  }
}

export async function removeFromFavorites(userId: string | null, productId: number): Promise<void> {
  if (userId) {
    await removeFromAPIFavorites(userId, productId);
  } else {
    removeFromLocalStorageFavorites(productId);
  }
}

export async function checkIsFavorite(userId: string | null, productId: number): Promise<boolean> {
  if (userId) {
    return await checkIsFavoriteInAPI(userId, productId);
  } else {
    const favorites = getLocalStorageFavorites();
    return favorites.includes(productId);
  }
}
