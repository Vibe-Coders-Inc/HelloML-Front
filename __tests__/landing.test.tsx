import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => <img src={src} alt={alt} />;
});

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

jest.mock('@/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

jest.mock('@/components/landing/VoiceBarAnimation', () => ({
  VoiceBarAnimation: () => <div data-testid="voice-bar-animation" />,
  VoiceBarAnimationLarge: () => <div data-testid="voice-bar-animation-large" />,
}));

import { VoiceBarAnimation, VoiceBarAnimationLarge } from '@/components/landing/VoiceBarAnimation';
import LandingPage from '@/app/page';

describe('Landing Page', () => {
  it('renders without crash', () => {
    render(<LandingPage />);
    expect(screen.getByText(/AI that/)).toBeInTheDocument();
  });

  it('displays $5/mo pricing', () => {
    render(<LandingPage />);
    expect(screen.getAllByText(/\$5\/mo/).length).toBeGreaterThanOrEqual(1);
  });

  it('has Get Your Number CTA linking to signup', () => {
    render(<LandingPage />);
    const cta = screen.getByText('Get Your Number');
    expect(cta.closest('a')).toHaveAttribute('href', '/auth?mode=signup');
  });

  it('has Try It Live demo button linking to /demo', () => {
    render(<LandingPage />);
    const demoBtn = screen.getByText(/Try It Live/);
    expect(demoBtn.closest('a')).toHaveAttribute('href', '/demo');
  });

  it('displays feature sections', () => {
    render(<LandingPage />);
    expect(screen.getByText('Books appointments')).toBeInTheDocument();
    expect(screen.getByText('Answers from your docs')).toBeInTheDocument();
    expect(screen.getByText('Full transcripts')).toBeInTheDocument();
    expect(screen.getByText('Always on, 24/7')).toBeInTheDocument();
  });

  it('has pricing info in hero', () => {
    render(<LandingPage />);
    expect(screen.getByText(/\$5\/month/)).toBeInTheDocument();
  });

  it('has Get Started Free CTA', () => {
    render(<LandingPage />);
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
  });

  it('has footer with navigation links', () => {
    render(<LandingPage />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('has Sign In and Get Started nav buttons', () => {
    render(<LandingPage />);
    const signIn = screen.getByText('Sign In');
    expect(signIn.closest('a')).toHaveAttribute('href', '/auth?mode=signin');
    const getStarted = screen.getByText('Get Started');
    expect(getStarted.closest('a')).toHaveAttribute('href', '/auth?mode=signup');
  });

  it('shows social proof section', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Built by engineers from/)).toBeInTheDocument();
  });

  it('shows integration logos in dark section', () => {
    render(<LandingPage />);
    expect(screen.getAllByText('Google Calendar').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Outlook').length).toBeGreaterThanOrEqual(1);
  });

  it('has no emojis in the page content', () => {
    const { container } = render(<LandingPage />);
    const html = container.innerHTML;
    expect(html).not.toContain('📅');
    expect(html).not.toContain('📄');
    expect(html).not.toContain('📝');
    expect(html).not.toContain('📞');
    expect(html).not.toContain('🔧');
    expect(html).not.toContain('✨');
    expect(html).not.toContain('🎙️');
    expect(html).not.toContain('🤖');
  });

  it('renders VoiceBarAnimation without crashing', () => {
    const { getByTestId } = render(<VoiceBarAnimation />);
    expect(getByTestId('voice-bar-animation')).toBeInTheDocument();
  });

  it('renders VoiceBarAnimationLarge without crashing', () => {
    const { getByTestId } = render(<VoiceBarAnimationLarge />);
    expect(getByTestId('voice-bar-animation-large')).toBeInTheDocument();
  });

  it('has no em dashes', () => {
    const { container } = render(<LandingPage />);
    expect(container.innerHTML).not.toContain('—');
  });

  it('uses Borel cursive typography in hero', () => {
    const { container } = render(<LandingPage />);
    const serifElements = container.querySelectorAll('[style*="Borel"]');
    expect(serifElements.length).toBeGreaterThanOrEqual(1);
  });

  it('has a dark integrations section', () => {
    const { container } = render(<LandingPage />);
    const darkSection = container.querySelector('.bg-\\[\\#111111\\]');
    expect(darkSection).toBeInTheDocument();
  });
});
