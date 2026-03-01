'use client';

import { useEffect, useRef } from 'react';

/**
 * Two crossing conversation ribbons with voice icon at intersection.
 * Caller speech flows left→right (enters bottom-left, exits top-right).
 * AI responses flow right→left (enters top-left, exits bottom-right).
 * Voice bars icon sits at the crossing point.
 */

const CALLER_TEXT = "Yeah hi I need to schedule something for Thursday if that works... um also wanted to ask about pricing for the full service package? And do you guys do weekends? My wife was asking about Saturday appointments too. Oh and one more thing can you send me the address again I lost the email... ";
const AI_TEXT = "Of course! I have a 2:30 opening on Thursday that would work perfectly. Our full service package starts at $150. Yes, we do offer Saturday appointments from 9 AM to 3 PM. I'll send our address and a confirmation to your email right now. Is there anything else I can help with? ";

export function VoiceEqualizer({ className = '' }: { className?: string }) {
  const callerOffsetRef = useRef(0);
  const aiOffsetRef = useRef(0);
  const callerTextRef = useRef<SVGTextElement>(null);
  const aiTextRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    let running = true;

    function animate() {
      if (!running) return;
      callerOffsetRef.current -= 0.5;
      if (callerOffsetRef.current < -4000) callerOffsetRef.current += 2000;
      aiOffsetRef.current += 0.5;
      if (aiOffsetRef.current > 4000) aiOffsetRef.current -= 2000;

      if (callerTextRef.current) {
        const tp = callerTextRef.current.querySelector('textPath');
        if (tp) tp.setAttribute('startOffset', `${callerOffsetRef.current}px`);
      }
      if (aiTextRef.current) {
        const tp = aiTextRef.current.querySelector('textPath');
        if (tp) tp.setAttribute('startOffset', `${aiOffsetRef.current}px`);
      }

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    return () => { running = false; };
  }, []);

  const callerTripled = CALLER_TEXT + CALLER_TEXT + CALLER_TEXT;
  const aiTripled = AI_TEXT + AI_TEXT + AI_TEXT;

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height: 240 }} aria-hidden="true">
      <svg
        viewBox="0 0 1200 240"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
          {/* Caller ribbon: sweeps from bottom-left up to top-right, gentle S-curve */}
          <path
            id="callerPath"
            d="M -400,220 C 0,220 200,120 450,80 C 580,58 620,58 750,80 C 1000,120 1200,220 1600,220"
            fill="none"
          />
          {/* AI ribbon: sweeps from top-left down to bottom-right, crossing the caller ribbon */}
          <path
            id="aiPath"
            d="M -400,20 C 0,20 200,120 450,160 C 580,182 620,182 750,160 C 1000,120 1200,20 1600,20"
            fill="none"
          />
        </defs>

        {/* AI ribbon band (behind — slightly lighter) */}
        <path
          d="M -400,20 C 0,20 200,120 450,160 C 580,182 620,182 750,160 C 1000,120 1200,20 1600,20"
          stroke="#6B5740"
          strokeWidth="36"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* AI text */}
        <text
          ref={aiTextRef}
          fill="#FAF8F3"
          fontSize="13"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.02em"
          opacity="0.8"
        >
          <textPath href="#aiPath" startOffset="0">
            {aiTripled}
          </textPath>
        </text>

        {/* Caller ribbon band (in front — darker) */}
        <path
          d="M -400,220 C 0,220 200,120 450,80 C 580,58 620,58 750,80 C 1000,120 1200,220 1600,220"
          stroke="#3D3425"
          strokeWidth="36"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Caller text */}
        <text
          ref={callerTextRef}
          fill="#FAF8F3"
          fontSize="13"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.02em"
          opacity="0.85"
        >
          <textPath href="#callerPath" startOffset="0">
            {callerTripled}
          </textPath>
        </text>
      </svg>

      {/* Voice bars icon at the crossing point */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-[#FAF8F3] border-2 border-[#3D3425] rounded-2xl px-5 py-3 flex items-end gap-[3px] shadow-lg shadow-[#3D3425]/20" style={{ height: 56 }}>
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
