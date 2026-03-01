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
    div: ({ children, style, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, style, ...props }: any) => <span {...props}>{children}</span>,
    p: ({ children, style, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, style, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, style, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, style, ...props }: any) => <h3 {...props}>{children}</h3>,
    section: ({ children, style, ...props }: any) => <section {...props}>{children}</section>,
    svg: ({ children, style, ...props }: any) => <svg {...props}>{children}</svg>,
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
  useInView: () => true,
  useMotionValue: () => ({ set: () => {}, get: () => 0 }),
  useSpring: (v: any) => v,
  animate: () => ({ stop: () => {} }),
}));

jest.mock('@/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

jest.mock('@/components/landing/VoiceEqualizer', () => ({
  VoiceEqualizer: () => <div data-testid="voice-equalizer" />,
}));
jest.mock('@/components/landing/HeroCallCard', () => ({
  HeroCallCard: () => <div data-testid="hero-call-card" />,
}));
jest.mock('@/components/landing/HeroVoiceOrb', () => ({
  HeroVoiceOrb: () => <div data-testid="hero-voice-orb" />,
}));

jest.mock('@/components/landing/NoiseOverlay', () => ({
  NoiseOverlay: () => <div data-testid="noise-overlay" />,
}));

import LandingPage from '@/app/page';

describe('Landing Page', () => {
  it('renders without crash', () => {
    render(<LandingPage />);
    expect(screen.getByText(/AI that/)).toBeInTheDocument();
  });

  it('has hero heading with Borel on "answers"', () => {
    const { container } = render(<LandingPage />);
    const borelElements = container.querySelectorAll('[style*="Borel"]');
    expect(borelElements.length).toBeGreaterThanOrEqual(1);
  });

  it('has primary CTA linking to demo', () => {
    render(<LandingPage />);
    const cta = screen.getByText('Hear It Live');
    expect(cta.closest('a')).toHaveAttribute('href', '/demo');
  });

  it('has secondary CTA linking to signup', () => {
    render(<LandingPage />);
    const btns = screen.getAllByText('Start Free');
    expect(btns[0].closest('a')).toHaveAttribute('href', '/auth?mode=signup');
  });

  it('displays feature sections', () => {
    render(<LandingPage />);
    expect(screen.getByText('Books appointments automatically')).toBeInTheDocument();
    expect(screen.getByText('Answers from your docs')).toBeInTheDocument();
    expect(screen.getByText('Full transcripts')).toBeInTheDocument();
    expect(screen.getByText('Always on')).toBeInTheDocument();
  });

  it('has pricing info', () => {
    render(<LandingPage />);
    expect(screen.getAllByText(/\/mo/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/100 minutes included/)).toBeInTheDocument();
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
  });

  it('has Sign In and Get Started nav buttons', () => {
    render(<LandingPage />);
    const signIn = screen.getByText('Sign In');
    expect(signIn.closest('a')).toHaveAttribute('href', '/auth?mode=signin');
  });

  it('shows social proof section', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Built by engineers from/)).toBeInTheDocument();
  });

  it('shows integration logos', () => {
    render(<LandingPage />);
    expect(screen.getAllByText('Google Calendar').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Outlook').length).toBeGreaterThanOrEqual(1);
  });

  it('has no emojis', () => {
    const { container } = render(<LandingPage />);
    const html = container.innerHTML;
    expect(html).not.toContain('📅');
    expect(html).not.toContain('📄');
    expect(html).not.toContain('📞');
    expect(html).not.toContain('✨');
  });

  it('has no em dashes', () => {
    const { container } = render(<LandingPage />);
    expect(container.innerHTML).not.toContain('—');
  });

  it('has problem section with stat', () => {
    render(<LandingPage />);
    expect(screen.getByText(/You miss it/)).toBeInTheDocument();
    expect(screen.getByText(/won't leave a voicemail/)).toBeInTheDocument();
  });

  it('has bold statement section', () => {
    render(<LandingPage />);
    expect(screen.getByText('Talks')).toBeInTheDocument();
    expect(screen.getByText('human.')).toBeInTheDocument();
    expect(screen.getByText('machine.')).toBeInTheDocument();
  });

  it('has dark integrations section', () => {
    const { container } = render(<LandingPage />);
    const darkSection = container.querySelector('[class*="bg-[#1a1a1a]"]');
    expect(darkSection).toBeInTheDocument();
  });

  it('has how it works section', () => {
    render(<LandingPage />);
    expect(screen.getByText('Tell us about your business')).toBeInTheDocument();
    expect(screen.getByText('Connect your calendar')).toBeInTheDocument();
    expect(screen.getByText('Calls start answering')).toBeInTheDocument();
  });

  it('targets small businesses in hero copy', () => {
    render(<LandingPage />);
    expect(screen.getByText(/contractors, clinics/)).toBeInTheDocument();
  });

  it('has hero call card', () => {
    render(<LandingPage />);
    expect(screen.getByTestId('hero-call-card')).toBeInTheDocument();
  });

  it('has dashboard section with video', () => {
    render(<LandingPage />);
    expect(screen.getByText('Every call. Every transcript. Every booking.')).toBeInTheDocument();
  });
});
