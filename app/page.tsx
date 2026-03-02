'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, animate, useScroll, useTransform } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import { HeroCallCard } from '@/components/landing/HeroCallCard';
import { NoiseOverlay } from '@/components/landing/NoiseOverlay';
import { MissedCallCascade } from '@/components/landing/MissedCallCascade';
import { FaceGearMorph } from '@/components/landing/FaceGearMorph';

/* ═══════════════════════════════════════════
   HELLOML LANDING PAGE — v5
   All scroll-based animations (replay on re-enter)
   Redesigned How It Works + Pricing
   ═══════════════════════════════════════════ */

function Slide({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`min-h-screen flex items-center justify-center px-6 overflow-hidden relative ${className}`}>
      {children}
    </section>
  );
}

/* ── SVG Icons ── */
const CalendarIcon = () => <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="2.5"/><line x1="8" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="2.5"/><line x1="16" y1="12" x2="16" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="32" y1="12" x2="32" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="24" cy="30" r="3" fill="currentColor"/></svg>;
const DocumentIcon = () => <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none"><rect x="10" y="6" width="28" height="36" rx="4" stroke="currentColor" strokeWidth="2.5"/><line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/><line x1="16" y1="28" x2="30" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/></svg>;
const TranscriptIcon = () => <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none"><rect x="6" y="8" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="2.5"/><line x1="12" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/><line x1="12" y1="30" x2="26" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/></svg>;
const PhoneIcon = () => <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none"><path d="M38 32.5v4.5a3 3 0 01-3.27 3 29.7 29.7 0 01-12.95-4.61 29.27 29.27 0 01-9-9A29.7 29.7 0 018.17 13.27 3 3 0 0111.15 10H15.67a3 3 0 013 2.58 19.27 19.27 0 001.05 4.22 3 3 0 01-.68 3.16l-1.9 1.9a24 24 0 009 9l1.9-1.9a3 3 0 013.16-.68 19.27 19.27 0 004.22 1.05 3 3 0 012.58 3.07z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ClockIcon = () => <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5"/><path d="M24 14v10l7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;

/* ── CountUp ── */
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

/* ── Animation presets — ALL scroll-based, replay every time ── */
const ease = [0.22, 1, 0.36, 1] as const;
const vp = { once: false, amount: 0.3 as const };
const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: vp, transition: { duration: 0.7, ease } };
const fadeLeft = { initial: { opacity: 0, x: -60 }, whileInView: { opacity: 1, x: 0 }, viewport: vp, transition: { duration: 0.7, ease } };
const fadeRight = { initial: { opacity: 0, x: 60 }, whileInView: { opacity: 1, x: 0 }, viewport: vp, transition: { duration: 0.7, ease } };
const scaleIn = { initial: { opacity: 0, scale: 0.88 }, whileInView: { opacity: 1, scale: 1 }, viewport: vp, transition: { duration: 0.8, ease } };

const integrations = [
  { name: 'Google Calendar', src: 'https://img.icons8.com/color/96/google-calendar--v1.png' },
  { name: 'Outlook', src: 'https://img.icons8.com/color/96/microsoft-outlook-2019--v2.png' },
  { name: 'Google Drive', src: 'https://img.icons8.com/color/96/google-drive--v1.png' },
];

