'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { VoiceWaveformHero } from '@/components/landing/VoiceWaveformHero';
import { WaveformComparison } from '@/components/landing/WaveformComparison';

/* ═══════════════════════════════════════════
   SCROLL-DRIVEN CONVERGENCE SECTION
   ═══════════════════════════════════════════ */
function ScatterWord({
  text,
  startX,
  startY,
  startScale,
  startRotate = 0,
  progress,
}: {
  text: string;
  startX: number;
  startY: number;
  startScale: number;
  startRotate?: number;
  progress: import('framer-motion').MotionValue<number>;
}) {
  const x = useTransform(progress, [0, 1], [startX, 0]);
  const y = useTransform(progress, [0, 1], [startY, 0]);
  const scale = useTransform(progress, [0, 1], [startScale, 1]);
  const rotate = useTransform(progress, [0, 1], [startRotate, 0]);
  const opacity = useTransform(progress, [0, 0.15, 1], [0, 1, 1]);

  return (
    <motion.span
      style={{ x, y, scale, rotate, opacity }}
      className="font-serif-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-[#8B6F47] tracking-tight inline-block"
    >
      {text}
    </motion.span>
  );
}

function ScatterConverge({
  words,
  className = '',
  centralElement,
}: {
  words: { text: string; startX: number; startY: number; startScale: number; startRotate?: number }[];
  className?: string;
  centralElement?: React.ReactNode;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', '0.6 0.5'],
  });

  const centralOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.8], [0.7, 0.4, 0.1]);
  const centralScale = useTransform(scrollYProgress, [0, 0.8], [1.1, 0.9]);

  return (
    <div ref={ref} className={`relative min-h-[50vh] flex items-center justify-center overflow-hidden ${className}`}>
      {centralElement && (
        <motion.div
          style={{ opacity: centralOpacity, scale: centralScale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <div className="w-full max-w-md">{centralElement}</div>
        </motion.div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 relative z-10">
        {words.map((w, i) => (
          <ScatterWord key={i} text={w.text} startX={w.startX} startY={w.startY} startScale={w.startScale} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   USE CASE CAROUSEL
   ═══════════════════════════════════════════ */
const useCases = [
  { label: 'The contractor on the job site.', text: 'Your agent books the estimate.' },
  { label: 'The stylist mid-appointment.', text: 'Your agent reschedules the no-show.' },
  { label: 'The attorney in court.', text: 'Your agent takes the message.' },
  { label: "The owner who can't be everywhere.", text: 'Your agent can.' },
];

function UseCaseCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % useCases.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-32 sm:h-28 max-w-lg mx-auto">
      {useCases.map((uc, i) => (
        <motion.div
          key={i}
          animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 12 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          style={{ pointerEvents: i === active ? 'auto' : 'none' }}
        >
          <p className="text-lg sm:text-xl text-[#8B7355] font-medium">
            {uc.label} <span className="text-[#8B6F47] font-semibold">{uc.text}</span>
          </p>
        </motion.div>
      ))}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button onClick={() => setActive((p) => (p - 1 + useCases.length) % useCases.length)} className="p-1 text-[#8B6F47]/40 hover:text-[#8B6F47]" aria-label="Previous">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {useCases.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-[#8B6F47] scale-125' : 'bg-[#E8DCC8]'}`} />
        ))}
        <button onClick={() => setActive((p) => (p + 1) % useCases.length)} className="p-1 text-[#8B6F47]/40 hover:text-[#8B6F47]" aria-label="Next">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INTEGRATION MARQUEE
   ═══════════════════════════════════════════ */
function IntegrationMarquee() {
  const logos = [
    { name: 'Google Calendar', src: 'https://img.icons8.com/color/96/google-calendar--v1.png' },
    { name: 'Outlook', src: 'https://img.icons8.com/color/96/microsoft-outlook-2019--v2.png' },
    { name: 'Google Drive', src: 'https://img.icons8.com/color/96/google-drive--v1.png' },
    { name: 'Notion', src: 'https://img.icons8.com/ios-filled/100/000000/notion.png' },
    { name: 'Dropbox', src: 'https://img.icons8.com/color/96/dropbox.png' },
  ];
  const doubled = [...logos, ...logos];
  return (
    <div className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F0EBE3] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F0EBE3] to-transparent z-10" />
      <div className="flex gap-12 animate-marquee">
        {doubled.map((l, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.src} alt={l.name} className="w-8 h-8" />
            <span className="text-sm text-[#8B7355]/60 font-medium whitespace-nowrap">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SVG ICONS (no emojis ever)
   ═══════════════════════════════════════════ */
const CalendarIcon = ({ light = false }: { light?: boolean }) => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="28" rx="4" stroke={light ? '#D4A96A' : '#8B6F47'} strokeWidth="2"/><line x1="8" y1="22" x2="40" y2="22" stroke={light ? '#D4A96A' : '#8B6F47'} strokeWidth="2"/><line x1="16" y1="12" x2="16" y2="7" stroke={light ? '#E8D5B5' : '#A67A5B'} strokeWidth="2" strokeLinecap="round"/><line x1="32" y1="12" x2="32" y2="7" stroke={light ? '#E8D5B5' : '#A67A5B'} strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="30" r="3" fill={light ? '#D4A96A' : '#8B6F47'}/></svg>
);
const DocumentIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="10" y="6" width="28" height="36" rx="4" stroke="#8B6F47" strokeWidth="2"/><line x1="16" y1="16" x2="32" y2="16" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="22" x2="28" y2="22" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="28" x2="30" y2="28" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/></svg>
);
const TranscriptIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="6" y="8" width="36" height="32" rx="4" stroke="#8B6F47" strokeWidth="2"/><line x1="12" y1="18" x2="36" y2="18" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="24" x2="30" y2="24" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="30" x2="26" y2="30" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/></svg>
);
const PhoneIcon = ({ light = false }: { light?: boolean }) => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="16" y="6" width="16" height="36" rx="4" stroke={light ? '#D4A96A' : '#8B6F47'} strokeWidth="2"/><circle cx="24" cy="36" r="2" fill={light ? '#E8D5B5' : '#A67A5B'}/><rect x="20" y="9" width="8" height="2" rx="1" fill={light ? '#E8D5B5' : '#C9B790'}/><circle cx="24" cy="22" r="5" stroke={light ? '#D4A96A' : '#8B6F47'} strokeWidth="1.5" opacity="0.5"/><circle cx="24" cy="22" r="9" stroke={light ? '#E8D5B5' : '#A67A5B'} strokeWidth="1" opacity="0.2"/></svg>
);
const SetupIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="#8B6F47" strokeWidth="2"/><path d="M24 16v8l5.5 5.5" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="24" cy="24" r="2" fill="#8B6F47"/></svg>
);

/* ═══════════════════════════════════════════
   SCROLL-REVEAL WRAPPER
   ═══════════════════════════════════════════ */
function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.3, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const dashboardRef = useRef(null);
  const { scrollYProgress: dashScroll } = useScroll({ target: dashboardRef, offset: ['start end', 'end start'] });
  const dashY = useTransform(dashScroll, [0, 1], [40, -40]);
  const dashShadow = useTransform(dashScroll, [0, 0.5, 1], [
    'rgba(139,111,71,0.15) 0px 30px 60px -15px',
    'rgba(139,111,71,0.35) 0px 70px 140px -30px',
    'rgba(139,111,71,0.15) 0px 30px 60px -15px',
  ]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] overflow-x-hidden">

      {/* NAV - Frosted glass */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F3]/60 backdrop-blur-xl border-b border-[#E8DCC8]/30" style={{ borderRadius: '0 0 12px 12px' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
            <div className="scale-[0.65] sm:scale-[0.8] md:scale-100 origin-left"><Logo size="small" lightMode /></div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/auth?mode=signin" className="text-[#8B6F47] hover:text-[#A67A5B] font-medium text-sm">Sign In</Link>
            <Link href="/auth?mode=signup">
              <Button className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-5 py-2 text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-16 pb-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center px-6 relative z-10"
        >
          <h1 className="font-serif-display text-5xl sm:text-6xl md:text-8xl tracking-tight mb-4">
            <span className="text-[#8B6F47]">AI that </span>
            <span style={{ fontFamily: 'Borel, cursive' }} className="text-[#8B6F47]">answers</span>
            <span className="text-[#8B6F47]"> your phone.</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-[#8B7355] font-medium mb-6">
            Sounds like a human. Works like a machine.
          </p>
          <VoiceWaveformHero />
          <div className="mb-6">
            <Link href="/pricing" className="inline-flex items-center gap-2 group">
              <span className="font-serif-display text-5xl md:text-6xl text-[#8B6F47]">$5</span>
              <span className="text-left">
                <span className="block text-base text-[#8B7355] font-medium">/month</span>
                <span className="block text-sm text-[#A67A5B] group-hover:underline">100 minutes included</span>
              </span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 md:px-10 md:py-6 text-lg font-medium shadow-xl shadow-[#8B6F47]/20 group">
                Get Your Number <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-5 md:px-10 md:py-6 text-lg font-medium border-[#8B6F47]/30 text-[#8B6F47] hover:bg-[#8B6F47]/10">
                Try It Live
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. SOCIAL PROOF */}
      <ScrollReveal className="text-center py-8 border-t border-[#E8DCC8]/30">
        <p className="text-xs uppercase tracking-[0.2em] text-[#A67A5B]/70 font-medium mb-6">Built by engineers from</p>
        <div className="flex items-center justify-center gap-10 sm:gap-14 md:gap-20">
          <svg className="h-8 md:h-10 w-auto opacity-50" viewBox="0 0 170 170" fill="#8B6F47">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.92.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.75-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.4 7.09-28.32a41.66 41.66 0 0 1 14.84-15.07 39.82 39.82 0 0 1 20.07-5.65c3.92 0 9.06 1.21 15.43 3.59 6.35 2.39 10.42 3.6 12.22 3.6 1.35 0 5.92-1.42 13.67-4.24 7.32-2.62 13.5-3.7 18.56-3.27 13.71 1.11 24.02 6.52 30.86 16.27-12.27 7.44-18.33 17.86-18.2 31.22.12 10.41 3.89 19.07 11.28 25.94 3.35 3.18 7.1 5.64 11.25 7.39-.9 2.62-1.85 5.13-2.87 7.54zM119.04 7.01c0 8.16-2.98 15.78-8.92 22.82-7.17 8.4-15.85 13.25-25.25 12.49a25.4 25.4 0 0 1-.19-3.09c0-7.84 3.41-16.22 9.47-23.08 3.02-3.47 6.87-6.35 11.55-8.64 4.66-2.26 9.07-3.51 13.23-3.73.12 1.08.17 2.16.17 3.23h-.06z"/>
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/disney-logo.svg" alt="Disney" className="h-8 md:h-10 w-auto opacity-50" style={{ filter: 'sepia(1) saturate(3) brightness(0.4) hue-rotate(350deg)' }} />
          <div className="flex flex-col items-center opacity-50">
            <span className="text-[10px] md:text-xs font-bold tracking-wider text-[#8B6F47] leading-tight">LAWRENCE LIVERMORE</span>
            <span className="text-[8px] md:text-[10px] font-medium tracking-widest text-[#8B6F47] leading-tight">NATIONAL LABORATORY</span>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. DASHBOARD */}
      <motion.div ref={dashboardRef} style={{ y: dashY }} className="w-full max-w-5xl mx-auto px-4 md:px-6 mb-8">
        <motion.div style={{ boxShadow: dashShadow }} className="relative perspective-mobile md:perspective-desktop rounded-[20px] overflow-hidden border border-[#E8DCC8]/60">
          <div className="bg-[#F5EFE6] px-2 md:px-4 py-1 md:py-3 flex items-center gap-1 md:gap-2 border-b border-[#E8DCC8]/60">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-2 md:mx-12">
              <div className="bg-white/60 rounded py-0.5 md:py-1 px-2 md:px-3 text-center">
                <span className="text-[6px] md:text-[10px] text-[#8B7355]/50 font-medium">helloml.app/dashboard</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden" style={{ margin: '-8px' }}>
            <Image src="/dashboard-preview.png" alt="HelloML dashboard" width={1600} height={1000} className="w-full h-auto" style={{ minWidth: 'calc(100% + 16px)' }} priority />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top, #FAF8F3 10%, transparent)' }} />
        </motion.div>
      </motion.div>

      {/* 4. SCATTER CONVERGENCE: "Sounds Like a Human" */}
      <ScatterConverge
        className="py-8 md:py-12"
        centralElement={<VoiceWaveformHero />}
        words={[
          { text: 'Sounds', startX: -240, startY: -100, startScale: 1.8, startRotate: -8 },
          { text: 'Like', startX: 200, startY: -80, startScale: 1.6, startRotate: 6 },
          { text: 'a', startX: -160, startY: 90, startScale: 2.2, startRotate: 12 },
          { text: 'Human.', startX: 180, startY: 120, startScale: 2.0, startRotate: -5 },
        ]}
      />

      {/* 5. STATS */}
      <ScrollReveal className="py-10 md:py-14 px-4 border-t border-[#E8DCC8]/30 bg-[#F0EBE3]">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 md:gap-12 text-center">
          <div>
            <div className="font-serif-display text-4xl md:text-6xl text-[#8B6F47]">&lt;500<span className="text-xl md:text-2xl">ms</span></div>
            <div className="text-sm text-[#8B7355] mt-1 font-medium">Response time</div>
          </div>
          <div>
            <div className="font-serif-display text-4xl md:text-6xl text-[#8B6F47]">99.9<span className="text-xl md:text-2xl">%</span></div>
            <div className="text-sm text-[#8B7355] mt-1 font-medium">Uptime</div>
          </div>
          <div>
            <div className="font-serif-display text-4xl md:text-6xl text-[#8B6F47]">24/7</div>
            <div className="text-sm text-[#8B7355] mt-1 font-medium">Availability</div>
          </div>
        </div>
      </ScrollReveal>

      {/* 6. HOW IT WORKS */}
      <section className="py-12 md:py-16 px-4 border-t border-[#E8DCC8]/30">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif-display text-3xl md:text-5xl text-[#8B6F47] mb-2">Three steps. Five minutes. Done.</h2>
            <p className="text-base md:text-lg text-[#8B7355] mb-10">Set up your AI phone agent in less time than it takes to brew coffee.</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <DocumentIcon />, title: 'Upload your docs', desc: 'FAQs, menus, policies. Your agent learns it all.' },
              { icon: <CalendarIcon />, title: 'Connect your calendar', desc: 'Google Calendar, Outlook. Bookings happen automatically.' },
              { icon: <PhoneIcon />, title: 'Calls answered', desc: '24/7. On your dedicated number. Instantly.' },
            ].map((step, i) => (
              <ScrollReveal key={i}>
                <div className="flex flex-col items-center text-center bg-white/70 rounded-[20px] border border-[#E8DCC8]/50 p-5 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-[#FAF8F3] border border-[#E8DCC8]/50 flex items-center justify-center mb-3">
                    {step.icon}
                  </div>
                  <div className="text-sm font-bold text-[#8B6F47]/40 mb-1">Step {i + 1}</div>
                  <h3 className="font-serif-display text-lg text-[#8B6F47] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#8B7355]">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WAVEFORM COMPARISON */}
      <section className="py-12 md:py-16 px-4 bg-[#F0EBE3] border-t border-[#E8DCC8]/30">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif-display text-3xl md:text-5xl text-[#8B6F47] mb-3">Your callers won&apos;t know the difference.</h2>
            <p className="text-base md:text-lg text-[#8B7355] mb-8">Natural turn-taking, real-time comprehension, sub-500ms response.</p>
          </ScrollReveal>
          <ScrollReveal>
            <WaveformComparison />
          </ScrollReveal>
        </div>
      </section>

      {/* 8. DEMO CTA - THE DARK SECTION */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden" style={{ backgroundColor: '#2A1F14' }}>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="font-serif-display text-3xl md:text-5xl text-white mb-3">Don&apos;t take our word for it.</h2>
            <p className="text-lg text-[#D4A96A] mb-10">Call our AI agent right now and hear the difference.</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="relative inline-block mb-10">
              <div className="w-52 h-80 sm:w-60 sm:h-96 rounded-[2.5rem] border-[6px] border-[#4a3f35] bg-gradient-to-b from-[#1a150f] to-[#0f0c08] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-black/40">
                <div className="absolute top-3 w-20 h-1.5 rounded-full bg-[#3a3530]" />
                <div className="absolute inset-4 top-10 bottom-20 rounded-2xl bg-[#0f0c08] flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 200 80" className="w-full h-full px-4" preserveAspectRatio="none">
                    <path d="M0,40 Q25,20 50,40 Q75,60 100,40 Q125,20 150,40 Q175,60 200,40" fill="none" stroke="rgba(212,169,106,0.5)" strokeWidth="2" className="animate-wave" />
                  </svg>
                </div>
                <div className="absolute top-14 text-center z-10">
                  <div className="text-xs text-[#D4A96A]/80 font-medium">HelloML AI Agent</div>
                </div>
                <div className="absolute bottom-8 z-10">
                  <Link href="/demo">
                    <Button className="bg-[#D4A96A] hover:bg-[#e0b97a] text-[#2A1F14] rounded-full w-12 h-12 shadow-lg shadow-[#D4A96A]/30 flex items-center justify-center font-bold">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                    </Button>
                  </Link>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-36 h-36 rounded-full border-2 border-[#D4A96A]/20 animate-pulse-ring" />
                  <div className="absolute w-52 h-52 rounded-full border border-[#D4A96A]/10 animate-pulse-ring-delayed" />
                </div>
              </div>
            </div>
            <div>
              <Link href="/demo">
                <Button size="lg" className="bg-[#D4A96A] hover:bg-[#e0b97a] text-[#2A1F14] rounded-full px-8 py-5 text-base font-semibold shadow-lg shadow-[#D4A96A]/20 group">
                  Call Our AI Live <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. FEATURES */}
      <section className="py-12 md:py-16 px-4 bg-[#FAF8F3] border-t border-[#E8DCC8]/30">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-10">
            <h2 className="font-serif-display text-3xl md:text-5xl text-[#8B6F47] mb-2">Everything you need. Nothing you don&apos;t.</h2>
            <p className="text-base md:text-lg text-[#8B7355]">One agent. Fully loaded.</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <CalendarIcon />, title: 'Books appointments', desc: 'Your agent checks availability and creates bookings directly on your calendar. No back-and-forth.', dark: false },
              { icon: <DocumentIcon />, title: 'Answers from your docs', desc: 'Upload FAQs, policies, or menus. Your agent searches them in real time to answer caller questions.', dark: false },
              { icon: <TranscriptIcon />, title: 'Full transcripts', desc: 'Get a full transcription and summary delivered to your dashboard the moment a call ends.', dark: false },
              { icon: <PhoneIcon light />, title: 'Always on, 24/7', desc: 'We provision a dedicated phone number for your business. Your agent picks up around the clock.', dark: true },
            ].map((f, i) => (
              <ScrollReveal key={i}>
                <div className={`group p-5 rounded-[20px] border hover:-translate-y-1 transition-all duration-300 ${
                  f.dark
                    ? 'bg-[#2A1F14] border-[#3a2f24] hover:shadow-xl hover:shadow-[#2A1F14]/20'
                    : 'bg-white/70 border-[#E8DCC8]/50 hover:border-[#8B6F47]/30 hover:shadow-xl hover:shadow-[#8B6F47]/10'
                }`}>
                  <div className="mb-3">{f.dark ? <PhoneIcon light /> : f.icon}</div>
                  <h3 className={`font-serif-display text-lg md:text-xl mb-1 ${f.dark ? 'text-white' : 'text-[#8B6F47]'}`}>{f.title}</h3>
                  <p className={`text-sm md:text-base ${f.dark ? 'text-[#D4A96A]/80' : 'text-[#8B7355]'}`}>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. USE CASES */}
      <section className="py-12 md:py-16 px-4 border-t border-[#E8DCC8]/30 bg-[#F0EBE3]">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif-display text-3xl md:text-5xl text-[#8B6F47] mb-3">Built for people who can&apos;t miss a call.</h2>
            <p className="text-base md:text-lg text-[#8B7355] mb-8">Your agent works while you work.</p>
          </ScrollReveal>
          <UseCaseCarousel />
        </div>
      </section>

      {/* 11. INTEGRATIONS */}
      <section className="py-10 md:py-14 px-4 bg-[#F0EBE3] border-t border-[#E8DCC8]/30">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif-display text-3xl md:text-5xl text-[#8B6F47] mb-3">Works with the tools you <span style={{ fontFamily: 'Borel, cursive' }}>already</span> use.</h2>
            <p className="text-base md:text-lg text-[#8B7355] mb-8">Connects to your calendar, docs, and files automatically.</p>
          </ScrollReveal>
          <IntegrationMarquee />
        </div>
      </section>

      {/* 12. PRICING */}
      <section className="py-12 md:py-16 px-4 border-t border-[#E8DCC8]/30 bg-[#FAF8F3]">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-serif-display text-3xl md:text-5xl text-[#8B6F47] mb-3">One plan. $5/month. Done.</h2>
            <p className="text-lg text-[#8B7355] mb-8">Everything included. No surprises.</p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="max-w-sm mx-auto bg-white/70 backdrop-blur-xl border border-[#E8DCC8]/60 rounded-[20px] p-6 shadow-lg shadow-[#8B6F47]/5 hover:shadow-2xl hover:shadow-[#8B6F47]/15 hover:border-[#8B6F47]/20 transition-all duration-500">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="font-serif-display text-5xl md:text-6xl text-[#8B6F47]">$5</span>
                <span className="text-lg text-[#8B7355]">/mo</span>
              </div>
              <p className="text-sm text-[#A67A5B] mb-6">per agent</p>
              <div className="space-y-3 text-left mb-8">
                {['100 minutes included', 'Dedicated phone number', 'Knowledge base uploads', 'Real-time transcription', 'Call analytics and history', '$0.10/min after 100'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#8B7355]">
                    <svg className="w-4 h-4 text-[#8B6F47] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </div>
                ))}
              </div>
              <Link href="/auth?mode=signup">
                <Button className="w-full bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full py-5 font-medium">Start Free Trial</Button>
              </Link>
              <p className="text-xs text-[#A67A5B]/60 mt-3">No credit card required</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 13. FINAL CTA */}
      <ScatterConverge
        className="py-12 md:py-16 bg-[#F0EBE3] border-t border-[#E8DCC8]/30"
        words={[
          { text: 'Your', startX: -100, startY: -30, startScale: 1.6, startRotate: -6 },
          { text: 'calls,', startX: 80, startY: 40, startScale: 1.5, startRotate: 4 },
        ]}
      />
      <section className="pb-12 bg-[#F0EBE3] text-center">
        <h2 className="font-serif-display text-5xl md:text-7xl text-[#8B6F47] mb-6">
          <span style={{ fontFamily: 'Borel, cursive' }}>answered</span>.
        </h2>
        <p className="text-[#8B7355] mb-6">No credit card required</p>
        <Link href="/auth?mode=signup">
          <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-10 py-6 text-xl font-medium shadow-2xl shadow-[#8B6F47]/20 group">
            Get Started Free <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-[#E8DCC8]/50 bg-[#FAF8F3]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="small" lightMode />
          <div className="flex items-center gap-6 md:gap-8 text-sm text-[#8B7355]">
            <Link href="/demo" className="hover:text-[#8B6F47]">Demo</Link>
            <Link href="/pricing" className="hover:text-[#8B6F47]">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#8B6F47]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#8B6F47]">Terms</Link>
            <Link href="/support" className="hover:text-[#8B6F47]">Support</Link>
          </div>
          <p className="text-sm text-[#A67A5B]/60">&copy; 2026 HelloML</p>
        </div>
      </footer>
    </div>
  );
}
