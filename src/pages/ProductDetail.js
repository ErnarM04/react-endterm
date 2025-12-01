import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const mockProducts = [
          {
            id: 1,
            name: 'Wireless Headphones',
            description: 'Premium wireless headphones with noise cancellation technology. Perfect for music lovers and professionals who need to focus. Features include long battery life, comfortable ear cushions, and superior sound quality.',
            price: 99.99,
            image: 'https://via.placeholder.com/600x400?text=Headphones',
            stock: 15,
            category: 'Electronics',
            brand: 'TechAudio'
          },
          {
            id: 2,
            name: 'Smart Watch',
            description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and smartphone notifications. Water-resistant design perfect for active lifestyles.',
            price: 199.99,
            image: 'https://via.placeholder.com/600x400?text=Smart+Watch',
            stock: 8,
            category: 'Wearables',
            brand: 'SmartWear'
          },
          {
            id: 3,
            name: 'Laptop Stand',
            description: 'Ergonomic aluminum laptop stand for better posture. Adjustable height and angle to find your perfect viewing position. Compatible with all laptop sizes.',
            price: 49.99,
            image: 'https://via.placeholder.com/600x400?text=Laptop+Stand',
            stock: 25,
            category: 'Accessories',
            brand: 'ErgoDesk'
          },
          {
            id: 4,
            name: 'Mechanical Keyboard',
            description: 'RGB mechanical keyboard with cherry switches. Tactile feedback and customizable RGB lighting. Perfect for gaming and typing.',
            price: 129.99,
            image: 'https://via.placeholder.com/600x400?text=Keyboard',
            stock: 12,
            category: 'Gaming',
            brand: 'GameTech'
          },
          {
            id: 5,
            name: 'USB-C Hub',
            description: 'Multi-port USB-C hub with HDMI output and SD card reader. Expand your laptop connectivity with multiple ports in one compact device.',
            price: 34.99,
            image: 'https://via.placeholder.com/600x400?text=USB+Hub',
            stock: 20,
            category: 'Accessories',
            brand: 'ConnectPro'
          },
          {
            id: 6,
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse with long battery life. Precision tracking and comfortable design for extended use.',
            price: 29.99,
            image: 'https://via.placeholder.com/600x400?text=Mouse',
            stock: 0,
            category: 'Accessories',
            brand: 'ClickTech'
          }
        ];

        const foundProduct = mockProducts.find(p => p.id === parseInt(id));

        setTimeout(() => {
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError('Product not found');
          }
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleIncrement = () => {
    if (quantity < (product?.stock || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Spinner text="Loading product details..." />;
  }

  if (error || !product) {
    return (
      <div className="container my-5">
        <ErrorBox message={error || 'Product not found'} />
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  const totalPrice = product.price * quantity;

  return (
    <div className="container my-5">
      <button className="btn btn-outline-secondary mb-4" onClick={handleBack}>
        ← Back
      </button>

      {addedToCart && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Product added to cart successfully!
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setAddedToCart(false)}
          ></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <img
              src={product.image}
              className="card-img-top"
              alt={product.name}
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          {product.brand && (
            <p className="text-muted mb-2">Brand: {product.brand}</p>
          )}
          {product.category && (
            <span className="badge bg-secondary mb-3">{product.category}</span>
          )}

          <div className="mb-4">
            <h3 className="text-primary">${product.price.toFixed(2)}</h3>
            <span className={`badge bg-${product.stock > 0 ? 'success' : 'danger'} ms-2`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="mb-4">{product.description}</p>

          {product.stock > 0 && (
            <>
              <div className="mb-4">
                <label className="me-3">Quantity:</label>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="mx-3 fs-5">{quantity}</span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <div className="mb-4">
                <h5>Total: ${totalPrice.toFixed(2)}</h5>
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="btn btn-outline-primary btn-lg">
                  Buy Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