/* ═══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="bg-[#FAF8F3]">

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

      {/* ═══ 1. HERO ═══ */}
      <Slide className="bg-[#FAF8F3] pt-20">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-5 leading-[1.05]"
            >
              <span className="text-[#8B6F47]/40">AI that </span>
              <span style={{ fontFamily: 'Borel, cursive' }} className="text-[#8B6F47]">answers</span>
              <br />
              <span className="text-[#8B6F47]">your phone.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease }}
              className="text-lg md:text-xl text-[#8B7355] mb-6 max-w-lg mx-auto lg:mx-0">
              Built for contractors, clinics, and small businesses. Starting at <span style={{ fontFamily: 'Borel, cursive' }} className="text-[#8B6F47] text-2xl">$5</span>/mo.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6, ease }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-3">
              <Link href="/demo">
                <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-6 text-lg font-medium shadow-xl shadow-[#8B6F47]/25 group cursor-pointer">
                  Hear It Live <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-medium border-[#8B6F47]/30 text-[#8B6F47] hover:bg-[#8B6F47]/10 cursor-pointer">Start Free</Button>
              </Link>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-xs text-[#A67A5B]/50">No credit card required</motion.p>

            {/* Social proof — DARKER */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8 pt-5 border-t border-[#E8DCC8]/40">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B6F47]/70 font-semibold mb-3">Built by engineers from</p>
              <div className="flex items-center justify-center lg:justify-start gap-8">
                <svg className="h-5 w-auto opacity-40" viewBox="0 0 170 170" fill="#8B6F47"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.92.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.75-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.4 7.09-28.32a41.66 41.66 0 0 1 14.84-15.07 39.82 39.82 0 0 1 20.07-5.65c3.92 0 9.06 1.21 15.43 3.59 6.35 2.39 10.42 3.6 12.22 3.6 1.35 0 5.92-1.42 13.67-4.24 7.32-2.62 13.5-3.7 18.56-3.27 13.71 1.11 24.02 6.52 30.86 16.27-12.27 7.44-18.33 17.86-18.2 31.22.12 10.41 3.89 19.07 11.28 25.94 3.35 3.18 7.1 5.64 11.25 7.39-.9 2.62-1.85 5.13-2.87 7.54zM119.04 7.01c0 8.16-2.98 15.78-8.92 22.82-7.17 8.4-15.85 13.25-25.25 12.49a25.4 25.4 0 0 1-.19-3.09c0-7.84 3.41-16.22 9.47-23.08 3.02-3.47 6.87-6.35 11.55-8.64 4.66-2.26 9.07-3.51 13.23-3.73.12 1.08.17 2.16.17 3.23h-.06z"/></svg>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/disney-logo.svg" alt="Disney" className="h-5 w-auto opacity-40" loading="lazy" style={{ filter: 'sepia(1) saturate(3) brightness(0.4) hue-rotate(350deg)' }} />
                <div className="flex flex-col items-center opacity-40">
                  <span className="text-[8px] font-bold tracking-wider text-[#8B6F47] leading-tight">LAWRENCE LIVERMORE</span>
                  <span className="text-[6px] font-medium tracking-widest text-[#8B6F47] leading-tight">NATIONAL LABORATORY</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 60, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease }} className="relative flex items-center justify-center">
            <div className="absolute w-96 h-96 bg-[#8B6F47]/8 rounded-full blur-[100px]" />
            <div className="relative z-10"><HeroCallCard /></div>
          </motion.div>
        </div>
      </Slide>

      {/* ═══ 2. THE PROBLEM ═══ */}
      <Slide className="bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...scaleIn}>
            <div className="mb-8">
              <span className="text-[120px] sm:text-[160px] md:text-[200px] font-bold text-[#8B6F47] leading-none tracking-tighter block">
                <CountUp target={80} suffix="%" />
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4">
              of callers won&apos;t leave a voicemail.
            </h2>
            <p className="text-lg md:text-xl text-[#8B7355] max-w-xl mx-auto">
              They call your competitor instead. Every missed call is lost revenue.
            </p>
            <MissedCallCascade />
          </motion.div>
        </div>
      </Slide>

      {/* ═══ 3. HOW IT WORKS — right after problem, shows the fix ═══ */}
      <Slide className="bg-[#FAF8F3]">
        <div className="max-w-5xl mx-auto w-full">
          <motion.h2 {...fadeUp} className="text-4xl md:text-6xl font-bold text-[#8B6F47] text-center mb-16">
            Up and running in{' '}<span style={{ fontFamily: 'Borel, cursive' }}>two minutes.</span>
          </motion.h2>

          {/* Horizontal connected steps */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#8B6F47]/20 via-[#8B6F47]/40 to-[#8B6F47]/20" />

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  num: '1',
                  title: 'Describe your business',
                  desc: 'Tell us what you do, your hours, and services. We handle the rest.',
                  visual: (
                    <div className="w-full h-32 bg-white rounded-xl border border-[#E8DCC8]/50 p-4 mt-4 shadow-sm">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#8B6F47]" />
                          <div className="h-2.5 bg-[#8B6F47]/15 rounded w-2/3" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#8B6F47]/40" />
                          <div className="h-2.5 bg-[#8B6F47]/10 rounded w-4/5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#8B6F47]/40" />
                          <div className="h-2.5 bg-[#8B6F47]/10 rounded w-1/2" />
                        </div>
                        <div className="mt-3 h-7 bg-[#8B6F47] rounded-lg w-20 flex items-center justify-center">
                          <span className="text-[9px] text-white font-medium">Next</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  num: '2',
                  title: 'Connect your calendar',
                  desc: 'Google Calendar or Outlook. One click. Instant sync.',
                  visual: (
                    <div className="w-full h-32 bg-white rounded-xl border border-[#E8DCC8]/50 p-4 mt-4 shadow-sm flex flex-col items-center justify-center gap-3">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://img.icons8.com/color/96/google-calendar--v1.png" alt="" className="w-10 h-10 rounded-lg" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://img.icons8.com/color/96/microsoft-outlook-2019--v2.png" alt="" className="w-10 h-10 rounded-lg" />
                      </div>
                      <div className="flex items-center gap-1.5 text-green-600">
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">Connected</span>
                      </div>
                    </div>
                  ),
                },
                {
                  num: '3',
                  title: 'Your phone answers',
                  desc: 'Get a dedicated number. Every call answered instantly.',
                  visual: (
                    <div className="w-full h-32 bg-white rounded-xl border border-[#E8DCC8]/50 p-4 mt-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[11px] text-[#3D3425] font-medium">Incoming call...</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="bg-[#F5F0E8] rounded-lg px-3 py-1.5 w-fit">
                          <span className="text-[10px] text-[#3D3425]">Hi, are you open today?</span>
                        </div>
                        <div className="bg-[#8B6F47] rounded-lg px-3 py-1.5 w-fit ml-auto">
                          <span className="text-[10px] text-white">Yes! We are open 9 to 5...</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={vp}
                  transition={{ delay: i * 0.2, duration: 0.7, ease }}
                  className="text-center"
                >
                  {/* Number circle */}
                  <div className="inline-flex items-center justify-center w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#8B6F47] to-[#6B5235] text-white mb-6 shadow-xl shadow-[#8B6F47]/20">
                    <span className="text-5xl font-bold">{step.num}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#8B6F47] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#8B7355] leading-relaxed mb-2">{step.desc}</p>
                  {/* Mini visual */}
                  {step.visual}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Slide>

      {/* ═══ 4. BOLD STATEMENT — credibility builder ═══ */}
      <Slide className="bg-[#FAF8F3]">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col items-center gap-2 md:gap-4">
            <div className="flex items-baseline gap-3 sm:gap-6 md:gap-10">
              <motion.span {...fadeLeft} className="text-5xl sm:text-7xl md:text-[110px] lg:text-[140px] font-bold text-[#8B6F47] leading-none tracking-tight">Talks</motion.span>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 0.35 }} viewport={vp} transition={{ delay: 0.3, duration: 0.8 }} className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-[#8B6F47] leading-none" style={{ fontFamily: 'Borel, cursive' }}>like a</motion.span>
            </div>
            <motion.span {...fadeUp} transition={{ delay: 0.15, duration: 0.7, ease }} className="text-5xl sm:text-7xl md:text-[110px] lg:text-[140px] font-bold text-[#8B6F47] leading-none tracking-tight">human.</motion.span>
            <FaceGearMorph />
            <div className="flex items-baseline gap-3 sm:gap-6 md:gap-10">
              <motion.span {...fadeRight} transition={{ delay: 0.3, duration: 0.7, ease }} className="text-5xl sm:text-7xl md:text-[110px] lg:text-[140px] font-bold text-[#8B6F47]/25 leading-none tracking-tight">Works</motion.span>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 0.35 }} viewport={vp} transition={{ delay: 0.5, duration: 0.8 }} className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-[#8B6F47] leading-none" style={{ fontFamily: 'Borel, cursive' }}>like a</motion.span>
            </div>
            <motion.span {...fadeUp} transition={{ delay: 0.45, duration: 0.7, ease }} className="text-5xl sm:text-7xl md:text-[110px] lg:text-[140px] font-bold text-[#8B6F47] leading-none tracking-tight">machine.</motion.span>
          </div>
        </div>
      </Slide>

      {/* ═══ 5. DASHBOARD — proof ═══ */}
      <Slide className="bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto w-full">
          <motion.h2 {...fadeUp} className="text-3xl md:text-5xl font-bold text-[#8B6F47] text-center mb-4">
            Every call. Every transcript. Every booking.
          </motion.h2>
          <motion.p {...fadeUp} className="text-center text-[#8B7355] mb-8 text-base md:text-lg max-w-2xl mx-auto">
            A real-time dashboard that shows every conversation, booking, and insight.
          </motion.p>
          <motion.div {...scaleIn} className="relative rounded-2xl overflow-hidden border border-[#E8DCC8]/50 shadow-2xl shadow-[#8B6F47]/10 bg-white">
            <div className="bg-[#F5EFE6] px-3 md:px-4 py-2 md:py-3 flex items-center gap-2 border-b border-[#E8DCC8]/60">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#28C840]" />
              <div className="flex-1 mx-4 md:mx-12"><div className="bg-white/60 rounded py-1 px-3 text-center"><span className="text-[8px] md:text-[10px] text-[#8B7355]/50 font-medium">helloml.app/dashboard</span></div></div>
            </div>
            <Image src="/dashboard-preview.png" alt="HelloML dashboard showing call logs, transcripts, and bookings" width={1600} height={1000} className="w-full h-auto block" priority />
          </motion.div>
        </div>
      </Slide>

      {/* ═══ 6. FEATURES — bento grid ═══ */}
      <Slide className="bg-[#F0EBE1]">
        <div className="max-w-5xl mx-auto w-full">
          <motion.h2 {...fadeUp} className="text-4xl md:text-6xl font-bold text-[#8B6F47] text-center mb-12">
            Everything you need.{' '}<span style={{ fontFamily: 'Borel, cursive' }} className="text-[#8B6F47]/50">Nothing you don&apos;t.</span>
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <motion.div {...fadeUp} className="col-span-2 lg:col-span-2 p-6 md:p-8 rounded-2xl bg-white/80 border border-[#E8DCC8]/40 hover:border-[#8B6F47]/20 hover:shadow-xl hover:shadow-[#8B6F47]/8 transition-all duration-300 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#8B6F47]/10 text-[#8B6F47] mb-4"><CalendarIcon /></div>
                <h3 className="text-xl md:text-2xl font-bold text-[#8B6F47] mb-2">Books appointments automatically</h3>
                <p className="text-[#8B7355] text-sm md:text-base leading-relaxed max-w-md">Checks your real-time availability and books directly on your calendar. No double-bookings, no phone tag.</p>
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 md:w-64 md:h-64 opacity-[0.06] group-hover:opacity-[0.1] transition-opacity">
                <svg viewBox="0 0 200 200" fill="#8B6F47"><rect x="20" y="40" width="160" height="140" rx="12"/><rect x="20" y="20" width="160" height="30" rx="12"/></svg>
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="p-6 rounded-2xl bg-[#8B6F47] text-white border border-[#8B6F47] relative overflow-hidden">
              <div className="absolute top-4 right-4 text-6xl font-bold text-white/10">24/7</div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 mb-4"><ClockIcon /></div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Always on</h3>
                <p className="text-white/70 text-sm leading-relaxed">Nights. Weekends. Holidays. Every call answered.</p>
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="p-6 rounded-2xl bg-white/80 border border-[#E8DCC8]/40 hover:border-[#8B6F47]/20 hover:shadow-xl hover:shadow-[#8B6F47]/8 transition-all duration-300 relative overflow-hidden">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#8B6F47]/10 text-[#8B6F47] mb-4"><TranscriptIcon /></div>
              <h3 className="text-lg md:text-xl font-bold text-[#8B6F47] mb-2">Full transcripts</h3>
              <p className="text-[#8B7355] text-sm leading-relaxed">Every call transcribed, summarized, and searchable.</p>
              <div className="mt-4 space-y-2 opacity-30">
                <div className="h-2 bg-[#8B6F47]/20 rounded w-full" /><div className="h-2 bg-[#8B6F47]/15 rounded w-4/5" /><div className="h-2 bg-[#8B6F47]/10 rounded w-3/5" />
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="col-span-2 p-6 md:p-8 rounded-2xl bg-white/80 border border-[#E8DCC8]/40 hover:border-[#8B6F47]/20 hover:shadow-xl hover:shadow-[#8B6F47]/8 transition-all duration-300 relative overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#8B6F47]/10 text-[#8B6F47] mb-4"><DocumentIcon /></div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#8B6F47] mb-2">Answers from your docs</h3>
                  <p className="text-[#8B7355] text-sm md:text-base leading-relaxed">Upload FAQs, menus, or service lists. Your agent answers questions in real time with accurate information.</p>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="relative w-48 h-36">
                    <div className="absolute top-0 left-4 w-40 h-28 bg-[#8B6F47]/5 rounded-lg border border-[#8B6F47]/10 rotate-[-3deg]" />
                    <div className="absolute top-2 left-2 w-40 h-28 bg-[#8B6F47]/8 rounded-lg border border-[#8B6F47]/10 rotate-[1deg]" />
                    <div className="absolute top-4 left-0 w-40 h-28 bg-white rounded-lg border border-[#8B6F47]/15 shadow-sm p-3">
                      <div className="space-y-2"><div className="h-2 bg-[#8B6F47]/15 rounded w-3/4" /><div className="h-2 bg-[#8B6F47]/10 rounded w-full" /><div className="h-2 bg-[#8B6F47]/10 rounded w-5/6" /><div className="h-2 bg-[#8B6F47]/8 rounded w-2/3" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Slide>

      {/* ═══ 7. DARK SECTION ═══ */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-[#1a1a1a] relative overflow-hidden">
        <NoiseOverlay opacity={0.06} />
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <motion.h2 {...fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#FAF8F3] mb-4 leading-tight">
                Works with the tools you{' '}<span style={{ fontFamily: 'Borel, cursive' }} className="text-[#D4A96A]">already</span>{' '}use.
              </motion.h2>
              <motion.p {...fadeUp} className="text-base md:text-lg text-[#FAF8F3]/40 mb-10">
                Connects to your calendar, docs, and workflows in seconds.
              </motion.p>
              <motion.div {...scaleIn} className="flex items-center gap-6 md:gap-10">
                {integrations.map((logo, i) => (
                  <motion.div key={i} {...fadeUp} className="flex flex-col items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.src} alt={logo.name} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-2xl hover:scale-110 transition-transform duration-300" loading="lazy" />
                    <span className="text-xs text-[#FAF8F3]/30 font-medium">{logo.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="space-y-8">
              {[
                { val: <><span className="text-[#D4A96A]">&lt;</span><CountUp target={500} /><span className="text-2xl ml-1">ms</span></>, label: 'Average response time', desc: 'Picks up before the second ring.' },
                { val: <><CountUp target={99} />.9<span className="text-2xl ml-1">%</span></>, label: 'Uptime guarantee', desc: 'Built on enterprise infrastructure.' },
                { val: <span className="text-[#D4A96A]">24/7</span>, label: 'Availability', desc: 'Never takes a sick day or a vacation.' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp}
                  transition={{ delay: i * 0.15, duration: 0.6, ease }} className="border-l-2 border-[#D4A96A]/30 pl-6">
                  <div className="text-4xl md:text-5xl font-bold text-[#FAF8F3]">{s.val}</div>
                  <div className="text-sm text-[#FAF8F3]/60 font-medium mt-1">{s.label}</div>
                  <div className="text-xs text-[#FAF8F3]/30 mt-0.5">{s.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. PRICING — modern minimal ═══ */}
      <Slide className="bg-[#FAF8F3]">
        <motion.div {...scaleIn} className="max-w-4xl mx-auto w-full text-center">
          {/* Giant price as the hero element */}
          <div className="mb-8">
            <div className="flex items-baseline justify-center gap-2">
              <span style={{ fontFamily: 'Borel, cursive' }} className="text-[100px] sm:text-[130px] md:text-[160px] font-bold text-[#8B6F47] leading-none">$5</span>
              <div className="text-left">
                <span className="block text-xl text-[#8B7355]">per agent</span>
                <span className="block text-xl text-[#8B7355]">per month</span>
              </div>
            </div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#8B6F47]/50 font-semibold mt-8">One plan. Everything included.</p>
          </div>

          {/* Feature pills */}
          <motion.div {...fadeUp} className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[
              '100 minutes included',
              '$0.10/min after',
              'Unlimited agents',
              'Call transcripts',
              'Calendar sync',
              'Custom voices',
              'No contracts',
            ].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-[#E8DCC8] text-sm text-[#3D3425] shadow-sm">
                <Check className="w-3.5 h-3.5 text-[#8B6F47]" />
                {item}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-10 py-6 text-lg font-medium shadow-xl shadow-[#8B6F47]/25 group cursor-pointer">
                Start Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-6 text-lg font-medium border-[#8B6F47]/30 text-[#8B6F47] hover:bg-[#8B6F47]/10 cursor-pointer">
                Try the Live Demo
              </Button>
            </Link>
          </motion.div>
          <p className="text-xs text-[#A67A5B]/40 mt-4">No credit card required. Cancel anytime.</p>
        </motion.div>
      </Slide>

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
