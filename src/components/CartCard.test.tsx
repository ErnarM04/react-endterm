import React from 'react';
import { render, screen } from '@testing-library/react';
import CartCard from './CartCard';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

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
  }),
}));

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      favorites: (state = { favoriteStatuses: {} }) => state,
    },
  });
};

const mockItem = {
  id: 1,
  product_id: 1,
  name: 'Test Product',
  price: 10.99,
  quantity: 2,
  description: 'Test description',
  image: 'https://example.com/image.jpg',
};

describe('CartCard', () => {
  const mockOnQuantityChange = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it('renders cart card', () => {
    renderWithProviders(
      <CartCard
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product name', () => {
    renderWithProviders(
      <CartCard
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    renderWithProviders(
      <CartCard
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );
    // The price is split across text nodes: $ (node1) 10.99 (node2) space cartCard.each
    // getByText with string requires exact match in single node, regex can match across nodes
    expect(screen.getByText(/10\.99/)).toBeInTheDocument();
  });

  it('renders quantity', () => {
    renderWithProviders(
      <CartCard
        item={mockItem}
        onQuantityChange={mockOnQuantityChange}
        onRemove={mockOnRemove}
      />
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

