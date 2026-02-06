'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { RotatingText } from '@/components/ui/rotating-text';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Graphic placeholder component
function GraphicPlaceholder({
  label,
  height = 'h-64',
  suggestion
}: {
  label: string;
  height?: string;
  suggestion: string;
}) {
  return (
    <div className={`${height} w-full rounded-3xl border-2 border-dashed border-[#E8DCC8] bg-gradient-to-br from-[#FAF8F3] to-[#F5EFE6] flex flex-col items-center justify-center p-8`}>
      <span className="text-[#A67A5B]/60 font-medium text-sm uppercase tracking-wider mb-2">{label}</span>
      <span className="text-[#8B7355]/40 text-xs text-center max-w-xs">{suggestion}</span>
    </div>
  );
}

export default function LandingPage() {
  const rotatingPhrases = [
    "24/7",
    "while you're busy",
    "every single time",
    "so you don't have to"
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F3]/80 backdrop-blur-md border-b border-[#E8DCC8]/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="small" lightMode />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth?mode=signin"
              className="text-[#5D4E37] hover:text-[#8B6F47] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link href="/auth?mode=signup">
              <Button className="bg-[#5D4E37] hover:bg-[#8B6F47] text-white rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Main headline */}
          <motion.h1
            variants={staggerItem}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#5D4E37] tracking-tight mb-6"
          >
            Finally, something simple.
          </motion.h1>

          {/* Subheadline with rotating text */}
          <motion.p
            variants={staggerItem}
            className="text-2xl md:text-3xl lg:text-4xl text-[#8B7355] mb-4"
          >
            Your phone rings. We answer.
          </motion.p>

          <motion.p
            variants={staggerItem}
            className="text-xl md:text-2xl text-[#A67A5B]/80 mb-12"
          >
            <RotatingText
              phrases={rotatingPhrases}
              interval={3000}
              className="text-[#8B6F47] font-medium"
            />
          </motion.p>

          {/* CTA */}
          <motion.div variants={staggerItem}>
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-[#5D4E37] hover:bg-[#8B6F47] text-white rounded-full px-10 py-7 text-lg font-medium shadow-xl shadow-[#5D4E37]/20 hover:shadow-2xl hover:shadow-[#5D4E37]/30 transition-all duration-300 group"
              >
                Get Your Number
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Graphic Zone */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto mt-16 px-6"
        >
          <GraphicPlaceholder
            label="Graphic Zone A — Hero Visual"
            height="h-80"
            suggestion="Abstract phone silhouette with incoming call ripples. Linear-style gradient glow. Warm tones."
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#E8DCC8] flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-[#A67A5B]"
            />
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <AnimatedSection className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6 mb-16"
          >
            <motion.p
              variants={staggerItem}
              className="text-2xl md:text-3xl text-[#5D4E37] font-medium"
            >
              Tell us about your business.
            </motion.p>
            <motion.p
              variants={staggerItem}
              className="text-2xl md:text-3xl text-[#5D4E37] font-medium"
            >
              We create your agent.
            </motion.p>
            <motion.p
              variants={staggerItem}
              className="text-2xl md:text-3xl text-[#5D4E37] font-medium"
            >
              Calls handled. You notified.
            </motion.p>
          </motion.div>

          {/* How It Works Graphic Zone */}
          <GraphicPlaceholder
            label="Graphic Zone B — Flow Diagram"
            height="h-64"
            suggestion="Minimal 3-node flow. Soft connecting lines with subtle pulse animation. Or 3 floating cards."
          />
        </div>
      </AnimatedSection>

      {/* Integrations Section */}
      <AnimatedSection className="py-32 px-6 bg-gradient-to-b from-[#FAF8F3] to-[#F5EFE6]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5D4E37] mb-4">
            Works with the tools you already use.
          </h2>
          <p className="text-lg text-[#8B7355] mb-16">
            Seamlessly connects to your calendar and more.
          </p>

          {/* Integrations Graphic Zone */}
          <GraphicPlaceholder
            label="Graphic Zone C — Integration Logos"
            height="h-48"
            suggestion="Google Calendar, Outlook, Notion logos. Clean marks in glass-card containers. Subtle hover glow."
          />
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16"
          >
            {[
              { title: "Every call answered.", desc: "Never miss a customer again." },
              { title: "Your schedule, synced.", desc: "Calendar integration keeps you organized." },
              { title: "Transcripts delivered.", desc: "Know what was said, when you need it." },
              { title: "One number. Zero hassle.", desc: "We provision it. You own it." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="space-y-2"
              >
                <h3 className="text-xl md:text-2xl font-semibold text-[#5D4E37]">
                  {feature.title}
                </h3>
                <p className="text-[#8B7355]">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Graphic Zone */}
          <GraphicPlaceholder
            label="Graphic Zone D — Feature Visual"
            height="h-72"
            suggestion="Abstract icons: sound wave, calendar dot, text lines, phone. Linear-style thin strokes with gradient fills."
          />
        </div>
      </AnimatedSection>

      {/* Who It's For Section */}
      <AnimatedSection className="py-32 px-6 bg-gradient-to-b from-[#F5EFE6] to-[#FAF8F3]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-xl md:text-2xl lg:text-3xl text-[#5D4E37] leading-relaxed"
          >
            For the contractor on the job site.{' '}
            <span className="text-[#8B7355]">The stylist mid-appointment.</span>{' '}
            The attorney in court.{' '}
            <span className="text-[#8B7355]">The owner who can&apos;t be everywhere.</span>
          </motion.p>

          {/* Who It's For Graphic Zone (optional, subtle) */}
          <div className="mt-16">
            <GraphicPlaceholder
              label="Graphic Zone E — Subtle Background (Optional)"
              height="h-32"
              suggestion="Abstract silhouettes suggesting work. Very faded, almost watermark-like. Or leave text-only."
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Preview Section */}
      <AnimatedSection className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5D4E37] mb-4">
            Simple pricing. No surprises.
          </h2>
          <p className="text-lg text-[#8B7355] mb-8">
            Start free. Upgrade when you&apos;re ready.
          </p>
          <Link href="/pricing">
            <Button
              variant="outline"
              className="border-[#5D4E37] text-[#5D4E37] hover:bg-[#5D4E37] hover:text-white rounded-full px-8 py-6"
            >
              View Pricing
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      {/* Final CTA Section */}
      <AnimatedSection className="py-32 px-6 relative overflow-hidden">
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
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5D4E37] mb-8"
          >
            Your calls, answered.
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
                className="bg-[#5D4E37] hover:bg-[#8B6F47] text-white rounded-full px-12 py-8 text-xl font-medium shadow-2xl shadow-[#5D4E37]/20 hover:shadow-3xl hover:shadow-[#5D4E37]/30 transition-all duration-300 group"
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

        {/* Final CTA Graphic Zone */}
        <div className="max-w-lg mx-auto mt-16">
          <GraphicPlaceholder
            label="Graphic Zone F — Background Accent"
            height="h-24"
            suggestion="Soft radial gradient behind CTA. Warm glow effect like a spotlight."
          />
        </div>
      </AnimatedSection>

      {/* Minimal Footer (separate from main footer) */}
      <footer className="py-12 px-6 border-t border-[#E8DCC8]/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="small" lightMode />
          <div className="flex items-center gap-8 text-sm text-[#8B7355]">
            <Link href="/pricing" className="hover:text-[#5D4E37] transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-[#5D4E37] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#5D4E37] transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-[#5D4E37] transition-colors">Support</Link>
          </div>
          <p className="text-sm text-[#A67A5B]/60">
            © 2026 HelloML
          </p>
        </div>
      </footer>
    </div>
  );
}
