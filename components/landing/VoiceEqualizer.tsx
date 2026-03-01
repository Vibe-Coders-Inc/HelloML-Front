'use client';

import { useEffect, useRef } from 'react';

/**
 * Single flowing voice curve — wisprflow-inspired.
 * One bold, clean, sweeping curve with subtle motion.
 * Minimal and confident. Not a busy equalizer.
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
      const parent = canvas.parentElement;
      const W = parent?.clientWidth || 800;
      const H = 100;
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
      const cy = H / 2;
      t += 0.004; // Slow, smooth movement
      ctx.clearRect(0, 0, W, H);

      // Single bold curve with subtle fill
      const pts: [number, number][] = [];
      for (let x = 0; x <= W; x += 2) {
        const nx = x / W;
        // Smooth envelope — rises in, holds, falls out
        const env = Math.sin(nx * Math.PI);
        // Single smooth sine with gentle harmonic
        const angle = nx * Math.PI * 2 * 2.5 + t * 20;
        const y = (Math.sin(angle) + 0.2 * Math.sin(angle * 2.3 + 0.8)) * 28 * env;
        pts.push([x, cy + y]);
      }

      // Soft gradient fill below curve
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, cy - 30, 0, H);
      fillGrad.addColorStop(0, 'rgba(139, 111, 71, 0.08)');
      fillGrad.addColorStop(1, 'rgba(139, 111, 71, 0)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // The bold stroke
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.strokeStyle = 'rgba(139, 111, 71, 0.45)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

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
      <canvas ref={canvasRef} className="w-full" style={{ height: 100 }} />
    </div>
  );
}
