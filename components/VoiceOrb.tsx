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

/**
 * AI Voice Orb — Luminous gradient sphere inspired by Tommy Jepsen's Dribbble orb.
 * 
 * Key effects:
 * - Drifting white hotspot that slowly orbits inside the sphere
 * - Color gradient that shifts between warm tones (gold, amber, cream)
 * - Grain/noise texture overlay via SVG filter
 * - Soft outer glow halo that pulses with audio
 * - Gentle scale breathing, more pronounced when AI speaks
 * - Dark background context
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const audioRef = useRef(0);
  const scaleRef = useRef(1);
  const grainDataRef = useRef<ImageData | null>(null);

  const isActive = state === 'active';
  const isConnecting = state === 'connecting';

  // Pre-generate grain texture (static noise, regenerated periodically)
  const generateGrain = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 18; // very subtle
    }
    return imageData;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 360;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Smooth audio interpolation
    audioRef.current += (audioLevel - audioRef.current) * 0.08;
    const audio = audioRef.current;

    // Smooth scale interpolation (breathing + audio reactive)
    const targetScale = isActive
      ? 1 + audio * 0.12 + (aiSpeaking ? 0.03 * Math.sin(timeRef.current * 2) : 0)
      : isConnecting
      ? 1 + 0.02 * Math.sin(timeRef.current * 3)
      : 1 + 0.015 * Math.sin(timeRef.current * 0.8); // idle breathing
    scaleRef.current += (targetScale - scaleRef.current) * 0.06;

    const speed = isActive ? 0.012 : isConnecting ? 0.008 : 0.005;
    timeRef.current += speed;
    const t = timeRef.current;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const baseR = 120;
    const r = baseR * scaleRef.current;

    // === Outer glow (large, soft halo) ===
    const glowSize = r * 1.6 + (isActive ? audio * 40 : 0);
    const glowAlpha = 0.25 + (isActive ? audio * 0.2 : 0.05 * Math.sin(t * 0.5));
    const glow = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, glowSize);
    glow.addColorStop(0, `rgba(200, 160, 100, ${glowAlpha * 0.4})`);
    glow.addColorStop(0.4, `rgba(180, 140, 80, ${glowAlpha * 0.15})`);
    glow.addColorStop(1, 'rgba(139, 111, 71, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // === Main sphere base gradient ===
    // Color shifts over time between warm gold, amber, cream
    const colorPhase = t * 0.3;
    const c1r = 210 + 30 * Math.sin(colorPhase);
    const c1g = 175 + 25 * Math.sin(colorPhase + 1);
    const c1b = 120 + 30 * Math.sin(colorPhase + 2);
    const c2r = 170 + 20 * Math.sin(colorPhase + 3);
    const c2g = 130 + 15 * Math.sin(colorPhase + 0.5);
    const c2b = 70 + 20 * Math.sin(colorPhase + 1.5);
    const c3r = 120 + 25 * Math.sin(colorPhase + 2);
    const c3g = 85 + 20 * Math.sin(colorPhase + 3.5);
    const c3b = 45 + 15 * Math.sin(colorPhase + 1);

    // Gradient from top-left light to bottom-right dark
    const gradAngle = t * 0.15;
    const gx1 = cx + Math.cos(gradAngle) * r * 0.5;
    const gy1 = cy + Math.sin(gradAngle) * r * 0.5 - r * 0.3;
    const body = ctx.createRadialGradient(gx1, gy1, 0, cx, cy, r);
    body.addColorStop(0, `rgb(${Math.round(c1r)}, ${Math.round(c1g)}, ${Math.round(c1b)})`);
    body.addColorStop(0.45, `rgb(${Math.round(c2r)}, ${Math.round(c2g)}, ${Math.round(c2b)})`);
    body.addColorStop(0.85, `rgb(${Math.round(c3r)}, ${Math.round(c3g)}, ${Math.round(c3b)})`);
    body.addColorStop(1, 'rgb(70, 50, 30)');

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = body;
    ctx.fillRect(0, 0, size, size);

    // === Drifting white hotspot (the key effect) ===
    // Slowly orbits inside the sphere, creating the "light sweeping across" look
    const hotspotAngle = t * 0.4;
    const hotspotDist = r * 0.3;
    const hx = cx + Math.cos(hotspotAngle) * hotspotDist + Math.sin(t * 0.7) * r * 0.1;
    const hy = cy + Math.sin(hotspotAngle * 0.7) * hotspotDist * 0.8 - r * 0.1;
    const hotspotR = r * (0.55 + (isActive ? audio * 0.15 : 0));
    const hotspotAlpha = 0.7 + (isActive ? audio * 0.2 : 0.1 * Math.sin(t * 0.6));

    const hotspot = ctx.createRadialGradient(hx, hy, 0, hx, hy, hotspotR);
    hotspot.addColorStop(0, `rgba(255, 252, 245, ${hotspotAlpha})`);
    hotspot.addColorStop(0.2, `rgba(255, 245, 225, ${hotspotAlpha * 0.6})`);
    hotspot.addColorStop(0.5, `rgba(230, 200, 150, ${hotspotAlpha * 0.2})`);
    hotspot.addColorStop(1, 'rgba(200, 160, 100, 0)');
    ctx.fillStyle = hotspot;
    ctx.fillRect(0, 0, size, size);

    // === Secondary color wash (opposite side, adds depth) ===
    const wash2Angle = hotspotAngle + Math.PI + 0.5;
    const w2x = cx + Math.cos(wash2Angle) * r * 0.35;
    const w2y = cy + Math.sin(wash2Angle) * r * 0.35;
    const wash2 = ctx.createRadialGradient(w2x, w2y, 0, w2x, w2y, r * 0.6);
    const deepR = 130 + 30 * Math.sin(t * 0.4);
    const deepG = 85 + 20 * Math.sin(t * 0.3 + 1);
    const deepB = 40 + 20 * Math.sin(t * 0.5 + 2);
    wash2.addColorStop(0, `rgba(${Math.round(deepR)}, ${Math.round(deepG)}, ${Math.round(deepB)}, 0.5)`);
    wash2.addColorStop(1, 'rgba(100, 70, 35, 0)');
    ctx.fillStyle = wash2;
    ctx.fillRect(0, 0, size, size);

    // === Rim light (edge glow for 3D pop) ===
    const rim = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r);
    rim.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rim.addColorStop(0.6, 'rgba(255, 245, 220, 0.03)');
    rim.addColorStop(1, `rgba(255, 240, 200, ${0.12 + (isActive ? audio * 0.1 : 0)})`);
    ctx.fillStyle = rim;
    ctx.fillRect(0, 0, size, size);

    // === Grain texture overlay ===
    // Regenerate grain every ~10 frames for subtle movement
    if (!grainDataRef.current || Math.floor(t * 60) % 6 === 0) {
      grainDataRef.current = generateGrain(ctx, size, size);
    }
    if (grainDataRef.current) {
      const grainCanvas = grainCanvasRef.current;
      if (grainCanvas) {
        grainCanvas.width = size;
        grainCanvas.height = size;
        const gCtx = grainCanvas.getContext('2d');
        if (gCtx) {
          gCtx.putImageData(grainDataRef.current, 0, 0);
          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = 0.35;
          ctx.drawImage(grainCanvas, 0, 0);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
        }
      }
    }

    ctx.restore(); // unclip

    frameRef.current = requestAnimationFrame(draw);
  }, [audioLevel, isActive, isConnecting, aiSpeaking, generateGrain]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [draw]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 360, height: 360 }}>
      <canvas
        ref={canvasRef}
        style={{ width: 360, height: 360 }}
        className="absolute inset-0"
      />
      {/* Hidden canvas for grain compositing */}
      <canvas ref={grainCanvasRef} style={{ display: 'none' }} />

      {/* Clickable center overlay */}
      <motion.button
        className="relative z-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{ width: 240, height: 240 }}
        onClick={onClick}
        whileHover={state === 'idle' ? { scale: 1.04 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      >
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-2 text-white/90 drop-shadow-lg">
            <Mic className="w-8 h-8" />
            <span className="text-sm font-medium tracking-wide">Start Demo</span>
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
