import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setSigningOut(true);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <a href="/" className="navbar-brand" onClick={(e) => handleLinkClick(e, '/')}>
          Product Store
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="basic-navbar-nav"
          aria-expanded={isMenuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="basic-navbar-nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a href="/" className="nav-link" onClick={(e) => handleLinkClick(e, '/')}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/products" className="nav-link" onClick={(e) => handleLinkClick(e, '/products')}>
                Products
              </a>
            </li>
            <li className="nav-item">
              <a href="/cart" className="nav-link" onClick={(e) => handleLinkClick(e, '/cart')}>
                Cart
              </a>
            </li>
          </ul>
          <ul className="navbar-nav">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <a href="/profile" className="nav-link" onClick={(e) => handleLinkClick(e, '/profile')}>
                    Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/logout" className="nav-link" onClick={handleLogout}>
                    {signingOut ? 'Logging out...' : 'Logout'}
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={(e) => handleLinkClick(e, '/login')}>
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a href="/signup" className="nav-link" onClick={(e) => handleLinkClick(e, '/signup')}>
                    Sign Up
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
