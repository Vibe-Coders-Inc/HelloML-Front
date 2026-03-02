'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

interface VoiceOrbProps {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  audioLevel: number;
  aiSpeaking: boolean;
  voice?: string;
  onClick?: () => void;
}

// Each voice gets a unique color palette: [highlight, mid, deep, glow]
// All designed to look good on cream #FAF6F0 background
const VOICE_PALETTES: Record<string, { hi: [number,number,number]; mid: [number,number,number]; deep: [number,number,number]; glow: [number,number,number] }> = {
  ash:     { hi: [230, 200, 155], mid: [185, 145, 90],  deep: [120, 85, 45],  glow: [200, 160, 100] }, // warm gold (default)
  alloy:   { hi: [200, 210, 220], mid: [140, 155, 175], deep: [80, 95, 120],  glow: [160, 175, 195] }, // cool silver
  ballad:  { hi: [220, 180, 200], mid: [175, 120, 155], deep: [120, 65, 100], glow: [195, 150, 180] }, // dusty rose
  coral:   { hi: [235, 190, 170], mid: [200, 140, 110], deep: [140, 80, 55],  glow: [215, 165, 140] }, // warm coral
  echo:    { hi: [180, 200, 210], mid: [120, 150, 170], deep: [65, 95, 120],  glow: [150, 175, 190] }, // slate blue
  sage:    { hi: [190, 215, 185], mid: [130, 165, 125], deep: [75, 110, 70],  glow: [160, 190, 155] }, // muted sage
  shimmer: { hi: [225, 210, 230], mid: [180, 160, 195], deep: [120, 100, 140], glow: [200, 185, 210] }, // soft lavender
  verse:   { hi: [215, 205, 180], mid: [170, 155, 120], deep: [115, 100, 65],  glow: [190, 180, 150] }, // warm khaki
  marin:   { hi: [185, 215, 210], mid: [125, 170, 165], deep: [70, 115, 110],  glow: [155, 190, 185] }, // seafoam
};

