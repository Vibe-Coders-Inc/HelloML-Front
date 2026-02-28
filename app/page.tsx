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

/* ─── animation helpers ─── */
const staggerContainer = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ─── Scroll-Scale Convergence Section ─── */
function ScrollScaleHeader({ leftText, rightText, className = '' }: { leftText: string; rightText: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [2.5, 1]);
  const leftX = useTransform(scrollYProgress, [0, 1], [-200, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <div ref={ref} className={`h-[40vh] flex items-center justify-center overflow-hidden ${className}`}>
      <motion.span style={{ scale, x: leftX, opacity }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#8B6F47] inline-block">
        {leftText}
      </motion.span>
      <motion.span style={{ scale, x: rightX, opacity }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#8B6F47] inline-block ml-3">
        {rightText}
      </motion.span>
    </div>
  );
}

/* ─── Scroll-Scale Stat Pair ─── */
function ScrollScaleStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const leftX = useTransform(scrollYProgress, [0, 1], [-120, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);

  return (
    <div ref={ref} className="h-[30vh] flex items-center justify-center overflow-hidden">
      <div className="flex items-baseline gap-3">
        <motion.span style={{ scale, x: leftX, opacity }} className="text-4xl md:text-6xl font-bold text-[#8B6F47] tabular-nums inline-block">
          {value}
        </motion.span>
        <motion.span style={{ scale, x: rightX, opacity }} className="text-sm md:text-base text-[#8B7355] font-medium inline-block">
          {label}
        </motion.span>
      </div>
    </div>
  );
}

/* ─── Scroll-Scale Card ─── */
function ScrollScaleCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Use Case Carousel ─── */
const useCases = [
  { label: 'The contractor on the job site', text: 'Your agent books the estimate.' },
  { label: 'The stylist mid-appointment', text: 'Your agent reschedules the no-show.' },
  { label: 'The attorney in court', text: 'Your agent takes the message.' },
  { label: "The owner who can't be everywhere", text: 'Your agent can.' },
];

function UseCaseCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % useCases.length), 5000);
    return () => clearInterval(t);
  }, []);
  const prev = () => setActive((p) => (p - 1 + useCases.length) % useCases.length);
  const next = () => setActive((p) => (p + 1) % useCases.length);
  return (
    <div className="relative h-48 sm:h-40 max-w-lg mx-auto">
      {useCases.map((uc, i) => (
        <motion.div
          key={i}
          animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          style={{ pointerEvents: i === active ? 'auto' : 'none' }}
        >
          <p className="text-lg sm:text-xl text-[#8B7355] font-medium">
            {uc.label}. <span className="text-[#8B6F47] font-semibold">{uc.text}</span>
          </p>
        </motion.div>
      ))}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button onClick={prev} className="p-1 text-[#8B6F47]/40 hover:text-[#8B6F47] transition-colors" aria-label="Previous">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {useCases.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === active ? 'bg-[#8B6F47] scale-125' : 'bg-[#E8DCC8]'}`} />
        ))}
        <button onClick={next} className="p-1 text-[#8B6F47]/40 hover:text-[#8B6F47] transition-colors" aria-label="Next">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Marquee ─── */
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
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#FAF8F3] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FAF8F3] to-transparent z-10" />
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

/* ─── SVG Icons ─── */
const DocumentIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
    <rect x="10" y="6" width="28" height="36" rx="4" stroke="#8B6F47" strokeWidth="2"/>
    <line x1="16" y1="16" x2="32" y2="16" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="22" x2="28" y2="22" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="28" x2="30" y2="28" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="12" width="32" height="28" rx="4" stroke="#8B6F47" strokeWidth="2"/>
    <line x1="8" y1="22" x2="40" y2="22" stroke="#8B6F47" strokeWidth="2"/>
    <line x1="16" y1="12" x2="16" y2="7" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/>
    <line x1="32" y1="12" x2="32" y2="7" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="24" cy="30" r="3" fill="#8B6F47"/>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
    <rect x="16" y="6" width="16" height="36" rx="4" stroke="#8B6F47" strokeWidth="2"/>
    <circle cx="24" cy="36" r="2" fill="#A67A5B"/>
    <rect x="20" y="9" width="8" height="2" rx="1" fill="#C9B790"/>
    <circle cx="24" cy="22" r="5" stroke="#8B6F47" strokeWidth="1.5" opacity="0.3"/>
    <circle cx="24" cy="22" r="9" stroke="#A67A5B" strokeWidth="1" opacity="0.15"/>
  </svg>
);

const TranscriptIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
    <rect x="6" y="8" width="36" height="32" rx="4" stroke="#8B6F47" strokeWidth="2"/>
    <line x1="12" y1="18" x2="36" y2="18" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="24" x2="30" y2="24" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="30" x2="26" y2="30" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* ─── Main Page ─── */
export default function LandingPage() {
  const dashboardRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: dashboardRef, offset: ['start end', 'end start'] });
  const dashY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const dashShadow = useTransform(scrollYProgress, [0, 0.5, 1], [
    'rgba(139,111,71,0.15) 0px 30px 60px -15px',
    'rgba(139,111,71,0.35) 0px 70px 140px -30px',
    'rgba(139,111,71,0.15) 0px 30px 60px -15px',
  ]);

  /* Final CTA scroll-scale */
  const finalRef = useRef(null);
  const { scrollYProgress: finalProgress } = useScroll({ target: finalRef, offset: ['start end', 'center center'] });
  const finalScale = useTransform(finalProgress, [0, 1], [1.8, 1]);
  const finalOpacity = useTransform(finalProgress, [0, 0.3, 1], [0, 1, 1]);

  /* Demo CTA scroll-scale */
  const demoRef = useRef(null);
  const { scrollYProgress: demoProgress } = useScroll({ target: demoRef, offset: ['start end', 'center center'] });
  const demoScale = useTransform(demoProgress, [0, 1], [2, 1]);
  const demoOpacity = useTransform(demoProgress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F3]/80 backdrop-blur-md border-b border-[#E8DCC8]/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
            <div className="scale-[0.65] sm:scale-[0.8] md:scale-100 origin-left"><Logo size="small" lightMode /></div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Link href="/auth?mode=signin" className="text-[#8B6F47] hover:text-[#A67A5B] font-medium transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap">Sign In</Link>
            <Link href="/auth?mode=signup">
              <Button className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base min-h-[36px] sm:min-h-[44px] whitespace-nowrap">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ───────── 1. HERO ───────── */}
      <section className="min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center pt-20 md:pt-32 pb-8 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#E8DCC8]/30 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-3/4 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-[#A67A5B]/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#8B6F47]/5 via-transparent to-transparent rounded-full blur-3xl" />
        </div>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.h1 variants={staggerItem} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#8B6F47] bg-clip-text text-transparent">AI that </span>
            <span style={{ fontFamily: 'Borel, cursive' }} className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#8B6F47] bg-clip-text text-transparent">answers</span>
            <span className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#8B6F47] bg-clip-text text-transparent"> your phone.</span>
          </motion.h1>
          <motion.p variants={staggerItem} className="text-2xl sm:text-3xl md:text-4xl text-[#8B7355] font-semibold mb-4">
            Sounds like a human. Works like a machine.
          </motion.p>
          <motion.p variants={staggerItem} className="text-base sm:text-lg md:text-xl text-[#8B7355]/70 mb-4 max-w-2xl mx-auto leading-relaxed px-2">
            Your AI voice agent books appointments, answers questions from your documents, and handles every call so you don&apos;t have to.
          </motion.p>
          <motion.div variants={staggerItem}>
            <VoiceWaveformHero />
          </motion.div>
          <motion.div variants={staggerItem} className="mb-6">
            <Link href="/pricing" className="inline-flex items-center gap-2 group">
              <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#8B6F47]">$5</span>
              <span className="text-left">
                <span className="block text-sm sm:text-base text-[#8B7355] font-medium">/month</span>
                <span className="block text-xs sm:text-sm text-[#A67A5B] group-hover:underline">100 minutes included &rarr;</span>
              </span>
            </Link>
          </motion.div>
          <motion.div variants={staggerItem} className="mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 md:px-10 md:py-7 text-base md:text-lg font-medium shadow-xl shadow-[#8B6F47]/20 hover:shadow-2xl hover:shadow-[#8B6F47]/30 transition-all duration-300 group">
                Get Your Number <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-5 md:px-10 md:py-7 text-base md:text-lg font-medium border-[#8B6F47]/30 text-[#8B6F47] hover:text-[#8B6F47] hover:bg-[#8B6F47]/10 transition-all duration-300">
                Try It Live
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ───────── 2. SOCIAL PROOF BAR ───────── */}
      <section className="text-center py-8 md:py-10 border-t border-[#E8DCC8]/30">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#A67A5B]/70 font-medium mb-6">Built by engineers from</p>
        <div className="flex items-center justify-center gap-10 sm:gap-14 md:gap-20">
          <div>
            <svg className="h-7 sm:h-8 md:h-10 w-auto opacity-50" viewBox="0 0 170 170" fill="#8B6F47">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.92.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.75-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.4 7.09-28.32a41.66 41.66 0 0 1 14.84-15.07 39.82 39.82 0 0 1 20.07-5.65c3.92 0 9.06 1.21 15.43 3.59 6.35 2.39 10.42 3.6 12.22 3.6 1.35 0 5.92-1.42 13.67-4.24 7.32-2.62 13.5-3.7 18.56-3.27 13.71 1.11 24.02 6.52 30.86 16.27-12.27 7.44-18.33 17.86-18.2 31.22.12 10.41 3.89 19.07 11.28 25.94 3.35 3.18 7.1 5.64 11.25 7.39-.9 2.62-1.85 5.13-2.87 7.54zM119.04 7.01c0 8.16-2.98 15.78-8.92 22.82-7.17 8.4-15.85 13.25-25.25 12.49a25.4 25.4 0 0 1-.19-3.09c0-7.84 3.41-16.22 9.47-23.08 3.02-3.47 6.87-6.35 11.55-8.64 4.66-2.26 9.07-3.51 13.23-3.73.12 1.08.17 2.16.17 3.23h-.06z"/>
            </svg>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/disney-logo.svg" alt="Disney" className="h-7 sm:h-8 md:h-10 w-auto opacity-50" style={{ filter: 'sepia(1) saturate(3) brightness(0.4) hue-rotate(350deg)' }} />
          </div>
          <div className="flex flex-col items-center opacity-50">
            <span className="text-[8px] sm:text-[10px] md:text-xs font-bold tracking-wider text-[#8B6F47] leading-tight">LAWRENCE LIVERMORE</span>
            <span className="text-[6px] sm:text-[8px] md:text-[10px] font-medium tracking-widest text-[#8B6F47] leading-tight">NATIONAL LABORATORY</span>
          </div>
        </div>
      </section>

      {/* ───────── 3. DASHBOARD PREVIEW ───────── */}
      <motion.div ref={dashboardRef} style={{ y: dashY }} className="w-full max-w-5xl mx-auto px-4 md:px-6 mb-8 md:mb-12">
        <motion.div style={{ boxShadow: dashShadow }} className="relative perspective-mobile md:perspective-desktop rounded-lg sm:rounded-2xl overflow-hidden border border-[#E8DCC8]/60">
          <div className="bg-[#F5EFE6] px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 md:py-3 flex items-center gap-0.5 sm:gap-1 md:gap-2 border-b border-[#E8DCC8]/60">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-1 sm:mx-2 md:mx-12">
              <div className="bg-white/60 rounded py-px sm:py-0.5 md:py-1 px-1 sm:px-2 md:px-3 text-center">
                <span className="text-[4px] sm:text-[6px] md:text-[10px] text-[#8B7355]/50 font-medium">helloml.app/dashboard</span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden" style={{ margin: '-8px' }}>
            <Image src="/dashboard-preview.png" alt="HelloML AI phone agent dashboard showing call transcription, appointment booking, and automated phone answering" width={1600} height={1000} className="w-full h-auto" style={{ minWidth: 'calc(100% + 16px)' }} priority />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, #FAF8F3 10%, transparent)' }} />
        </motion.div>
      </motion.div>

      {/* ───────── 4. STATS — Scroll-Scale Convergence ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[#E8DCC8]/30">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0">
          <ScrollScaleStat value="<500ms" label="Response time" />
          <ScrollScaleStat value="99.9%" label="Uptime" />
          <ScrollScaleStat value="24/7" label="Availability" />
        </div>
      </section>

      {/* ───────── 5. HOW IT WORKS ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-[#F5EFE6] border-t border-[#E8DCC8]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-radial from-[#A67A5B]/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-2">Three steps. Five minutes. Done.</h2>
          <p className="text-base md:text-lg text-[#8B7355] mb-12">Set up your AI phone agent in less time than it takes to brew coffee.</p>
          <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: <DocumentIcon />, title: 'Upload your docs', desc: 'FAQs, menus, policies. Your agent learns it all.' },
              { icon: <CalendarIcon />, title: 'Connect your calendar', desc: 'Google Calendar, Outlook. Bookings happen automatically.' },
              { icon: <PhoneIcon />, title: 'Calls answered', desc: '24/7. On your dedicated number. Instantly.' },
            ].map((step, i) => (
              <ScrollScaleCard key={i} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-white/80 border border-[#E8DCC8]/50 flex items-center justify-center mb-4 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="text-sm font-bold text-[#8B6F47]/40 mb-2">Step {i + 1}</div>
                  <h3 className="text-lg font-semibold text-[#8B6F47] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#8B7355]">{step.desc}</p>
                </div>
              </ScrollScaleCard>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 6. SOUNDS LIKE A HUMAN ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[#E8DCC8]/30 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-[#8B6F47]/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollScaleHeader leftText="Your callers" rightText="won't know the difference." />
          <p className="text-base md:text-lg text-[#8B7355] mb-10 text-center">Built on the latest voice AI models with natural turn-taking, real-time comprehension, and sub-500ms response times.</p>
          <WaveformComparison />
        </div>
      </section>

      {/* ───────── 7. LIVE DEMO CTA ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-[#F5EFE6] border-t border-[#E8DCC8]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE6] via-[#EDE3D3]/30 to-[#F5EFE6] pointer-events-none" />
        <div ref={demoRef} className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2 style={{ scale: demoScale, opacity: demoOpacity }} className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B6F47] mb-4 inline-block">
            Don&apos;t take our word for it.
          </motion.h2>
          <p className="text-lg text-[#8B7355] mb-8 max-w-md mx-auto">Call our AI agent right now and hear the difference.</p>
          <div className="relative inline-block mb-8">
            <div className="w-56 h-96 sm:w-64 sm:h-[28rem] rounded-[2.5rem] border-[6px] border-[#3a3a3a] bg-gradient-to-b from-[#2a2218] to-[#1a1610] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-black/30">
              <div className="absolute top-3 w-24 h-2 rounded-full bg-[#2a2a2a]" />
              <div className="absolute inset-4 top-10 bottom-20 rounded-2xl bg-[#1a150f] flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 80" className="w-full h-full px-4 phone-waveform-anim" preserveAspectRatio="none">
                  <path d="M0,40 Q10,20 20,38 Q30,55 40,40 Q50,25 60,42 Q70,55 80,38 Q90,20 100,40 Q110,58 120,40 Q130,22 140,40 Q150,55 160,38 Q170,22 180,42 Q190,58 200,40" fill="none" stroke="rgba(139,111,71,0.6)" strokeWidth="2" strokeLinecap="round" />
                  <path d="M0,40 Q15,30 30,42 Q45,50 60,38 Q75,28 90,40 Q105,52 120,42 Q135,30 150,40 Q165,50 180,38 Q195,28 200,40" fill="none" stroke="rgba(139,111,71,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute top-14 text-center z-10">
                <div className="text-xs text-[#8B6F47]/80 font-medium">HelloML AI Agent</div>
              </div>
              <div className="absolute bottom-8 z-10">
                <Link href="/demo">
                  <Button className="relative bg-[#28C840] hover:bg-[#32d64e] text-white rounded-full w-14 h-14 shadow-lg shadow-[#28C840]/40 animate-pulse-call flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                  </Button>
                </Link>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-40 h-40 rounded-full border-2 border-[#8B6F47]/15 animate-pulse-ring" />
                <div className="absolute w-56 h-56 rounded-full border border-[#8B6F47]/10 animate-pulse-ring-delayed" />
                <div className="absolute w-72 h-72 rounded-full border border-[#8B6F47]/5 animate-pulse-ring" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
          <div className="block">
            <Link href="/demo">
              <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 text-base font-medium shadow-lg group">
                Call Our AI Live <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── 8. FEATURES GRID ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[#E8DCC8]/30 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#E8DCC8]/20 via-transparent to-transparent rounded-full blur-3xl -translate-y-1/2" />
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-2 text-center">Everything you need. Nothing you don&apos;t.</h2>
          <p className="text-base md:text-lg text-[#8B7355] mb-10 text-center">One agent. Fully loaded.</p>
          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {[
              { icon: (<svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="28" rx="4" stroke="#8B6F47" strokeWidth="2"/><line x1="8" y1="22" x2="40" y2="22" stroke="#8B6F47" strokeWidth="2"/><line x1="16" y1="12" x2="16" y2="7" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/><line x1="32" y1="12" x2="32" y2="7" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="30" r="3" fill="#8B6F47"/></svg>), title: 'Books appointments', desc: 'Your agent checks availability and creates bookings directly on your calendar. No back-and-forth.' },
              { icon: (<svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="10" y="6" width="28" height="36" rx="4" stroke="#8B6F47" strokeWidth="2"/><line x1="16" y1="16" x2="32" y2="16" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="22" x2="28" y2="22" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="28" x2="30" y2="28" stroke="#C9B790" strokeWidth="2" strokeLinecap="round"/></svg>), title: 'Answers from your docs', desc: 'Upload FAQs, policies, or menus. Your agent searches them in real time to answer caller questions.' },
              { icon: <TranscriptIcon />, title: 'Full transcripts', desc: 'Get a full transcription and summary delivered to your dashboard the moment a call ends.' },
              { icon: (<svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="16" y="6" width="16" height="36" rx="4" stroke="#8B6F47" strokeWidth="2"/><circle cx="24" cy="36" r="2" fill="#A67A5B"/><rect x="20" y="9" width="8" height="2" rx="1" fill="#C9B790"/><circle cx="24" cy="22" r="5" stroke="#8B6F47" strokeWidth="1.5" opacity="0.5"/><circle cx="24" cy="22" r="9" stroke="#A67A5B" strokeWidth="1" opacity="0.2"/></svg>), title: 'Always on, 24/7', desc: 'We provision a dedicated phone number for your business. Your agent picks up around the clock.' },
            ].map((f, i) => (
              <ScrollScaleCard key={i} delay={i * 0.1}>
                <div className="group p-6 md:p-8 rounded-2xl bg-gradient-to-br from-white/60 to-white/30 border border-[#E8DCC8]/50 hover:border-[#8B6F47]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8B6F47]/10 transition-all duration-300 relative overflow-hidden feature-card-glow">
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#8B6F47] mb-2">{f.title}</h3>
                  <p className="text-[#8B7355] text-sm md:text-base">{f.desc}</p>
                </div>
              </ScrollScaleCard>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 9. USE CASE CAROUSEL ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-[#F5EFE6] border-t border-[#E8DCC8]/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4">Built for people who can&apos;t miss a call.</h2>
          <p className="text-base md:text-lg text-[#8B7355] mb-10">Your agent works while you work.</p>
          <UseCaseCarousel />
        </div>
      </section>

      {/* ───────── 10. INTEGRATION MARQUEE ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[#E8DCC8]/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4">Works with the tools you <span style={{ fontFamily: 'Borel, cursive' }}>already</span> use.</h2>
          <p className="text-base md:text-lg text-[#8B7355] mb-10">Connects to your calendar, docs, and files automatically.</p>
          <IntegrationMarquee />
        </div>
      </section>

      {/* ───────── 11. PRICING CARD ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-[#F5EFE6] border-t border-[#E8DCC8]/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#A67A5B]/8 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4">One plan. $5/month. Done.</h2>
          <p className="text-lg text-[#8B7355] mb-8">Everything included. No surprises.</p>
          <ScrollScaleCard>
            <div className="max-w-sm mx-auto bg-white/50 backdrop-blur-xl border border-[#E8DCC8]/60 rounded-3xl p-8 shadow-lg shadow-[#8B6F47]/5 hover:shadow-2xl hover:shadow-[#8B6F47]/15 hover:border-[#8B6F47]/20 transition-all duration-500 mb-8 relative overflow-hidden group">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#8B6F47]/[0.05] via-transparent to-[#A67A5B]/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl md:text-6xl font-bold text-[#8B6F47]">$5</span>
                  <span className="text-lg text-[#8B7355]">/mo</span>
                </div>
                <p className="text-sm text-[#A67A5B] mb-6">per agent</p>
                <div className="space-y-3 text-left mb-8">
                  {['100 minutes included', 'Dedicated phone number', 'Knowledge base uploads', 'Real-time transcription', 'Call analytics & history', '$0.10/min after 100'].map((feature, i) => (
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
            </div>
          </ScrollScaleCard>
          <Link href="/pricing" className="text-sm text-[#8B6F47] hover:underline">View full pricing details &rarr;</Link>
        </div>
      </section>

      {/* ───────── 12. FINAL CTA ───────── */}
      <section className="py-12 md:py-16 px-4 md:px-6 border-t border-[#E8DCC8]/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-gradient-radial from-[#E8DCC8]/40 via-transparent to-transparent rounded-full blur-3xl" />
        </div>
        <div ref={finalRef} className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2 style={{ scale: finalScale, opacity: finalOpacity }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#8B6F47] mb-4 inline-block">
            Your calls, <span style={{ fontFamily: 'Borel, cursive' }}>answered</span>.
          </motion.h2>
          <p className="text-[#8B7355] mb-8">No credit card required</p>
          <Link href="/auth?mode=signup">
            <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-6 md:px-12 md:py-8 text-lg md:text-xl font-medium shadow-2xl shadow-[#8B6F47]/20 transition-all duration-300 group">
              Get Started Free <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#E8DCC8]/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="small" lightMode />
          <div className="flex items-center gap-6 md:gap-8 text-sm text-[#8B7355]">
            <Link href="/demo" className="hover:text-[#8B6F47] transition-colors">Demo</Link>
            <Link href="/pricing" className="hover:text-[#8B6F47] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#8B6F47] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#8B6F47] transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-[#8B6F47] transition-colors">Support</Link>
          </div>
          <p className="text-sm text-[#A67A5B]/60">&copy; 2026 HelloML</p>
        </div>
      </footer>
    </div>
  );
}
