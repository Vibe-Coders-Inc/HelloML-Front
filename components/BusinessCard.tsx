'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Phone, Calendar, Trash2, ArrowRight } from 'lucide-react';
import { useAgentByBusiness } from '@/lib/hooks/use-agents';
import { GlowButton } from '@/components/ui/glow-button';
import { DeleteBurst } from '@/components/ui/delete-burst';
import type { Business } from '@/lib/types';

interface BusinessCardProps {
  business: Business;
  onDelete: (businessId: number) => void;
  isDeleting: boolean;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  },
};

export function BusinessCard({ business, onDelete, isDeleting, index }: BusinessCardProps) {
  const router = useRouter();
  const { data: agent, isLoading: agentLoading } = useAgentByBusiness(business.id);
  const [isExploding, setIsExploding] = useState(false);
  const [showCard, setShowCard] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPhoneDisplay = () => {
    if (agentLoading) {
      return <span className="text-[#A67A5B]/60">Loading...</span>;
    }

    if (!agent) {
      return <span className="text-[#A67A5B]/60">No agent</span>;
    }

    if (!agent.phone_number) {
      return <span className="text-[#A67A5B]/60">No phone number</span>;
    }

    if (agent.phone_number.status === 'provisioning') {
      return <span className="text-[#A67A5B]">Provisioning...</span>;
    }

    return <span className="text-[#8B6F47] font-medium">{agent.phone_number.phone_number}</span>;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      setIsExploding(true);
      // Start fading the card after a brief moment
      setTimeout(() => setShowCard(false), 150);
    }
  };

  const handleBurstComplete = () => {
    onDelete(business.id);
  };

  return (
    <AnimatePresence mode="wait">
      {(showCard || isExploding) && (
        <motion.div
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate={showCard ? 'visible' : 'exit'}
          exit="exit"
          whileHover={showCard ? { y: -4 } : {}}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          className="group relative"
        >
          {/* Delete burst animation */}
          <DeleteBurst isActive={isExploding} onComplete={handleBurstComplete} />

          <div className={`relative bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm hover:shadow-xl hover:shadow-[#8B6F47]/5 transition-all duration-300 rounded-2xl overflow-hidden ${isExploding ? 'pointer-events-none' : ''}`}>
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FAF8F3]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#8B6F47] truncate mb-1">
                    {business.name}
                  </h3>
                  <p className="text-sm text-[#A67A5B]/70 truncate">
                    {business.business_email}
                  </p>
                </div>
                <motion.button
                  className="text-[#A67A5B]/30 hover:text-red-500 hover:bg-red-50 rounded-lg h-8 w-8 flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  onClick={handleDeleteClick}
                  disabled={isDeleting || isExploding}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>

          {/* Details */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center text-sm text-[#A67A5B]/80">
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] flex items-center justify-center mr-3">
                <Building2 className="h-4 w-4 text-[#A67A5B]/60" />
              </div>
              <span className="truncate">{business.address}</span>
            </div>

            <div className="flex items-center text-sm">
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] flex items-center justify-center mr-3">
                <Phone className="h-4 w-4 text-[#A67A5B]/60" />
              </div>
              {getPhoneDisplay()}
            </div>

            <div className="flex items-center text-sm text-[#A67A5B]/80">
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F3] flex items-center justify-center mr-3">
                <Calendar className="h-4 w-4 text-[#A67A5B]/60" />
              </div>
              {formatDate(business.created_at)}
            </div>
          </div>

          {/* Action Button with mouse-following glow */}
          <GlowButton
            onClick={() => router.push(`/business/${business.id}`)}
            className="w-full h-11 rounded-xl"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </GlowButton>
        </div>
      </div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
