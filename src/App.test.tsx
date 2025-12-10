import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('./i18n', () => ({
  __esModule: true,
  default: {
    use: jest.fn(() => ({
      init: jest.fn(),
    })),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

jest.mock('./services/firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('./services/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: null, loading: false, auth: {} }),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      items: (state = { list: [], loadingList: false, errorList: null }) => state,
      favorites: (state = { products: [], loading: false, error: null }) => state,
      cart: (state = { items: [], loading: false, error: null }) => state,
    },
  });
};

test('renders app', () => {
  const store = createTestStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(document.body).toBeInTheDocument();
});

