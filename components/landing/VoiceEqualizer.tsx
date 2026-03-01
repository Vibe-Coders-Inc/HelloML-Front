'use client';

/**
 * Premium voice equalizer visualization.
 * 28 vertical bars forming a dome shape, each pulsing independently.
 * Pure CSS animations for 60fps GPU-composited performance.
 */

const BAR_COUNT = 28;
const ANIMS = ['voice-orb-1', 'voice-orb-2', 'voice-orb-3', 'voice-orb-4'];

export function VoiceEqualizer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-end justify-center gap-[3px] ${className}`}
      style={{ height: 52 }}
      aria-hidden="true"
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => {
        const center = (BAR_COUNT - 1) / 2;
        const dist = Math.abs(i - center) / center;
        // Dome shape: tallest center, shortest edges
        const h = Math.round(52 - dist * 36);
        // Vary duration using golden ratio modulo for organic feel
        const dur = (0.7 + ((i * 7) % 13) / 13 * 0.8).toFixed(2);
        const del = (i * 0.04).toFixed(2);
        const anim = ANIMS[i % ANIMS.length];
        const op = (0.3 + (1 - dist) * 0.5).toFixed(2);

        return (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              height: h,
              backgroundColor: '#8B6F47',
              opacity: Number(op),
              transformOrigin: 'bottom',
              animation: `${anim} ${dur}s ${del}s ease-in-out infinite`,
              willChange: 'transform',
            }}
          />
        );
      })}
    </div>
  );
}
