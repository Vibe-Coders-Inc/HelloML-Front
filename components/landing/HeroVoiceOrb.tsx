'use client';

/**
 * Hero voice orb — Remotion-rendered video of organic pulsing blob.
 * Autoplay, muted, looped. Lightweight at ~530KB.
 */

export function HeroVoiceOrb({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-[280px] h-[210px] sm:w-[360px] sm:h-[270px] object-contain"
        poster=""
      >
        <source src="/voice-orb.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
