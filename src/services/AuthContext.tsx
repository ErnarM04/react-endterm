import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import { auth } from "./firebase";
import { syncLocalStorageToAPI } from "./favoritesService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { fetchFavorites, clearFavorites } from "../features/favorites/favoritesSlice";
import { fetchCart, clearCart } from "../features/cart/cartSlice";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    auth: typeof auth;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within <AuthProvider>");
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const prevUserIdRef = useRef<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        return onAuthStateChanged(auth, async (currentUser) => {
            // Sync favorites from localStorage to API when user logs in
            if (currentUser && currentUser.uid !== prevUserIdRef.current) {
                try {
                    await syncLocalStorageToAPI(currentUser.uid);
                    // Fetch favorites and cart after sync
                    dispatch(fetchFavorites(currentUser.uid));
                    dispatch(fetchCart());
                } catch (error) {
                    console.error('Error syncing favorites on login:', error);
                }
                prevUserIdRef.current = currentUser.uid;
            }
            if (!currentUser) {
                prevUserIdRef.current = null;
                // Clear Redux state when user logs out
                dispatch(clearFavorites());
                dispatch(clearCart());
            }
            setUser(currentUser || null);
            setLoading(false);
        })
    }, [dispatch])

    return (
        <AuthContext.Provider value={{ user, loading, auth }}>
            {children}
        </AuthContext.Provider>
    );
}



