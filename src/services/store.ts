import {configureStore} from "@reduxjs/toolkit";
import itemsReducer from "../features/items/itemsSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import profileReducer from "../features/profile/profileSlice";

export const store = configureStore({
    reducer: {
        items: itemsReducer,
        favorites: favoritesReducer,
        profile: profileReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



