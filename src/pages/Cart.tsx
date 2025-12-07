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

function Cart(): React.JSX.Element {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        const cartData = await getCart();
        
        // Fetch product details for each cart item
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
      await updateCartItem(itemId, newQuantity);
      // Update local state
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
      await removeCartItem(item.product_id);
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
    
    const subtotal = calculateSubtotal();
    const total = calculateTotal();
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Show checkout notification
    await notifyCheckout(total, itemCount);
    
    // Proceed with checkout (you can add actual checkout logic here)
    alert(`Proceeding to checkout with ${itemCount} item${itemCount > 1 ? 's' : ''} (Total: $${total.toFixed(2)})`);
  };

  if (authLoading || loading) {
    return <Spinner />;
  }

  if (!user) {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col text-center py-5">
            <h2>Please Log In</h2>
            <p className="text-muted mb-4">You must be logged in to view your cart.</p>
            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Log In
              </button>
              <button className="btn btn-outline-primary" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                className="btn btn-primary btn-lg w-100"
                onClick={handleCheckout}
              >
                Proceed to Checkout
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

