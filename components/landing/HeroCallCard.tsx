'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Live call transcript card for hero section.
 * Auto-plays a phone conversation between a caller and HelloML AI.
 * BIGGER version with more detail — demonstrates the product instantly.
 */

interface Message {
  role: 'caller' | 'ai';
  text: string;
}

const CONVERSATION: Message[] = [
  { role: 'caller', text: "Hi, I need to schedule a plumbing repair for this week." },
  { role: 'ai', text: "I can help with that. We have openings on Wednesday at 10 AM or Thursday at 2:30 PM. Which works better?" },
  { role: 'caller', text: "Thursday at 2:30 works. Do you need my address?" },
  { role: 'ai', text: "Yes please, and I'll also need a brief description of the issue so our technician comes prepared." },
  { role: 'caller', text: "It's a leaking kitchen faucet. Address is 445 Oak Street." },
  { role: 'ai', text: "Perfect. You're booked for Thursday at 2:30 for a kitchen faucet repair at 445 Oak Street. I'll send a confirmation text with your technician's name shortly." },
];

const TYPING_SPEED = 35; // ms per character — consistent, no acceleration
const PAUSE_BETWEEN = 900; // ms between messages
const RESTART_DELAY = 4000; // ms before restarting

export function HeroCallCard({ className = '' }: { className?: string }) {
  const [messages, setMessages] = useState<{ role: string; text: string; typing?: boolean }[]>([]);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stopwatch timer — counts steadily, independent of conversation
  const startTime = useRef(Date.now());
  useEffect(() => {
    const t = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (currentMsg >= CONVERSATION.length) {
      const t = setTimeout(() => {
        setMessages([]);
        setCurrentMsg(0);
        setCurrentChar(0);
      }, RESTART_DELAY);
      return () => clearTimeout(t);
    }

    const msg = CONVERSATION[currentMsg];

    if (currentChar === 0) {
      setIsTyping(true);
      const t = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: msg.role, text: '', typing: true }]);
        setCurrentChar(1);
      }, 400);
      return () => clearTimeout(t);
    }

    if (currentChar <= msg.text.length) {
      const t = setTimeout(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: msg.role,
            text: msg.text.slice(0, currentChar),
            typing: currentChar < msg.text.length,
          };
          return updated;
        });
        setCurrentChar(c => c + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setCurrentMsg(m => m + 1);
      setCurrentChar(0);
    }, PAUSE_BETWEEN);
    return () => clearTimeout(t);
  }, [currentMsg, currentChar]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#E8DCC8] shadow-2xl shadow-[#8B6F47]/15 overflow-hidden w-full max-w-[520px]">
        {/* Call header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#E8DCC8]/50 bg-[#FAF8F3]">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#8B6F47]/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#8B6F47]" viewBox="0 0 48 48" fill="none"><path d="M38 32.5v4.5a3 3 0 01-3.27 3 29.7 29.7 0 01-12.95-4.61 29.27 29.27 0 01-9-9A29.7 29.7 0 018.17 13.27 3 3 0 0111.15 10H15.67a3 3 0 013 2.58 19.27 19.27 0 001.05 4.22 3 3 0 01-.68 3.16l-1.9 1.9a24 24 0 009 9l1.9-1.9a3 3 0 013.16-.68 19.27 19.27 0 004.22 1.05 3 3 0 012.58 3.07z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#3D3425]">HelloML Agent</p>
            <p className="text-xs text-green-600 font-medium">Live call in progress</p>
          </div>
          {/* Live waveform bars — steady tempo, no jitter */}
          <div className="flex items-end gap-[2px] h-6 mr-2">
            {[14, 8, 18, 10, 16, 6, 12].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-[#8B6F47]/60"
                style={{
                  height: h,
                  transformOrigin: 'bottom',
                  animation: `voiceBar 0.8s ${i * 0.12}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-[#A67A5B]/60 tabular-nums">{timeStr}</span>
        </div>

        {/* Transcript area */}
        <div ref={containerRef} className="px-3 sm:px-5 py-3 sm:py-4 space-y-3 min-h-[220px] sm:min-h-[300px] max-h-[280px] sm:max-h-[360px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'caller' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === 'caller'
                    ? 'bg-[#F5F0E8] text-[#3D3425] rounded-bl-md'
                    : 'bg-[#8B6F47] text-white rounded-br-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && currentMsg < CONVERSATION.length && (
            <div className={`flex ${CONVERSATION[currentMsg]?.role === 'caller' ? 'justify-start' : 'justify-end'}`}>
              <div className={`px-4 py-2.5 rounded-2xl ${
                CONVERSATION[currentMsg]?.role === 'caller'
                  ? 'bg-[#F5F0E8] rounded-bl-md'
                  : 'bg-[#8B6F47] rounded-br-md'
              }`}>
                <div className="flex gap-1">
                  {[0, 1, 2].map(j => (
                    <div
                      key={j}
                      className={`w-1.5 h-1.5 rounded-full ${
                        CONVERSATION[currentMsg]?.role === 'caller' ? 'bg-[#8B7355]' : 'bg-white/70'
                      }`}
                      style={{ animation: `voiceBar 0.5s ${j * 0.15}s ease-in-out infinite alternate` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar with booking confirmation */}
        <div className="px-5 py-2.5 border-t border-[#E8DCC8]/30 bg-[#FAF8F3]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <p className="text-[11px] text-[#8B7355]">Real-time transcription</p>
          </div>
          <p className="text-[11px] text-[#A67A5B]/50">Powered by HelloML</p>
        </div>
      </div>
    </div>
  );
}
