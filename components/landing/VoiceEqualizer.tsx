'use client';

import { useEffect, useRef } from 'react';

/**
 * Premium voice waveform visualization — fluid, organic, wisprflow-inspired.
 * Uses a single canvas for a smooth flowing waveform with soft gradients.
 * GPU-composited, 60fps.
 */

export function VoiceEqualizer({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI
    const dpr = window.devicePixelRatio || 1;
    const W = 320;
    const H = 80;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const centerY = H / 2;

    // Multiple layered waves for organic feel
    const waves = [
      { amp: 18, freq: 0.012, speed: 0.025, phase: 0, alpha: 0.7 },
      { amp: 12, freq: 0.018, speed: -0.018, phase: 2.1, alpha: 0.5 },
      { amp: 8,  freq: 0.025, speed: 0.032, phase: 4.2, alpha: 0.35 },
      { amp: 5,  freq: 0.035, speed: -0.015, phase: 1.0, alpha: 0.2 },
    ];

    let time = 0;
    let animId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      for (const wave of waves) {
        time += wave.speed * 0.016; // ~60fps normalized

        ctx.beginPath();

        // Envelope: fade at edges using a bell curve
        for (let x = 0; x <= W; x++) {
          // Bell envelope — strong center, fading edges
          const t = x / W;
          const envelope = Math.pow(Math.sin(t * Math.PI), 1.5);

          // Composite sine for organic shape
          const y1 = Math.sin(x * wave.freq + time * 60 * wave.speed + wave.phase) * wave.amp;
          const y2 = Math.sin(x * wave.freq * 1.7 + time * 60 * wave.speed * 0.8 + wave.phase + 1.3) * wave.amp * 0.3;
          const y = (y1 + y2) * envelope;

          if (x === 0) {
            ctx.moveTo(x, centerY + y);
          } else {
            ctx.lineTo(x, centerY + y);
          }
        }

        // Gradient stroke
        const grad = ctx.createLinearGradient(0, centerY - 25, 0, centerY + 25);
        grad.addColorStop(0, `rgba(139, 111, 71, ${wave.alpha})`);
        grad.addColorStop(0.5, `rgba(166, 122, 91, ${wave.alpha * 0.9})`);
        grad.addColorStop(1, `rgba(139, 111, 71, ${wave.alpha * 0.6})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = wave === waves[0] ? 2.5 : 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Soft glow on primary wave — mirrored fill
      ctx.beginPath();
      const primaryWave = waves[0];
      for (let x = 0; x <= W; x++) {
        const t = x / W;
        const envelope = Math.pow(Math.sin(t * Math.PI), 1.5);
        const y1 = Math.sin(x * primaryWave.freq + time * 60 * primaryWave.speed + primaryWave.phase) * primaryWave.amp;
        const y2 = Math.sin(x * primaryWave.freq * 1.7 + time * 60 * primaryWave.speed * 0.8 + primaryWave.phase + 1.3) * primaryWave.amp * 0.3;
        const y = (y1 + y2) * envelope;

        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      // Mirror back along centerline for filled shape
      for (let x = W; x >= 0; x--) {
        const t = x / W;
        const envelope = Math.pow(Math.sin(t * Math.PI), 1.5);
        const y1 = Math.sin(x * primaryWave.freq + time * 60 * primaryWave.speed + primaryWave.phase) * primaryWave.amp;
        const y2 = Math.sin(x * primaryWave.freq * 1.7 + time * 60 * primaryWave.speed * 0.8 + primaryWave.phase + 1.3) * primaryWave.amp * 0.3;
        const y = (y1 + y2) * envelope;
        ctx.lineTo(x, centerY - y * 0.15); // Slight mirror for volume feel
      }
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, centerY - 20, 0, centerY + 20);
      fillGrad.addColorStop(0, 'rgba(139, 111, 71, 0.08)');
      fillGrad.addColorStop(0.5, 'rgba(166, 122, 91, 0.12)');
      fillGrad.addColorStop(1, 'rgba(139, 111, 71, 0.04)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    frameRef.current = animId;

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className={`flex items-center justify-center ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        style={{ width: 320, height: 80 }}
        className="opacity-90"
      />
    </div>
  );
}
