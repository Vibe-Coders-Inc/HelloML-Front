import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/auth',
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

// Mock app context
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockSignInWithGoogle = jest.fn();

jest.mock('@/lib/context', () => ({
  useApp: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle,
    signOut: jest.fn(),
  }),
}));

jest.mock('@/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

import AuthPage from '@/app/auth/page';

describe('Auth Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthPage />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('has Google OAuth button', () => {
    render(<AuthPage />);
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('switches to signup mode', async () => {
    render(<AuthPage />);
    const signUpLink = screen.getByText('Sign up');
    fireEvent.click(signUpLink);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });

  it('switches back to login mode', async () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByText('Sign up'));
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sign in'));
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('signup form shows name and email fields on step 1', () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByText('Sign up'));
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  });

  it('login form does not submit with invalid email', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByText('Sign In');
    
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'validpass123');
    await user.click(submitBtn);
    
    // signIn should not be called with invalid email
    await waitFor(() => {
      expect(mockSignIn).not.toHaveBeenCalled();
    });
  });

  it('login form validates password length', async () => {
    const user = userEvent.setup();
    render(<AuthPage />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByText('Sign In');
    
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, '123');
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('has links to terms and privacy', () => {
    render(<AuthPage />);
    const termsLink = screen.getByText('Terms');
    const privacyLink = screen.getByText('Privacy Policy');
    expect(termsLink.closest('a')).toHaveAttribute('href', '/terms');
    expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy');
  });

  it('calls signInWithGoogle when Google button clicked', async () => {
    render(<AuthPage />);
    fireEvent.click(screen.getByText('Continue with Google'));
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });
});
