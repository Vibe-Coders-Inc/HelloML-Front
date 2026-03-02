'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const vp = { once: true, margin: '-50px' as const };

/**
 * Two side-by-side visual cards:
 * LEFT — "Human" — animated voice waveform bars with warm gradient
 * RIGHT — "Machine" — mini dashboard with auto-completing tasks + progress
 */

// ─── LEFT CARD: Voice Waveform ───

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

// ─── RIGHT CARD: Machine Dashboard ───

function AnimatedProgress({ delay, label, pct }: { delay: number; label: string; pct: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [delay, pct]);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-white/50">{label}</span>
        <span className="text-[10px] text-white/40">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #C4956A, #DEB887)',
          }}
        />
      </div>
    </div>
  );
}

function CheckItem({ label, delay }: { label: string; delay: number }) {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setChecked(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-300 ${checked ? 'bg-[#C4956A] border-[#C4956A]' : 'border-white/20'}`}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-xs transition-all duration-300 ${checked ? 'text-white/70 line-through' : 'text-white/40'}`}>{label}</span>
    </div>
  );
}

function MiniClock() {
  const [display, setDisplay] = useState('09:41');
  useEffect(() => {
    const times = ['09:41', '09:42', '09:43', '09:44', '09:45'];
    let idx = 0;
    const i = setInterval(() => {
      idx = (idx + 1) % times.length;
      setDisplay(times[idx]);
    }, 2000);
    return () => clearInterval(i);
  }, []);
  return <span className="font-mono text-lg text-white/80 tabular-nums">{display}</span>;
}

function MachineCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={vp}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-1 min-w-[260px] max-w-[340px] aspect-square rounded-3xl overflow-hidden p-5 flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #5C4A35 0%, #3D3425 50%, #2A2318 100%)',
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)',
      }} />

      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">Automated</span>
        <MiniClock />
      </div>

      {/* Task checklist — staggered auto-check */}
      <div className="space-y-2.5 mb-4 relative z-10">
        <CheckItem label="Answer incoming call" delay={800} />
        <CheckItem label="Identify caller intent" delay={1600} />
        <CheckItem label="Check calendar availability" delay={2400} />
        <CheckItem label="Book appointment" delay={3200} />
        <CheckItem label="Send confirmation SMS" delay={4000} />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 my-2 relative z-10" />

      {/* Progress bars */}
      <div className="space-y-3 relative z-10 flex-1">
        <AnimatedProgress label="Call processed" pct={100} delay={1000} />
        <AnimatedProgress label="Booking confirmed" pct={100} delay={2500} />
        <AnimatedProgress label="Follow-up queued" pct={72} delay={3500} />
      </div>

      {/* Status badge */}
      <div className="flex items-center gap-2 mt-3 relative z-10">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-[11px] text-white/50">All systems operational</span>
      </div>
    </motion.div>
  );
}

// ─── Export ───

export function FaceGearMorph() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 my-8 w-full max-w-[720px] mx-auto px-4">
      <VoiceWaveCard />
      <MachineCard />
    </div>
  );
}
