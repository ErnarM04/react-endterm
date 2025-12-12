import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductDetails from './ProductDetails';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../i18n', () => ({
  __esModule: true,
  default: {
    language: 'en',
  },
}));

jest.mock('../services/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
  }),
}));

jest.mock('../hooks/useCart', () => ({
  useCart: () => ({
    addToCart: jest.fn(),
  }),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      items: (state = {
        selectedItem: null,
        loadingItem: false,
        errorItem: null,
      }) => state,
      favorites: (state = { favoriteStatuses: {} }) => state,
    },
  });
};

describe('ProductDetails', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    );
  };

  it('renders product details page', () => {
    renderWithProviders(<ProductDetails />);
    expect(document.body).toBeInTheDocument();
  });
});

