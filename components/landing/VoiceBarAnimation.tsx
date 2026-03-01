'use client';

/**
 * Voice waveform visualizer using smooth animated SVG circles.
 * Inspired by voice assistant UIs — organic pulsing dots, not a barcode.
 * Pure CSS animations, GPU-composited via transform: scale().
 */

function VoiceDots({ count, maxSize, gap, className = '' }: { count: number; maxSize: number; gap: number; className?: string }) {
  const dots = Array.from({ length: count }, (_, i) => {
    // Create a natural voice-like pattern: louder in the middle, quieter at edges
    const center = (count - 1) / 2;
    const dist = Math.abs(i - center) / center;
    const baseScale = 0.3 + (1 - dist) * 0.7; // 0.3 at edges, 1.0 at center
    const animIndex = (i % 4) + 1;
    const delay = (i * 0.12) % 1.5;
    const duration = 1.2 + (i % 3) * 0.4;

    return (
      <div
        key={i}
        className="rounded-full bg-[#8B6F47]"
        style={{
          width: `${maxSize}px`,
          height: `${maxSize}px`,
          opacity: 0.3 + baseScale * 0.5,
          animation: `voice-dot-${animIndex} ${duration}s ease-in-out ${delay}s infinite`,
          willChange: 'transform',
        }}
      />
    );
  });

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ gap: `${gap}px`, contain: 'layout style paint' }}>
      {dots}
    </div>
  );
}

export function VoiceBarAnimation() {
  return <VoiceDots count={15} maxSize={6} gap={4} className="max-w-[300px] mx-auto py-2" />;
}

export function VoiceBarAnimationLarge() {
  return <VoiceDots count={25} maxSize={8} gap={5} className="max-w-[500px] mx-auto py-4" />;
}
