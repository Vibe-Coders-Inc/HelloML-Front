'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export function VoiceWaveformHero() {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('.waveform-path');

    const waveStates = [
      [
        'M0,50 Q15,20 30,45 Q45,70 60,50 Q75,30 90,52 Q105,70 120,45 Q135,20 150,50 Q165,75 180,50 Q195,25 210,50 Q225,70 240,45 Q255,25 270,50 Q285,70 300,50',
        'M0,50 Q15,70 30,55 Q45,35 60,50 Q75,65 90,48 Q105,30 120,52 Q135,70 150,50 Q165,30 180,50 Q195,68 210,48 Q225,32 240,50 Q255,68 270,50 Q285,32 300,50',
      ],
      [
        'M0,50 Q20,15 40,42 Q60,68 80,50 Q100,32 120,52 Q140,70 160,45 Q180,20 200,50 Q220,75 240,42 Q260,18 280,50 Q295,68 300,50',
        'M0,50 Q20,72 40,55 Q60,35 80,50 Q100,62 120,45 Q140,28 160,52 Q180,72 200,50 Q220,28 240,55 Q260,72 280,48 Q295,30 300,50',
      ],
      [
        'M0,50 Q25,30 50,48 Q75,65 100,50 Q125,35 150,50 Q175,65 200,48 Q225,32 250,50 Q275,65 300,50',
        'M0,50 Q25,65 50,52 Q75,38 100,50 Q125,62 150,50 Q175,38 200,52 Q225,65 250,50 Q275,38 300,50',
      ],
    ];

    paths.forEach((path, i) => {
      const states = waveStates[i % waveStates.length];
      animate(path, {
        d: [{ to: states[0] }, { to: states[1] }, { to: states[0] }],
        duration: 3000 + i * 800,
        loop: true,
        ease: 'inOutSine',
      });
    });

    return () => {
      // cleanup handled by component unmount
    };
  }, []);

  return (
    <div className="flex items-center justify-center my-4 md:my-6 w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 300 100"
        className="w-full max-w-3xl h-32 sm:h-40 md:h-52"
        preserveAspectRatio="none"
      >
        <path
          className="waveform-path"
          d="M0,50 Q15,20 30,45 Q45,70 60,50 Q75,30 90,52 Q105,70 120,45 Q135,20 150,50 Q165,75 180,50 Q195,25 210,50 Q225,70 240,45 Q255,25 270,50 Q285,70 300,50"
          fill="none"
          stroke="rgba(139,111,71,0.5)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="waveform-path"
          d="M0,50 Q20,15 40,42 Q60,68 80,50 Q100,32 120,52 Q140,70 160,45 Q180,20 200,50 Q220,75 240,42 Q260,18 280,50 Q295,68 300,50"
          fill="none"
          stroke="rgba(139,111,71,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="waveform-path"
          d="M0,50 Q25,30 50,48 Q75,65 100,50 Q125,35 150,50 Q175,65 200,48 Q225,32 250,50 Q275,65 300,50"
          fill="none"
          stroke="rgba(139,111,71,0.15)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
