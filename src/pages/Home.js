import React from 'react';
import { useNavigate } from 'react-router';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-0">
      <div
        className="bg-primary text-white py-5 mb-5"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container">
          <div className="row text-center">
            <div className="col">
              <h1 className="display-4 mb-4">Welcome to Product Store</h1>
              <p className="lead mb-4">
                Discover amazing products at unbeatable prices.
                Shop the latest trends and find everything you need in one place.
              </p>
              <button className="btn btn-light btn-lg me-3" onClick={() => navigate('/products')}>
                Browse Products
              </button>
              <button className="btn btn-outline-light btn-lg" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row text-center mb-5">
          <div className="col">
            <h2 className="mb-4">Why Choose Us?</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: '3rem', color: '#667eea' }}>🚚</span>
              </div>
              <h4>Fast Delivery</h4>
              <p className="text-muted">
                Get your orders delivered quickly and safely to your doorstep.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: '3rem', color: '#667eea' }}>🛡️</span>
              </div>
              <h4>Secure Shopping</h4>
              <p className="text-muted">
                Your data and payments are protected with the highest security standards.
              </p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="text-center p-4">
              <div className="mb-3">
                <span style={{ fontSize: '3rem', color: '#667eea' }}>⭐</span>
              </div>
              <h4>Quality Products</h4>
              <p className="text-muted">
                We offer only the best quality products from trusted suppliers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
