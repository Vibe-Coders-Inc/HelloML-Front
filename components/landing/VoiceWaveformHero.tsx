'use client';

import { useEffect, useRef } from 'react';
import anime from 'animejs';

export function VoiceWaveformHero() {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('.waveform-path');

    // Each path morphs between two organic wave shapes
    const waveStates = [
      [
        'M0,40 Q15,20 30,38 Q45,56 60,40 Q75,24 90,42 Q105,58 120,38 Q135,18 150,40 Q165,60 180,40 Q195,22 210,40 Q225,58 240,38 Q255,20 270,40 Q285,58 300,40',
        'M0,40 Q15,55 30,42 Q45,28 60,40 Q75,52 90,38 Q105,24 120,42 Q135,58 150,40 Q165,22 180,40 Q195,56 210,42 Q225,26 240,40 Q255,54 270,40 Q285,26 300,40',
      ],
      [
        'M0,40 Q20,15 40,35 Q60,55 80,40 Q100,25 120,42 Q140,58 160,38 Q180,18 200,40 Q220,60 240,35 Q260,15 280,42 Q295,55 300,40',
        'M0,40 Q20,58 40,45 Q60,30 80,40 Q100,50 120,38 Q140,25 160,42 Q180,58 200,40 Q220,22 240,45 Q260,60 280,38 Q295,22 300,40',
      ],
      [
        'M0,40 Q25,28 50,42 Q75,52 100,38 Q125,22 150,40 Q175,55 200,42 Q225,30 250,40 Q275,50 300,40',
        'M0,40 Q25,52 50,38 Q75,28 100,42 Q125,55 150,40 Q175,25 200,38 Q225,50 250,40 Q275,30 300,40',
      ],
    ];

    paths.forEach((path, i) => {
      const states = waveStates[i % waveStates.length];
      anime({
        targets: path,
        d: [{ value: states[0] }, { value: states[1] }, { value: states[0] }],
        duration: 3000 + i * 800,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'normal',
      });
    });

    return () => {
      anime.remove(paths);
    };
  }, []);

  return (
    <div className="flex items-center justify-center my-6 md:my-8">
      <svg
        ref={svgRef}
        viewBox="0 0 300 80"
        className="w-64 sm:w-80 md:w-96 h-16 sm:h-20"
        preserveAspectRatio="none"
      >
        <path
          className="waveform-path"
          d="M0,40 Q15,20 30,38 Q45,56 60,40 Q75,24 90,42 Q105,58 120,38 Q135,18 150,40 Q165,60 180,40 Q195,22 210,40 Q225,58 240,38 Q255,20 270,40 Q285,58 300,40"
          fill="none"
          stroke="rgba(139,111,71,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="waveform-path"
          d="M0,40 Q20,15 40,35 Q60,55 80,40 Q100,25 120,42 Q140,58 160,38 Q180,18 200,40 Q220,60 240,35 Q260,15 280,42 Q295,55 300,40"
          fill="none"
          stroke="rgba(139,111,71,0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          className="waveform-path"
          d="M0,40 Q25,28 50,42 Q75,52 100,38 Q125,22 150,40 Q175,55 200,42 Q225,30 250,40 Q275,50 300,40"
          fill="none"
          stroke="rgba(139,111,71,0.15)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
