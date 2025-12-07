import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetails from "./pages/ProductDetails";
import {BrowserRouter, Routes, Route} from "react-router";
import About from "./pages/About";
import ProductsList from "./pages/ProductsList";
import Header from "./components/Header";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import {AuthProvider} from "./services/AuthContext";
import ErrorBox from './components/ErrorBox';

function App() {

    const [isOnline, setIsOnline] = useState(navigator.onLine);

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
                {!isOnline && (
                    <ErrorBox message={"You are offline. Showing cached data."} style={{ position: 'sticky', top: 0, zIndex: 1050 }}/>
                        
                )}
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<ProductsList />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );

}

export default App;



