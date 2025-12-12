import { render, screen } from '@testing-library/react';
import Signup from './Signup';
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
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({})),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => jest.fn(),
}));

describe('Signup', () => {
  it('renders signup form', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByText('signup.title')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('signup.placeholders.email')).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('signup.placeholders.password')).toBeInTheDocument();
  });

  it('renders confirm password input', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('signup.placeholders.confirm')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    expect(screen.getByText('signup.button')).toBeInTheDocument();
  });
});

