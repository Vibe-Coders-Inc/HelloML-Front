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
 * AI Voice Orb — Luminous glass sphere inspired by Dribbble AI orb.
 * Multiple layered radial gradients, ambient glow, color-shifting core.
 * Audio-reactive: core brightens and glow expands with voice input.
 */
export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const audioRef = useRef(0);

  const isActive = state === 'active';
  const isConnecting = state === 'connecting';

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Smooth audio
    audioRef.current += (audioLevel - audioRef.current) * 0.08;
    const audio = audioRef.current;

    const speed = isActive ? 0.008 : isConnecting ? 0.006 : 0.003;
    timeRef.current += speed;
    const t = timeRef.current;

    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const baseR = 95;

    // Audio-reactive sizing
    const pulse = isActive ? 1 + audio * 0.08 : 1;
    const r = baseR * pulse;

    // === Layer 1: Outer ambient glow (large, soft) ===
    const glowR = r * 1.8 + (isActive ? audio * 30 : 0);
    const glowAlpha = 0.12 + (isActive ? audio * 0.15 : 0);
    const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, glowR);
    // Shift between warm brown (idle/speaking) and golden (listening)
    if (aiSpeaking) {
      glow.addColorStop(0, `rgba(180, 140, 90, ${glowAlpha * 1.2})`);
      glow.addColorStop(0.4, `rgba(139, 111, 71, ${glowAlpha * 0.6})`);
      glow.addColorStop(1, 'rgba(139, 111, 71, 0)');
    } else {
      glow.addColorStop(0, `rgba(200, 165, 110, ${glowAlpha * 1.3})`);
      glow.addColorStop(0.4, `rgba(170, 130, 80, ${glowAlpha * 0.5})`);
      glow.addColorStop(1, 'rgba(139, 111, 71, 0)');
    }
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
    ctx.fill();

    // === Layer 2: Secondary glow ring (color accent) ===
    const ring = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.35);
    const accentShift = Math.sin(t * 0.5) * 0.5 + 0.5; // oscillate between warm and cool
    const accentR = Math.round(160 + accentShift * 40);
    const accentG = Math.round(120 + accentShift * 20);
    const accentB = Math.round(70 + (1 - accentShift) * 30);
    ring.addColorStop(0, `rgba(${accentR}, ${accentG}, ${accentB}, 0.08)`);
    ring.addColorStop(0.6, `rgba(${accentR}, ${accentG}, ${accentB}, 0.04)`);
    ring.addColorStop(1, 'rgba(139, 111, 71, 0)');
    ctx.fillStyle = ring;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // === Layer 3: Main sphere body (deep gradient) ===
    const body = ctx.createRadialGradient(
      cx - r * 0.15, cy - r * 0.2, r * 0.1,
      cx, cy, r
    );
    // Rich layered brown-to-dark gradient
    body.addColorStop(0, aiSpeaking ? 'rgba(220, 190, 145, 1)' : 'rgba(230, 200, 155, 1)');
    body.addColorStop(0.25, aiSpeaking ? 'rgba(185, 145, 90, 1)' : 'rgba(195, 155, 100, 1)');
    body.addColorStop(0.5, 'rgba(155, 120, 70, 1)');
    body.addColorStop(0.75, 'rgba(110, 82, 48, 1)');
    body.addColorStop(1, 'rgba(65, 48, 28, 1)');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // === Layer 4: Internal light source (shifts position with time) ===
    const lightX = cx + Math.sin(t * 0.7) * r * 0.15;
    const lightY = cy + Math.cos(t * 0.9) * r * 0.12 - r * 0.1;
    const lightR = r * (0.6 + (isActive ? audio * 0.2 : 0));
    const lightAlpha = 0.35 + (isActive ? audio * 0.25 : Math.sin(t) * 0.05);
    const light = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightR);
    light.addColorStop(0, `rgba(255, 235, 200, ${lightAlpha})`);
    light.addColorStop(0.3, `rgba(220, 180, 120, ${lightAlpha * 0.6})`);
    light.addColorStop(0.7, `rgba(180, 140, 80, ${lightAlpha * 0.2})`);
    light.addColorStop(1, 'rgba(139, 111, 71, 0)');
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // === Layer 5: Secondary internal light (opposite side, subtle) ===
    const light2X = cx - Math.sin(t * 0.5) * r * 0.2;
    const light2Y = cy + Math.cos(t * 0.6) * r * 0.15 + r * 0.15;
    const light2 = ctx.createRadialGradient(light2X, light2Y, 0, light2X, light2Y, r * 0.4);
    light2.addColorStop(0, `rgba(200, 160, 100, ${0.15 + (isActive ? audio * 0.1 : 0)})`);
    light2.addColorStop(1, 'rgba(139, 111, 71, 0)');
    ctx.fillStyle = light2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // === Layer 6: Glossy highlight (top-left specular) ===
    const hlX = cx - r * 0.28;
    const hlY = cy - r * 0.32;
    const hl = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, r * 0.55);
    hl.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    hl.addColorStop(0.25, 'rgba(255, 255, 255, 0.2)');
    hl.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    hl.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = hl;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // === Layer 7: Rim light (edge glow for 3D depth) ===
    const rim = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.02);
    rim.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rim.addColorStop(0.7, 'rgba(200, 170, 120, 0.06)');
    rim.addColorStop(1, `rgba(220, 190, 140, ${0.15 + (isActive ? audio * 0.15 : 0)})`);
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2);
    ctx.fill();

    // === Layer 8: Small bright specular dot (top) ===
    const dotX = cx - r * 0.2;
    const dotY = cy - r * 0.25;
    const dot = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, r * 0.12);
    dot.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    dot.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    dot.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = dot;
    ctx.beginPath();
    ctx.arc(dotX, dotY, r * 0.12, 0, Math.PI * 2);
    ctx.fill();

    frameRef.current = requestAnimationFrame(draw);
  }, [audioLevel, isActive, isConnecting, aiSpeaking]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [draw]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
      <canvas
        ref={canvasRef}
        style={{ width: 320, height: 320 }}
        className="absolute inset-0"
      />

      {/* Clickable center overlay */}
      <motion.button
        className="relative z-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{ width: 200, height: 200 }}
        onClick={onClick}
        whileHover={state === 'idle' ? { scale: 1.04 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      >
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-2 text-white/90 drop-shadow-lg">
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
