import React from 'react';
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
import Offline from "./pages/Offline";
import {AuthProvider} from "./services/AuthContext";
import OfflineBanner from './components/OfflineBanner';
import { useOnlineStatus } from './hooks/useOnlineStatus';

function App() {
    const { isOnline } = useOnlineStatus();

    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="d-flex flex-column min-vh-100">
                    {!isOnline && <OfflineBanner />}
                    <Header />
                    <main className="flex-fill" style={{ backgroundColor: "#F5F6F7" }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<ProductsList />} />
                            <Route path="/products/:id" element={<ProductDetails />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/offline" element={<Offline />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );

}

export default App;



