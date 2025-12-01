import React from 'react';
import { Router, Routes, Route } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import ProductsList from './pages/ProductsList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

// Create browser router using react-router's API
function BrowserRouter({ children }) {
  const [location, setLocation] = React.useState({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: null,
    key: 'default'
  });

  React.useEffect(() => {
    const handlePopState = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        state: window.history.state,
        key: 'default'
      });
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Listen for custom navigation events
    const handleRouteChange = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        state: window.history.state,
        key: 'default'
      });
    };
    
    window.addEventListener('routechange', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('routechange', handleRouteChange);
    };
  }, []);

  const navigator = React.useMemo(() => ({
    push: (to, state) => {
      const path = typeof to === 'string' ? to : to.pathname + (to.search || '') + (to.hash || '');
      window.history.pushState(state || {}, '', path);
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        state: state || null,
        key: 'default'
      });
      window.dispatchEvent(new Event('routechange'));
    },
    replace: (to, state) => {
      const path = typeof to === 'string' ? to : to.pathname + (to.search || '') + (to.hash || '');
      window.history.replaceState(state || {}, '', path);
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        state: state || null,
        key: 'default'
      });
      window.dispatchEvent(new Event('routechange'));
    },
    go: (delta) => {
      window.history.go(delta);
    },
    createHref: (to) => {
      return typeof to === 'string' ? to : to.pathname + (to.search || '') + (to.hash || '');
    }
  }), []);

  return (
    <Router location={location} navigator={navigator}>
      {children}
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
