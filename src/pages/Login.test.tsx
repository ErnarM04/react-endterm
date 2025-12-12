import { render, screen } from '@testing-library/react';
import Login from './Login';
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

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({})),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => jest.fn(),
}));

describe('Login', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText('login.title')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('login.placeholders.email')).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('login.placeholders.password')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText('login.button')).toBeInTheDocument();
  });
});

