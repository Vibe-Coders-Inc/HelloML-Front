import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => <img src={src} alt={alt} />;
});

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => 0,
  useMotionValue: () => ({ set: () => {}, get: () => 0 }),
  useSpring: (v: any) => v,
  animate: () => ({ stop: () => {} }),
}));

// Mock Logo
jest.mock('@/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

jest.mock('@/components/landing/HeroCallCard', () => ({
  HeroCallCard: () => <div data-testid="hero-call-card" />,
}));
jest.mock('@/components/landing/NoiseOverlay', () => ({
  NoiseOverlay: () => <div data-testid="noise-overlay" />,
}));
jest.mock('@/components/landing/MissedCallCascade', () => ({
  MissedCallCascade: () => <div data-testid="missed-call-cascade" />,
}));
jest.mock('@/components/landing/FaceGearMorph', () => ({
  FaceGearMorph: () => <div data-testid="face-gear-morph" />,
}));

jest.mock('@/components/VoiceOrb', () => ({
  VoiceOrb: ({ state, onClick }: any) => (
    <div data-testid="voice-orb" onClick={onClick}>
      {state === 'idle' && <button>Start Demo</button>}
    </div>
  ),
}));

// Track session mock state
const mockStart = jest.fn();
const mockEnd = jest.fn();
const mockToggleMute = jest.fn();
let mockSessionStatus = 'idle';
let mockErrorMessage: string | undefined = undefined;

jest.mock('@/components/DemoSession', () => ({
  useDemoSession: () => ({
    status: mockSessionStatus,
    timeLeft: 120,
    audioLevel: 0.5,
    aiSpeaking: false,
    isMuted: false,
    errorMessage: mockErrorMessage,
    transcript: [],
    start: mockStart,
    end: mockEnd,
    toggleMute: mockToggleMute,
  }),
}));

import LandingPage from '@/app/page';

describe('Demo Section on Landing Page', () => {
  beforeEach(() => {
    mockSessionStatus = 'idle';
    mockErrorMessage = undefined;
    jest.clearAllMocks();
  });

  it('renders demo section with heading', () => {
    render(<LandingPage />);
    expect(screen.getByText('Talk to an AI Phone Agent')).toBeInTheDocument();
  });

  it('has demo section with id="demo"', () => {
    const { container } = render(<LandingPage />);
    expect(container.querySelector('#demo')).toBeInTheDocument();
  });

  it('displays all voice options', () => {
    render(<LandingPage />);
    const voices = ['Alloy', 'Ash', 'Ballad', 'Coral', 'Echo', 'Sage', 'Shimmer', 'Verse', 'Marin'];
    voices.forEach(voice => {
      expect(screen.getByText(voice)).toBeInTheDocument();
    });
  });

  it('shows voice description on selection', () => {
    render(<LandingPage />);
    expect(screen.getByText('Warm, confident')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Coral'));
    expect(screen.getByText('Clear, friendly')).toBeInTheDocument();
  });

  it('shows free minutes info', () => {
    render(<LandingPage />);
    const matches = screen.getAllByText(/5 free minutes/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it('shows connecting state', () => {
    mockSessionStatus = 'connecting';
    render(<LandingPage />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('shows active state with timer', () => {
    mockSessionStatus = 'active';
    render(<LandingPage />);
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  it('shows ended state with CTA', () => {
    mockSessionStatus = 'ended';
    render(<LandingPage />);
    expect(screen.getByText('Hope that was impressive!')).toBeInTheDocument();
  });

  it('shows error state for mic denied', () => {
    mockSessionStatus = 'error';
    mockErrorMessage = 'mic_denied';
    render(<LandingPage />);
    expect(screen.getByText('Microphone access needed')).toBeInTheDocument();
  });
});
