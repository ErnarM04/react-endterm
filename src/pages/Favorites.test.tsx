import React from 'react';
import { render, screen } from '@testing-library/react';
import Favorites from './Favorites';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../services/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
  }),
}));

jest.mock('./ProductCard', () => {
  return function MockProductCard({ product }: { product: any }) {
    return <div data-testid="product-card">{product.name}</div>;
  };
});

const createTestStore = () => {
  return configureStore({
    reducer: {
      favorites: (state = { products: [], loading: false, error: null }) => state,
    },
  });
};

describe('Favorites', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it('renders favorites page', () => {
    renderWithProviders(<Favorites />);
    expect(screen.getByText('favorites.title')).toBeInTheDocument();
  });

  it('renders empty state when no favorites', () => {
    renderWithProviders(<Favorites />);
    expect(screen.getByText('favorites.emptyTitle')).toBeInTheDocument();
  });
});

