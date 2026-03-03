'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import type { ExtractedWebsiteInfo } from '@/lib/types';

interface WebsiteExtractorProps {
  onExtracted: (info: ExtractedWebsiteInfo, url: string) => void;
  initialUrl?: string;
  className?: string;
}

export function WebsiteExtractor({ onExtracted, initialUrl = '', className = '' }: WebsiteExtractorProps) {
  const [url, setUrl] = useState(initialUrl);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync with initialUrl changes
  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  const simulateProgress = () => {
    setProgress(0);
    const stages = [
      { at: 5, text: 'Fetching homepage...' },
      { at: 20, text: 'Scanning subpages...' },
      { at: 45, text: 'Extracting contact info...' },
      { at: 65, text: 'Analyzing services...' },
      { at: 80, text: 'Building profile...' },
      { at: 92, text: 'Almost done...' },
    ];
    let currentStage = 0;
    setStatusText(stages[0].text);

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + (0.5 + Math.random() * 1.5);
        // Advance status text at stage boundaries
        if (currentStage < stages.length - 1 && next >= stages[currentStage + 1].at) {
          currentStage++;
          setStatusText(stages[currentStage].text);
        }
        // Cap at 92 until real completion
        return Math.min(next, 92);
      });
    }, 100);
  };

  const handleExtract = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setIsExtracting(true);
    setError(null);
    setExtracted(false);
    simulateProgress();

    try {
      const info = await apiClient.extractWebsiteInfo(trimmed);
      // Complete the progress bar
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(100);
      setStatusText('Complete');
      setExtracted(true);
      onExtracted(info, trimmed);
    } catch (err) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(0);
      setError(err instanceof Error ? err.message : 'Failed to analyze website');
    } finally {
      setIsExtracting(false);
    }
  };

  const isValidUrl = (s: string) => {
    const trimmed = s.trim();
    if (!trimmed) return false;
    return /^(https?:\/\/)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+/.test(trimmed);
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4 text-[#8B6F47]" />
        <span className="text-sm font-medium text-[#5D4E37]">
          Website <span className="text-[#A67A5B]/40 font-normal">(optional)</span>
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setExtracted(false);
            setError(null);
          }}
          placeholder="www.yourbusiness.com"
          className="flex-1 bg-white border-2 h-11 rounded-xl text-[#2D2416] placeholder:text-[#A67A5B]/40 border-[#E8DCC8] focus:border-[#8B6F47]"
          disabled={isExtracting}
        />
        <motion.button
          onClick={handleExtract}
          disabled={!isValidUrl(url) || isExtracting}
          whileTap={{ scale: 0.95 }}
          className={`h-11 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
            extracted
              ? 'bg-green-500 text-white'
              : 'bg-[#8B6F47] text-white hover:bg-[#6B5D4D] disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {extracted ? (
            <>
              <Check className="w-4 h-4" />
              Done
            </>
          ) : isExtracting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Scanning
            </span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Auto-fill
            </>
          )}
        </motion.button>
      </div>

      {/* Progress bar */}
      <AnimatePresence>
        {isExtracting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5"
          >
            <div className="h-1.5 bg-[#E8DCC8]/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8B6F47] to-[#C9A86C] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: 'linear' }}
              />
            </div>
            <p className="text-[11px] text-[#8B6F47]/60 mt-1">{statusText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
        {extracted && !error && !isExtracting && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-green-600 text-xs mt-1.5 flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            Business info extracted and auto-filled
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
