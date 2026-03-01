'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Live call transcript card for hero section.
 * Auto-plays a phone conversation between a caller and HelloML AI.
 * Clean UI card with typing animation — demonstrates the product instantly.
 */

interface Message {
  role: 'caller' | 'ai';
  text: string;
}

const CONVERSATION: Message[] = [
  { role: 'caller', text: "Hi, I need to schedule an appointment for Thursday." },
  { role: 'ai', text: "Of course! I have a 2:30 opening on Thursday. Would that work?" },
  { role: 'caller', text: "That's perfect. Can you also send me the address?" },
  { role: 'ai', text: "You're all set for Thursday at 2:30. I'll send the address and confirmation to your email right now." },
];

const TYPING_SPEED = 35; // ms per character
const PAUSE_BETWEEN = 800; // ms between messages
const RESTART_DELAY = 3000; // ms before restarting

export function HeroCallCard({ className = '' }: { className?: string }) {
  const [messages, setMessages] = useState<{ role: string; text: string; typing?: boolean }[]>([]);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentMsg >= CONVERSATION.length) {
      // Restart after delay
      const t = setTimeout(() => {
        setMessages([]);
        setCurrentMsg(0);
        setCurrentChar(0);
      }, RESTART_DELAY);
      return () => clearTimeout(t);
    }

    const msg = CONVERSATION[currentMsg];

    if (currentChar === 0) {
      // Start new message — show typing indicator
      setIsTyping(true);
      const t = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: msg.role, text: '', typing: true }]);
        setCurrentChar(1);
      }, 400);
      return () => clearTimeout(t);
    }

    if (currentChar <= msg.text.length) {
      // Type character
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

    // Message complete — pause then next
    const t = setTimeout(() => {
      setCurrentMsg(m => m + 1);
      setCurrentChar(0);
    }, PAUSE_BETWEEN);
    return () => clearTimeout(t);
  }, [currentMsg, currentChar]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`relative ${className}`}>
      {/* Call card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8DCC8] shadow-2xl shadow-[#8B6F47]/10 overflow-hidden" style={{ width: 440, maxWidth: '92vw' }}>
        {/* Call header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#E8DCC8]/50 bg-[#FAF8F3]">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#3D3425]">HelloML Agent</p>
            <p className="text-xs text-[#8B7355]">Active call</p>
          </div>
          {/* Live waveform bars */}
          <div className="flex items-end gap-[2px] h-5">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-[#8B6F47]"
                style={{
                  height: 8 + Math.random() * 12,
                  transformOrigin: 'bottom',
                  animation: `voiceBar ${0.3 + i * 0.1}s ${i * 0.05}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Transcript area */}
        <div ref={containerRef} className="px-5 py-4 space-y-3 min-h-[180px] max-h-[220px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'caller' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'caller'
                    ? 'bg-[#F5F0E8] text-[#3D3425] rounded-bl-md'
                    : 'bg-[#8B6F47] text-white rounded-br-md'
                }`}
              >
                {msg.text}
                {msg.typing && <span className="inline-block w-[2px] h-4 bg-current ml-0.5 animate-pulse" />}
              </div>
            </div>
          ))}
          {isTyping && (
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

        {/* Call duration footer */}
        <div className="px-5 py-2 border-t border-[#E8DCC8]/30 bg-[#FAF8F3]/50">
          <p className="text-[10px] text-[#A67A5B]/60 text-center font-mono">00:42</p>
        </div>
      </div>
    </div>
  );
}
