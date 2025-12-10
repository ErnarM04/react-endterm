import {configureStore} from "@reduxjs/toolkit";
import itemsReducer from "../features/items/itemsSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
    reducer: {
        items: itemsReducer,
        favorites: favoritesReducer,
        cart: cartReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



