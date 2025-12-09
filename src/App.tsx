import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetails from "./pages/ProductDetails";
import {BrowserRouter, Routes, Route} from "react-router";
import ProductsList from "./pages/ProductsList";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import {AuthProvider} from "./services/AuthContext";
import ErrorBox from './components/ErrorBox';
import { useTranslation } from 'react-i18next';

function App() {

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { t } = useTranslation();

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            console.log('Back online');
        };

        const handleOffline = () => {
            setIsOnline(false);
            console.log('Gone offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="d-flex flex-column min-vh-100">
                    {!isOnline && (
                        <ErrorBox message={t('offline')} style={{ position: 'sticky', top: 0, zIndex: 1050 }}/>
                    )}
                    <Header />
                    <main className="flex-fill">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductsList />} />
                            <Route path="/products/:id" element={<ProductDetails />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/favorites" element={<Favorites />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );

}

export default App;



