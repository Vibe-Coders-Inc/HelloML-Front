'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import anime from 'animejs';

/* ═══════════════════════════════════════════
   ANIMATION PRIMITIVES
   ═══════════════════════════════════════════ */

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function AnimatedSection({
  children,
  className = '',
  delay = 0,
  variant = 'slideUp',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'slideUp' | 'scaleIn';
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: variant === 'scaleIn' ? 0 : 60, scale: variant === 'scaleIn' ? 0.92 : 1 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ═══════════════════════════════════════════
   HERO WAVEFORM — Anime.js SVG path morph
   ═══════════════════════════════════════════ */

function HeroWaveform() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll('.wave-path');

    // Organic sine wave morph via anime.js
    paths.forEach((path, i) => {
      const baseY = 40;
      const amp = 12 + i * 4;
      const freq = 0.04 - i * 0.005;

      function generatePath(phase: number) {
        let d = `M 0 ${baseY}`;
        for (let x = 0; x <= 400; x += 4) {
          const y = baseY + Math.sin(x * freq + phase) * amp * Math.sin((x / 400) * Math.PI);
          d += ` L ${x} ${y.toFixed(2)}`;
        }
        return d;
      }

      const phase = i * 1.5;
      const anim = { phase };
      anime({
        targets: anim,
        phase: phase + Math.PI * 4,
        duration: 6000 + i * 1000,
        easing: 'linear',
        loop: true,
        update: () => {
          path.setAttribute('d', generatePath(anim.phase));
        },
      });
    });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto my-8 h-20 opacity-60">
      <svg ref={svgRef} viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
        <path className="wave-path" fill="none" stroke="#C9B790" strokeWidth="1.5" strokeLinecap="round" />
        <path className="wave-path" fill="none" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round" />
        <path className="wave-path" fill="none" stroke="#8B6F47" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STATS — Anime.js number counters
   ═══════════════════════════════════════════ */

function AnimatedStat({
  value,
  suffix,
  prefix,
  label,
  delay: d,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated || !numRef.current) return;
    setHasAnimated(true);
    const obj = { val: 0 };
    anime({
      targets: obj,
      val: value,
      duration: 1800,
      delay: d,
      easing: 'easeOutExpo',
      round: value >= 10 ? 1 : 10,
      update: () => {
        if (numRef.current) {
          numRef.current.textContent = `${prefix || ''}${value >= 10 ? Math.round(obj.val) : obj.val.toFixed(1)}${suffix || ''}`;
        }
      },
    });
  }, [isInView, hasAnimated, value, suffix, prefix, d]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: d / 1000 }}
      className="text-center"
    >
      <span ref={numRef} className="block text-4xl sm:text-5xl md:text-6xl font-bold text-[#8B6F47]">
        {prefix || ''}0{suffix || ''}
      </span>
      <span className="text-sm sm:text-base text-[#8B7355] mt-2 block">{label}</span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   WAVEFORM MORPH — IVR → Human comparison
   ═══════════════════════════════════════════ */

