import React from 'react';
import { CartItem } from '../types';

interface CartCardProps {
  item: CartItem;
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

function CartCard({ item, onQuantityChange, onRemove }: CartCardProps): React.JSX.Element {
  const handleIncrement = (): void => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleDecrement = (): void => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  const handleRemove = (): void => {
    onRemove(item.id);
  };

  const totalPrice = (item.price || 0) * (item.quantity || 1);

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-3">
            <img
              src={item.image || 'https://via.placeholder.com/150x150?text=No+Image'}
              alt={item.name || 'Product'}
              className="img-fluid"
              style={{ height: '150px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
          <div className="col-md-5">
            <h5 className="card-title">{item.name || 'Product Name'}</h5>
            <p className="card-text text-muted">
              {item.description || 'No description available'}
            </p>
            <span className="badge bg-primary fs-6">
              ${item.price?.toFixed(2) || '0.00'} each
            </span>
          </div>
          <div className="col-md-2">
            <div className="d-flex align-items-center justify-content-center">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="mx-3 fs-5">{item.quantity || 1}</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>
          <div className="col-md-2 text-end">
            <div className="mb-2">
              <strong className="fs-5">${totalPrice.toFixed(2)}</strong>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartCard;

