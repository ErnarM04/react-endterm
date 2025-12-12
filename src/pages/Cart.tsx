import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CartCard from '../components/CartCard';
import ErrorBox from '../components/ErrorBox';
import Spinner from '../components/Spinner';
import { getCart, updateCartItem, removeCartItem } from '../services/cartService';
import { getProductById, Product } from '../services/ItemsService';
import { CartItem } from '../types';
import { useAuth } from '../services/AuthContext';
import { notifyCheckout } from '../services/notificationService';
import { useTranslation } from 'react-i18next';

function Cart(): React.JSX.Element {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!user) {
      setLoading(false);
      setError(null);
      return;
    }

    const fetchCart = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const cartData = await getCart(user.uid);
        
        const itemsWithProducts = await Promise.all(
          cartData.map(async (item: CartItem) => {
            try {
              const product: Product = await getProductById(item.product_id.toString());
              return {
                ...item,
                product: product,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.thumbnail || (product.images ? product.images.split(',')[0].trim() : ''),
              };
            } catch (err) {
              console.error(`Failed to fetch product ${item.product_id}:`, err);
              return {
                ...item,
                name: `Product ${item.product_id}`,
                description: 'Product details unavailable',
                price: 0,
                image: '',
              };
            }
          })
        );
        setCartItems(itemsWithProducts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load cart. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, authLoading]);

  const handleQuantityChange = async (itemId: number, newQuantity: number): Promise<void> => {
    try {
      await updateCartItem(user?.uid, itemId, newQuantity);
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quantity';
      setError(errorMessage);
    }
  };

  const handleRemove = async (itemId: number): Promise<void> => {
    try {
      const item = cartItems.find((i) => i.id === itemId);
      if (!item) {
        throw new Error('Item not found in cart');
      }
      await removeCartItem(user?.uid, item.product_id);
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      setError(errorMessage);
    }
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + (itemPrice * (item.quantity || 1));
    }, 0);
  };

  const calculateTax = (): number => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = async (): Promise<void> => {
    if (cartItems.length === 0) {
      return;
    }
    
    const total = calculateTotal();
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    await notifyCheckout(total, itemCount);
    
    alert(t('cart.checkoutAlert', { count: itemCount, plural: itemCount > 1 ? 's' : '', total: total.toFixed(2) }));
  };

  if (authLoading || loading) {
    return <div className="d-flex mt-5 justify-content-center align-items-center"><Spinner /></div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col text-center py-5">
            <h2>{t('cart.emptyTitle')}</h2>
            <p className="text-muted mb-4">{t('cart.emptySubtitle')}</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}
              style={{ backgroundColor: "#2A3A47", color: "#FFFFFF", border: 0 }}>
              {t('cart.browse')}
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
          <h1 className="mb-4">{t('cart.title')}</h1>
        </div>
      </div>

      {error && <ErrorBox message={error} />}

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
              <h4>{t('cart.summary')}</h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>{t('cart.subtotal')}</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>{t('cart.tax')}</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>{t('cart.total')}</strong>
                <strong className="fs-5">${calculateTotal().toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleCheckout}
                style={{backgroundColor: "#5D8A6A", border: 0}}
                
              >
                {t('cart.checkout')}
              </button>
              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate('/products')}
              >
                {t('cart.continue')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

