import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

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

jest.mock('@/components/DemoSession', () => ({
  useDemoSession: () => ({
    status: 'idle',
    timeLeft: 120,
    audioLevel: 0,
    aiSpeaking: false,
    isMuted: false,
    start: jest.fn(),
    end: jest.fn(),
    toggleMute: jest.fn(),
  }),
}));

import LandingPage from '@/app/page';

const VOICES = [
  { id: 'alloy', label: 'Alloy', desc: 'Neutral, balanced' },
  { id: 'ash', label: 'Ash', desc: 'Warm, confident' },
  { id: 'ballad', label: 'Ballad', desc: 'Expressive, dramatic' },
  { id: 'coral', label: 'Coral', desc: 'Clear, friendly' },
  { id: 'echo', label: 'Echo', desc: 'Smooth, deep' },
  { id: 'sage', label: 'Sage', desc: 'Calm, measured' },
  { id: 'shimmer', label: 'Shimmer', desc: 'Soft, gentle' },
  { id: 'verse', label: 'Verse', desc: 'Versatile, natural' },
  { id: 'marin', label: 'Marin', desc: 'Latest, natural' },
];

describe('Voice Selector', () => {
  it('lists all voices', () => {
    render(<LandingPage />);
    VOICES.forEach(voice => {
      expect(screen.getByText(voice.label)).toBeInTheDocument();
    });
  });

  it('shows "Choose a voice" label', () => {
    render(<LandingPage />);
    expect(screen.getByText('Choose a voice')).toBeInTheDocument();
  });

  it('defaults to Ash voice with its description', () => {
    render(<LandingPage />);
    expect(screen.getByText('Warm, confident')).toBeInTheDocument();
  });

  it('updates description when a different voice is selected', () => {
    render(<LandingPage />);
    fireEvent.click(screen.getByText('Echo'));
    expect(screen.getByText('Smooth, deep')).toBeInTheDocument();
  });

  it('each voice button has a title with its description', () => {
    render(<LandingPage />);
    VOICES.forEach(voice => {
      const button = screen.getByText(voice.label);
      expect(button).toHaveAttribute('title', voice.desc);
    });
  });

  it('highlights selected voice differently', () => {
    render(<LandingPage />);
    const ashButton = screen.getByText('Ash');
    expect(ashButton.className).toContain('bg-[#8B6F47]');

    const alloyButton = screen.getByText('Alloy');
    expect(alloyButton.className).not.toContain('bg-[#8B6F47]');
  });
});