/**
 * AI Voice Orb — Luminous gradient sphere with per-voice color palettes.
 * Drifting white hotspot, color-shifting gradients, grain overlay, outer glow.
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, voice = 'ash', onClick }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const audioRef = useRef(0);
  const scaleRef = useRef(1);
  const grainDataRef = useRef<ImageData | null>(null);
  // Smooth color transitions when voice changes
  const initPalette = VOICE_PALETTES[voice] || VOICE_PALETTES.ash;
  const currentColorRef = useRef({ hi: [...initPalette.hi], mid: [...initPalette.mid], deep: [...initPalette.deep], glow: [...initPalette.glow] });

  const isActive = state === 'active';
  const isConnecting = state === 'connecting';

  const palette = useMemo(() => VOICE_PALETTES[voice] || VOICE_PALETTES.ash, [voice]);

  const generateGrain = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 18;
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

    // Smooth audio
    audioRef.current += (audioLevel - audioRef.current) * 0.08;
    const audio = audioRef.current;

    // Smooth color transition (lerp toward target palette)
    const cc = currentColorRef.current;
    const lerpRate = 0.04;
    for (let i = 0; i < 3; i++) {
      cc.hi[i] += (palette.hi[i] - cc.hi[i]) * lerpRate;
      cc.mid[i] += (palette.mid[i] - cc.mid[i]) * lerpRate;
      cc.deep[i] += (palette.deep[i] - cc.deep[i]) * lerpRate;
      cc.glow[i] += (palette.glow[i] - cc.glow[i]) * lerpRate;
    }

    // Scale breathing
    const targetScale = isActive
      ? 1 + audio * 0.12 + (aiSpeaking ? 0.03 * Math.sin(timeRef.current * 2) : 0)
      : isConnecting
      ? 1 + 0.02 * Math.sin(timeRef.current * 3)
      : 1 + 0.015 * Math.sin(timeRef.current * 0.8);
    scaleRef.current += (targetScale - scaleRef.current) * 0.06;

    const speed = isActive ? 0.012 : isConnecting ? 0.008 : 0.005;
    timeRef.current += speed;
    const t = timeRef.current;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const baseR = 120;
    const r = baseR * scaleRef.current;

    const [hr, hg, hb] = cc.hi;
    const [mr, mg, mb] = cc.mid;
    const [dr, dg, db] = cc.deep;
    const [gr, gg, gb] = cc.glow;

    // === Outer glow ===
    const glowSize = r * 1.6 + (isActive ? audio * 40 : 0);
    const glowAlpha = 0.25 + (isActive ? audio * 0.2 : 0.05 * Math.sin(t * 0.5));
    const glow = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, glowSize);
    glow.addColorStop(0, `rgba(${gr|0}, ${gg|0}, ${gb|0}, ${glowAlpha * 0.4})`);
    glow.addColorStop(0.4, `rgba(${gr|0}, ${gg|0}, ${gb|0}, ${glowAlpha * 0.15})`);
    glow.addColorStop(1, `rgba(${gr|0}, ${gg|0}, ${gb|0}, 0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // === Main sphere gradient ===
    const colorPhase = t * 0.3;
    const c1r = hr + 20 * Math.sin(colorPhase);
    const c1g = hg + 15 * Math.sin(colorPhase + 1);
    const c1b = hb + 20 * Math.sin(colorPhase + 2);
    const c2r = mr + 15 * Math.sin(colorPhase + 3);
    const c2g = mg + 10 * Math.sin(colorPhase + 0.5);
    const c2b = mb + 15 * Math.sin(colorPhase + 1.5);
    const c3r = dr + 15 * Math.sin(colorPhase + 2);
    const c3g = dg + 10 * Math.sin(colorPhase + 3.5);
    const c3b = db + 10 * Math.sin(colorPhase + 1);

    const gradAngle = t * 0.15;
    const gx1 = cx + Math.cos(gradAngle) * r * 0.5;
    const gy1 = cy + Math.sin(gradAngle) * r * 0.5 - r * 0.3;
    const body = ctx.createRadialGradient(gx1, gy1, 0, cx, cy, r);
    body.addColorStop(0, `rgb(${c1r|0}, ${c1g|0}, ${c1b|0})`);
    body.addColorStop(0.45, `rgb(${c2r|0}, ${c2g|0}, ${c2b|0})`);
    body.addColorStop(0.85, `rgb(${c3r|0}, ${c3g|0}, ${c3b|0})`);
    body.addColorStop(1, `rgb(${(dr*0.5)|0}, ${(dg*0.5)|0}, ${(db*0.5)|0})`);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = body;
    ctx.fillRect(0, 0, size, size);

    // === Drifting white hotspot ===
    const hotspotAngle = t * 0.4;
    const hotspotDist = r * 0.3;
    const hx = cx + Math.cos(hotspotAngle) * hotspotDist + Math.sin(t * 0.7) * r * 0.1;
    const hy = cy + Math.sin(hotspotAngle * 0.7) * hotspotDist * 0.8 - r * 0.1;
    const hotspotR = r * (0.55 + (isActive ? audio * 0.15 : 0));
    const hotspotAlpha = 0.7 + (isActive ? audio * 0.2 : 0.1 * Math.sin(t * 0.6));

    const hotspot = ctx.createRadialGradient(hx, hy, 0, hx, hy, hotspotR);
    hotspot.addColorStop(0, `rgba(255, 252, 245, ${hotspotAlpha})`);
    hotspot.addColorStop(0.2, `rgba(255, 245, 225, ${hotspotAlpha * 0.6})`);
    hotspot.addColorStop(0.5, `rgba(${hr|0}, ${hg|0}, ${hb|0}, ${hotspotAlpha * 0.2})`);
    hotspot.addColorStop(1, `rgba(${mr|0}, ${mg|0}, ${mb|0}, 0)`);
    ctx.fillStyle = hotspot;
    ctx.fillRect(0, 0, size, size);

    // === Secondary color wash ===
    const wash2Angle = hotspotAngle + Math.PI + 0.5;
    const w2x = cx + Math.cos(wash2Angle) * r * 0.35;
    const w2y = cy + Math.sin(wash2Angle) * r * 0.35;
    const wash2 = ctx.createRadialGradient(w2x, w2y, 0, w2x, w2y, r * 0.6);
    wash2.addColorStop(0, `rgba(${dr|0}, ${dg|0}, ${db|0}, 0.5)`);
    wash2.addColorStop(1, `rgba(${(dr*0.7)|0}, ${(dg*0.7)|0}, ${(db*0.7)|0}, 0)`);
    ctx.fillStyle = wash2;
    ctx.fillRect(0, 0, size, size);

    // === Rim light ===
    const rim = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r);
    rim.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rim.addColorStop(0.6, 'rgba(255, 245, 220, 0.03)');
    rim.addColorStop(1, `rgba(255, 240, 200, ${0.12 + (isActive ? audio * 0.1 : 0)})`);
    ctx.fillStyle = rim;
    ctx.fillRect(0, 0, size, size);

    // === Grain texture ===
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

    ctx.restore();

    frameRef.current = requestAnimationFrame(draw);
  }, [audioLevel, isActive, isConnecting, aiSpeaking, palette, generateGrain]);

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
      <canvas ref={grainCanvasRef} style={{ display: 'none' }} />

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
