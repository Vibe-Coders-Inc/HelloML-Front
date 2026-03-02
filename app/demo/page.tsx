'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MicOff, PhoneOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceOrb } from '@/components/VoiceOrb';
import { useDemoSession } from '@/components/DemoSession';
import { Logo } from '@/components/Logo';

const VOICES = [
  { id: 'alloy', label: 'Alloy', desc: 'Neutral, balanced' },
  { id: 'ash', label: 'Ash', desc: 'Warm, confident' },
  { id: 'ballad', label: 'Ballad', desc: 'Expressive, dramatic' },
  { id: 'coral', label: 'Coral', desc: 'Clear, friendly' },
  { id: 'echo', label: 'Echo', desc: 'Smooth, deep' },
  { id: 'sage', label: 'Sage', desc: 'Calm, measured' },
  { id: 'shimmer', label: 'Shimmer', desc: 'Soft, gentle' },
  { id: 'verse', label: 'Verse', desc: 'Versatile, natural' },
  { id: 'marin', label: 'Marin', desc: 'Latest, natural' },
] as const;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function DemoPage() {
  const session = useDemoSession();
  const [selectedVoice, setSelectedVoice] = useState('ash');

  return (
    <div className="min-h-screen bg-[#0D0B0A] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo size="small" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        {/* IDLE STATE */}
        {session.status === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white/95 mb-4">
              Talk to an AI Phone Agent
            </h1>
            <p className="text-white/40 text-base sm:text-lg mb-6 max-w-md">
              Experience what HelloML sounds like — live.
            </p>

            {/* Voice Picker */}
            <div className="w-full max-w-lg mb-8">
              <p className="text-white/30 text-xs mb-3 text-center">Choose a voice</p>
              <div className="flex flex-wrap justify-center gap-2">
                {VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    title={voice.desc}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedVoice === voice.id
                        ? 'bg-[#8B6F47] text-white shadow-md scale-105'
                        : 'bg-white/8 text-white/50 hover:bg-white/12 hover:text-white/70'
                    }`}
                  >
                    {voice.label}
                  </button>
                ))}
              </div>
              <p className="text-white/20 text-xs mt-2 text-center">
                {VOICES.find(v => v.id === selectedVoice)?.desc}
              </p>
            </div>

            <VoiceOrb
              state="idle"
              audioLevel={0}
              aiSpeaking={false}
              onClick={() => session.start(selectedVoice)}
            />

            <p className="mt-10 text-white/30 text-xs sm:text-sm">
              No signup required • 2 minute demo • Uses your microphone
            </p>
            <p className="mt-3 text-white/15 text-xs max-w-sm">
              This demo uses your microphone to have a live conversation with our AI
            </p>
          </motion.div>
        )}

        {/* CONNECTING STATE */}
        {session.status === 'connecting' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-xl text-white/60 mb-8">Connecting...</h2>
            <VoiceOrb
              state="connecting"
              audioLevel={0}
              aiSpeaking={false}
            />
          </motion.div>
        )}

        {/* ACTIVE STATE */}
        {session.status === 'active' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center"
          >
            {/* Timer */}
            <p className="text-white/30 text-sm mb-6 tabular-nums">
              {formatTime(session.timeLeft)}
            </p>

            <VoiceOrb
              state="active"
              audioLevel={session.audioLevel}
              aiSpeaking={session.aiSpeaking}
            />

            {/* Live transcript */}
            <div className="mt-6 min-h-[3rem] max-w-md px-4">
              {session.transcript ? (
                <motion.p
                  key={session.transcript.slice(0, 20)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white/80 text-base sm:text-lg text-center font-light leading-relaxed"
                >
                  {session.transcript}
                </motion.p>
              ) : (
                <p className="text-white/30 text-sm text-center">
                  {session.aiSpeaking ? 'AI is speaking...' : 'Listening...'}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={session.toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  session.isMuted
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-white/8 text-white/50 hover:bg-white/12'
                }`}
              >
                <MicOff className="w-5 h-5" />
              </button>
              <button
                onClick={session.end}
                className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-colors"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ENDED STATE */}
        {session.status === 'ended' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-center text-center"
          >
            {/* Decorative ripple rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.07]">
              <div className="relative w-[400px] h-[400px]">
                <div className="absolute inset-0 rounded-full border border-white"/>
                <div className="absolute inset-8 rounded-full border border-white"/>
                <div className="absolute inset-16 rounded-full border border-white"/>
                <div className="absolute inset-24 rounded-full border border-white"/>
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white/95 mb-3">
                Hope that was impressive!
              </h2>
              <p className="text-white/50 text-lg mb-8">
                Ready to build your own?
              </p>
              <Link href="/auth?mode=signup">
                <Button className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 text-base font-medium group">
                  Create Your Agent — Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="mt-4 text-white/25 text-xs">
                No credit card required
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 text-sm text-[#8B6F47] hover:text-[#C9A96E] transition-colors"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}

        {/* ERROR STATE */}
        {session.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center max-w-md"
          >
            {session.errorMessage === 'mic_denied' ? (
              <>
                <h2 className="text-xl font-bold text-white/90 mb-3">
                  Microphone access needed
                </h2>
                <p className="text-white/50 text-sm mb-6">
                  Microphone access is needed for the demo. Please allow microphone permissions in your browser settings and try again.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white/90 mb-3">
                  Something went wrong
                </h2>
                <p className="text-white/50 text-sm mb-6">
                  We couldn&apos;t establish a connection. Please check your internet and try again.
                </p>
              </>
            )}
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-[#8B6F47] hover:text-[#C9A96E] transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
