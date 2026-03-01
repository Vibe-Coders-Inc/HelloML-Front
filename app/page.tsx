'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { VoiceBarAnimation, VoiceBarAnimationLarge } from '@/components/landing/VoiceBarAnimation';

/* ═══════════════════════════════════════════
   SVG ICONS
   ═══════════════════════════════════════════ */
const CalendarIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="2"/><line x1="8" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="12" x2="16" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="32" y1="12" x2="32" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="24" cy="30" r="3" fill="currentColor"/></svg>
);
const DocumentIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="10" y="6" width="28" height="36" rx="4" stroke="currentColor" strokeWidth="2"/><line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/><line x1="16" y1="28" x2="30" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/></svg>
);
const TranscriptIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="6" y="8" width="36" height="32" rx="4" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/><line x1="12" y1="30" x2="26" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/></svg>
);
const PhoneIcon = () => (
  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none"><rect x="16" y="6" width="16" height="36" rx="4" stroke="currentColor" strokeWidth="2"/><circle cx="24" cy="36" r="2" fill="currentColor"/><rect x="20" y="9" width="8" height="2" rx="1" fill="currentColor" opacity="0.4"/></svg>
);

/* ═══════════════════════════════════════════
   SCROLL REVEAL (GPU-composited, snappy)
   ═══════════════════════════════════════════ */
function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   INTEGRATION ICONS (for dark section)
   ═══════════════════════════════════════════ */
