'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

interface VoiceOrbProps {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  audioLevel: number;
  aiSpeaking: boolean;
  onClick?: () => void;
}

/*
 * Simple 2D noise — good enough for organic blob edges.
 * Based on a basic gradient noise implementation.
 */
function createNoise() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Shuffle
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const grad2 = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];

  function dot(g: number[], x: number, y: number) {
    return g[0] * x + g[1] * y;
  }

  function fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a: number, b: number, t: number) {
    return a + t * (b - a);
  }

  return function noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[X] + Y] & 7;
    const ab = perm[perm[X] + Y + 1] & 7;
    const ba = perm[perm[X + 1] + Y] & 7;
    const bb = perm[perm[X + 1] + Y + 1] & 7;

    return lerp(
      lerp(dot(grad2[aa], xf, yf), dot(grad2[ba], xf - 1, yf), u),
      lerp(dot(grad2[ab], xf, yf - 1), dot(grad2[bb], xf - 1, yf - 1), u),
      v
    );
  };
}

/**
 * AI Voice Orb — canvas-based organic blob.
 * Uses Perlin noise to offset radius at each angle,
 * creating smooth, fluid, living edges like ChatGPT voice.
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef(createNoise());
  const timeRef = useRef(0);
  const frameRef = useRef(0);
  const audioRef = useRef(0); // smoothed audio level

  const isActive = state === 'active';
  const isConnecting = state === 'connecting';

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise = noiseRef.current;
    const dpr = window.devicePixelRatio || 1;
    const w = 300;
    const h = 300;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Smooth the audio level for buttery transitions
    audioRef.current += (audioLevel - audioRef.current) * 0.08;
    const smoothAudio = audioRef.current;

    // Time progression — controls how fast the blob morphs
    const speed = isActive ? 0.012 : isConnecting ? 0.008 : 0.005;
    timeRef.current += speed;
    const t = timeRef.current;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const baseRadius = 90;
    // How much the edges deform
    const deform = isActive ? 8 + smoothAudio * 18 : isConnecting ? 10 : 6;
    // Number of noise samples around the circle
    const points = 120;

    // Build the blob path
    const coords: [number, number][] = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const nx = Math.cos(angle) * 1.5;
      const ny = Math.sin(angle) * 1.5;
      // Layer multiple noise octaves for organic feel
      const n1 = noise(nx + t, ny + t) * deform;
      const n2 = noise(nx * 2 + t * 1.3 + 100, ny * 2 + t * 1.3 + 100) * deform * 0.4;
      const r = baseRadius + n1 + n2 + (isActive ? smoothAudio * 6 : 0);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      coords.push([x, y]);
    }

    // Draw filled blob with gradient
    const gradient = ctx.createRadialGradient(
      cx - 25, cy - 25, 10,
      cx, cy, baseRadius + deform + 10
    );
    if (aiSpeaking) {
      gradient.addColorStop(0, 'rgba(220, 185, 140, 1)');
      gradient.addColorStop(0.4, 'rgba(170, 130, 75, 1)');
      gradient.addColorStop(0.7, 'rgba(139, 111, 71, 1)');
      gradient.addColorStop(1, 'rgba(80, 58, 32, 1)');
    } else {
      gradient.addColorStop(0, 'rgba(230, 200, 155, 1)');
      gradient.addColorStop(0.35, 'rgba(185, 150, 95, 1)');
      gradient.addColorStop(0.65, 'rgba(150, 115, 65, 1)');
      gradient.addColorStop(1, 'rgba(90, 65, 38, 1)');
    }

    // Draw smooth blob using quadratic curves
    ctx.beginPath();
    ctx.moveTo(coords[0][0], coords[0][1]);
    for (let i = 0; i < coords.length - 1; i++) {
      const xc = (coords[i][0] + coords[i + 1][0]) / 2;
      const yc = (coords[i][1] + coords[i + 1][1]) / 2;
      ctx.quadraticCurveTo(coords[i][0], coords[i][1], xc, yc);
    }
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Glossy highlight
    const hlGrad = ctx.createRadialGradient(
      cx - 30, cy - 35, 5,
      cx - 10, cy - 15, baseRadius * 0.7
    );
    hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    hlGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
    hlGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = hlGrad;
    ctx.fill();

    // Outer glow
    ctx.shadowColor = `rgba(139, 111, 71, ${0.15 + (isActive ? smoothAudio * 0.3 : 0)})`;
    ctx.shadowBlur = 30 + (isActive ? smoothAudio * 30 : 0);
    ctx.strokeStyle = 'transparent';
    ctx.stroke();
    ctx.shadowBlur = 0;

    frameRef.current = requestAnimationFrame(draw);
  }, [audioLevel, isActive, isConnecting, aiSpeaking]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [draw]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
      {/* Canvas blob */}
      <canvas
        ref={canvasRef}
        style={{ width: 300, height: 300 }}
        className="absolute inset-0"
      />

      {/* Clickable center */}
      <motion.button
        className="relative z-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{ width: 200, height: 200 }}
        onClick={onClick}
        whileHover={state === 'idle' ? { scale: 1.04 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      >
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-2 text-white/80 drop-shadow-lg">
            <Mic className="w-8 h-8" />
            <span className="text-sm font-medium">Start Demo</span>
          </div>
        )}
        {isConnecting && (
          <motion.div
            className="w-6 h-6 border-2 border-white/40 border-t-white/90 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {isActive && (
          <motion.div
            className="flex items-end gap-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ height: 32 }}
          >
            {Array.from({ length: 7 }, (_, i) => {
              const center = 3;
              const dist = Math.abs(i - center) / center;
              const maxH = 28 - dist * 14;
              const barH = 6 + audioLevel * (maxH - 6);
              return (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    transformOrigin: 'bottom',
                  }}
                  animate={{ height: barH }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                />
              );
            })}
          </motion.div>
        )}
        {state === 'ended' && (
          <div className="text-white/60 text-sm font-medium drop-shadow">Done</div>
        )}
      </motion.button>
    </div>
  );
}
