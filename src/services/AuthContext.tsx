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
            if (currentUser && currentUser.uid !== prevUserIdRef.current) {
                try {
                    await syncLocalStorageToAPI(currentUser.uid);
                    dispatch(fetchFavorites(currentUser.uid));
                    dispatch(fetchCart(currentUser.uid));
                } catch (error) {
                    console.error('Error syncing favorites on login:', error);
                }
                prevUserIdRef.current = currentUser.uid;
            }
            if (!currentUser) {
                prevUserIdRef.current = null;
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