function WaveformComparison() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [hasMorphed, setHasMorphed] = useState(false);

  // Robot waveform: harsh steps
  const robotPath = (() => {
    let d = 'M 0 50';
    for (let x = 0; x <= 500; x += 8) {
      const y = 50 + (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 20) * (x % 16 === 0 ? 1 : 0.3);
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    return d;
  })();

  // Smooth human waveform
  const humanPath = (() => {
    let d = 'M 0 50';
    for (let x = 0; x <= 500; x += 4) {
      const envelope = Math.sin((x / 500) * Math.PI);
      const y = 50 + Math.sin(x * 0.06) * 22 * envelope + Math.sin(x * 0.15) * 8 * envelope;
      d += ` L ${x} ${y.toFixed(2)}`;
    }
    return d;
  })();

  useEffect(() => {
    if (!isInView || hasMorphed || !pathRef.current) return;
    setHasMorphed(true);

    // Start with robot path
    pathRef.current.setAttribute('d', robotPath);

    // Morph to human path after a beat
    anime({
      targets: pathRef.current,
      d: [{ value: humanPath }],
      duration: 2000,
      delay: 800,
      easing: 'easeInOutQuad',
    });

    // Label swap
    setTimeout(() => {
      if (labelRef.current) {
        labelRef.current.textContent = '✨ HelloML Voice AI';
        labelRef.current.style.color = '#8B6F47';
      }
    }, 1600);
  }, [isInView, hasMorphed, robotPath, humanPath]);

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      <div className="relative bg-white/30 backdrop-blur-sm rounded-3xl border border-[#E8DCC8]/50 p-6 md:p-10 shadow-xl shadow-[#8B6F47]/5">
        <span
          ref={labelRef}
          className="block text-sm font-semibold mb-4 transition-colors duration-500"
          style={{ color: '#A67A5B' }}
        >
          🤖 Traditional IVR
        </span>
        <svg viewBox="0 0 500 100" className="w-full h-24" preserveAspectRatio="none">
          <path ref={pathRef} fill="none" stroke="#8B6F47" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="flex justify-between text-xs text-[#A67A5B]/60 mt-3">
          <span>Robotic &amp; choppy</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={hasMorphed ? { opacity: 1 } : {}}
            transition={{ delay: 2 }}
          >
            Natural &amp; fluid →
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   USE CASE CAROUSEL
   ═══════════════════════════════════════════ */

const useCases = [
  { persona: '🔨 Contractor', text: 'On the job site — your agent books the estimate.', color: '#A67A5B' },
  { persona: '💇 Stylist', text: 'Mid-appointment — your agent reschedules the no-show.', color: '#8B6F47' },
  { persona: '⚖️ Attorney', text: 'In court — your agent takes the message.', color: '#C9B790' },
  { persona: '🏢 Owner', text: "Can't be everywhere — your agent can.", color: '#8B6F47' },
];

function UseCaseCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % useCases.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative h-52 sm:h-44">
        {useCases.map((uc, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: i === active ? 1 : 0,
              scale: i === active ? 1 : 0.95,
              y: i === active ? 0 : 30,
              filter: i === active ? 'blur(0px)' : 'blur(4px)',
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            style={{ pointerEvents: i === active ? 'auto' : 'none' }}
          >
            <div className="bg-white/40 backdrop-blur-sm rounded-3xl border border-[#E8DCC8]/40 p-8 shadow-lg w-full">
              <span className="text-4xl mb-4 block">{uc.persona.split(' ')[0]}</span>
              <h3 className="text-xl font-semibold text-[#8B6F47] mb-2">{uc.persona.split(' ').slice(1).join(' ')}</h3>
              <p className="text-base text-[#8B7355]">{uc.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {useCases.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'bg-[#8B6F47] w-8' : 'bg-[#E8DCC8] w-4'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INTEGRATION MARQUEE — infinite scroll
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
    <div className="overflow-hidden relative py-4">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FAF8F3] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FAF8F3] to-transparent z-10" />
      <div className="flex gap-10 animate-marquee">
        {doubled.map((l, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0 bg-white/40 backdrop-blur-sm rounded-2xl border border-[#E8DCC8]/30 px-5 py-3 shadow-sm hover:shadow-md hover:border-[#8B6F47]/20 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.src} alt={l.name} className="w-8 h-8" />
            <span className="text-sm text-[#8B7355] font-medium whitespace-nowrap">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   HOW IT WORKS — staggered steps
   ═══════════════════════════════════════════ */

function HowItWorksSteps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const steps = [
    {
      num: '01',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
          <rect x="10" y="6" width="28" height="36" rx="4" stroke="#8B6F47" strokeWidth="2" />
          <line x1="16" y1="16" x2="32" y2="16" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="22" x2="28" y2="22" stroke="#C9B790" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="28" x2="30" y2="28" stroke="#C9B790" strokeWidth="2" strokeLinecap="round" />
          <motion.path
            d="M32 32 L36 36 L42 28"
            stroke="#8B6F47"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
          />
        </svg>
      ),
      title: 'Upload your docs',
      desc: 'FAQs, menus, policies — your agent learns everything in seconds.',
    },
    {
      num: '02',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="12" width="32" height="28" rx="4" stroke="#8B6F47" strokeWidth="2" />
          <line x1="8" y1="22" x2="40" y2="22" stroke="#8B6F47" strokeWidth="2" />
          <line x1="16" y1="12" x2="16" y2="7" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="12" x2="32" y2="7" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round" />
          <motion.circle
            cx="24"
            cy="30"
            r="4"
            fill="#8B6F47"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 1, duration: 0.4, type: 'spring' }}
          />
        </svg>
      ),
      title: 'Connect your calendar',
      desc: 'Google Calendar, Outlook — bookings happen automatically.',
    },
    {
      num: '03',
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
          <rect x="16" y="6" width="16" height="36" rx="4" stroke="#8B6F47" strokeWidth="2" />
          <circle cx="24" cy="36" r="2" fill="#A67A5B" />
          <rect x="20" y="9" width="8" height="2" rx="1" fill="#C9B790" />
          <motion.circle cx="24" cy="22" r="5" stroke="#8B6F47" strokeWidth="1.5" initial={{ scale: 0 }} animate={isInView ? { scale: [0, 1.3, 1] } : {}} transition={{ delay: 1.4, duration: 0.6 }} />
          <motion.circle cx="24" cy="22" r="9" stroke="#A67A5B" strokeWidth="1" opacity="0.3" initial={{ scale: 0 }} animate={isInView ? { scale: [0, 1.2, 1] } : {}} transition={{ delay: 1.6, duration: 0.6 }} />
          <motion.circle cx="24" cy="22" r="13" stroke="#C9B790" strokeWidth="0.5" opacity="0.15" initial={{ scale: 0 }} animate={isInView ? { scale: [0, 1.1, 1] } : {}} transition={{ delay: 1.8, duration: 0.6 }} />
        </svg>
      ),
      title: 'Your AI answers calls',
      desc: '24/7. On your dedicated number. Instantly.',
    },
  ];

  return (
    <div ref={ref} className="grid sm:grid-cols-3 gap-6 md:gap-10">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative group"
        >
          {/* Connector line */}
          {i < 2 && (
            <div className="hidden sm:block absolute top-12 -right-5 md:-right-5 w-10 h-px">
              <motion.div
                className="h-px bg-gradient-to-r from-[#8B6F47]/30 to-[#8B6F47]/10"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.3, duration: 0.6 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          )}
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-[#E8DCC8]/50 p-8 shadow-lg shadow-[#8B6F47]/[0.03] group-hover:shadow-xl group-hover:border-[#8B6F47]/20 group-hover:-translate-y-1 transition-all duration-500">
            <div className="text-xs font-bold tracking-[0.3em] text-[#A67A5B]/50 mb-4">{step.num}</div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B6F47]/10 to-[#A67A5B]/5 flex items-center justify-center mb-5">
              {step.icon}
            </div>
            <h3 className="text-lg font-semibold text-[#8B6F47] mb-2">{step.title}</h3>
            <p className="text-sm text-[#8B7355] leading-relaxed">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STAGGERED TEXT REVEAL — Anime.js
   ═══════════════════════════════════════════ */

function StaggeredText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isInView || hasAnimated || !ref.current) return;
    setHasAnimated(true);
    const words = ref.current.querySelectorAll('.stagger-word');
    anime({
      targets: words,
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(60),
      duration: 700,
      easing: 'easeOutExpo',
    });
  }, [isInView, hasAnimated]);

  return (
    <div ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="stagger-word inline-block opacity-0 mr-[0.3em]">
          {word}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  const dashboardRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: dashboardRef, offset: ['start end', 'end start'] });
  const dashY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const dashScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.98]);
  const dashShadow = useTransform(scrollYProgress, [0, 0.5, 1], [
    'rgba(139,111,71,0.1) 0px 20px 50px -15px',
    'rgba(139,111,71,0.4) 0px 80px 160px -40px',
    'rgba(139,111,71,0.1) 0px 20px 50px -15px',
  ]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] overflow-x-hidden">
      {/* ═══ Nav ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F3]/80 backdrop-blur-xl border-b border-[#E8DCC8]/40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
            <div className="scale-[0.65] sm:scale-[0.8] md:scale-100 origin-left">
              <Logo size="small" lightMode />
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Link
              href="/auth?mode=signin"
              className="text-[#8B6F47] hover:text-[#A67A5B] font-medium transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap"
            >
              Sign In
            </Link>
            <Link href="/auth?mode=signup">
              <Button className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base min-h-[36px] sm:min-h-[44px] whitespace-nowrap">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
         1. HERO — BOLD + COMMANDING
         ═══════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 md:pt-28 pb-8 relative">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-[#E8DCC8]/30 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-[#A67A5B]/10 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center px-6 relative z-10"
        >
          {/* Badge */}
          <motion.div variants={staggerItem} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B6F47]/8 border border-[#8B6F47]/15 text-sm text-[#8B6F47] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#8B6F47] animate-pulse" />
              Powered by the latest in voice AI
            </span>
          </motion.div>

          {/* Main headline — LARGE */}
          <motion.h1
            variants={staggerItem}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-[#8B6F47] tracking-tight mb-6 leading-[0.95]"
          >
            AI that{' '}
            <span style={{ fontFamily: 'Borel, cursive' }} className="relative">
              answers
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-[#8B6F47]/20 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
            <br />
            your phone.
          </motion.h1>

          {/* Subheadline — punchy */}
          <motion.p
            variants={staggerItem}
            className="text-lg sm:text-xl md:text-2xl text-[#8B7355] max-w-2xl mx-auto leading-relaxed mb-2"
          >
            Sounds like a human. Works like a machine.
          </motion.p>
          <motion.p
            variants={staggerItem}
            className="text-base sm:text-lg text-[#A67A5B]/70 max-w-xl mx-auto mb-4"
          >
            Books appointments, answers questions from your docs, handles every call — so you don&apos;t have to.
          </motion.p>

          {/* Animated waveform */}
          <motion.div variants={staggerItem}>
            <HeroWaveform />
          </motion.div>

          {/* Pricing hook */}
          <motion.div variants={staggerItem} className="mb-10">
            <Link href="/pricing" className="inline-flex items-center gap-3 group">
              <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#8B6F47]">$5</span>
              <span className="text-left">
                <span className="block text-base sm:text-lg text-[#8B7355] font-medium">/month</span>
                <span className="block text-sm text-[#A67A5B] group-hover:underline">
                  100 minutes included &rarr;
                </span>
              </span>
            </Link>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-10 py-6 md:px-12 md:py-7 text-base md:text-lg font-medium shadow-2xl shadow-[#8B6F47]/25 hover:shadow-[#8B6F47]/40 hover:scale-[1.02] transition-all duration-300 group"
              >
                Get Your Number
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-6 md:px-12 md:py-7 text-base md:text-lg font-medium border-[#8B6F47]/25 text-[#8B6F47] hover:text-[#8B6F47] hover:bg-[#8B6F47]/8 hover:border-[#8B6F47]/40 transition-all duration-300"
              >
                🎙️ Try It Live
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
         2. DASHBOARD PREVIEW — parallax + depth
         ═══════════════════════════════════════ */}
      <motion.div
        ref={dashboardRef}
        style={{ y: dashY, scale: dashScale }}
        className="w-full max-w-5xl mx-auto px-4 md:px-6 mb-20 md:mb-32 will-change-transform"
      >
        <motion.div
          style={{ boxShadow: dashShadow }}
          className="relative perspective-mobile md:perspective-desktop rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8DCC8]/60"
        >
          <div className="bg-[#F5EFE6] px-1.5 sm:px-2 md:px-4 py-1 sm:py-1.5 md:py-3 flex items-center gap-0.5 sm:gap-1 md:gap-2 border-b border-[#E8DCC8]/60">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-3 md:h-3 rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-1 sm:mx-2 md:mx-12">
              <div className="bg-white/60 rounded py-px sm:py-0.5 md:py-1 px-1 sm:px-2 md:px-3 text-center">
                <span className="text-[4px] sm:text-[6px] md:text-[10px] text-[#8B7355]/50 font-medium">
                  helloml.app/dashboard
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden" style={{ margin: '-8px' }}>
            <Image
              src="/dashboard-preview.png"
              alt="HelloML AI phone agent dashboard showing call transcription, appointment booking, and automated phone answering"
              width={1600}
              height={1000}
              className="w-full h-auto"
              style={{ minWidth: 'calc(100% + 16px)' }}
              priority
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-24 md:h-40 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #FAF8F3 5%, transparent)' }}
          />
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════
         3. SOCIAL PROOF BAR — fade-in stagger
         ═══════════════════════════════════════ */}
      <AnimatedSection className="text-center pt-4 pb-16 md:pb-24">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#A67A5B]/60 font-medium mb-8 md:mb-10">
          Built by engineers from
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex items-center justify-center gap-10 sm:gap-14 md:gap-20"
        >
          <motion.div variants={staggerItem}>
            <svg className="h-7 sm:h-8 md:h-10 w-auto opacity-40 hover:opacity-60 transition-opacity" viewBox="0 0 170 170" fill="#8B6F47">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.92.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.75-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.4 7.09-28.32a41.66 41.66 0 0 1 14.84-15.07 39.82 39.82 0 0 1 20.07-5.65c3.92 0 9.06 1.21 15.43 3.59 6.35 2.39 10.42 3.6 12.22 3.6 1.35 0 5.92-1.42 13.67-4.24 7.32-2.62 13.5-3.7 18.56-3.27 13.71 1.11 24.02 6.52 30.86 16.27-12.27 7.44-18.33 17.86-18.2 31.22.12 10.41 3.89 19.07 11.28 25.94 3.35 3.18 7.1 5.64 11.25 7.39-.9 2.62-1.85 5.13-2.87 7.54zM119.04 7.01c0 8.16-2.98 15.78-8.92 22.82-7.17 8.4-15.85 13.25-25.25 12.49a25.4 25.4 0 0 1-.19-3.09c0-7.84 3.41-16.22 9.47-23.08 3.02-3.47 6.87-6.35 11.55-8.64 4.66-2.26 9.07-3.51 13.23-3.73.12 1.08.17 2.16.17 3.23h-.06z" />
            </svg>
          </motion.div>
          <motion.div variants={staggerItem}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/disney-logo.svg"
              alt="Disney"
              className="h-7 sm:h-8 md:h-10 w-auto opacity-40 hover:opacity-60 transition-opacity"
              style={{ filter: 'sepia(1) saturate(3) brightness(0.4) hue-rotate(350deg)' }}
            />
          </motion.div>
          <motion.div variants={staggerItem} className="flex flex-col items-center opacity-40 hover:opacity-60 transition-opacity">
            <span className="text-[8px] sm:text-[10px] md:text-xs font-bold tracking-wider text-[#8B6F47] leading-tight">
              LAWRENCE LIVERMORE
            </span>
            <span className="text-[6px] sm:text-[8px] md:text-[10px] font-medium tracking-widest text-[#8B6F47] leading-tight">
              NATIONAL LABORATORY
            </span>
          </motion.div>
        </motion.div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         4. STATS — Anime.js counters
         ═══════════════════════════════════════ */}
      <AnimatedSection className="py-16 md:py-28 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/30 backdrop-blur-sm rounded-3xl border border-[#E8DCC8]/40 p-8 md:p-14 shadow-xl shadow-[#8B6F47]/[0.04]">
            <div className="grid grid-cols-3 gap-6 md:gap-12">
              <AnimatedStat prefix="<" value={500} suffix="ms" label="Response latency" delay={0} />
              <AnimatedStat value={99.9} suffix="%" label="Uptime guaranteed" delay={200} />
              <AnimatedStat value={24} suffix="/7" label="Always available" delay={400} />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         5. "SOUNDS HUMAN" — waveform morph
         ═══════════════════════════════════════ */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <StaggeredText
            text="This isn't your grandmother's phone tree."
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg text-[#8B7355] mb-12 max-w-lg mx-auto"
          >
            Watch a robotic IVR transform into natural, human-like conversation.
          </motion.p>
          <WaveformComparison />
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         6. HOW IT WORKS
         ═══════════════════════════════════════ */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6 bg-gradient-to-b from-[#FAF8F3] via-[#F5EFE6] to-[#FAF8F3]">
        <div className="max-w-4xl mx-auto text-center">
          <StaggeredText
            text="Three steps. Five minutes. Done."
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-[#8B7355] mb-16"
          >
            Set up your AI phone agent in less time than it takes to brew coffee.
          </motion.p>
          <HowItWorksSteps />
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         7. LIVE DEMO CTA — conversion centerpiece
         ═══════════════════════════════════════ */}
      <AnimatedSection className="py-24 md:py-40 px-4 md:px-6 relative overflow-hidden" variant="scaleIn">
        {/* Radial bg glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] bg-gradient-radial from-[#8B6F47]/8 via-transparent to-transparent rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#8B6F47] mb-4"
          >
            Hear it for yourself.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-[#8B7355] mb-14 max-w-md mx-auto"
          >
            Call our AI agent. Experience what your customers will hear.
          </motion.p>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-block"
          >
            {/* Outer pulsing rings */}
            <div className="absolute inset-0 -m-12 flex items-center justify-center pointer-events-none">
              <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 border-[#8B6F47]/8 animate-pulse-ring" />
              <div className="absolute w-96 h-96 sm:w-[26rem] sm:h-[26rem] rounded-full border border-[#8B6F47]/5 animate-pulse-ring-delayed" />
              <div className="absolute w-[30rem] h-[30rem] rounded-full border border-[#8B6F47]/3 animate-pulse-ring" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-60 h-[26rem] sm:w-68 sm:h-[30rem] rounded-[2.5rem] border-4 border-[#8B6F47]/15 bg-white/50 backdrop-blur-xl shadow-2xl shadow-[#8B6F47]/10 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Notch */}
              <div className="absolute top-4 w-20 h-1.5 rounded-full bg-[#8B6F47]/10" />
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#8B6F47]/[0.02] via-transparent to-[#8B6F47]/[0.04]" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B6F47]/10 to-[#A67A5B]/5 flex items-center justify-center mb-6">
                  <span className="text-4xl">📞</span>
                </div>
                <p className="text-sm font-semibold text-[#8B6F47] mb-1">HelloML AI Agent</p>
                <p className="text-xs text-[#A67A5B]/60 mb-8">Live demo</p>
                <Link href="/demo">
                  <Button className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 text-base font-medium shadow-xl shadow-[#8B6F47]/25 hover:shadow-[#8B6F47]/40 hover:scale-[1.03] transition-all duration-300 group">
                    Call Our AI
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         8. FEATURES GRID — cards with depth
         ═══════════════════════════════════════ */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <StaggeredText
              text="Everything you need. Nothing you don't."
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-[#8B7355]"
            >
              One agent. Fully loaded. Ready in minutes.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-5 md:gap-6"
          >
            {[
              {
                icon: '📅',
                title: 'Books appointments on the spot.',
                desc: 'Your agent checks availability and creates bookings directly on your calendar. No back-and-forth.',
              },
              {
                icon: '📄',
                title: 'Answers from your documents.',
                desc: 'Upload FAQs, policies, or menus. Your agent searches them in real time to answer caller questions.',
              },
              {
                icon: '📝',
                title: 'Transcripts after every call.',
                desc: 'Get a full transcription and summary delivered to your dashboard the moment a call ends.',
              },
              {
                icon: '📞',
                title: 'One number. Always on.',
                desc: 'We provision a dedicated phone number for your business. Your agent picks up 24/7.',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="group relative p-7 md:p-9 rounded-3xl bg-white/40 backdrop-blur-sm border border-[#E8DCC8]/40 hover:border-[#8B6F47]/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8B6F47]/10 transition-all duration-500 will-change-transform overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B6F47]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B6F47]/10 to-[#A67A5B]/5 flex items-center justify-center mb-5 text-2xl group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#8B6F47] mb-3">{f.title}</h3>
                  <p className="text-[#8B7355] text-sm md:text-base leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         9. USE CASE CAROUSEL
         ═══════════════════════════════════════ */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6 bg-gradient-to-b from-[#F5EFE6] to-[#FAF8F3]">
        <div className="max-w-3xl mx-auto text-center">
          <StaggeredText
            text="Built for people who are too busy to answer."
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-[#8B7355] mb-14"
          >
            Your agent works while you work.
          </motion.p>
          <UseCaseCarousel />
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         10. INTEGRATION MARQUEE
         ═══════════════════════════════════════ */}
      <AnimatedSection className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4">
            Works with the tools you{' '}
            <span style={{ fontFamily: 'Borel, cursive' }}>already</span> use.
          </h2>
          <p className="text-base md:text-lg text-[#8B7355] mb-12">
            Connects to your calendar, docs, and files automatically.
          </p>
          <IntegrationMarquee />
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         11. PRICING — glass card
         ═══════════════════════════════════════ */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6" variant="scaleIn">
        <div className="max-w-4xl mx-auto text-center">
          <StaggeredText
            text="Simple pricing. No surprises."
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg text-[#8B7355] mb-12"
          >
            One plan. Everything included.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="max-w-sm mx-auto relative group"
          >
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-gradient-to-b from-[#8B6F47]/10 to-[#A67A5B]/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-white/50 backdrop-blur-xl border border-[#E8DCC8]/50 rounded-3xl p-9 shadow-lg shadow-[#8B6F47]/5 hover:shadow-2xl hover:shadow-[#8B6F47]/15 hover:border-[#8B6F47]/20 transition-all duration-500">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl md:text-7xl font-bold text-[#8B6F47]">$5</span>
                <span className="text-lg text-[#8B7355]">/mo</span>
              </div>
              <p className="text-sm text-[#A67A5B] mb-8">per agent</p>
              <div className="space-y-4 text-left mb-8">
                {[
                  '100 minutes included',
                  'Dedicated phone number',
                  'Knowledge base uploads',
                  'Real-time transcription',
                  'Call analytics & history',
                  '$0.10/min after 100',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#8B7355]">
                    <svg className="w-5 h-5 text-[#8B6F47] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
              <Link href="/auth?mode=signup">
                <Button className="w-full bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full py-6 font-medium text-base shadow-lg shadow-[#8B6F47]/20 hover:shadow-xl hover:shadow-[#8B6F47]/30 transition-all duration-300">
                  Start Free Trial
                </Button>
              </Link>
              <p className="text-xs text-[#A67A5B]/50 mt-4">No credit card required</p>
            </div>
          </motion.div>

          <Link href="/pricing" className="inline-block mt-6 text-sm text-[#8B6F47] hover:underline">
            View full pricing details &rarr;
          </Link>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
         12. FINAL CTA — commanding close
         ═══════════════════════════════════════ */}
      <section className="py-24 md:py-40 px-4 md:px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#E8DCC8]/30 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05]">
          <div className="relative w-[500px] h-[500px]">
            <motion.div className="absolute inset-0 rounded-full border-2 border-[#8B6F47]" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} />
            <motion.div className="absolute inset-10 rounded-full border border-[#8B6F47]" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
            <motion.div className="absolute inset-20 rounded-full border border-[#8B6F47]" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#8B6F47] mb-10"
          >
            Your calls,{' '}
            <span style={{ fontFamily: 'Borel, cursive' }}>answered</span>.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-10 py-7 md:px-14 md:py-8 text-lg md:text-xl font-medium shadow-2xl shadow-[#8B6F47]/25 hover:shadow-[#8B6F47]/40 hover:scale-[1.03] transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-[#8B7355]"
          >
            No credit card required
          </motion.p>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="py-12 px-6 border-t border-[#E8DCC8]/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="small" lightMode />
          <div className="flex items-center gap-6 md:gap-8 text-sm text-[#8B7355]">
            <Link href="/demo" className="hover:text-[#8B6F47] transition-colors">Demo</Link>
            <Link href="/pricing" className="hover:text-[#8B6F47] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#8B6F47] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#8B6F47] transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-[#8B6F47] transition-colors">Support</Link>
          </div>
          <p className="text-sm text-[#A67A5B]/50">© 2026 HelloML</p>
        </div>
      </footer>
    </div>
  );
}