const integrations = [
  { name: 'Google Calendar', src: 'https://img.icons8.com/color/96/google-calendar--v1.png' },
  { name: 'Outlook', src: 'https://img.icons8.com/color/96/microsoft-outlook-2019--v2.png' },
  { name: 'Google Drive', src: 'https://img.icons8.com/color/96/google-drive--v1.png' },
  { name: 'Notion', src: 'https://img.icons8.com/ios-filled/100/ffffff/notion.png' },
  { name: 'Dropbox', src: 'https://img.icons8.com/color/96/dropbox.png' },
  { name: 'Slack', src: 'https://img.icons8.com/color/96/slack-new.png' },
  { name: 'Zapier', src: 'https://img.icons8.com/color/96/zapier.png' },
  { name: 'HubSpot', src: 'https://img.icons8.com/color/96/hubspot.png' },
];

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const dashboardRef = useRef(null);
  const { scrollYProgress: dashScroll } = useScroll({ target: dashboardRef, offset: ['start end', 'end start'] });
  const dashY = useTransform(dashScroll, [0, 1], [30, -30]);

  return (
    <div className="min-h-screen bg-[#FAF8F3] overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F3]/80 backdrop-blur-xl border-b border-[#E8DCC8]/40">
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

      {/* ── 1. HERO ── */}
      <section className="pt-28 md:pt-36 pb-12 flex flex-col items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center px-6"
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl tracking-tight mb-5 leading-[1.05]">
            <span className="font-serif-display text-[#8B6F47]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>AI that </span>
            <span className="font-bold text-[#8B6F47]">answers</span>
            <br className="hidden sm:block" />
            <span className="font-serif-display text-[#8B6F47]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}> your phone.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#8B7355] mb-8 max-w-xl mx-auto">
            Sounds like a human. Works like a machine. Starting at $5/month.
          </p>
          <VoiceBarAnimationLarge />
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mt-8">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 md:px-10 md:py-6 text-lg font-medium shadow-xl shadow-[#8B6F47]/20 group cursor-pointer">
                Get Your Number <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-5 md:px-10 md:py-6 text-lg font-medium border-[#8B6F47]/30 text-[#8B6F47] hover:bg-[#8B6F47]/10 cursor-pointer">
                Try It Live
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── 2. SOCIAL PROOF ── */}
      <ScrollReveal className="text-center py-6 border-t border-[#E8DCC8]/30">
        <p className="text-xs uppercase tracking-[0.2em] text-[#A67A5B]/70 font-medium mb-5">Built by engineers from</p>
        <div className="flex items-center justify-center gap-10 sm:gap-14 md:gap-20">
          <svg className="h-7 md:h-9 w-auto opacity-40" viewBox="0 0 170 170" fill="#8B6F47">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.92.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.75-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.4 7.09-28.32a41.66 41.66 0 0 1 14.84-15.07 39.82 39.82 0 0 1 20.07-5.65c3.92 0 9.06 1.21 15.43 3.59 6.35 2.39 10.42 3.6 12.22 3.6 1.35 0 5.92-1.42 13.67-4.24 7.32-2.62 13.5-3.7 18.56-3.27 13.71 1.11 24.02 6.52 30.86 16.27-12.27 7.44-18.33 17.86-18.2 31.22.12 10.41 3.89 19.07 11.28 25.94 3.35 3.18 7.1 5.64 11.25 7.39-.9 2.62-1.85 5.13-2.87 7.54zM119.04 7.01c0 8.16-2.98 15.78-8.92 22.82-7.17 8.4-15.85 13.25-25.25 12.49a25.4 25.4 0 0 1-.19-3.09c0-7.84 3.41-16.22 9.47-23.08 3.02-3.47 6.87-6.35 11.55-8.64 4.66-2.26 9.07-3.51 13.23-3.73.12 1.08.17 2.16.17 3.23h-.06z"/>
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/disney-logo.svg" alt="Disney" className="h-7 md:h-9 w-auto opacity-40" style={{ filter: 'sepia(1) saturate(3) brightness(0.4) hue-rotate(350deg)' }} />
          <div className="flex flex-col items-center opacity-40">
            <span className="text-[10px] md:text-xs font-bold tracking-wider text-[#8B6F47] leading-tight">LAWRENCE LIVERMORE</span>
            <span className="text-[8px] md:text-[10px] font-medium tracking-widest text-[#8B6F47] leading-tight">NATIONAL LABORATORY</span>
          </div>
        </div>
      </ScrollReveal>

      {/* ── 3. DASHBOARD ── */}
      <motion.div ref={dashboardRef} style={{ y: dashY }} className="w-full max-w-5xl mx-auto px-4 md:px-6 mt-4 mb-12">
        <div className="relative perspective-mobile md:perspective-desktop rounded-2xl overflow-hidden border border-[#E8DCC8]/60 shadow-2xl shadow-[#8B6F47]/10">
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
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: 'linear-gradient(to top, #FAF8F3 10%, transparent)' }} />
        </div>
      </motion.div>

      {/* ── 4. HOW IT WORKS ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-[#8B6F47] mb-2">
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Three steps.</span> Five minutes. Done.
            </h2>
            <p className="text-base md:text-lg text-[#8B7355] mb-12">Set up your AI phone agent in less time than it takes to brew coffee.</p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: <DocumentIcon />, title: 'Upload your docs', desc: 'FAQs, menus, policies. Your agent learns it all.' },
              { icon: <CalendarIcon />, title: 'Connect your calendar', desc: 'Google Calendar, Outlook. Bookings happen automatically.' },
              { icon: <PhoneIcon />, title: 'Calls answered', desc: '24/7. On your dedicated number. Instantly.' },
            ].map((step, i) => (
              <ScrollReveal key={i}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#E8DCC8]/50 flex items-center justify-center mb-4 shadow-sm text-[#8B6F47]">
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-[#A67A5B]/40 mb-2 uppercase tracking-wider">Step {i + 1}</div>
                  <h3 className="text-lg font-semibold text-[#8B6F47] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#8B7355]">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FEATURES ── */}
      <section className="py-16 md:py-20 px-4 bg-[#F5EFE6]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-[#8B6F47] mb-2">
              Everything you need. <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }}>Nothing you don&apos;t.</span>
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <CalendarIcon />, title: 'Books appointments', desc: 'Checks availability and books directly on your calendar. No back-and-forth.' },
              { icon: <DocumentIcon />, title: 'Answers from your docs', desc: 'Upload FAQs, policies, or menus. Answers caller questions in real time.' },
              { icon: <TranscriptIcon />, title: 'Full transcripts', desc: 'Get a transcription and summary on your dashboard the moment a call ends.' },
              { icon: <PhoneIcon />, title: 'Always on, 24/7', desc: 'A dedicated phone number for your business. Your agent picks up around the clock.' },
            ].map((f, i) => (
              <ScrollReveal key={i}>
                <div className="group p-6 rounded-2xl bg-white/60 border border-[#E8DCC8]/40 hover:border-[#8B6F47]/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#8B6F47]/5 transition-all duration-300 text-[#8B6F47]" style={{ willChange: 'transform' }}>
                  <div className="mb-3 opacity-70">{f.icon}</div>
                  <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
                  <p className="text-[#8B7355] text-sm">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. DARK INTEGRATIONS SECTION (the wow moment) ── */}
      <section className="py-20 md:py-28 px-4 bg-[#111111] relative overflow-hidden">
        {/* Floating integration icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {integrations.map((logo, i) => (
            <div
              key={i}
              className="absolute animate-float-slow"
              style={{
                left: `${8 + (i * 12) % 85}%`,
                top: `${15 + ((i * 37) % 70)}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${6 + (i % 3) * 2}s`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg opacity-20 hover:opacity-40 transition-opacity"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Works with the tools you{' '}
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400 }} className="text-[#D4A96A]">already</span>
              {' '}use.
            </h2>
            <p className="text-base md:text-lg text-white/50 mb-10">Connects to your calendar, docs, and workflows automatically.</p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-12">
              {integrations.map((logo, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="text-[10px] text-white/40 font-medium">{logo.name}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3">
              <VoiceBarAnimation />
              <span className="text-white/70 text-sm font-medium">Your AI agent, always listening</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 7. DEMO CTA ── */}
      <section className="py-16 md:py-20 px-4 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold text-[#8B6F47] mb-3">
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Don&apos;t take our word for it.</span>
          </h2>
          <p className="text-lg text-[#8B7355] mb-8 max-w-md mx-auto">Call our AI agent right now and hear the difference yourself.</p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 text-lg font-medium shadow-xl shadow-[#8B6F47]/20 group cursor-pointer">
                Try the Live Demo <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-5 text-lg font-medium border-[#8B6F47]/30 text-[#8B6F47] hover:bg-[#8B6F47]/10 cursor-pointer">
                Get Started Free
              </Button>
            </Link>
          </div>
          <p className="text-xs text-[#A67A5B]/50 mt-4">$5/month per agent. 100 minutes included. No credit card required.</p>
        </ScrollReveal>
      </section>

      {/* ── 8. FOOTER ── */}
      <footer className="py-8 px-6 border-t border-[#E8DCC8]/40 bg-[#F5EFE6]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="small" lightMode />
          <div className="flex items-center gap-6 text-sm text-[#8B7355]">
            <Link href="/demo" className="hover:text-[#8B6F47] transition-colors">Demo</Link>
            <Link href="/pricing" className="hover:text-[#8B6F47] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#8B6F47] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#8B6F47] transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-[#8B6F47] transition-colors">Support</Link>
          </div>
          <p className="text-sm text-[#A67A5B]/50">&copy; 2026 HelloML</p>
        </div>
      </footer>
    </div>
  );
}
