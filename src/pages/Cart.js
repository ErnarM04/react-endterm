import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import CartCard from '../components/CartCard';
import ErrorBox from '../components/ErrorBox';

function Cart() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'Premium wireless headphones with noise cancellation',
      price: 99.99,
      quantity: 2,
      image: 'https://via.placeholder.com/150x150?text=Headphones'
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Feature-rich smartwatch with fitness tracking',
      price: 199.99,
      quantity: 1,
      image: 'https://via.placeholder.com/150x150?text=Smart+Watch'
    }
  ]);

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemove = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (!currentUser) {
      // Redirect to login page if user is not authenticated
      navigate('/login');
      return;
    }
    // Proceed with checkout if user is logged in
    alert('Redirecting to checkout...');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col text-center py-5">
            <h2>Your cart is empty</h2>
            <p className="text-muted mb-4">Add some products to get started!</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col">
          <h1 className="mb-4">Shopping Cart</h1>
        </div>
      </div>

      {!currentUser && (
        <div className="row mb-3">
          <div className="col">
            <div className="alert alert-warning" role="alert">
              <strong>Please login to checkout.</strong> You need to be logged in to complete your purchase.
              <a href="/login" className="alert-link ms-2" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                Login here
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          {cartItems.map((item) => (
            <CartCard
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
        <div className="col-md-4">
          <div className="card sticky-top" style={{ top: '100px' }}>
            <div className="card-header">
              <h4>Order Summary</h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total:</strong>
                <strong className="fs-5">${calculateTotal().toFixed(2)}</strong>
              </div>
              <button
                className={`btn btn-lg w-100 ${currentUser ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleCheckout}
                disabled={!currentUser}
                title={!currentUser ? 'Please login to checkout' : ''}
              >
                {currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
