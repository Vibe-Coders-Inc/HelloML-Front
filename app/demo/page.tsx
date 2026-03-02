'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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

  const isLive = session.status === 'active' || session.status === 'connecting';

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo size="small" lightMode />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-[#8B6F47]/70 hover:text-[#8B6F47] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">

        {/* IDLE STATE — top content */}
        <AnimatePresence mode="wait">
          {session.status === 'idle' && (
            <motion.div
              key="idle-top"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#3D2E1F] mb-4">
                Talk to an AI Phone Agent
              </h1>
              <p className="text-[#8B6F47]/70 text-base sm:text-lg mb-6 max-w-md">
                Experience what HelloML sounds like — live.
              </p>

              {/* Voice Picker */}
              <div className="w-full max-w-lg mb-8">
                <p className="text-[#8B6F47]/50 text-xs mb-3 text-center">Choose a voice</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {VOICES.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      title={voice.desc}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedVoice === voice.id
                          ? 'bg-[#8B6F47] text-white shadow-md scale-105'
                          : 'bg-[#E8DCC8]/60 text-[#8B6F47]/80 hover:bg-[#E8DCC8] hover:text-[#8B6F47]'
                      }`}
                    >
                      {voice.label}
                    </button>
                  ))}
                </div>
                <p className="text-[#8B6F47]/30 text-xs mt-2 text-center">
                  {VOICES.find(v => v.id === selectedVoice)?.desc}
                </p>
              </div>
            </motion.div>
          )}

          {session.status === 'connecting' && (
            <motion.div
              key="connecting-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <h2 className="text-xl text-[#8B6F47] mb-8">Connecting...</h2>
            </motion.div>
          )}

          {session.status === 'active' && (
            <motion.div
              key="active-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <p className="text-[#8B6F47]/40 text-sm mb-6 tabular-nums">
                {formatTime(session.timeLeft)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* VOICE ORB — always mounted, never unmounts (preserves color state) */}
        {(session.status === 'idle' || isLive) && (
          <VoiceOrb
            state={session.status === 'idle' ? 'idle' : session.status === 'connecting' ? 'connecting' : 'active'}
            audioLevel={session.audioLevel}
            aiSpeaking={session.aiSpeaking}
            voice={selectedVoice}
            onClick={session.status === 'idle' ? () => session.start(selectedVoice) : undefined}
          />
        )}

        {/* Bottom content — transcript, controls, etc */}
        <AnimatePresence mode="wait">
          {session.status === 'idle' && (
            <motion.div
              key="idle-bottom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <p className="mt-10 text-[#8B6F47]/50 text-xs sm:text-sm">
                No signup required • 2 minute demo • Uses your microphone
              </p>
              <p className="mt-3 text-[#8B6F47]/30 text-xs max-w-sm">
                This demo uses your microphone to have a live conversation with our AI
              </p>
            </motion.div>
          )}

          {session.status === 'active' && (
            <motion.div
              key="active-bottom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              {/* Live transcript */}
              <div className="mt-6 min-h-[3rem] max-w-md px-4">
                {session.transcript && (
                  <motion.p
                    key={session.transcript.slice(0, 20)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#3D2E1F]/80 text-base sm:text-lg text-center font-light leading-relaxed"
                  >
                    {session.transcript}
                  </motion.p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={session.toggleMute}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    session.isMuted
                      ? 'bg-red-100 text-red-500'
                      : 'bg-[#8B6F47]/10 text-[#8B6F47]/70 hover:bg-[#8B6F47]/20'
                  }`}
                >
                  <MicOff className="w-5 h-5" />
                </button>
                <button
                  onClick={session.end}
                  className="w-14 h-14 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-colors"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <div className="absolute inset-0 rounded-full border border-[#8B6F47]"/>
                <div className="absolute inset-8 rounded-full border border-[#8B6F47]"/>
                <div className="absolute inset-16 rounded-full border border-[#8B6F47]"/>
                <div className="absolute inset-24 rounded-full border border-[#A67A5B]"/>
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#3D2E1F] mb-3">
                Hope that was impressive!
              </h2>
              <p className="text-[#8B6F47]/80 text-lg mb-8">
                Ready to build your own?
              </p>
              <Link href="/auth?mode=signup">
                <Button className="bg-[#8B6F47] hover:bg-[#A67A5B] text-white rounded-full px-8 py-5 text-base font-medium group">
                  Create Your Agent — Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="mt-4 text-[#8B6F47]/40 text-xs">
                No credit card required
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 text-sm text-[#8B6F47] hover:text-[#A67A5B] transition-colors"
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
                <h2 className="text-xl font-bold text-[#3D2E1F] mb-3">
                  Microphone access needed
                </h2>
                <p className="text-[#8B6F47]/70 text-sm mb-6">
                  Microphone access is needed for the demo. Please allow microphone permissions in your browser settings and try again.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-[#3D2E1F] mb-3">
                  Something went wrong
                </h2>
                <p className="text-[#8B6F47]/70 text-sm mb-6">
                  We couldn&apos;t establish a connection. Please check your internet and try again.
                </p>
              </>
            )}
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-[#8B6F47] hover:text-[#A67A5B] transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
