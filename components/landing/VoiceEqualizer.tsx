'use client';

import { useEffect, useRef } from 'react';

/**
 * Premium flowing voice waveform — wisprflow-inspired.
 * Full-width sweeping organic wave, bold and prominent.
 * Canvas-based, 60fps.
 */

export function VoiceEqualizer({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      const W = rect?.width || 800;
      const H = 140;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width / (window.devicePixelRatio || 1);
      const H = canvas.height / (window.devicePixelRatio || 1);
      const centerY = H / 2;
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      // Primary bold wave with filled body
      drawFilledWave(ctx, W, centerY, t, {
        amp: 35, freq: 6, phase: 0, speed: 1,
        color: [139, 111, 71], strokeWidth: 3, fillOpacity: 0.12,
      });

      // Secondary wave — offset, thinner
      drawFilledWave(ctx, W, centerY, t, {
        amp: 22, freq: 5, phase: 2.2, speed: -0.7,
        color: [166, 122, 91], strokeWidth: 1.8, fillOpacity: 0.06,
      });

      // Tertiary accent
      drawFilledWave(ctx, W, centerY, t, {
        amp: 15, freq: 8, phase: 4.5, speed: 1.3,
        color: [139, 111, 71], strokeWidth: 1, fillOpacity: 0.04,
      });

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={`w-full ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full" style={{ height: 140 }} />
    </div>
  );
}

interface WaveConfig {
  amp: number;
  freq: number;     // number of full cycles across width
  phase: number;
  speed: number;
  color: [number, number, number];
  strokeWidth: number;
  fillOpacity: number;
}

function drawFilledWave(
  ctx: CanvasRenderingContext2D,
  W: number, centerY: number, t: number,
  cfg: WaveConfig
) {
  const { amp, freq, phase, speed, color, strokeWidth, fillOpacity } = cfg;
  const [r, g, b] = color;

  // Build wave points
  const pts: [number, number][] = [];
  for (let x = 0; x <= W; x += 2) {
    const nx = x / W;
    // Soft envelope — strongest in center
    const env = Math.pow(Math.sin(nx * Math.PI), 1.2);
    // Main sine + harmonics for organic feel
    const angle = nx * Math.PI * 2 * freq + t * speed * 50 + phase;
    const y = (
      Math.sin(angle) +
      0.3 * Math.sin(angle * 2.1 + 1.3) +
      0.15 * Math.sin(angle * 0.5 + 2.8)
    ) * amp * env;
    pts.push([x, centerY + y]);
  }

  // Filled body — wave to center
  ctx.beginPath();
  pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.lineTo(W, centerY);
  ctx.lineTo(0, centerY);
  ctx.closePath();
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;
  ctx.fill();

  // Mirror below
  ctx.beginPath();
  pts.forEach(([x, y], i) => {
    const my = centerY - (y - centerY) * 0.5;
    i === 0 ? ctx.moveTo(x, my) : ctx.lineTo(x, my);
  });
  ctx.lineTo(W, centerY);
  ctx.lineTo(0, centerY);
  ctx.closePath();
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillOpacity * 0.5})`;
  ctx.fill();

  // Stroke
  if (strokeWidth > 0) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}
