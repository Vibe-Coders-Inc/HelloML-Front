'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Loader2, Check, AlertCircle, Sparkles } from 'lucide-react';
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

  const handleExtract = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setIsExtracting(true);
    setError(null);
    setExtracted(false);

    try {
      const info = await apiClient.extractWebsiteInfo(trimmed);
      setExtracted(true);
      onExtracted(info, trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze website');
    } finally {
      setIsExtracting(false);
    }
  };

  const isValidUrl = (s: string) => {
    const trimmed = s.trim();
    if (!trimmed) return false;
    // Accept with or without protocol
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
          {isExtracting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : extracted ? (
            <>
              <Check className="w-4 h-4" />
              Done
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Auto-fill
            </>
          )}
        </motion.button>
      </div>

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
        {extracted && !error && (
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
