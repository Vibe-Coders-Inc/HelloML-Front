'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Phone, Calendar, Trash2, ArrowRight } from 'lucide-react';
import { useAgentByBusiness } from '@/lib/hooks/use-agents';
import { GlowButton } from '@/components/ui/glow-button';
import { DeleteBurst } from '@/components/ui/delete-burst';
import { DeleteConfirmModal } from '@/components/ui/delete-confirm-modal';
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
    transition: { duration: 0.3 },
  },
};

export function BusinessCard({ business, onDelete, isDeleting, index }: BusinessCardProps) {
  const router = useRouter();
  const { data: agent, isLoading: agentLoading } = useAgentByBusiness(business.id);
  const [isExploding, setIsExploding] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    // Format as +1 (XXX) XXX-XXXX
    if (digits.length === 10) {
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return phone; // Return original if format doesn't match
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

    return <span className="text-[#8B6F47] font-medium">{formatPhoneNumber(agent.phone_number.phone_number)}</span>;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setIsExploding(true);
  };

  const handleBurstComplete = useCallback(() => {
    setIsHidden(true);
    onDelete(business.id);
  }, [business.id, onDelete]);

  if (isHidden) {
    return null;
  }

  return (
    <>
      <motion.div
        layout
        layoutId={`business-card-${business.id}`}
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate={isExploding ? { opacity: 0, scale: 0.8, transition: { duration: 0.3 } } : 'visible'}
        exit="exit"
        whileHover={!isExploding ? { y: -6, scale: 1.02 } : {}}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
        className="group relative cursor-pointer"
        style={{ overflow: 'visible' }}
      >
        {/* Delete burst animation - positioned to overflow the card */}
        <DeleteBurst isActive={isExploding} onComplete={handleBurstComplete} />

        <div
          className={`relative bg-white rounded-2xl transition-all duration-300 ${isExploding ? 'pointer-events-none' : ''}`}
          style={{
            overflow: 'visible',
            boxShadow: `
              0 1px 2px rgba(139,111,71,0.04),
              0 4px 8px rgba(139,111,71,0.06),
              0 8px 16px rgba(139,111,71,0.06),
              0 0 0 1px rgba(232,220,200,0.5)
            `,
          }}
        >
          {/* Hover glow ring */}
          <div
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(139,111,71,0.15), rgba(166,122,91,0.1), rgba(201,183,144,0.15))',
              filter: 'blur(1px)',
            }}
          />

          {/* Inner card with slight inset effect */}
          <div className="relative bg-white rounded-2xl">
            {/* Accent bar at top */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#8B6F47]/40 to-transparent" />

            {/* Subtle top highlight for depth */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FDFCFA] to-transparent rounded-t-2xl pointer-events-none" />

            {/* Content */}
            <div className="relative p-6 pt-5">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[#5D4E37] truncate mb-1">
                  {business.name}
                </h3>
                <p className="text-sm text-[#8B6F47]/70 truncate">
                  {business.business_email}
                </p>
              </div>
              <motion.button
                className="text-[#A67A5B]/40 hover:text-red-500 hover:bg-red-50 rounded-lg h-8 w-8 flex items-center justify-center transition-colors duration-200 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
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
              <div className="flex items-center text-sm text-[#6B5D4D]">
                <div className="w-9 h-9 min-w-[36px] rounded-lg bg-[#F5F0E8] flex items-center justify-center mr-3">
                  <Building2 className="h-4 w-4 text-[#8B6F47]" />
                </div>
                <span className="truncate">{business.address}</span>
              </div>

              <div className="flex items-center text-sm text-[#6B5D4D]">
                <div className="w-9 h-9 min-w-[36px] rounded-lg bg-[#F5F0E8] flex items-center justify-center mr-3">
                  <Phone className="h-4 w-4 text-[#8B6F47]" />
                </div>
                {getPhoneDisplay()}
              </div>

              <div className="flex items-center text-sm text-[#6B5D4D]">
                <div className="w-9 h-9 min-w-[36px] rounded-lg bg-[#F5F0E8] flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-[#8B6F47]" />
                </div>
                <span>
                  <span className="text-[#A67A5B]/60">Created </span>
                  {formatDate(business.created_at)}
                </span>
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
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        businessName={business.name}
        isDeleting={isDeleting && isExploding}
      />
    </>
  );
}
