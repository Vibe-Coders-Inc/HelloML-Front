'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const vp = { once: true, margin: '-50px' as const };

/**
 * Two side-by-side visual cards:
 * LEFT — "Human" — animated voice waveform bars with warm gradient
 * RIGHT — "Machine" — circuit grid with animated traveling pulses
 * Both glass-morphic with rich color. Clear, bold, no ambiguity.
 */

function VoiceWaveCard() {
  const barCount = 32;
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0.2 + Math.random() * 0.6)
  );

  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.06;
      setBars(prev =>
        prev.map((_, i) => {
          const base = Math.sin(t + i * 0.3) * 0.35 + 0.5;
          const secondary = Math.sin(t * 1.7 + i * 0.5) * 0.15;
          const tertiary = Math.sin(t * 0.4 + i * 0.8) * 0.1;
          return Math.max(0.08, Math.min(1, base + secondary + tertiary));
        })
      );
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={vp}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-1 min-w-[260px] max-w-[340px] aspect-square rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #D4A574 0%, #8B6F47 50%, #6B5535 100%)',
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 rounded-3xl" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)',
      }} />

      {/* Label */}
      <div className="absolute top-5 left-6 z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Voice</span>
      </div>

      {/* Waveform bars */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="flex items-center gap-[3px] h-[55%] w-full">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-[height] duration-100"
              style={{
                height: `${h * 100}%`,
                background: `linear-gradient(180deg, rgba(255,255,255,${0.5 + h * 0.3}) 0%, rgba(255,255,255,0.1) 100%)`,
                alignSelf: 'center',
                minHeight: '4px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating text */}
      <div className="absolute bottom-5 left-6 right-6 z-10">
        <p className="text-white/90 text-sm font-medium">Natural conversation</p>
        <p className="text-white/40 text-xs mt-0.5">Warm, responsive, adaptive</p>
      </div>
    </motion.div>
  );
}

function CircuitCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 340;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Grid of circuit nodes
    const cols = 8;
    const rows = 8;
    const padding = 35;
    const spacingX = (size - padding * 2) / (cols - 1);
    const spacingY = (size - padding * 2) / (rows - 1);

    interface Node { x: number; y: number; connections: number[] }
    const nodes: Node[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padding + c * spacingX;
        const y = padding + r * spacingY;
        const idx = r * cols + c;
        const connections: number[] = [];
        // Right connection
        if (c < cols - 1 && Math.random() > 0.2) connections.push(idx + 1);
        // Down connection
        if (r < rows - 1 && Math.random() > 0.2) connections.push(idx + cols);
        // Diagonal
        if (c < cols - 1 && r < rows - 1 && Math.random() > 0.7) connections.push(idx + cols + 1);
        nodes.push({ x, y, connections });
      }
    }

    // Pulses
    interface Pulse { from: number; to: number; progress: number; speed: number }
    let pulses: Pulse[] = [];
    let time = 0;

    const loop = () => {
      time += 0.016;
      ctx.clearRect(0, 0, size, size);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        for (const ci of node.connections) {
          const target = nodes[ci];
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          // L-shaped paths (circuit board style)
          if (Math.abs(target.x - node.x) > 1 && Math.abs(target.y - node.y) > 1) {
            ctx.lineTo(target.x, node.y);
            ctx.lineTo(target.x, target.y);
          } else {
            ctx.lineTo(target.x, target.y);
          }
          ctx.stroke();
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(time * 2 + i * 0.5) * 0.5 + 0.5;

        // Glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        glow.addColorStop(0, `rgba(255, 230, 180, ${0.15 + pulse * 0.15})`);
        glow.addColorStop(1, 'rgba(255, 230, 180, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Dot
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + pulse * 0.35})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Spawn pulses
      if (Math.random() < 0.12) {
        const startIdx = Math.floor(Math.random() * nodes.length);
        const node = nodes[startIdx];
        if (node.connections.length > 0) {
          const toIdx = node.connections[Math.floor(Math.random() * node.connections.length)];
          pulses.push({ from: startIdx, to: toIdx, progress: 0, speed: 0.015 + Math.random() * 0.02 });
        }
      }

      // Draw pulses
      pulses = pulses.filter(p => {
        p.progress += p.speed;
        if (p.progress >= 1) return false;
        const from = nodes[p.from];
        const to = nodes[p.to];
        const alpha = Math.sin(p.progress * Math.PI);

        let x: number, y: number;
        // L-shaped interpolation
        if (Math.abs(to.x - from.x) > 1 && Math.abs(to.y - from.y) > 1) {
          if (p.progress < 0.5) {
            const t = p.progress * 2;
            x = from.x + (to.x - from.x) * t;
            y = from.y;
          } else {
            const t = (p.progress - 0.5) * 2;
            x = to.x;
            y = from.y + (to.y - from.y) * t;
          }
        } else {
          x = from.x + (to.x - from.x) * p.progress;
          y = from.y + (to.y - from.y) * p.progress;
        }

        // Bright pulse
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
        glow.addColorStop(0, `rgba(255, 220, 150, ${alpha * 0.8})`);
        glow.addColorStop(0.5, `rgba(255, 180, 100, ${alpha * 0.3})`);
        glow.addColorStop(1, 'rgba(255, 180, 100, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={vp}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-1 min-w-[260px] max-w-[340px] aspect-square rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #5C4A35 0%, #3D3425 50%, #2A2318 100%)',
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 rounded-3xl" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)',
      }} />

      {/* Label */}
      <div className="absolute top-5 left-6 z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Logic</span>
      </div>

      {/* Circuit canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Floating text */}
      <div className="absolute bottom-5 left-6 right-6 z-10">
        <p className="text-white/80 text-sm font-medium">Precision processing</p>
        <p className="text-white/35 text-xs mt-0.5">Fast, reliable, structured</p>
      </div>
    </motion.div>
  );
}

export function FaceGearMorph() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 my-8 w-full max-w-[720px] mx-auto px-4">
      <VoiceWaveCard />
      <CircuitCard />
    </div>
  );
}
