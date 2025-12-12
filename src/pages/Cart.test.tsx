import React from 'react';
import { render, screen } from '@testing-library/react';
import Cart from './Cart';
import { BrowserRouter } from 'react-router';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../services/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
    loading: false,
  }),
}));

jest.mock('../services/cartService', () => ({
  getCart: jest.fn(() => Promise.resolve([])),
  updateCartItem: jest.fn(() => Promise.resolve()),
  removeCartItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../services/ItemsService', () => ({
  getProductById: jest.fn(() => Promise.resolve({
    id: 1,
    name: 'Test Product',
    price: 10.99,
    description: 'Test description',
    thumbnail: 'test.jpg',
  })),
}));

jest.mock('../services/notificationService', () => ({
  notifyCheckout: jest.fn(() => Promise.resolve()),
}));

jest.mock('../components/CartCard', () => {
  return function MockCartCard({ item }: { item: any }) {
    return <div data-testid="cart-card">{item.name}</div>;
  };
});

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
    expect(document.body).toBeInTheDocument();
  });
});

