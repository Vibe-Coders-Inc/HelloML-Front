import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/demo',
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
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: () => true,
}));

// Mock Logo
jest.mock('@/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

// Track session mock state
const mockStart = jest.fn();
const mockEnd = jest.fn();
const mockToggleMute = jest.fn();
let mockSessionStatus = 'idle';

jest.mock('@/components/DemoSession', () => ({
  useDemoSession: () => ({
    status: mockSessionStatus,
    timeLeft: 120,
    audioLevel: 0.5,
    aiSpeaking: false,
    isMuted: false,
    errorMessage: undefined,
    transcript: [],
    start: mockStart,
    end: mockEnd,
    toggleMute: mockToggleMute,
  }),
}));

import DemoPage from '@/app/demo/page';

describe('Demo Page', () => {
  beforeEach(() => {
    mockSessionStatus = 'idle';
    jest.clearAllMocks();
  });

  it('renders without crash', () => {
    render(<DemoPage />);
    expect(screen.getByText('Talk to an AI Phone Agent')).toBeInTheDocument();
  });

  it('displays all voice options', () => {
    render(<DemoPage />);
    const voices = ['Alloy', 'Ash', 'Ballad', 'Coral', 'Echo', 'Sage', 'Shimmer', 'Verse', 'Marin'];
    voices.forEach(voice => {
      expect(screen.getByText(voice)).toBeInTheDocument();
    });
  });

  it('shows voice description on selection', () => {
    render(<DemoPage />);
    // Default is Ash
    expect(screen.getByText('Warm, confident')).toBeInTheDocument();
    // Click Coral
    fireEvent.click(screen.getByText('Coral'));
    expect(screen.getByText('Clear, friendly')).toBeInTheDocument();
  });

  it('shows Start Demo button in idle state', () => {
    render(<DemoPage />);
    expect(screen.getByText('Start Demo')).toBeInTheDocument();
  });

  it('shows 2-minute demo info', () => {
    render(<DemoPage />);
    expect(screen.getByText(/2 minute demo/)).toBeInTheDocument();
  });

  it('shows connecting state', () => {
    mockSessionStatus = 'connecting';
    render(<DemoPage />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('shows active state with timer and controls', () => {
    mockSessionStatus = 'active';
    render(<DemoPage />);
    expect(screen.getByText('2:00')).toBeInTheDocument();
    // Timer is visible, controls are present
    expect(screen.getByText('2:00')).toBeInTheDocument();
  });

  it('shows ended state with CTA', () => {
    mockSessionStatus = 'ended';
    render(<DemoPage />);
    expect(screen.getByText('Hope that was impressive!')).toBeInTheDocument();
    expect(screen.getByText(/Create Your Agent/)).toBeInTheDocument();
  });

  it('shows error state for mic denied', () => {
    mockSessionStatus = 'error';
    // Override the mock temporarily to include errorMessage
    jest.spyOn(require('@/components/DemoSession'), 'useDemoSession').mockReturnValue({
      status: 'error',
      timeLeft: 120,
      audioLevel: 0,
      aiSpeaking: false,
      isMuted: false,
      errorMessage: 'mic_denied',
      transcript: [],
      start: mockStart,
      end: mockEnd,
      toggleMute: mockToggleMute,
    });
    render(<DemoPage />);
    expect(screen.getByText('Microphone access needed')).toBeInTheDocument();
  });

  it('has back link to home', () => {
    render(<DemoPage />);
    const backLink = screen.getByText('Back');
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });
});
