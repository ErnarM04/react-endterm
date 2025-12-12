import { render, screen } from '@testing-library/react';
import LoadingSpinner, { ImageSkeleton } from './Spinner';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('LoadingSpinner', () => {
  it('renders spinner', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });
});

describe('ImageSkeleton', () => {
  it('renders with default props', () => {
    const { container } = render(<ImageSkeleton />);
    const skeleton = container.firstChild;
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with custom width and height', () => {
    const { container } = render(<ImageSkeleton width="200px" height="300px" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ width: '200px', height: '300px' });
  });

  it('renders with custom className', () => {
    const { container } = render(<ImageSkeleton className="custom-class" />);
    const skeleton = container.firstChild;
    expect(skeleton).toHaveClass('custom-class');
  });
});

