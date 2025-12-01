import React from 'react';
import { useNavigate } from 'react-router';

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        className="card-img-top"
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name || 'Product Name'}</h5>
        <p className="card-text text-muted flex-grow-1">
          {product.description || 'No description available'}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-primary fs-6">
            ${product.price?.toFixed(2) || '0.00'}
          </span>
          {product.stock !== undefined && (
            <span className={`badge bg-${product.stock > 0 ? 'success' : 'danger'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>
        <a
          href={`/products/${product.id}`}
          className="btn btn-primary w-100"
          onClick={handleViewDetails}
        >
          View Details
        </a>
      </div>
    </div>
  );
}

export default ProductCard;
