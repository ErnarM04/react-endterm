import { render, screen } from '@testing-library/react';
import Footer from './Footer';

const mockChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: 'en',
    },
  }),
}));

describe('Footer', () => {
  it('renders footer', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders language selector', () => {
    render(<Footer />);
    const select = screen.getByLabelText('nav.language');
    expect(select).toBeInTheDocument();
  });

  it('renders brand text', () => {
    render(<Footer />);
    expect(screen.getByText('brand')).toBeInTheDocument();
  });
});

