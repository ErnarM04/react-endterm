import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { AuthProvider } from './services/AuthContext';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
}));

export const createTestStore = () => {
  return configureStore({
    reducer: {
    },
  });
};

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    store = createTestStore(),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    );
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

