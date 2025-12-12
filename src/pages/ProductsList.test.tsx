import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductsList from './ProductsList';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
      if (params) {
        return `${key} ${JSON.stringify(params)}`;
      }
      return key;
    },
  }),
}));

jest.mock('./ProductCard', () => {
  return function MockProductCard({ product }: { product: any }) {
    return <div data-testid="product-card">{product.name}</div>;
  };
});

jest.mock('../hooks/useDebounce', () => ({
  useDebounce: (value: string) => value,
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      items: (state = {
        list: [],
        loadingList: false,
        errorList: null,
        query: '',
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10,
      }) => state,
    },
  });
};

describe('ProductsList', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it('renders products list page', () => {
    renderWithProviders(<ProductsList />);
    expect(screen.getByPlaceholderText('search.placeholder')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderWithProviders(<ProductsList />);
    expect(screen.getByPlaceholderText('search.placeholder')).toBeInTheDocument();
  });

  it('renders clear button', () => {
    renderWithProviders(<ProductsList />);
    expect(screen.getByText('search.clear')).toBeInTheDocument();
  });
});

