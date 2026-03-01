'use client';

import React from 'react';

const ANIM_NAMES = ['voice-bar-1', 'voice-bar-2', 'voice-bar-3', 'voice-bar-4'] as const;

const BAR_CONFIGS: { anim: string; delay: string; opacity: number }[] = [
  { anim: 'voice-bar-1', delay: '0s', opacity: 0.5 },
  { anim: 'voice-bar-2', delay: '0.1s', opacity: 0.7 },
  { anim: 'voice-bar-3', delay: '0.2s', opacity: 0.4 },
  { anim: 'voice-bar-1', delay: '0.15s', opacity: 0.8 },
  { anim: 'voice-bar-4', delay: '0.05s', opacity: 0.6 },
  { anim: 'voice-bar-2', delay: '0.25s', opacity: 0.3 },
  { anim: 'voice-bar-3', delay: '0.3s', opacity: 0.7 },
  { anim: 'voice-bar-1', delay: '0.35s', opacity: 0.5 },
  { anim: 'voice-bar-4', delay: '0.12s', opacity: 0.8 },
  { anim: 'voice-bar-2', delay: '0.4s', opacity: 0.4 },
  { anim: 'voice-bar-3', delay: '0.08s', opacity: 0.6 },
  { anim: 'voice-bar-1', delay: '0.22s', opacity: 0.7 },
  { anim: 'voice-bar-4', delay: '0.18s', opacity: 0.3 },
  { anim: 'voice-bar-2', delay: '0.33s', opacity: 0.5 },
  { anim: 'voice-bar-3', delay: '0.45s', opacity: 0.8 },
  { anim: 'voice-bar-1', delay: '0.28s', opacity: 0.6 },
  { anim: 'voice-bar-4', delay: '0.38s', opacity: 0.4 },
  { anim: 'voice-bar-2', delay: '0.5s', opacity: 0.7 },
  { anim: 'voice-bar-3', delay: '0.14s', opacity: 0.5 },
  { anim: 'voice-bar-1', delay: '0.42s', opacity: 0.3 },
  { anim: 'voice-bar-4', delay: '0.26s', opacity: 0.8 },
  { anim: 'voice-bar-2', delay: '0.36s', opacity: 0.6 },
  { anim: 'voice-bar-3', delay: '0.48s', opacity: 0.4 },
  { anim: 'voice-bar-1', delay: '0.06s', opacity: 0.7 },
  { anim: 'voice-bar-4', delay: '0.32s', opacity: 0.5 },
];

const containerStyle: React.CSSProperties = {
  contain: 'layout style paint',
};

function BarGroup({
  bars,
  height,
  maxWidth,
  barWidth,
  gap,
  label,
}: {
  bars: typeof BAR_CONFIGS;
  height: number;
  maxWidth: number;
  barWidth: number;
  gap: number;
  label: string;
}) {
  return (
    <div
      data-testid={label}
      style={{
        ...containerStyle,
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height,
        maxWidth,
        width: '100%',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap,
          height: '100%',
        }}
      >
        {bars.map((bar, i) => (
          <div
            key={i}
            style={{
              width: barWidth,
              height: '100%',
              borderRadius: barWidth,
              backgroundColor: `rgba(139,111,71,${bar.opacity})`,
              transformOrigin: 'bottom',
              willChange: 'transform',
              animation: `${bar.anim} ease-in-out infinite`,
              animationDelay: bar.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function VoiceBarAnimation() {
  return (
    <BarGroup
      bars={BAR_CONFIGS}
      height={90}
      maxWidth={400}
      barWidth={2.5}
      gap={5}
      label="voice-bar-animation"
    />
  );
}

const LARGE_BARS = BAR_CONFIGS.concat([
  { anim: 'voice-bar-2', delay: '0.02s', opacity: 0.6 },
  { anim: 'voice-bar-3', delay: '0.19s', opacity: 0.4 },
  { anim: 'voice-bar-1', delay: '0.44s', opacity: 0.7 },
  { anim: 'voice-bar-4', delay: '0.09s', opacity: 0.5 },
  { anim: 'voice-bar-2', delay: '0.29s', opacity: 0.8 },
  { anim: 'voice-bar-3', delay: '0.41s', opacity: 0.3 },
  { anim: 'voice-bar-1', delay: '0.16s', opacity: 0.6 },
  { anim: 'voice-bar-4', delay: '0.37s', opacity: 0.7 },
  { anim: 'voice-bar-2', delay: '0.23s', opacity: 0.5 },
  { anim: 'voice-bar-3', delay: '0.11s', opacity: 0.4 },
  { anim: 'voice-bar-1', delay: '0.46s', opacity: 0.8 },
  { anim: 'voice-bar-4', delay: '0.21s', opacity: 0.6 },
  { anim: 'voice-bar-2', delay: '0.34s', opacity: 0.3 },
  { anim: 'voice-bar-3', delay: '0.07s', opacity: 0.7 },
  { anim: 'voice-bar-1', delay: '0.39s', opacity: 0.5 },
]);

export function VoiceBarAnimationLarge() {
  return (
    <BarGroup
      bars={LARGE_BARS}
      height={120}
      maxWidth={600}
      barWidth={3}
      gap={4}
      label="voice-bar-animation-large"
    />
  );
}
