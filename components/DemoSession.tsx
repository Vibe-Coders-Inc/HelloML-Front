'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const DEMO_DURATION = 120; // seconds
const REALTIME_MODEL = 'gpt-4o-realtime-preview-2024-12-17';

interface DemoSessionState {
  status: 'idle' | 'connecting' | 'active' | 'ended' | 'error';
  timeLeft: number;
  audioLevel: number;
  aiSpeaking: boolean;
  errorMessage?: string;
  isMuted: boolean;
}

interface UseDemoSessionReturn extends DemoSessionState {
  start: () => Promise<void>;
  end: () => void;
  toggleMute: () => void;
}

export function useDemoSession(): UseDemoSessionReturn {
  const [status, setStatus] = useState<DemoSessionState['status']>('idle');
  const [timeLeft, setTimeLeft] = useState(DEMO_DURATION);
  const [audioLevel, setAudioLevel] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isMuted, setIsMuted] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const remoteAnalyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const dcRef = useRef<RTCDataChannel | null>(null);

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    dcRef.current?.close();
    pcRef.current?.close();
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    pcRef.current = null;
    localStreamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    remoteAnalyserRef.current = null;
    dcRef.current = null;
  }, []);

  const end = useCallback(() => {
    cleanup();
    setStatus('ended');
    setAudioLevel(0);
    setAiSpeaking(false);
  }, [cleanup]);

  // Audio level monitoring
  const monitorAudio = useCallback(() => {
    const localData = new Uint8Array(analyserRef.current?.fftSize ?? 256);
    const remoteData = new Uint8Array(remoteAnalyserRef.current?.fftSize ?? 256);

    const tick = () => {
      let localLevel = 0;
      let remoteLevel = 0;

      if (analyserRef.current) {
        analyserRef.current.getByteTimeDomainData(localData);
        let sum = 0;
        for (let i = 0; i < localData.length; i++) {
          const v = (localData[i] - 128) / 128;
          sum += v * v;
        }
        localLevel = Math.sqrt(sum / localData.length);
      }

      if (remoteAnalyserRef.current) {
        remoteAnalyserRef.current.getByteTimeDomainData(remoteData);
        let sum = 0;
        for (let i = 0; i < remoteData.length; i++) {
          const v = (remoteData[i] - 128) / 128;
          sum += v * v;
        }
        remoteLevel = Math.sqrt(sum / remoteData.length);
      }

      const isAi = remoteLevel > 0.02;
      setAiSpeaking(isAi);
      setAudioLevel(Math.min(1, Math.max(localLevel, remoteLevel) * 4));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    try {
      setStatus('connecting');
      setErrorMessage(undefined);
      setTimeLeft(DEMO_DURATION);

      // 1. Get mic
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
      } catch {
        setStatus('error');
        setErrorMessage('mic_denied');
        return;
      }
      localStreamRef.current = stream;

      // 2. Get ephemeral key
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/demo/session`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to get session');
      const { ephemeral_key } = await res.json();

      // 3. WebRTC setup
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Add local audio
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // Audio context for visualization
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const localSource = audioCtx.createMediaStreamSource(stream);
      const localAnalyser = audioCtx.createAnalyser();
      localAnalyser.fftSize = 256;
      localSource.connect(localAnalyser);
      analyserRef.current = localAnalyser;

      // Handle remote audio
      pc.ontrack = (e) => {
        const remoteAudio = new Audio();
        remoteAudio.srcObject = e.streams[0];
        remoteAudio.play();

        const remoteSource = audioCtx.createMediaStreamSource(e.streams[0]);
        const remoteAnalyser = audioCtx.createAnalyser();
        remoteAnalyser.fftSize = 256;
        remoteSource.connect(remoteAnalyser);
        remoteAnalyserRef.current = remoteAnalyser;
      };

      // 4. Data channel
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onopen = () => {
        // Send session config
        dc.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: 'You are a friendly AI phone agent demo for HelloML. Greet the user warmly, introduce yourself as a HelloML demo agent, and show off your conversational abilities. You can answer questions about HelloML (an AI phone answering service for businesses that costs $5/month, books appointments, answers from uploaded documents, provides transcriptions). Keep responses concise and natural. You have about 2 minutes with the caller.',
            voice: 'alloy',
            input_audio_transcription: { model: 'whisper-1' },
            turn_detection: { type: 'server_vad' },
          },
        }));

        // Trigger greeting
        dc.send(JSON.stringify({
          type: 'response.create',
          response: {
            modalities: ['text', 'audio'],
            instructions: 'Greet the user! Say something like "Hey there! I\'m a HelloML demo agent. Think of me as your AI receptionist — I can answer calls, book appointments, and handle customer questions for your business. Go ahead and ask me anything, or just have a chat! We\'ve got about two minutes."',
          },
        }));
      };

      dc.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === 'response.audio.delta') {
            setAiSpeaking(true);
          } else if (msg.type === 'response.audio.done' || msg.type === 'response.done') {
            setAiSpeaking(false);
          }
        } catch { /* ignore */ }
      };

      // 5. SDP exchange
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ephemeral_key}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        }
      );
      if (!sdpRes.ok) throw new Error('SDP exchange failed');

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      // 6. Active!
      setStatus('active');
      monitorAudio();

      // 7. Timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = DEMO_DURATION - elapsed;
        if (remaining <= 0) {
          end();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      // Handle connection close
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          end();
        }
      };
    } catch (err) {
      console.error('Demo session error:', err);
      cleanup();
      setStatus('error');
      setErrorMessage('connection_failed');
    }
  }, [cleanup, end, monitorAudio]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const track = stream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return { status, timeLeft, audioLevel, aiSpeaking, errorMessage, isMuted, start, end, toggleMute };
}
