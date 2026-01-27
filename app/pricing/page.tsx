'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Sidebar } from '@/components/Sidebar';
import { SetupWizard } from '@/components/SetupWizard';
import { useApp } from '@/lib/context';
import {
  ChevronDown,
  Phone,
  Bot,
  FileText,
  Clock,
  Zap,
  Shield,
  ArrowRight,
  Check
} from 'lucide-react';

const includedFeatures = [
  { icon: Bot, text: 'AI-powered voice agent' },
  { icon: Phone, text: 'Dedicated phone number' },
  { icon: FileText, text: 'Knowledge base uploads' },
  { icon: Clock, text: '100 minutes included' },
  { icon: Zap, text: 'Real-time transcription' },
  { icon: Shield, text: 'Call analytics & history' },
];

const faqs = [
  {
    question: 'What counts as a minute?',
    answer: 'A minute is measured from when a call connects to when it ends. Partial minutes are rounded up to the nearest minute.',
  },
  {
    question: 'Can I add more agents?',
    answer: 'Yes! Each additional agent is $5/month with its own 100 minutes included. Overage minutes are pooled across all your agents.',
  },
  {
    question: 'What happens if I go over my minutes?',
    answer: 'You\'ll be charged $0.10 per additional minute at the end of your billing cycle. You\'ll always have visibility into your usage from the dashboard.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your agent will remain active until the end of your billing period.',
  },
];

export default function PricingPage() {
  const { isAuthenticated } = useApp();
  const router = useRouter();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const pageContent = (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#8B6F47] via-[#A67A5B] to-[#C9B790] overflow-hidden">
        {/* Hero background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Floating dots */}
          <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDuration: '4s' }} />
          <div className="absolute top-[30%] right-[20%] w-3 h-3 bg-white/20 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute top-[60%] left-[25%] w-2 h-2 bg-white/25 rounded-full animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .08) 25%, rgba(255, 255, 255, .08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .08) 75%, rgba(255, 255, 255, .08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .08) 25%, rgba(255, 255, 255, .08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .08) 75%, rgba(255, 255, 255, .08) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          {/* Logo - only show if not authenticated (sidebar shows logo when authenticated) */}
          {!isAuthenticated && (
            <Link href="/" className="inline-block mb-12 hover:opacity-80 transition-opacity">
              <Logo size="small" />
            </Link>
          )}

          {/* Hero Content */}
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 leading-relaxed"
            >
              One plan, no hidden fees. Pay for what you use.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* Pricing Card + FAQ — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl border border-[#E8DCC8]/50 shadow-2xl shadow-[#8B6F47]/10 overflow-hidden"
          >
            {/* Card Header */}
            <div className="relative bg-gradient-to-br from-[#8B6F47] to-[#A67A5B] p-10 text-center overflow-hidden">
              {/* Decorative ring */}
              <div className="absolute -top-16 -right-16 w-48 h-48 border border-white/10 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 border border-white/10 rounded-full" />

              <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-4">Per Agent</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm text-white/60 font-medium self-start mt-3">$</span>
                <span className="text-8xl font-extrabold text-white tracking-tight leading-none">5</span>
                <span className="text-white/50 text-base font-medium self-end mb-2">/mo</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5">
                <Clock className="w-3.5 h-3.5 text-white/80" />
                <span className="text-white/90 text-sm font-medium">100 minutes included</span>
              </div>
            </div>

            {/* Overage Pricing */}
            <div className="px-8 py-4 bg-[#F5F0E8]/50 border-b border-[#E8DCC8]/50">
              <div className="flex items-center justify-between">
                <span className="text-[#5D4E37] font-medium text-sm">Additional minutes</span>
                <span className="text-[#8B6F47] font-bold text-lg">$0.10<span className="text-sm font-normal text-[#5a4a3a]/60">/min</span></span>
              </div>
            </div>

            {/* Features List */}
            <div className="p-8">
              <ul className="space-y-3">
                {includedFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#8B6F47]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#8B6F47]" />
                    </div>
                    <span className="text-[#5D4E37] text-sm">{feature.text}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Link
                  href={isAuthenticated ? '/dashboard' : '/auth'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] text-white font-semibold hover:shadow-lg hover:shadow-[#8B6F47]/20 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <p className="text-center text-sm text-[#5a4a3a]/50 mt-4">
                No credit card required to start
              </p>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-[#5D4E37] mb-2">Common questions</h2>
              <p className="text-[#5a4a3a]/60 text-sm">Everything you need to know about pricing.</p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E8DCC8]/50 p-5"
                >
                  <h3 className="font-semibold text-[#5D4E37] mb-1.5 text-sm">{faq.question}</h3>
                  <p className="text-[#5a4a3a]/70 leading-relaxed text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-20 pt-8 border-t border-[#E8DCC8]/50"
        >
          <Link href={isAuthenticated ? '/dashboard' : '/'} className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#5D4E37] font-medium transition-colors">
            <ChevronDown className="w-4 h-4 rotate-90" />
            {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
          </Link>
        </motion.div>
      </div>
    </>
  );

  // If authenticated, show with sidebar
  if (isAuthenticated) {
    return (
      <div className="flex-1 bg-[#FAF8F3] relative flex flex-col">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#8B6F47]/10 via-[#A67A5B]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-[#C9B790]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#E8DCC8]/30 to-transparent rounded-full blur-3xl" />
        </div>

        <Sidebar onCreateBusiness={() => setIsWizardOpen(true)} />

        <main className="lg:pl-14 flex-1 relative z-10">
          {pageContent}
        </main>

        <SetupWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onComplete={(id) => { setIsWizardOpen(false); router.push(`/business/${id}`); }}
        />
      </div>
    );
  }

  // If not authenticated, show without sidebar
  return (
    <div className="flex-1 bg-[#FAF8F3] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#8B6F47]/10 via-[#A67A5B]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-[#C9B790]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#E8DCC8]/30 to-transparent rounded-full blur-3xl" />

        {/* Floating circles */}
        <div className="absolute top-[15%] left-[8%] w-3 h-3 bg-[#A67A5B]/20 rounded-full animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[25%] right-[12%] w-4 h-4 bg-[#8B6F47]/15 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-[60%] left-[5%] w-2 h-2 bg-[#C9B790]/30 rounded-full animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-[45%] right-[6%] w-3 h-3 bg-[#A67A5B]/20 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
      </div>

      {pageContent}
    </div>
  );
}
