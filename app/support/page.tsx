'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import {
  ChevronDown,
  Mail,
  Send,
  MessageCircleQuestion,
  Headphones
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I set up my first voice agent?',
    answer: `After signing in, follow these steps:

<steps>
1. Click "New Business" on your dashboard
2. Enter your business details in the setup wizard
3. Configure your agent's personality and greeting
4. Provision a phone number
</steps>

Your agent will be ready to take calls within minutes.`,
  },
  {
    question: 'What phone numbers are supported?',
    answer: 'We currently support US phone numbers through our Twilio integration. You can provision local numbers from any area code, or transfer an existing number to our platform.',
  },
  {
    question: 'How does the AI handle calls it cannot answer?',
    answer: 'Your agent uses your uploaded knowledge base documents to answer questions. If the agent encounters a question outside its knowledge, it will politely let the caller know and can offer to take a message or transfer the call (configurable in agent settings).',
  },
  {
    question: 'Can I review call transcripts?',
    answer: `Yes! All calls are automatically transcribed. To view them:

<steps>
1. Go to your business dashboard
2. Navigate to the Calls section
3. Click on any call to view the full transcript
</steps>

You can also see caller information and track conversation metrics.`,
  },
  {
    question: 'What file types can I upload to the knowledge base?',
    answer: 'You can upload PDF documents and plain text files. Our system extracts the text, creates embeddings, and enables your agent to semantically search and reference the content during calls.',
  },
  {
    question: 'How do I update my agent\'s responses?',
    answer: `To update your agent's configuration:

<steps>
1. Navigate to your business dashboard
2. Find the Agent section
3. Click Edit to modify settings
</steps>

You can update the system prompt, greeting message, and goodbye message. For content changes, upload new documents to your knowledge base.`,
  },
  {
    question: 'Is there a limit on calls or documents?',
    answer: 'Current limits depend on your plan. Contact us for details on pricing tiers and enterprise options with higher limits.',
  },
  {
    question: 'How do I cancel or change my phone number?',
    answer: `To manage your phone number:

<steps>
1. Go to your business dashboard
2. Find the phone number section
3. Click delete or manage
</steps>

You can release a number and provision a new one at any time.`,
  },
];

