'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Animated section wrapper
function AnimatedSection({
  children,
  className = '',
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Scroll-highlight text line
function ScrollHighlightLine({
  children,
  delay = 0
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "100px" });

  return (
    <motion.p
      ref={ref}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.2, y: 10 }}
      transition={{ duration: 0.6, delay: isInView ? delay : 0, ease: 'easeOut' }}
      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-snug"
      style={{ color: isInView ? '#8B6F47' : '#C9B790' }}
    >
      {children}
    </motion.p>
  );
}


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F3]/80 backdrop-blur-md border-b border-[#E8DCC8]/50">
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

      {/* Hero Section */}
      <section className="min-h-[80vh] md:min-h-screen flex flex-col items-center justify-center pt-24 md:pt-40">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center px-6"
        >
          {/* Main headline */}
          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-[#8B6F47] tracking-tight mb-6"
          >
            AI that <span style={{ fontFamily: 'Borel, cursive' }}>answers</span> your phone.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={staggerItem}
            className="text-base sm:text-lg md:text-2xl text-[#8B7355] mb-6 max-w-2xl mx-auto leading-relaxed px-2"
          >
            A voice agent that books appointments, answers questions from your documents, and handles every call so you don&apos;t have to.
          </motion.p>

          {/* Pricing hook */}
          <motion.div variants={staggerItem} className="mb-10">
            <Link href="/pricing" className="inline-flex items-center gap-2 group">
              <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#8B6F47]">$5</span>
              <span className="text-left">
                <span className="block text-sm sm:text-base text-[#8B7355] font-medium">/month</span>
                <span className="block text-xs sm:text-sm text-[#A67A5B] group-hover:underline">100 minutes included &rarr;</span>
              </span>
            </Link>
          </motion.div>

          {/* CTA */}
          <motion.div variants={staggerItem} className="mb-8">
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 md:px-10 md:py-7 text-base md:text-lg font-medium shadow-xl shadow-[#8B6F47]/20 hover:shadow-2xl hover:shadow-[#8B6F47]/30 transition-all duration-300 group"
              >
                Get Your Number
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Social proof - moved below dashboard image */}
        </motion.div>

        {/* Hero Product Screenshot - Linear perspective style */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-12 md:mt-24 max-w-5xl mx-auto px-4 md:px-6"
        >
          <div
            className="relative perspective-mobile md:perspective-desktop"
            style={{
              transformOrigin: 'top center',
            }}
          >
            <div className="rounded-lg sm:rounded-2xl overflow-hidden border border-[#E8DCC8]/60" style={{
              boxShadow: 'rgba(139, 111, 71, 0.3) 0px 60px 120px -25px, rgba(139, 111, 71, 0.1) 0px 35px 75px -35px',
            }}>
              {/* macOS title bar */}
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
              {/* Screenshot — cropped 8px on all edges */}
              <div className="overflow-hidden" style={{ margin: '-8px' }}>
                <Image
                  src="/dashboard-preview.png"
                  alt="HelloML Dashboard"
                  width={1600}
                  height={1000}
                  className="w-full h-auto"
                  style={{ minWidth: 'calc(100% + 16px)' }}
                  priority
                />
              </div>
            </div>
            {/* Bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-40 md:h-56 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #FAF8F3 10%, transparent)' }}
            />
          </div>
        </motion.div>

        {/* Social proof — company logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 md:mt-12 text-center"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#A67A5B]/50 font-medium mb-4 md:mb-6">
            Built by engineers from
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-10 md:gap-14 opacity-40">
            {/* Apple */}
            <svg className="h-6 sm:h-7 md:h-8 w-auto" viewBox="0 0 170 170" fill="#8B6F47">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.2-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.28 2.13-9.54 3.24-12.8 3.35-4.92.21-9.84-1.96-14.75-6.52-3.13-2.73-7.04-7.41-11.75-14.04-5.03-7.08-9.17-15.29-12.41-24.65-3.47-10.2-5.21-20.07-5.21-29.59 0-10.95 2.36-20.4 7.09-28.32a41.66 41.66 0 0 1 14.84-15.07 39.82 39.82 0 0 1 20.07-5.65c3.92 0 9.06 1.21 15.43 3.59 6.35 2.39 10.42 3.6 12.22 3.6 1.35 0 5.92-1.42 13.67-4.24 7.32-2.62 13.5-3.7 18.56-3.27 13.71 1.11 24.02 6.52 30.86 16.27-12.27 7.44-18.33 17.86-18.2 31.22.12 10.41 3.89 19.07 11.28 25.94 3.35 3.18 7.1 5.64 11.25 7.39-.9 2.62-1.85 5.13-2.87 7.54zM119.04 7.01c0 8.16-2.98 15.78-8.92 22.82-7.17 8.4-15.85 13.25-25.25 12.49a25.4 25.4 0 0 1-.19-3.09c0-7.84 3.41-16.22 9.47-23.08 3.02-3.47 6.87-6.35 11.55-8.64 4.66-2.26 9.07-3.51 13.23-3.73.12 1.08.17 2.16.17 3.23h-.06z"/>
            </svg>
            {/* Disney */}
            <svg className="h-5 sm:h-6 md:h-7 w-auto" viewBox="0 0 200 50" fill="#8B6F47">
              <text x="0" y="40" fontFamily="Georgia, serif" fontSize="42" fontWeight="bold" fontStyle="italic">Disney</text>
            </svg>
            {/* LLNL */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] sm:text-[10px] md:text-xs font-bold tracking-wider text-[#8B6F47]">LAWRENCE LIVERMORE</span>
              <span className="text-[7px] sm:text-[9px] md:text-[10px] font-medium tracking-widest text-[#8B6F47]/80">NATIONAL LABORATORY</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6 mb-16">
            <ScrollHighlightLine>
              Upload your docs. Connect your calendar.
            </ScrollHighlightLine>
            <ScrollHighlightLine delay={0.15}>
              Your AI agent learns your business and starts taking calls.
            </ScrollHighlightLine>
            <ScrollHighlightLine delay={0.3}>
              Bookings made. Questions <span style={{ fontFamily: 'Borel, cursive' }}>handled</span>. You notified.
            </ScrollHighlightLine>
          </div>
        </div>
      </AnimatedSection>

      {/* Integrations Section */}
      <AnimatedSection className="py-32 px-6 bg-gradient-to-b from-[#FAF8F3] to-[#F5EFE6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4">
            Works with the tools you <span style={{ fontFamily: 'Borel, cursive' }}>already</span> use.
          </h2>
          <p className="text-base md:text-lg text-[#8B7355] mb-16 px-2">
            Your agent books through your calendar, searches your documents, and pulls context from your files — automatically.
          </p>

          {/* Integration Logos */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mx-auto max-w-lg md:max-w-2xl"
          >
            {[
              { name: 'Google Calendar', src: 'https://img.icons8.com/color/96/google-calendar--v1.png' },
              { name: 'Outlook', src: 'https://img.icons8.com/color/96/microsoft-outlook-2019--v2.png' },
              { name: 'Google Drive', src: 'https://img.icons8.com/color/96/google-drive--v1.png' },
              { name: 'Notion', src: 'https://img.icons8.com/ios-filled/100/000000/notion.png' },
              { name: 'Dropbox', src: 'https://img.icons8.com/color/96/dropbox.png' },
            ].map((integration) => (
              <motion.div
                key={integration.name}
                variants={staggerItem}
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E8DCC8]/50 shadow-lg shadow-[#8B6F47]/5 flex items-center justify-center group-hover:shadow-xl group-hover:border-[#A67A5B]/30 group-hover:scale-105 transition-all duration-300">
                  <img
                    src={integration.src}
                    alt={integration.name}
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                </div>
                <span className="text-xs text-[#8B7355]/60 font-medium">{integration.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16"
          >
            {[
              { title: "Books appointments on the spot.", desc: "Your agent checks availability and creates bookings directly on your calendar. No back-and-forth." },
              { title: "Answers from your documents.", desc: "Upload FAQs, policies, or menus. Your agent searches them in real time to answer caller questions." },
              { title: "Transcripts after every call.", desc: "Get a full transcription and summary delivered to your dashboard the moment a call ends." },
              { title: "One number. Always on.", desc: "We provision a dedicated phone number for your business. Your agent picks up 24/7." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="space-y-2"
              >
                <h3 className="text-xl md:text-2xl font-semibold text-[#8B6F47]">
                  {feature.title}
                </h3>
                <p className="text-[#8B7355]">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Icons — CSS visuals (hidden on mobile, text descriptions suffice) */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {/* Sound wave — calls */}
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#8B6F47]/10 to-[#A67A5B]/5 flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="20" width="4" height="8" rx="2" fill="#C9B790"/>
                <rect x="14" y="14" width="4" height="20" rx="2" fill="#A67A5B"/>
                <rect x="22" y="8" width="4" height="32" rx="2" fill="#8B6F47"/>
                <rect x="30" y="14" width="4" height="20" rx="2" fill="#A67A5B"/>
                <rect x="38" y="20" width="4" height="8" rx="2" fill="#C9B790"/>
              </svg>
            </div>

            <div className="hidden md:block w-12 h-px bg-gradient-to-r from-[#E8DCC8] to-[#E8DCC8]/30"/>

            {/* Calendar — schedule */}
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#8B6F47]/10 to-[#A67A5B]/5 flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="28" rx="4" stroke="#8B6F47" strokeWidth="2"/>
                <line x1="8" y1="22" x2="40" y2="22" stroke="#8B6F47" strokeWidth="2"/>
                <line x1="16" y1="12" x2="16" y2="7" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/>
                <line x1="32" y1="12" x2="32" y2="7" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="20" cy="30" r="3" fill="#8B6F47"/>
                <circle cx="28" cy="30" r="3" fill="#C9B790"/>
                <circle cx="36" cy="30" r="3" fill="#E8DCC8"/>
              </svg>
            </div>

            <div className="hidden md:block w-12 h-px bg-gradient-to-r from-[#E8DCC8]/30 via-[#E8DCC8] to-[#E8DCC8]/30"/>

            {/* Text lines — transcripts */}
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#8B6F47]/10 to-[#A67A5B]/5 flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="10" width="32" height="4" rx="2" fill="#8B6F47"/>
                <rect x="8" y="18" width="24" height="4" rx="2" fill="#A67A5B" opacity="0.7"/>
                <rect x="8" y="26" width="28" height="4" rx="2" fill="#A67A5B" opacity="0.5"/>
                <rect x="8" y="34" width="18" height="4" rx="2" fill="#C9B790"/>
              </svg>
            </div>

            <div className="hidden md:block w-12 h-px bg-gradient-to-r from-[#E8DCC8]/30 to-[#E8DCC8]"/>

            {/* Phone with ripples — one number */}
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#8B6F47]/10 to-[#A67A5B]/5 flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12" viewBox="0 0 48 48" fill="none">
                <rect x="16" y="6" width="16" height="36" rx="4" stroke="#8B6F47" strokeWidth="2"/>
                <circle cx="24" cy="36" r="2" fill="#A67A5B"/>
                <rect x="20" y="9" width="8" height="2" rx="1" fill="#C9B790"/>
                <circle cx="24" cy="22" r="5" stroke="#8B6F47" strokeWidth="1.5" fill="#8B6F47" opacity="0.08"/>
                <circle cx="24" cy="22" r="9" stroke="#A67A5B" strokeWidth="1" opacity="0.2"/>
                <circle cx="24" cy="22" r="13" stroke="#C9B790" strokeWidth="0.5" opacity="0.15"/>
              </svg>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Who It's For Section */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6 bg-gradient-to-b from-[#F5EFE6] to-[#FAF8F3]">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <ScrollHighlightLine>
              For the contractor on the job site — your agent books the estimate.
            </ScrollHighlightLine>
            <ScrollHighlightLine delay={0.15}>
              The stylist mid-appointment — your agent reschedules the no-show.
            </ScrollHighlightLine>
            <ScrollHighlightLine delay={0.3}>
              The attorney in court — your agent takes the message.
            </ScrollHighlightLine>
            <ScrollHighlightLine delay={0.45}>
              The owner who can&apos;t be everywhere — your agent can.
            </ScrollHighlightLine>
          </div>

          {/* Profession silhouettes */}
          <div className="mt-10 md:mt-16 flex items-center justify-center gap-8 md:gap-20 opacity-[0.6]">
            {/* Hard hat — contractor */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 22h20M8 22v-6a8 8 0 1 1 16 0v6" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="14" y="10" width="4" height="6" rx="1" fill="#A67A5B" opacity="0.3"/>
            </svg>
            {/* Scissors — stylist */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="10" cy="24" r="4" stroke="#8B6F47" strokeWidth="1.5"/>
              <circle cx="22" cy="24" r="4" stroke="#8B6F47" strokeWidth="1.5"/>
              <line x1="13" y1="21" x2="22" y2="8" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="19" y1="21" x2="10" y2="8" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {/* Gavel — attorney */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="10" y="6" width="14" height="5" rx="2" transform="rotate(30 10 6)" stroke="#8B6F47" strokeWidth="1.5"/>
              <line x1="17" y1="17" x2="24" y2="24" stroke="#8B6F47" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="8" y1="27" x2="26" y2="27" stroke="#A67A5B" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {/* Briefcase — owner */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="12" width="24" height="14" rx="3" stroke="#8B6F47" strokeWidth="1.5"/>
              <path d="M12 12V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" stroke="#8B6F47" strokeWidth="1.5"/>
              <line x1="4" y1="19" x2="28" y2="19" stroke="#A67A5B" strokeWidth="1" opacity="0.5"/>
            </svg>
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Preview Section */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B6F47] mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-lg text-[#8B7355] mb-10">
            One plan. Everything included.
          </p>

          {/* Pricing card */}
          <div className="max-w-sm mx-auto bg-white/60 backdrop-blur-sm border border-[#E8DCC8]/60 rounded-3xl p-8 shadow-lg shadow-[#8B6F47]/5 mb-8">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-5xl md:text-6xl font-bold text-[#8B6F47]">$5</span>
              <span className="text-lg text-[#8B7355]">/mo</span>
            </div>
            <p className="text-sm text-[#A67A5B] mb-6">per agent</p>
            <div className="space-y-3 text-left mb-8">
              {[
                '100 minutes included',
                'Dedicated phone number',
                'Knowledge base uploads',
                'Real-time transcription',
                'Call analytics & history',
                '$0.10/min after 100',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#8B7355]">
                  <svg className="w-4 h-4 text-[#8B6F47] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
            <Link href="/auth?mode=signup">
              <Button className="w-full bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full py-5 font-medium">
                Start Free Trial
              </Button>
            </Link>
            <p className="text-xs text-[#A67A5B]/60 mt-3">No credit card required</p>
          </div>

          <Link href="/pricing" className="text-sm text-[#8B6F47] hover:underline">
            View full pricing details &rarr;
          </Link>
        </div>
      </AnimatedSection>

      {/* Final CTA Section */}
      <AnimatedSection className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-gradient-radial from-[#E8DCC8]/40 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#8B6F47] mb-8"
          >
            Your calls, <span style={{ fontFamily: 'Borel, cursive' }}>answered</span>.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-6 md:px-12 md:py-8 text-lg md:text-xl font-medium shadow-2xl shadow-[#8B6F47]/20 hover:shadow-3xl hover:shadow-[#8B6F47]/30 transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-[#8B7355]"
          >
            No credit card required
          </motion.p>
        </div>

        {/* Decorative ripple rings */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.08]">
          <div className="relative w-[400px] h-[400px]">
            <div className="absolute inset-0 rounded-full border border-[#8B6F47]"/>
            <div className="absolute inset-8 rounded-full border border-[#8B6F47]"/>
            <div className="absolute inset-16 rounded-full border border-[#8B6F47]"/>
            <div className="absolute inset-24 rounded-full border border-[#A67A5B]"/>
          </div>
        </div>
      </AnimatedSection>

      {/* Minimal Footer (separate from main footer) */}
      <footer className="py-12 px-6 border-t border-[#E8DCC8]/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="small" lightMode />
          <div className="flex items-center gap-6 md:gap-8 text-sm text-[#8B7355]">
            <Link href="/pricing" className="hover:text-[#8B6F47] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#8B6F47] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#8B6F47] transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-[#8B6F47] transition-colors">Support</Link>
          </div>
          <p className="text-sm text-[#A67A5B]/60">
            © 2026 HelloML
          </p>
        </div>
      </footer>
    </div>
  );
}
