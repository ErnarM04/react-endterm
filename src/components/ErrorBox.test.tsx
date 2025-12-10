import { render, screen } from '@testing-library/react';
import ErrorBox from './ErrorBox';

describe('ErrorBox', () => {
  it('renders error message', () => {
    const message = 'Test error message';
    render(<ErrorBox message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders with custom style', () => {
    const message = 'Test error';
    const customStyle = { color: 'red' };
    const { container } = render(<ErrorBox message={message} style={customStyle} />);
    const alert = container.querySelector('.alert');
    expect(alert).toHaveStyle('color: red');
  });

  it('has alert role', () => {
    const message = 'Test error';
    render(<ErrorBox message={message} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

