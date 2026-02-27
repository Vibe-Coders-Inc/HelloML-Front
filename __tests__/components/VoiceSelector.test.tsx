import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// The voice selector is inline in the demo page, not a separate component.
// We test the voice selection functionality from the demo page.

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/demo',
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>;
});

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
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

import DemoPage from '@/app/demo/page';

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
    render(<DemoPage />);
    VOICES.forEach(voice => {
      expect(screen.getByText(voice.label)).toBeInTheDocument();
    });
  });

  it('shows "Choose a voice" label', () => {
    render(<DemoPage />);
    expect(screen.getByText('Choose a voice')).toBeInTheDocument();
  });

  it('defaults to Ash voice with its description', () => {
    render(<DemoPage />);
    expect(screen.getByText('Warm, confident')).toBeInTheDocument();
  });

  it('updates description when a different voice is selected', () => {
    render(<DemoPage />);
    fireEvent.click(screen.getByText('Echo'));
    expect(screen.getByText('Smooth, deep')).toBeInTheDocument();
  });

  it('each voice button has a title with its description', () => {
    render(<DemoPage />);
    VOICES.forEach(voice => {
      const button = screen.getByText(voice.label);
      expect(button).toHaveAttribute('title', voice.desc);
    });
  });

  it('highlights selected voice differently', () => {
    render(<DemoPage />);
    const ashButton = screen.getByText('Ash');
    expect(ashButton.className).toContain('bg-[#8B6F47]');
    
    const alloyButton = screen.getByText('Alloy');
    expect(alloyButton.className).not.toContain('bg-[#8B6F47]');
  });
});
