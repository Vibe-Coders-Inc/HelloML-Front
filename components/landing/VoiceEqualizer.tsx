'use client';

import { useEffect, useRef } from 'react';

/**
 * Flowing text ribbon with voice icon — wisprflow hero style.
 * Text from a phone conversation flows along a curved SVG path,
 * with a voice bars icon centered. The text scrolls continuously.
 */

const TRANSCRIPT = "Hi, I'd like to schedule an appointment for Thursday afternoon if possible. Let me check the calendar for you. It looks like we have a 2:30 opening. Would that work? That's perfect, thank you so much. Great, you're all set. We'll send a confirmation to your email. ";

export function VoiceEqualizer({ className = '' }: { className?: string }) {
  const offsetRef = useRef(0);
  const animRef = useRef<number>(0);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    let running = true;
    const doubled = TRANSCRIPT + TRANSCRIPT; // seamless loop

    function animate() {
      if (!running) return;
      offsetRef.current -= 0.5; // scroll speed
      if (textRef.current) {
        const tp = textRef.current.querySelector('textPath');
        if (tp) tp.setAttribute('startOffset', `${offsetRef.current}px`);
      }
      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);

    // We store the doubled text for the render
    if (textRef.current) {
      const tp = textRef.current.querySelector('textPath');
      if (tp) tp.textContent = doubled;
    }

    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, []);

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: 220 }} aria-hidden="true">
      <svg
        viewBox="0 0 1200 220"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ minWidth: '100%' }}
      >
        <defs>
          {/* S-curve path flowing from left to right with a dip through center */}
          <path
            id="textRibbon"
            d="M -200,40 C 100,40 200,180 400,180 C 550,180 550,110 600,110 C 650,110 650,180 800,180 C 1000,180 1100,40 1400,40"
            fill="none"
          />
          {/* Thicker band path for the dark ribbon */}
          <path
            id="ribbonBand"
            d="M -200,40 C 100,40 200,180 400,180 C 550,180 550,110 600,110 C 650,110 650,180 800,180 C 1000,180 1100,40 1400,40"
            fill="none"
          />
        </defs>

        {/* The dark ribbon band */}
        <use
          href="#ribbonBand"
          stroke="#3D3425"
          strokeWidth="42"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Scrolling text along the path */}
        <text
          ref={textRef}
          fill="#FAF8F3"
          fontSize="15"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.02em"
        >
          <textPath href="#textRibbon" startOffset="0">
            {TRANSCRIPT + TRANSCRIPT}
          </textPath>
        </text>
      </svg>

      {/* Voice icon in the center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[15%] z-10">
        <div className="bg-[#FAF8F3] border-2 border-[#3D3425] rounded-2xl px-4 py-3 flex items-end gap-[3px]" style={{ height: 52 }}>
          {Array.from({ length: 16 }, (_, i) => {
            const center = 7.5;
            const dist = Math.abs(i - center) / center;
            const h = Math.round(28 - dist * 20);
            return (
              <div
                key={i}
                className="rounded-full bg-[#3D3425]"
                style={{
                  width: 2.5,
                  height: h,
                  animation: `voiceBar ${0.4 + (i % 3) * 0.15}s ${i * 0.03}s ease-in-out infinite alternate`,
                }}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}
