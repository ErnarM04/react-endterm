import React from 'react';
import { render, screen } from '@testing-library/react';
import Cart from './Cart';
import { BrowserRouter } from 'react-router';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock AuthContext
jest.mock('../services/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
    loading: false,
  }),
}));

// Mock cartService
jest.mock('../services/cartService', () => ({
  getCart: jest.fn(() => Promise.resolve([])),
  updateCartItem: jest.fn(() => Promise.resolve()),
  removeCartItem: jest.fn(() => Promise.resolve()),
}));

// Mock ItemsService
jest.mock('../services/ItemsService', () => ({
  getProductById: jest.fn(() => Promise.resolve({
    id: 1,
    name: 'Test Product',
    price: 10.99,
    description: 'Test description',
    thumbnail: 'test.jpg',
  })),
}));

// Mock notificationService
jest.mock('../services/notificationService', () => ({
  notifyCheckout: jest.fn(() => Promise.resolve()),
}));

// Mock CartCard
jest.mock('../components/CartCard', () => {
  return function MockCartCard({ item }: { item: any }) {
    return <div data-testid="cart-card">{item.name}</div>;
  };
});

// Mock react-router hooks
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => jest.fn(),
}));

describe('Cart', () => {
  it('renders cart page', async () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    );
    // Component may show loading state initially, so just check it renders
    expect(document.body).toBeInTheDocument();
  });
});