function formatAnswer(answer: string) {
  // Parse the answer and replace <steps> blocks with styled components
  const parts = answer.split(/(<steps>[\s\S]*?<\/steps>)/g);

  return parts.map((part, index) => {
    if (part.startsWith('<steps>')) {
      const stepsContent = part.replace(/<\/?steps>/g, '').trim();
      const steps = stepsContent.split('\n').filter(line => line.trim());

      return (
        <div key={index} className="my-3 bg-[#F5F0E8] rounded-xl p-4 font-mono text-sm border border-[#E8DCC8]/50">
          {steps.map((step, stepIndex) => (
            <div key={stepIndex} className="flex items-start gap-2 py-1">
              <span className="text-[#8B6F47] font-semibold">{step.match(/^\d+\./)?.[0] || '•'}</span>
              <span className="text-[#5D4E37]">{step.replace(/^\d+\.\s*/, '')}</span>
            </div>
          ))}
        </div>
      );
    }
    return part ? <span key={index}>{part}</span> : null;
  });
}

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="group"
        >
          <div
            className={`bg-white/80 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden ${
              openIndex === index
                ? 'border-[#A67A5B]/30 shadow-lg shadow-[#8B6F47]/5'
                : 'border-[#E8DCC8]/50 hover:border-[#A67A5B]/20 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center gap-4 p-5 text-left transition-colors"
            >
              <span className="flex-1 font-medium text-[#5D4E37] pr-4">{item.question}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                  openIndex === index ? 'text-[#8B6F47]' : 'text-[#A67A5B]/50'
                }`} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-5 pb-5 text-[#5a4a3a]/80 leading-relaxed border-t border-[#E8DCC8]/30 pt-4 mt-1">
                    {formatAnswer(item.answer)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E8DCC8]/50 p-8 text-center shadow-xl"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#8B6F47] to-[#A67A5B] flex items-center justify-center shadow-lg">
          <Mail className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#5D4E37] mb-3">Message Sent!</h3>
        <p className="text-[#5a4a3a]/70 leading-relaxed">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible at{' '}
          <span className="text-[#8B6F47] font-medium">{formData.email}</span>
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
          }}
          className="mt-8 px-6 py-3 rounded-xl bg-[#F5F0E8] text-[#8B6F47] font-medium hover:bg-[#E8DCC8] transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#E8DCC8]/50 p-8 shadow-xl"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[#5D4E37] mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border border-[#E8DCC8] bg-[#FAF8F3] text-[#5D4E37] placeholder-[#A67A5B]/40 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#A67A5B] transition-all"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#5D4E37] mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border border-[#E8DCC8] bg-[#FAF8F3] text-[#5D4E37] placeholder-[#A67A5B]/40 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#A67A5B] transition-all"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-[#5D4E37] mb-2">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-4 rounded-xl border border-[#E8DCC8] bg-[#FAF8F3] text-[#5D4E37] placeholder-[#A67A5B]/40 focus:outline-none focus:ring-2 focus:ring-[#8B6F47]/20 focus:border-[#A67A5B] transition-all resize-none"
            placeholder="How can we help you?"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] text-white font-semibold hover:shadow-lg hover:shadow-[#8B6F47]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}

export default function SupportPage() {
  return (
    <div className="flex-1 bg-[#FAF8F3] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top gradient blob */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#8B6F47]/10 via-[#A67A5B]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-gradient-to-br from-[#C9B790]/20 to-transparent rounded-full blur-3xl" />

        {/* Bottom accent */}
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#E8DCC8]/30 to-transparent rounded-full blur-3xl" />

        {/* Floating circles */}
        <div className="absolute top-[15%] left-[8%] w-3 h-3 bg-[#A67A5B]/20 rounded-full animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[25%] right-[12%] w-4 h-4 bg-[#8B6F47]/15 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-[60%] left-[5%] w-2 h-2 bg-[#C9B790]/30 rounded-full animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-[45%] right-[6%] w-3 h-3 bg-[#A67A5B]/20 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
        <div className="absolute top-[80%] right-[15%] w-2 h-2 bg-[#8B6F47]/15 rounded-full animate-bounce" style={{ animationDuration: '5.5s', animationDelay: '1.5s' }} />
      </div>

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
          <div className="absolute top-[70%] right-[10%] w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .08) 25%, rgba(255, 255, 255, .08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .08) 75%, rgba(255, 255, 255, .08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .08) 25%, rgba(255, 255, 255, .08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .08) 75%, rgba(255, 255, 255, .08) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          {/* Logo */}
          <Link href="/" className="inline-block mb-12 hover:opacity-80 transition-opacity">
            <Logo size="small" />
          </Link>

          {/* Hero Content */}
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Support Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 leading-relaxed"
            >
              Find answers to common questions or get in touch with our team. We&apos;re here to help you get the most out of HelloML.
            </motion.p>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* FAQ Section - Takes 3 columns */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B6F47] to-[#A67A5B] flex items-center justify-center shadow-lg shadow-[#8B6F47]/20">
                <MessageCircleQuestion className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#5D4E37]">Frequently Asked Questions</h2>
                <p className="text-[#5a4a3a]/60 text-sm">Quick answers to common questions</p>
              </div>
            </motion.div>
            <FAQAccordion items={faqs} />
          </div>

          {/* Contact Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A67A5B] to-[#C9B790] flex items-center justify-center shadow-lg shadow-[#A67A5B]/20">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#5D4E37]">Get in Touch</h2>
                  <p className="text-[#5a4a3a]/60 text-sm">We&apos;ll respond as soon as possible</p>
                </div>
              </motion.div>
              <ContactForm />

              {/* Direct email option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-5 bg-white/60 backdrop-blur-sm rounded-xl border border-[#E8DCC8]/30 text-center"
              >
                <p className="text-sm text-[#5a4a3a]/70">
                  Prefer email directly?{' '}
                  <a href="mailto:noah@helloml.app" className="text-[#8B6F47] font-medium hover:underline">
                    noah@helloml.app
                  </a>
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-8 border-t border-[#E8DCC8]/50"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B6F47] hover:text-[#5D4E37] font-medium transition-colors">
            <ChevronDown className="w-4 h-4 rotate-90" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
