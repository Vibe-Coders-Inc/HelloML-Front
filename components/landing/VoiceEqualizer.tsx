'use client';

import { useEffect, useRef } from 'react';

/**
 * Premium flowing voice waveform — wisprflow-inspired.
 * Full-width organic wave with bold strokes and soft gradient fills.
 * Canvas-based, GPU-composited, 60fps.
 */

export function VoiceEqualizer({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 600;
    const H = 120;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const centerY = H / 2;
    let t = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      t += 0.012;
      ctx.clearRect(0, 0, W, H);

      // Layer 1: Soft filled wave (background glow)
      drawWave(ctx, W, H, centerY, t, {
        amp: 30, freq: 0.008, phase: 0, speed: 1,
        lineWidth: 0, fillAlpha: 0.08,
      });

      // Layer 2: Medium wave
      drawWave(ctx, W, H, centerY, t, {
        amp: 22, freq: 0.011, phase: 1.8, speed: 0.7,
        lineWidth: 2, strokeAlpha: 0.25, fillAlpha: 0.05,
      });

      // Layer 3: Primary bold wave
      drawWave(ctx, W, H, centerY, t, {
        amp: 26, freq: 0.009, phase: 0.5, speed: 1.2,
        lineWidth: 3.5, strokeAlpha: 0.6, fillAlpha: 0.1,
      });

      // Layer 4: Thin accent
      drawWave(ctx, W, H, centerY, t, {
        amp: 15, freq: 0.014, phase: 3.2, speed: -0.9,
        lineWidth: 1.2, strokeAlpha: 0.18, fillAlpha: 0,
      });

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className={`flex items-center justify-center w-full max-w-2xl mx-auto ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: 600, height: 120 }}
      />
    </div>
  );
}

interface WaveOpts {
  amp: number;
  freq: number;
  phase: number;
  speed: number;
  lineWidth: number;
  strokeAlpha?: number;
  fillAlpha: number;
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  W: number, H: number, centerY: number,
  t: number, opts: WaveOpts
) {
  const { amp, freq, phase, speed, lineWidth, strokeAlpha = 0, fillAlpha } = opts;

  // Build top path
  const points: [number, number][] = [];
  for (let x = 0; x <= W; x += 2) {
    const nx = x / W;
    // Bell envelope — tapers at edges
    const env = Math.pow(Math.sin(nx * Math.PI), 1.3);
    const y1 = Math.sin(x * freq + t * speed * 50 + phase) * amp;
    const y2 = Math.sin(x * freq * 2.3 + t * speed * 30 + phase + 2.1) * amp * 0.25;
    const y3 = Math.sin(x * freq * 0.5 + t * speed * 20 + phase + 4.0) * amp * 0.15;
    points.push([x, centerY + (y1 + y2 + y3) * env]);
  }

  // Stroke
  if (lineWidth > 0 && strokeAlpha > 0) {
    ctx.beginPath();
    points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    const grad = ctx.createLinearGradient(0, centerY - amp, 0, centerY + amp);
    grad.addColorStop(0, `rgba(139, 111, 71, ${strokeAlpha})`);
    grad.addColorStop(0.5, `rgba(166, 122, 91, ${strokeAlpha * 0.8})`);
    grad.addColorStop(1, `rgba(139, 111, 71, ${strokeAlpha * 0.5})`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  // Fill (mirrored below center for body)
  if (fillAlpha > 0) {
    ctx.beginPath();
    points.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
    // Close along centerline
    ctx.lineTo(W, centerY);
    ctx.lineTo(0, centerY);
    ctx.closePath();
    const fGrad = ctx.createLinearGradient(0, centerY - amp, 0, centerY);
    fGrad.addColorStop(0, `rgba(139, 111, 71, ${fillAlpha})`);
    fGrad.addColorStop(1, `rgba(139, 111, 71, 0)`);
    ctx.fillStyle = fGrad;
    ctx.fill();

    // Mirror fill below
    ctx.beginPath();
    points.forEach(([x, y], i) => {
      const mirrorY = centerY - (y - centerY) * 0.6;
      i === 0 ? ctx.moveTo(x, mirrorY) : ctx.lineTo(x, mirrorY);
    });
    ctx.lineTo(W, centerY);
    ctx.lineTo(0, centerY);
    ctx.closePath();
    const fGrad2 = ctx.createLinearGradient(0, centerY, 0, centerY + amp);
    fGrad2.addColorStop(0, `rgba(139, 111, 71, 0)`);
    fGrad2.addColorStop(1, `rgba(139, 111, 71, ${fillAlpha * 0.6})`);
    ctx.fillStyle = fGrad2;
    ctx.fill();
  }
}
