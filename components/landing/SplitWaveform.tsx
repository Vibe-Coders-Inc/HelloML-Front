'use client';

import { useRef, useEffect } from 'react';

function generateOrganicPath(yOffset: number): string {
  const points: string[] = [];
  const segments = 20;
  const width = 400;
  const baseY = 100;

  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const t = i / segments;
    // Organic: irregular amplitude, rounded feel
    const amp = 30 + Math.sin(t * 3.2 + yOffset) * 15 + Math.cos(t * 7.1 + yOffset * 0.7) * 8;
    const y = baseY + Math.sin(t * Math.PI * 3 + yOffset) * amp * 0.6
      + Math.sin(t * Math.PI * 5.3 + yOffset * 1.3) * amp * 0.25;

    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      // Use smooth curves
      const prevX = ((i - 1) / segments) * width;
      const cpX = (prevX + x) / 2;
      points.push(`S ${cpX} ${y} ${x} ${y}`);
    }
  }
  return points.join(' ');
}

function generateMachinePath(yOffset: number): string {
  const points: string[] = [];
  const segments = 20;
  const width = 400;
  const baseY = 100;
  const startX = 400;

  for (let i = 0; i <= segments; i++) {
    const x = startX + (i / segments) * width;
    const t = i / segments;
    // Machine: regular, geometric, sharp
    const amp = 35;
    const y = baseY + Math.sin(t * Math.PI * 4 + yOffset) * amp
      * (1 - t * 0.3); // fade slightly toward the right

    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      // Sharp lines for geometric feel
      points.push(`L ${x} ${y}`);
    }
  }
  return points.join(' ');
}

export function SplitWaveform() {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const organicPath = svg.querySelector('.waveform-organic') as SVGPathElement;
    const machinePath = svg.querySelector('.waveform-machine') as SVGPathElement;
    if (!organicPath || !machinePath) return;

    let running = false;
    let rafId: number;

    function tick() {
      if (!running) return;
      frameRef.current += 0.025;
      const t = frameRef.current;

      // Add slight randomness to organic side
      const organicOffset = t + Math.sin(t * 0.7) * 0.3;
      organicPath.setAttribute('d', generateOrganicPath(organicOffset));
      machinePath.setAttribute('d', generateMachinePath(t));

      rafId = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          running = true;
          tick();
        } else {
          running = false;
          if (rafId) cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(svg);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full max-w-[800px] mx-auto mt-8">
      <svg
        ref={svgRef}
        viewBox="0 0 800 200"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradient for blending zone */}
        <defs>
          <linearGradient id="organicGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B6F47" />
            <stop offset="85%" stopColor="#8B6F47" />
            <stop offset="100%" stopColor="#A67A5B" />
          </linearGradient>
          <linearGradient id="machineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A67A5B" />
            <stop offset="15%" stopColor="#C4956A" />
            <stop offset="100%" stopColor="#C4956A" />
          </linearGradient>
          {/* Clip paths for blending at center */}
          <clipPath id="leftClip">
            <rect x="0" y="0" width="420" height="200" />
          </clipPath>
          <clipPath id="rightClip">
            <rect x="380" y="0" width="420" height="200" />
          </clipPath>
        </defs>

        {/* Organic waveform (left side, bleeds slightly past center) */}
        <path
          className="waveform-organic"
          d={generateOrganicPath(0)}
          stroke="url(#organicGrad)"
          strokeWidth="2.5"
          fill="none"
          clipPath="url(#leftClip)"
          strokeLinecap="round"
        />

        {/* Machine waveform (right side, bleeds slightly past center) */}
        <path
          className="waveform-machine"
          d={generateMachinePath(0)}
          stroke="url(#machineGrad)"
          strokeWidth="2"
          fill="none"
          clipPath="url(#rightClip)"
          strokeLinecap="round"
        />

        {/* Center blend line */}
        <line
          x1="400" y1="40" x2="400" y2="160"
          stroke="#A67A5B"
          strokeWidth="0.5"
          opacity="0.2"
        />
      </svg>
    </div>
  );
}
