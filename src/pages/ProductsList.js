import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import ErrorBox from '../components/ErrorBox';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const mockProducts = [
          {
            id: 1,
            name: 'Wireless Headphones',
            description: 'Premium wireless headphones with noise cancellation',
            price: 99.99,
            image: 'https://via.placeholder.com/300x200?text=Headphones',
            stock: 15
          },
          {
            id: 2,
            name: 'Smart Watch',
            description: 'Feature-rich smartwatch with fitness tracking',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200?text=Smart+Watch',
            stock: 8
          },
          {
            id: 3,
            name: 'Laptop Stand',
            description: 'Ergonomic aluminum laptop stand for better posture',
            price: 49.99,
            image: 'https://via.placeholder.com/300x200?text=Laptop+Stand',
            stock: 25
          },
          {
            id: 4,
            name: 'Mechanical Keyboard',
            description: 'RGB mechanical keyboard with cherry switches',
            price: 129.99,
            image: 'https://via.placeholder.com/300x200?text=Keyboard',
            stock: 12
          },
          {
            id: 5,
            name: 'USB-C Hub',
            description: 'Multi-port USB-C hub with HDMI and SD card reader',
            price: 34.99,
            image: 'https://via.placeholder.com/300x200?text=USB+Hub',
            stock: 20
          },
          {
            id: 6,
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse with long battery life',
            price: 29.99,
            image: 'https://via.placeholder.com/300x200?text=Mouse',
            stock: 0
          }
        ];

        setTimeout(() => {
          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  if (loading) {
    return <Spinner text="Loading products..." />;
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="mb-4">Products</h1>
          <div className="input-group mb-4">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && <ErrorBox message={error} />}

      {filteredProducts.length === 0 && !loading ? (
        <div className="row">
          <div className="col text-center py-5">
            <h4>No products found</h4>
            <p className="text-muted">Try adjusting your search terms.</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 col-lg-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsList;
