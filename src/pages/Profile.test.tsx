import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from './Profile';
import { BrowserRouter } from 'react-router';
import { getUserProfile } from '../services/profileService';

jest.mock('../i18n', () => ({
  __esModule: true,
  default: {
    use: jest.fn(() => ({
      init: jest.fn(),
    })),
  },
}));

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
    user: { uid: 'test-uid', email: 'test@example.com' },
    auth: {},
  }),
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
  useNavigate: () => jest.fn(),
}));

jest.mock('../utils/imageCompression', () => ({
  compressImage: jest.fn(() => Promise.resolve('compressed-image-data')),
}));

jest.mock('../services/profileService', () => ({
  __esModule: true,
  getUserProfile: jest.fn(),
  saveProfilePicture: jest.fn(() => Promise.resolve()),
  getProfilePicture: jest.fn(() => Promise.resolve(null)),
}));

describe('Profile', () => {
  beforeEach(() => {
    (getUserProfile as jest.Mock).mockResolvedValue({ photoURL: null });
  });

  it('renders profile page', async () => {
    const { container } = render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('profile.title')).toBeInTheDocument();
  });

  it('renders email field', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('profile.email')).toBeInTheDocument();
  });

  it('renders user id field', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(screen.getByText('profile.userId')).toBeInTheDocument();
  });
});

