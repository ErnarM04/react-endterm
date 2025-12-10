import { render, screen, waitFor, act } from '@testing-library/react';
import NotificationPermission from './NotificationPermission';

jest.mock('../i18n', () => ({
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
  }),
}));

const mockRequestPermission = jest.fn(() => Promise.resolve('granted'));
Object.defineProperty(window, 'Notification', {
  writable: true,
  value: {
    permission: 'default',
    requestPermission: mockRequestPermission,
  },
  configurable: true,
});

Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    ready: Promise.resolve({
      showNotification: jest.fn(),
    }),
  },
  configurable: true,
});

const mockIsNotificationSupported = jest.fn(() => true);
const mockGetNotificationPermission = jest.fn(() => 'default');
const mockRequestNotificationPermission = jest.fn(() => Promise.resolve('granted'));

jest.mock('../services/notificationService', () => ({
  isNotificationSupported: () => mockIsNotificationSupported(),
  getNotificationPermission: () => mockGetNotificationPermission(),
  requestNotificationPermission: () => mockRequestNotificationPermission(),
}));

describe('NotificationPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsNotificationSupported.mockReturnValue(true);
    mockGetNotificationPermission.mockReturnValue('default');
    (window.Notification as any).permission = 'default';
  });

  it('renders notification permission card', async () => {
    await act(async () => {
      render(<NotificationPermission />);
    });
    await waitFor(() => {
      expect(screen.getByText('notifications.card.title')).toBeInTheDocument();
    });
  });

  it('renders request button', async () => {
    await act(async () => {
      render(<NotificationPermission />);
    });
    await waitFor(() => {
      expect(screen.getByText('notifications.card.action')).toBeInTheDocument();
    });
  });

  it('renders as banner when showAsBanner is true', async () => {
    await act(async () => {
      render(<NotificationPermission showAsBanner={true} />);
    });
    await waitFor(() => {
      expect(screen.getByText('notifications.prompt.title')).toBeInTheDocument();
    });
  });
});

