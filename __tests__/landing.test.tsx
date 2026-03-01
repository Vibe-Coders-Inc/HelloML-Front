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

jest.mock('@/components/landing/VoiceBarAnimation', () => ({
  VoiceBarAnimation: () => <div data-testid="voice-bar-animation" />,
  VoiceBarAnimationLarge: () => <div data-testid="voice-bar-animation-large" />,
}));

jest.mock('@/components/landing/AnimatedWaveform', () => ({
  AnimatedWaveform: () => <div data-testid="animated-waveform" />,
}));

jest.mock('@/components/landing/ScrollLinkedText', () => ({
  ScrollLinkedText: ({ text }: { text: string }) => <p data-testid="scroll-linked-text">{text}</p>,
}));

jest.mock('@/components/landing/NoiseOverlay', () => ({
  NoiseOverlay: () => <div data-testid="noise-overlay" />,
}));

jest.mock('@/components/landing/MissedCallAnimation', () => ({
  MissedCallAnimation: () => <div data-testid="missed-call-animation" />,
}));

jest.mock('@/components/landing/StepsTimeline', () => ({
  StepsTimeline: () => <div data-testid="steps-timeline" />,
}));

import { VoiceBarAnimation, VoiceBarAnimationLarge } from '@/components/landing/VoiceBarAnimation';
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
    const cta = screen.getByText('Hear It Answer a Call');
    expect(cta.closest('a')).toHaveAttribute('href', '/demo');
  });

  it('has secondary CTA linking to signup', () => {
    render(<LandingPage />);
    const btn = screen.getByText('Start Free Trial');
    expect(btn.closest('a')).toHaveAttribute('href', '/auth?mode=signup');
  });

  it('displays feature sections', () => {
    render(<LandingPage />);
    expect(screen.getByText('Books appointments')).toBeInTheDocument();
    expect(screen.getByText('Answers from your docs')).toBeInTheDocument();
    expect(screen.getByText('Full transcripts')).toBeInTheDocument();
    expect(screen.getByText('Always on, 24/7')).toBeInTheDocument();
  });

  it('has pricing info', () => {
    render(<LandingPage />);
    expect(screen.getByText(/\/mo per agent/)).toBeInTheDocument();
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

  it('renders VoiceBarAnimation components', () => {
    const { getByTestId } = render(<VoiceBarAnimation />);
    expect(getByTestId('voice-bar-animation')).toBeInTheDocument();
    const { getByTestId: getLarge } = render(<VoiceBarAnimationLarge />);
    expect(getLarge('voice-bar-animation-large')).toBeInTheDocument();
  });

  it('has no em dashes', () => {
    const { container } = render(<LandingPage />);
    expect(container.innerHTML).not.toContain('—');
  });

  it('has pain point section', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Every missed call/)).toBeInTheDocument();
  });

  it('has dark integrations section', () => {
    const { container } = render(<LandingPage />);
    const darkSection = container.querySelector('[class*="bg-[#1a1a1a]"]');
    expect(darkSection).toBeInTheDocument();
  });
});
