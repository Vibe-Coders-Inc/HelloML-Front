'use client';

import { useEffect, useRef } from 'react';

/**
 * Flowing text ribbon with voice icon — wisprflow hero style.
 * Dark band with conversation text flowing along a curved path,
 * voice bars icon centered where the ribbon dips.
 */

const TRANSCRIPT = "Hi, I'd like to schedule an appointment for Thursday afternoon if possible. Let me check the calendar for you. It looks like we have a 2:30 opening. Would that work? That's perfect, thank you so much. Great, you're all set. We'll send a confirmation to your email. Is there anything else I can help you with today? No that's everything. Have a wonderful day. ";

export function VoiceEqualizer({ className = '' }: { className?: string }) {
  const offsetRef = useRef(0);
  const animRef = useRef<number>(0);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    let running = true;

    function animate() {
      if (!running) return;
      offsetRef.current -= 0.6;
      // Reset to prevent number overflow
      if (offsetRef.current < -5000) offsetRef.current += 2500;
      if (textRef.current) {
        const tp = textRef.current.querySelector('textPath');
        if (tp) tp.setAttribute('startOffset', `${offsetRef.current}px`);
      }
      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);

    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, []);

  const tripled = TRANSCRIPT + TRANSCRIPT + TRANSCRIPT;

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: 180 }} aria-hidden="true">
      <svg
        viewBox="0 0 1200 180"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          {/* Flowing S-curve: enters bottom-left, sweeps up-right, dips at center, exits top-right */}
          <path
            id="textRibbon"
            d="M -300,160 C 0,160 150,30 350,30 C 480,30 520,90 600,90 C 680,90 720,30 850,30 C 1050,30 1200,160 1500,160"
            fill="none"
          />
        </defs>

        {/* The dark ribbon band */}
        <path
          d="M -300,160 C 0,160 150,30 350,30 C 480,30 520,90 600,90 C 680,90 720,30 850,30 C 1050,30 1200,160 1500,160"
          stroke="#3D3425"
          strokeWidth="44"
          strokeLinecap="round"
          fill="none"
          opacity="0.92"
        />

        {/* Scrolling text along the path */}
        <text
          ref={textRef}
          fill="#FAF8F3"
          fontSize="14"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.03em"
          fontWeight="400"
        >
          <textPath href="#textRibbon" startOffset="0">
            {tripled}
          </textPath>
        </text>
      </svg>

      {/* Voice bars icon at center of the ribbon dip */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-[#FAF8F3] border-2 border-[#3D3425] rounded-2xl px-4 py-3 flex items-end gap-[3px]" style={{ height: 50, transformOrigin: 'center' }}>
          {Array.from({ length: 14 }, (_, i) => {
            const center = 6.5;
            const dist = Math.abs(i - center) / center;
            const h = Math.round(24 - dist * 16);
            return (
              <div
                key={i}
                className="rounded-full bg-[#3D3425]"
                style={{
                  width: 2.5,
                  height: h,
                  transformOrigin: 'bottom',
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
