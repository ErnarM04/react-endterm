import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../services/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../services/store';
import { fetchFavorites, removeFavorite } from '../features/favorites/favoritesSlice';
import ProductCard from './ProductCard';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';

function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.favorites);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.uid));
    } else {
      dispatch(fetchFavorites(null));
    }
  }, [user, dispatch]);

  const handleRemove = async (productId: number) => {
    dispatch(removeFavorite({ userId: user?.uid || null, productId }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="mb-3">My Favorites</h1>
          {!user && (
            <p className="text-muted">
              Your favorites are saved locally. <a href="/login">Login</a> to sync them across devices.
            </p>
          )}
        </div>
      </div>

      {error && <ErrorBox message={error} />}

      {products.length === 0 ? (
        <div className="text-center py-5">
          <h3>No favorites yet</h3>
          <p className="text-muted mb-4">Start adding products to your favorites!</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-4 justify-content-center">
          {products.map((product) => (
            <div key={product.id} className="position-relative" style={{ maxWidth: '20em' }}>
              <ProductCard product={product} />
              <button
                className="btn btn-danger btn-sm position-absolute"
                style={{ top: '10px', right: '10px', zIndex: 10 }}
                onClick={() => handleRemove(product.id)}
                title="Remove from favorites"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
