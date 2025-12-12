import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getFavorites, addToFavorites, removeFromFavorites, checkIsFavorite, FavoriteItem } from "../../services/favoritesService";
import { Product } from "../../services/ItemsService";
import { getProductById } from "../../services/ItemsService";

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId: string | null, thunkAPI) => {
    try {
      const favoriteItems = await getFavorites(userId);
      console.log('Fetched favorite items:', favoriteItems);
      
      const validFavorites = favoriteItems.filter((item) => {
        if (!item || item.product_id === undefined || item.product_id === null) {
          console.warn('Invalid favorite item (missing product_id):', item);
          return false;
        }
        return true;
      });
      
      const productsWithDetails = await Promise.all(
        validFavorites.map(async (item) => {
          try {
            if (!item.product_id) {
              console.error('Item missing product_id:', item);
              return null;
            }
            const product = await getProductById(item.product_id.toString());
            return product;
          } catch (err) {
            console.error(`Failed to fetch product ${item.product_id}:`, err);
            return null;
          }
        })
      );

      return {
        favorites: validFavorites,
        products: productsWithDetails.filter((p): p is Product => p !== null),
      };
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async ({ userId, productId }: { userId: string | null; productId: number }, thunkAPI) => {
    try {
      await addToFavorites(userId, productId);
      const product = await getProductById(productId.toString());
      return product;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async ({ userId, productId }: { userId: string | null; productId: number }, thunkAPI) => {
    try {
      await removeFromFavorites(userId, productId);
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const checkFavoriteStatus = createAsyncThunk(
  'favorites/checkFavoriteStatus',
  async ({ userId, productId }: { userId: string | null; productId: number }, thunkAPI) => {
    try {
      const isFavorite = await checkIsFavorite(userId, productId);
      return { productId, isFavorite };
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

interface FavoritesState {
  favorites: FavoriteItem[];
  products: Product[];
  favoriteStatuses: Record<number, boolean>; // productId -> isFavorite
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  products: [],
  favoriteStatuses: {},
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavoriteStatus: (state, action: PayloadAction<{ productId: number; isFavorite: boolean }>) => {
      state.favoriteStatuses[action.payload.productId] = action.payload.isFavorite;
    },
    clearFavorites: (state) => {
      state.favorites = [];
      state.products = [];
      state.favoriteStatuses = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
        state.products = action.payload.products;
        state.loading = false;
        state.error = null;
        action.payload.favorites.forEach((fav) => {
          state.favoriteStatuses[fav.product_id] = true;
        });
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (action.payload) {
          state.products.push(action.payload);
          state.favoriteStatuses[action.payload.id] = true;
          state.favorites.push({
            product_id: action.payload.id,
            added_at: new Date().toISOString(),
          });
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const productId = action.payload;
        state.products = state.products.filter((p) => p.id !== productId);
        state.favorites = state.favorites.filter((f) => f.product_id !== productId);
        state.favoriteStatuses[productId] = false;
      })
      .addCase(checkFavoriteStatus.fulfilled, (state, action) => {
        state.favoriteStatuses[action.payload.productId] = action.payload.isFavorite;
      });
  },
});

export const { setFavoriteStatus, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

