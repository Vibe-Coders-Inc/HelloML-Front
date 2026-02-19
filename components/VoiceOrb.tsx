'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface VoiceOrbProps {
  state: 'idle' | 'connecting' | 'active' | 'ended';
  audioLevel: number; // 0-1
  aiSpeaking: boolean;
  onClick?: () => void;
}

export function VoiceOrb({ state, audioLevel, aiSpeaking, onClick }: VoiceOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const isActive = state === 'active';
  const isConnecting = state === 'connecting';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const size = 300;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2); // retina

    const draw = () => {
      timeRef.current += 0.012;
      const t = timeRef.current;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const baseRadius = isActive ? 80 + audioLevel * 30 : isConnecting ? 80 : 80;
      const blobCount = 6;

      // Draw multiple layered blobs for Siri-like effect
      const layers = [
        { offset: 0, alpha: 0.12, radiusMult: 1.4, colors: aiSpeaking ? ['#C084FC', '#818CF8', '#6366F1'] : ['#8B6F47', '#C9A87C', '#A67A5B'] },
        { offset: 0.5, alpha: 0.18, radiusMult: 1.2, colors: aiSpeaking ? ['#A78BFA', '#7C3AED', '#8B5CF6'] : ['#A67A5B', '#8B6F47', '#D4B896'] },
        { offset: 1.0, alpha: 0.35, radiusMult: 1.0, colors: aiSpeaking ? ['#8B5CF6', '#6D28D9', '#7C3AED'] : ['#C9A87C', '#B89B6A', '#8B6F47'] },
      ];

      for (const layer of layers) {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * layer.radiusMult);
        grad.addColorStop(0, layer.colors[0] + Math.round(layer.alpha * 255).toString(16).padStart(2, '0'));
        grad.addColorStop(0.5, layer.colors[1] + Math.round(layer.alpha * 200).toString(16).padStart(2, '0'));
        grad.addColorStop(1, layer.colors[2] + '00');

        ctx.beginPath();
        for (let i = 0; i <= blobCount * 10; i++) {
          const angle = (i / (blobCount * 10)) * Math.PI * 2;
          const wobble = isActive
            ? Math.sin(angle * blobCount + t * 2 + layer.offset) * (10 + audioLevel * 25)
              + Math.sin(angle * (blobCount - 2) + t * 3.3 + layer.offset * 2) * (6 + audioLevel * 15)
            : isConnecting
              ? Math.sin(angle * blobCount + t * 1.5 + layer.offset) * 8
              : Math.sin(angle * blobCount + t * 0.8 + layer.offset) * 4;
          const r = baseRadius * layer.radiusMult + wobble;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Inner bright core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 0.6);
      if (aiSpeaking) {
        coreGrad.addColorStop(0, 'rgba(167, 139, 250, 0.5)');
        coreGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
        coreGrad.addColorStop(1, 'rgba(109, 40, 217, 0)');
      } else {
        coreGrad.addColorStop(0, 'rgba(201, 168, 124, 0.5)');
        coreGrad.addColorStop(0.5, 'rgba(166, 122, 91, 0.2)');
        coreGrad.addColorStop(1, 'rgba(139, 111, 71, 0)');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, isConnecting, audioLevel, aiSpeaking]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
      {/* Canvas blob */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: 280, height: 280 }}
      />

      {/* Clickable center area */}
      <motion.button
        className="relative z-10 rounded-full flex items-center justify-center cursor-pointer"
        style={{ width: 140, height: 140 }}
        onClick={onClick}
        whileHover={state === 'idle' ? { scale: 1.05 } : undefined}
        whileTap={state === 'idle' ? { scale: 0.97 } : undefined}
      >
        {state === 'idle' && (
          <div className="flex flex-col items-center gap-2 text-[#6B553A]">
            <Mic className="w-8 h-8" />
            <span className="text-sm font-medium">Start Demo</span>
          </div>
        )}
        {isConnecting && (
          <motion.div
            className="w-6 h-6 border-2 border-[#8B6F47]/60 border-t-[#8B6F47] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {isActive && (
          <motion.div
            className="w-3 h-3 rounded-full bg-[#8B6F47]/60"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.button>
    </div>
  );
}
