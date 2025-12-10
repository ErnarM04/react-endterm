import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../services/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../services/store';
import { fetchFavorites, removeFavorite } from '../features/favorites/favoritesSlice';
import ProductCard from './ProductCard';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next';

function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.favorites);
  const { t } = useTranslation();

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
          <h1 className="mb-3">{t('favorites.title')}</h1>
          {!user && (
            <p className="text-muted">
              {t('favorites.syncHint')} <a href="/login">{t('nav.login')}</a>
            </p>
          )}
        </div>
      </div>

      {error && <ErrorBox message={error} />}

      {products.length === 0 ? (
        <div className="text-center py-5">
          <h3>{t('favorites.emptyTitle')}</h3>
          <p className="text-muted mb-4">{t('favorites.emptySubtitle')}</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}
            style={{ backgroundColor: "#2A3A47", color: "#FFFFFF", border: 0 }}>
            {t('favorites.browse')}
          </button>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-4 justify-content-center">
          {products.map((product) => (
            <div key={product.id} className="position-relative" style={{ width: '20em', height: '100%' }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
