'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GlowButton } from '@/components/ui/glow-button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  businessName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, businessName, isDeleting }: DeleteConfirmModalProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const confirmText = 'delete';
  const isValid = inputValue.toLowerCase() === confirmText;

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isDeleting) {
      onConfirm();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 overflow-hidden mx-4">
              {/* Header */}
              <div className="bg-red-50 px-6 py-5 border-b border-red-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-red-900">Delete Business</h2>
                    <p className="text-sm text-red-700/80 mt-0.5">This action cannot be undone</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <p className="text-[#5D4E37] text-sm leading-relaxed">
                  You are about to delete <span className="font-semibold">{businessName}</span>.
                  This will permanently remove all associated data including your agent, phone number, and call history.
                </p>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-[#5D4E37] mb-2">
                    Type <span className="font-mono bg-[#F5F0E8] px-1.5 py-0.5 rounded text-red-600">{confirmText}</span> to confirm
                  </label>
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type here..."
                    className={`h-12 border-2 rounded-xl text-[#5D4E37] ${
                      inputValue && !isValid ? 'border-red-300' : isValid ? 'border-green-400' : 'border-[#E8DCC8]'
                    }`}
                    disabled={isDeleting}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-[#FAF8F3] border-t border-[#E8DCC8]/50 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="px-5 py-2.5 text-sm font-medium text-[#8B6F47] hover:bg-[#E8DCC8]/50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <GlowButton
                  onClick={onConfirm}
                  disabled={!isValid || isDeleting}
                  className={`${isValid ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Deleting...
                    </>
                  ) : (
                    'Delete Business'
                  )}
                </GlowButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
