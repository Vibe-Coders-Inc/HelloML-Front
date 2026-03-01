'use client';

/**
 * Voice visualization — organic pulsing orbs, NOT a barcode.
 * 7-9 circles with dramatic height variation via scaleY.
 * Inspired by wisprflow's Lottie waveform but done with pure CSS.
 */

function VoiceOrbs({ count, size, gap, className = '' }: { count: number; size: number; gap: number; className?: string }) {
  const orbs = Array.from({ length: count }, (_, i) => {
    const center = (count - 1) / 2;
    const dist = Math.abs(i - center) / center;
    // Dramatic height variation: tall in center, short at edges
    const baseHeight = 0.3 + (1 - dist * dist) * 0.7;
    const animIndex = (i % 4) + 1;
    const delay = i * 0.15;
    const duration = 1.5 + (i % 3) * 0.3;

    return (
      <div
        key={i}
        className="rounded-full bg-[#8B6F47]"
        style={{
          width: `${size}px`,
          height: `${size * 3}px`,
          borderRadius: `${size}px`,
          opacity: 0.4 + baseHeight * 0.5,
          transformOrigin: 'center',
          animation: `voice-orb-${animIndex} ${duration}s ease-in-out ${delay}s infinite`,
        }}
      />
    );
  });

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ gap: `${gap}px`, contain: 'layout style paint' }}
    >
      {orbs}
    </div>
  );
}

export function VoiceBarAnimation() {
  return <VoiceOrbs count={7} size={4} gap={6} className="py-2" />;
}

export function VoiceBarAnimationLarge() {
  return <VoiceOrbs count={9} size={6} gap={8} className="py-6" />;
}
