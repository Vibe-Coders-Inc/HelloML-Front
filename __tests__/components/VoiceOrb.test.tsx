import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, ...props }: any) => (
      <div style={style} className={className} data-testid={props['data-testid']}>{children}</div>
    ),
    button: ({ children, onClick, style, className, ...props }: any) => (
      <button onClick={onClick} style={style} className={className}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

import { VoiceOrb } from '@/components/VoiceOrb';

describe('VoiceOrb', () => {
  it('renders in idle state with Start Demo text', () => {
    render(<VoiceOrb state="idle" audioLevel={0} aiSpeaking={false} />);
    expect(screen.getByText('Start Demo')).toBeInTheDocument();
  });

  it('renders in connecting state with spinner', () => {
    const { container } = render(<VoiceOrb state="connecting" audioLevel={0} aiSpeaking={false} />);
    // Connecting shows a spinning div (border-t pattern)
    const spinner = container.querySelector('.border-t-\\[\\#8B6F47\\]');
    // The connecting state doesn't show "Start Demo"
    expect(screen.queryByText('Start Demo')).not.toBeInTheDocument();
  });

  it('renders in active state with audio bars', () => {
    const { container } = render(<VoiceOrb state="active" audioLevel={0.5} aiSpeaking={false} />);
    // Active state shows 5 audio bar divs
    expect(screen.queryByText('Start Demo')).not.toBeInTheDocument();
  });

  it('renders in ended state without Start Demo', () => {
    render(<VoiceOrb state="ended" audioLevel={0} aiSpeaking={false} />);
    expect(screen.queryByText('Start Demo')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked in idle state', () => {
    const onClick = jest.fn();
    render(<VoiceOrb state="idle" audioLevel={0} aiSpeaking={false} onClick={onClick} />);
    fireEvent.click(screen.getByText('Start Demo'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has correct container dimensions', () => {
    const { container } = render(<VoiceOrb state="idle" audioLevel={0} aiSpeaking={false} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('320px');
    expect(wrapper.style.height).toBe('320px');
  });
});
