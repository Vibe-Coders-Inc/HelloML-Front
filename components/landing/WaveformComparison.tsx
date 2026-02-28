'use client';

import { useEffect, useRef } from 'react';

export function WaveformComparison() {
  const smoothRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Simple CSS-based animations are used instead of animejs for reliability
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {/* IVR Side */}
        <div className="rounded-2xl border border-red-200/50 bg-red-50/30 p-5 md:p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-red-400/80 uppercase tracking-wider">Traditional IVR</span>
          </div>
          <svg viewBox="0 0 300 100" className="w-full h-20 md:h-24" preserveAspectRatio="none">
            <path d="M0,50 L10,15 L20,85 L30,10 L40,90 L50,20 L60,80 L70,12 L80,88 L90,18 L100,82 L110,15 L120,85 L130,20 L140,80 L150,50" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M150,50 L160,15 L170,85 L180,10 L190,90 L200,20 L210,80 L220,12 L230,88 L240,18 L250,82 L260,15 L270,85 L280,20 L290,80 L300,50" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-red-400/60 mt-3 text-center">Choppy. Robotic. Frustrating.</p>
        </div>

        {/* HelloML Side */}
        <div className="rounded-2xl border border-[#E8DCC8]/50 bg-gradient-to-br from-white/60 to-[#FAF8F3]/60 p-5 md:p-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-[#8B6F47] uppercase tracking-wider">HelloML</span>
          </div>
          <svg ref={smoothRef} viewBox="0 0 300 100" className="w-full h-20 md:h-24 waveform-smooth-anim" preserveAspectRatio="none">
            <path d="M0,50 Q15,30 30,48 Q45,65 60,50 Q75,35 90,52 Q105,62 120,48 Q135,32 150,50 Q165,65 180,48 Q195,32 210,52 Q225,62 240,48 Q255,35 270,50 Q285,60 300,50" fill="none" stroke="rgba(139,111,71,0.5)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M0,50 Q20,38 40,52 Q60,60 80,48 Q100,36 120,50 Q140,62 160,48 Q180,36 200,52 Q220,60 240,48 Q260,38 280,50 Q290,55 300,50" fill="none" stroke="rgba(139,111,71,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-[#8B6F47]/60 mt-3 text-center">Smooth. Natural. Human.</p>
        </div>
      </div>
    </div>
  );
}
