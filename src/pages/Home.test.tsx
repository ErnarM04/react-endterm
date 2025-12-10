import { render, screen } from '@testing-library/react';
import Home from './Home';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Home', () => {
  it('renders home page', () => {
    render(<Home />);
    expect(screen.getByText('home.title')).toBeInTheDocument();
  });

  it('renders tagline and description', () => {
    render(<Home />);
    expect(screen.getByText(/home.tagline/)).toBeInTheDocument();
  });
});

