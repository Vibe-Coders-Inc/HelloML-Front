'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  animate,
  MotionValue,
} from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { VoiceEqualizer } from '@/components/landing/VoiceEqualizer';
import { NoiseOverlay } from '@/components/landing/NoiseOverlay';
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react';

/* ═══════════════════════════════════════════
   HELLOML LANDING PAGE
   Sticky-pinned scroll sections (Apple/Linear pattern)
   Each section pins to viewport, content animates within
   ═══════════════════════════════════════════ */

/* ── SCROLL SLIDE ──
   Tall outer div + sticky inner = content pins while
   scroll progress drives entrance/exit animations.
   Creates the "slide by slide" experience. */
function ScrollSlide({
  children,
  height = '200vh',
  className = '',
}: {
  children: React.ReactNode;
  height?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.92, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [60, 0, 0, -40]);

  return (
    <div ref={ref} style={{ height }} className="relative">
      <motion.div
        style={{ opacity, scale, y }}
        className={`sticky top-0 h-screen flex items-center justify-center overflow-hidden will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── PINNED MULTI-STEP ──
   For sections with multiple content frames that
   crossfade as you scroll (Apple keynote style). */
function PinnedFrame({
  children,
  index,
  total,
  progress,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const enter = start + segment * 0.15;
  const hold = start + segment * 0.5;
  const exit = start + segment * 0.85;
  const end = start + segment;

  const opacity = useTransform(progress, [start, enter, hold, exit, end], [0, 1, 1, 1, 0]);
  const frameY = useTransform(progress, [start, enter, exit, end], [50, 0, 0, -50]);
  const frameScale = useTransform(progress, [start, enter, exit, end], [0.95, 1, 1, 0.95]);

  return (
    <motion.div
      style={{ opacity, y: frameY, scale: frameScale, position: 'absolute' }}
      className="text-center max-w-3xl px-6 will-change-transform"
    >
      {children}
    </motion.div>
  );
}

/* ── SVG ICONS ── */
const CalendarIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="2.5"/><line x1="8" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="2.5"/><line x1="16" y1="12" x2="16" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="32" y1="12" x2="32" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="24" cy="30" r="3" fill="currentColor"/></svg>
);
const DocumentIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none"><rect x="10" y="6" width="28" height="36" rx="4" stroke="currentColor" strokeWidth="2.5"/><line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/><line x1="16" y1="28" x2="30" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/></svg>
);
const TranscriptIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none"><rect x="6" y="8" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="2.5"/><line x1="12" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/><line x1="12" y1="30" x2="26" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/></svg>
);
const PhoneIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none"><path d="M38 32.5v4.5a3 3 0 01-3.27 3 29.7 29.7 0 01-12.95-4.61 29.27 29.27 0 01-9-9A29.7 29.7 0 018.17 13.27 3 3 0 0111.15 10H15.67a3 3 0 013 2.58 19.27 19.27 0 001.05 4.22 3 3 0 01-.68 3.16l-1.9 1.9a24 24 0 009 9l1.9-1.9a3 3 0 013.16-.68 19.27 19.27 0 004.22 1.05 3 3 0 012.58 3.07z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

/* ── HELPERS ── */
function CountUp({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (isInView) {
      const c = animate(0, target, { duration: 1.5, ease: [0.22, 1, 0.36, 1] as const, onUpdate: (v) => setDisplay(Math.round(v)) });
      return () => c.stop();
    }
  }, [isInView, target]);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function MagneticButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const handleMouse = (e: ReactMouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };
  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ x: springX, y: springY }} className={className}>
      {children}
    </motion.div>
  );
}

const integrations = [
  { name: 'Google Calendar', src: 'https://img.icons8.com/color/96/google-calendar--v1.png' },
  { name: 'Outlook', src: 'https://img.icons8.com/color/96/microsoft-outlook-2019--v2.png' },
  { name: 'Google Drive', src: 'https://img.icons8.com/color/96/google-drive--v1.png' },
];

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  /* ── Pain story: pinned multi-step ── */
  const painRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: painProgress } = useScroll({
    target: painRef,
    offset: ['start start', 'end end'],
  });

  /* ── Bold statement convergence ── */
  const stmtRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stmtScroll } = useScroll({
    target: stmtRef,
    offset: ['start end', 'end start'],
  });
  const stmtTalksX = useTransform(stmtScroll, [0.1, 0.4], [-200, 0]);
  const stmtHumanY = useTransform(stmtScroll, [0.15, 0.45], [100, 0]);
  const stmtWorksX = useTransform(stmtScroll, [0.2, 0.5], [200, 0]);
  const stmtMachineY = useTransform(stmtScroll, [0.25, 0.55], [100, 0]);
  const stmtOpacity = useTransform(stmtScroll, [0.05, 0.3], [0, 1]);
  const stmtWorksOp = useTransform(stmtScroll, [0.15, 0.45], [0, 0.25]);
  const stmtMachineOp = useTransform(stmtScroll, [0.2, 0.5], [0, 1]);
  const stmtLikeOp = useTransform(stmtScroll, [0.1, 0.4], [0, 0.35]);

  /* ── Dashboard clip-path ── */
  const dashRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: dashScroll } = useScroll({
    target: dashRef,
    offset: ['start start', 'end end'],
  });
  const dashClip = useTransform(dashScroll, [0, 0.6], ['inset(8% 30% 8% 30% round 16px)', 'inset(0% 0% 0% 0% round 16px)']);
  const dashScale = useTransform(dashScroll, [0, 0.6], [0.88, 1]);
  const dashTitleOp = useTransform(dashScroll, [0, 0.3], [0, 1]);
  const dashTitleY = useTransform(dashScroll, [0, 0.3], [40, 0]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F3]/80 backdrop-blur-xl border-b border-[#E8DCC8]/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
            <div className="scale-[0.65] sm:scale-[0.8] md:scale-100 origin-left"><Logo size="small" lightMode /></div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/auth?mode=signin" className="text-[#8B6F47] hover:text-[#A67A5B] font-medium text-sm transition-colors">Sign In</Link>
            <Link href="/auth?mode=signup">
              <Button className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-5 py-2 text-sm cursor-pointer">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════
         1. HERO (100vh, parallax exit)
         ════════════════════════════════════ */}
      <section className="h-screen flex flex-col items-center justify-center px-6 relative">
        <div className="max-w-4xl mx-auto text-center flex-1 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            <span className="text-[#8B6F47]/40">AI that </span>
            <span style={{ fontFamily: 'Borel, cursive' }} className="text-[#8B6F47]">answers</span>
            <br className="hidden sm:block" />
            <span className="text-[#8B6F47]"> your phone.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <VoiceEqualizer />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-[#8B7355] mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Built for contractors, clinics, and small businesses that can&apos;t afford to miss a call. Starting at{' '}
            <span style={{ fontFamily: 'Borel, cursive' }} className="text-[#8B6F47]">$5</span>/mo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-3 justify-center"
          >
            <MagneticButton>
              <Link href="/demo">
                <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 md:px-10 md:py-6 text-lg font-medium shadow-xl shadow-[#8B6F47]/25 group cursor-pointer">
                  Hear It Live <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </MagneticButton>
            <Link href="/auth?mode=signup">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-5 md:px-10 md:py-6 text-lg font-medium border-[#8B6F47]/30 text-[#8B6F47] hover:bg-[#8B6F47]/10 cursor-pointer">
                Start Free
              </Button>
            </Link>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-xs text-[#A67A5B]/50 mt-4">No credit card required</motion.p>
        </div>

        {/* Social proof at bottom */}
        <div className="w-full border-t border-[#E8DCC8]/30 pt-4 pb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#A67A5B]/60 font-medium mb-3 text-center">Built by engineers from</p>
          <div className="flex items-center justify-center gap-10 sm:gap-14 md:gap-20">
            <svg className="h-6 md:h-8 w-auto opacity-30" viewBox="0 0 170 170" fill="#8B6F47"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.92.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.75-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.4 7.09-28.32a41.66 41.66 0 0 1 14.84-15.07 39.82 39.82 0 0 1 20.07-5.65c3.92 0 9.06 1.21 15.43 3.59 6.35 2.39 10.42 3.6 12.22 3.6 1.35 0 5.92-1.42 13.67-4.24 7.32-2.62 13.5-3.7 18.56-3.27 13.71 1.11 24.02 6.52 30.86 16.27-12.27 7.44-18.33 17.86-18.2 31.22.12 10.41 3.89 19.07 11.28 25.94 3.35 3.18 7.1 5.64 11.25 7.39-.9 2.62-1.85 5.13-2.87 7.54zM119.04 7.01c0 8.16-2.98 15.78-8.92 22.82-7.17 8.4-15.85 13.25-25.25 12.49a25.4 25.4 0 0 1-.19-3.09c0-7.84 3.41-16.22 9.47-23.08 3.02-3.47 6.87-6.35 11.55-8.64 4.66-2.26 9.07-3.51 13.23-3.73.12 1.08.17 2.16.17 3.23h-.06z"/></svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/disney-logo.svg" alt="Disney" className="h-6 md:h-8 w-auto opacity-30" loading="lazy" style={{ filter: 'sepia(1) saturate(3) brightness(0.4) hue-rotate(350deg)' }} />
            <div className="flex flex-col items-center opacity-30">
              <span className="text-[9px] md:text-xs font-bold tracking-wider text-[#8B6F47] leading-tight">LAWRENCE LIVERMORE</span>
              <span className="text-[7px] md:text-[10px] font-medium tracking-widest text-[#8B6F47] leading-tight">NATIONAL LABORATORY</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
         2. PAIN STORY (pinned, 4 text frames crossfade)
         Apple keynote style: scroll to reveal each line
         ════════════════════════════════════ */}
      <div ref={painRef} style={{ height: '350vh' }} className="relative">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-[#F5F0E8]">
          <PinnedFrame index={0} total={5} progress={painProgress}>
            <p className="text-5xl sm:text-6xl md:text-8xl font-bold text-[#8B6F47] leading-tight" data-font="playfair">
              Your phone rings.
            </p>
          </PinnedFrame>

          <PinnedFrame index={1} total={5} progress={painProgress}>
            <p className="text-5xl sm:text-6xl md:text-8xl font-bold text-[#8B6F47] leading-tight" data-font="playfair">
              You&apos;re on a job.
            </p>
          </PinnedFrame>

          <PinnedFrame index={2} total={5} progress={painProgress}>
            <p className="text-5xl sm:text-6xl md:text-8xl font-bold text-[#8B6F47] leading-tight" data-font="playfair">
              They hang up.
            </p>
          </PinnedFrame>

          <PinnedFrame index={3} total={5} progress={painProgress}>
            <p className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#8B6F47] leading-tight" data-font="playfair">
              They call your competitor.
            </p>
          </PinnedFrame>

          <PinnedFrame index={4} total={5} progress={painProgress}>
            <div>
              <p className="text-2xl sm:text-3xl md:text-4xl text-[#8B7355] mb-3">
                80% of callers won&apos;t leave a voicemail.
              </p>
              <p className="text-lg md:text-xl text-[#A67A5B]/60">
                They&apos;ll call someone else.
              </p>
            </div>
          </PinnedFrame>
        </div>
      </div>

      {/* ════════════════════════════════════
         3. BOLD STATEMENT (scroll-driven convergence)
         ════════════════════════════════════ */}
      <ScrollSlide height="250vh" className="bg-[#FAF8F3]">
        <div ref={stmtRef} className="max-w-6xl mx-auto w-full px-4">
          <div className="flex items-baseline justify-center gap-3 sm:gap-6 md:gap-10 mb-2 md:mb-4">
            <motion.span style={{ x: stmtTalksX, opacity: stmtOpacity }} className="text-5xl sm:text-7xl md:text-[110px] lg:text-[130px] font-bold text-[#8B6F47] leading-none tracking-tight will-change-transform" data-font="playfair">Talks</motion.span>
            <motion.span style={{ opacity: stmtLikeOp }} className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-[#8B6F47] leading-none will-change-transform" data-font="borel">like a</motion.span>
          </div>
          <div className="flex justify-center md:justify-start md:pl-[12%] mb-2 md:mb-4">
            <motion.span style={{ y: stmtHumanY, opacity: stmtOpacity }} className="text-5xl sm:text-7xl md:text-[110px] lg:text-[130px] font-bold text-[#8B6F47] leading-none tracking-tight will-change-transform" data-font="playfair">human.</motion.span>
          </div>
          <div className="flex items-baseline justify-center md:justify-end md:pr-[5%] gap-3 sm:gap-6 md:gap-10 mb-2 md:mb-4">
            <motion.span style={{ x: stmtWorksX, opacity: stmtWorksOp }} className="text-5xl sm:text-7xl md:text-[110px] lg:text-[130px] font-bold text-[#8B6F47] leading-none tracking-tight will-change-transform" data-font="playfair">Works</motion.span>
            <motion.span style={{ opacity: stmtLikeOp }} className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-[#8B6F47] leading-none will-change-transform" data-font="borel">like a</motion.span>
          </div>
          <div className="flex justify-center md:justify-end md:pr-[12%]">
            <motion.span style={{ y: stmtMachineY, opacity: stmtMachineOp }} className="text-5xl sm:text-7xl md:text-[110px] lg:text-[130px] font-bold text-[#8B6F47] leading-none tracking-tight will-change-transform" data-font="playfair">machine.</motion.span>
          </div>
        </div>
      </ScrollSlide>

      {/* ════════════════════════════════════
         4. DASHBOARD (pinned clip-path reveal)
         ════════════════════════════════════ */}
      <div ref={dashRef} style={{ height: '250vh' }} className="relative">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F5F0E8] px-4">
          <motion.h2
            style={{ opacity: dashTitleOp, y: dashTitleY }}
            className="text-2xl md:text-4xl font-bold text-[#8B6F47] text-center mb-8 will-change-transform"
          >
            Every call. Every transcript. Every booking.
          </motion.h2>

          <motion.div
            style={{ clipPath: dashClip, scale: dashScale }}
            className="w-full max-w-5xl will-change-transform"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#E8DCC8]/50 shadow-2xl shadow-[#8B6F47]/10 bg-white">
              <div className="bg-[#F5EFE6] px-3 md:px-4 py-2 md:py-3 flex items-center gap-2 border-b border-[#E8DCC8]/60">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28C840]" />
                <div className="flex-1 mx-4 md:mx-12">
                  <div className="bg-white/60 rounded py-1 px-3 text-center">
                    <span className="text-[8px] md:text-[10px] text-[#8B7355]/50 font-medium">helloml.app/dashboard</span>
                  </div>
                </div>
              </div>
              <Image src="/dashboard-preview.png" alt="HelloML dashboard showing call logs, transcripts, and bookings" width={1600} height={1000} className="w-full h-auto block" priority />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════
         5. HOW IT WORKS
         ════════════════════════════════════ */}
      <ScrollSlide height="200vh" className="bg-[#FAF8F3]">
        <div className="max-w-5xl mx-auto w-full px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#8B6F47] mb-3">
              <span style={{ fontFamily: 'Borel, cursive' }}>Three steps.</span>{' '}Two minutes.
            </h2>
            <p className="text-sm md:text-base text-[#8B7355]">No technical skills needed.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {[
              { step: '01', icon: <DocumentIcon />, title: 'Tell us about your business', desc: 'What you do, your hours, your services. Takes 30 seconds.' },
              { step: '02', icon: <CalendarIcon />, title: 'Connect your calendar', desc: 'Google Calendar or Outlook. One click, 15 seconds.' },
              { step: '03', icon: <PhoneIcon />, title: 'Your phone starts answering', desc: 'Get a dedicated number. Calls are answered instantly.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#8B6F47]/10 text-[#8B6F47] mb-4">{s.icon}</div>
                <div className="text-xs font-bold text-[#A67A5B]/40 tracking-widest uppercase mb-2">{s.step}</div>
                <h3 className="text-lg md:text-xl font-bold text-[#8B6F47] mb-2">{s.title}</h3>
                <p className="text-sm text-[#8B7355] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSlide>

      {/* ════════════════════════════════════
         6. FEATURES
         ════════════════════════════════════ */}
      <ScrollSlide height="200vh" className="bg-[#F0EBE1]">
        <div className="max-w-4xl mx-auto w-full px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-[#8B6F47] text-center mb-10">
            Everything you need.{' '}
            <span style={{ fontFamily: 'Borel, cursive' }} className="text-[#8B6F47]/50">Nothing you don&apos;t.</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <CalendarIcon />, title: 'Books appointments', desc: 'Checks your availability and books directly on your calendar.' },
              { icon: <DocumentIcon />, title: 'Answers from your docs', desc: 'Upload FAQs, service lists, or menus. Answers questions in real time.' },
              { icon: <TranscriptIcon />, title: 'Full transcripts', desc: 'Every call is transcribed and summarized the moment it ends.' },
              { icon: <PhoneIcon />, title: 'Always on, 24/7', desc: 'A dedicated phone number that picks up around the clock.' },
            ].map((f, i) => (
              <div key={i} className="group p-5 md:p-6 rounded-2xl bg-white/80 border border-[#E8DCC8]/40 hover:border-[#8B6F47]/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#8B6F47]/8 transition-all duration-300 text-[#8B6F47]">
                <div className="mb-3 opacity-60">{f.icon}</div>
                <h3 className="text-base md:text-lg font-semibold mb-1">{f.title}</h3>
                <p className="text-[#8B7355] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollSlide>

      {/* ════════════════════════════════════
         7. DARK SECTION (integrations + stats)
         ════════════════════════════════════ */}
      <ScrollSlide height="220vh" className="bg-[#1a1a1a] rounded-3xl mx-2 md:mx-4 relative">
        <NoiseOverlay opacity={0.06} />
        <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#FAF8F3] mb-4">
            Works with the tools you{' '}
            <span style={{ fontFamily: 'Borel, cursive' }} className="text-[#D4A96A]">already</span>
            {' '}use.
          </h2>
          <p className="text-base md:text-lg text-[#FAF8F3]/40 mb-14">Connects to your calendar, docs, and workflows in seconds.</p>

          <div className="flex items-center justify-center gap-12 md:gap-20 mb-16">
            {integrations.map((logo, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-2xl hover:scale-110 transition-transform duration-300" loading="lazy" />
                <span className="text-xs text-[#FAF8F3]/30 font-medium">{logo.name}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-12">
            <div><div className="text-3xl md:text-5xl font-bold text-[#D4A96A]">&lt;<CountUp target={500} /><span className="text-lg md:text-2xl">ms</span></div><div className="text-xs text-[#FAF8F3]/30 mt-2">Response time</div></div>
            <div><div className="text-3xl md:text-5xl font-bold text-[#D4A96A]"><CountUp target={99} />.9<span className="text-lg md:text-2xl">%</span></div><div className="text-xs text-[#FAF8F3]/30 mt-2">Uptime</div></div>
            <div><div className="text-3xl md:text-5xl font-bold text-[#D4A96A]">24/7</div><div className="text-xs text-[#FAF8F3]/30 mt-2">Availability</div></div>
          </div>
        </div>
      </ScrollSlide>

      {/* ════════════════════════════════════
         8. PRICING + CTA
         ════════════════════════════════════ */}
      <ScrollSlide height="180vh" className="bg-[#FAF8F3]">
        <div className="text-center px-6">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#8B6F47] mb-4">
            <span style={{ fontFamily: 'Borel, cursive' }}>$5</span>/mo per agent.
          </h2>
          <p className="text-lg md:text-xl text-[#8B7355] mb-2">100 minutes included. $0.10/min after.</p>
          <p className="text-sm text-[#A67A5B]/50 mb-10">No contracts. No hidden fees. Cancel anytime.</p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <MagneticButton>
              <Link href="/auth?mode=signup">
                <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 md:px-10 md:py-6 text-lg font-medium shadow-xl shadow-[#8B6F47]/25 group cursor-pointer">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </MagneticButton>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-5 md:px-10 md:py-6 text-lg font-medium border-[#8B6F47]/30 text-[#8B6F47] hover:bg-[#8B6F47]/10 cursor-pointer">
                Try the Live Demo
              </Button>
            </Link>
          </div>
          <p className="text-xs text-[#A67A5B]/40 mt-4">No credit card required</p>
        </div>
      </ScrollSlide>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-[#E8DCC8]/30 bg-[#F0EBE1]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="small" lightMode />
          <div className="flex items-center gap-6 text-sm text-[#8B7355]">
            <Link href="/demo" className="hover:text-[#8B6F47] transition-colors">Demo</Link>
            <Link href="/pricing" className="hover:text-[#8B6F47] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#8B6F47] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#8B6F47] transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-[#8B6F47] transition-colors">Support</Link>
          </div>
          <p className="text-sm text-[#A67A5B]/40">&copy; 2026 HelloML</p>
        </div>
      </footer>
    </div>
  );
}
