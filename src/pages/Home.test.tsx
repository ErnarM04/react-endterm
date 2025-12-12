import { render, screen } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter } from 'react-router';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Home', () => {
  it('renders home page', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText('home.title')).toBeInTheDocument();
  });

  it('renders tagline and description', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    expect(screen.getByText(/home.tagline/)).toBeInTheDocument();
  });
});

