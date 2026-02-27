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
    button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: () => true,
}));

jest.mock('@/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

import LandingPage from '@/app/page';

describe('Landing Page', () => {
  it('renders without crash', () => {
    render(<LandingPage />);
    expect(screen.getByText(/AI that/)).toBeInTheDocument();
  });

  it('displays $5/mo pricing', () => {
    render(<LandingPage />);
    const priceElements = screen.getAllByText('$5');
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('/mo').length).toBeGreaterThanOrEqual(1);
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
    expect(screen.getByText('Books appointments on the spot.')).toBeInTheDocument();
    expect(screen.getByText('Answers from your documents.')).toBeInTheDocument();
    expect(screen.getByText('Transcripts after every call.')).toBeInTheDocument();
    expect(screen.getByText('One number. Always on.')).toBeInTheDocument();
  });

  it('has simple pricing section with correct details', () => {
    render(<LandingPage />);
    expect(screen.getByText('Simple pricing. No surprises.')).toBeInTheDocument();
    expect(screen.getByText('100 minutes included')).toBeInTheDocument();
    expect(screen.getByText('Dedicated phone number')).toBeInTheDocument();
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

  it('shows integration logos', () => {
    render(<LandingPage />);
    expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    expect(screen.getByText('Outlook')).toBeInTheDocument();
    expect(screen.getByText('Notion')).toBeInTheDocument();
  });
});
