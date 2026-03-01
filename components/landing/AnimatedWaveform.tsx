'use client';

import { useEffect, useRef } from 'react';

/**
 * Anime.js SVG waveform that draws on mount with a flowing animation.
 * 3 layered sine waves with different amplitudes/phases.
 */
export function AnimatedWaveform({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let mounted = true;
    let animFrameId: number;

    // Dynamically import anime.js (v4)
    import('animejs').then(({ animate, svg: animeSvg, createTimeline, stagger }) => {
      if (!mounted || !svgRef.current) return;

      const paths = svgRef.current.querySelectorAll('.wave-path');
      
      // Draw each path with staggered timing
      const drawables = Array.from(paths).map(p => animeSvg.createDrawable(p as SVGPathElement));
      
      animate(drawables, {
        draw: '0 1',
        duration: 1800,
        delay: stagger(200),
        ease: 'inOutQuad',
      });

      // Continuous flowing phase shift
      let phase = 0;
      function updateWaves() {
        if (!mounted || !svgRef.current) return;
        phase += 0.02;
        const wavePaths = svgRef.current.querySelectorAll('.wave-path');
        wavePaths.forEach((path, i) => {
          const amplitude = 18 - i * 4;
          const frequency = 3 + i * 0.5;
          const speed = 1 + i * 0.3;
          let d = 'M 0 50';
          for (let x = 0; x <= 100; x++) {
            const y = 50 + Math.sin((x / 100) * Math.PI * frequency + phase * speed) * amplitude;
            d += ` L ${x * 4} ${y}`;
          }
          path.setAttribute('d', d);
        });
        animFrameId = requestAnimationFrame(updateWaves);
      }
      
      // Start flowing after draw completes
      setTimeout(() => updateWaves(), 2000);
    });

    return () => {
      mounted = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Generate initial static wave paths
  function staticWave(amplitude: number, frequency: number, phaseOffset: number) {
    let d = 'M 0 50';
    for (let x = 0; x <= 100; x++) {
      const y = 50 + Math.sin((x / 100) * Math.PI * frequency + phaseOffset) * amplitude;
      d += ` L ${x * 4} ${y}`;
    }
    return d;
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 100"
      className={className}
      style={{ width: '100%', maxWidth: '320px', height: 'auto' }}
    >
      <path
        className="wave-path"
        d={staticWave(18, 3, 0)}
        fill="none"
        stroke="#8B6F47"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        className="wave-path"
        d={staticWave(14, 3.5, 1)}
        fill="none"
        stroke="#D4A96A"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        className="wave-path"
        d={staticWave(10, 4, 2)}
        fill="none"
        stroke="#E8DCC8"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
