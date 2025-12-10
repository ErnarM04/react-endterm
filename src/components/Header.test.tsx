import { render, screen } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter } from 'react-router';

jest.mock('../services/firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../services/AuthContext', () => ({
  useAuth: () => ({
    user: null,
  }),
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
  auth: {},
}));

// Mock react-router hooks
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => jest.fn(),
}));

describe('Header', () => {
  it('renders header', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  it('renders brand link', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('brand')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(screen.getByText('nav.home')).toBeInTheDocument();
    expect(screen.getByText('nav.products')).toBeInTheDocument();
    expect(screen.getByText(/nav\.cart/)).toBeInTheDocument();
    expect(screen.getByText('nav.favorites')).toBeInTheDocument();
  });
});

