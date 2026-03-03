'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Phone, Trash2, ArrowRight, Clock } from 'lucide-react';
import { useAgentByBusiness } from '@/lib/hooks/use-agents';
import { useSubscription, useCreatePortalSession } from '@/lib/hooks/use-billing';
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
  const { data: subscriptionData } = useSubscription(business.id);
  const createPortal = useCreatePortalSession();
  const [isExploding, setIsExploding] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return phone;
  };

  const getPhoneDisplay = () => {
    if (agentLoading) return 'Loading...';
    if (!agent) return 'No agent';
    if (!agent.phone_number) return 'No number';
    if (agent.phone_number.status === 'provisioning') return 'Provisioning...';
    return formatPhoneNumber(agent.phone_number.phone_number);
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

  if (isHidden) return null;

  // Build Street View URL if address exists
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const hasAddress = !!business.address;
  const streetViewUrl = hasAddress && apiKey
    ? `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${encodeURIComponent(business.address)}&fov=90&pitch=5&key=${apiKey}`
    : null;

  const phoneStr = getPhoneDisplay();
  const hasPhone = phoneStr !== 'No agent' && phoneStr !== 'No number' && phoneStr !== 'Loading...' && phoneStr !== 'Provisioning...';

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
        whileHover={!isExploding ? { y: -4 } : {}}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
        className="group relative cursor-pointer"
        onClick={() => router.push(`/business/${business.id}`)}
        style={{ overflow: 'visible' }}
      >
        <DeleteBurst isActive={isExploding} onComplete={handleBurstComplete} />

        <div
          className={`relative bg-white rounded-2xl overflow-hidden border border-[#E8DCC8]/60 shadow-sm group-hover:shadow-lg group-hover:border-[#E8DCC8] transition-all duration-300 ${isExploding ? 'pointer-events-none' : ''}`}
        >
          {/* Header — Street View image or gradient fallback */}
          <div className="relative h-[140px] overflow-hidden">
            {streetViewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={streetViewUrl}
                  alt={`Street view of ${business.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D3425]/90 via-[#3D3425]/40 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#8B6F47] to-[#A67A5B]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D3425]/60 to-transparent" />
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              </div>
            )}

            {/* Business name on the image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold text-white truncate">{business.name}</h3>
              {business.business_email && (
                <p className="text-xs text-white/60 truncate mt-0.5">{business.business_email}</p>
              )}
            </div>

            {/* Delete button — top right corner */}
            <motion.button
              className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-red-500/80 text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
              onClick={handleDeleteClick}
              disabled={isDeleting || isExploding}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          {/* Details row */}
          <div className="p-4 space-y-2.5">
            {hasAddress && (
              <div className="flex items-center gap-2.5 text-sm text-[#6B5D4D]">
                <MapPin className="w-3.5 h-3.5 text-[#8B6F47]/50 flex-shrink-0" />
                <span className="truncate">{business.address}</span>
              </div>
            )}

            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="w-3.5 h-3.5 text-[#8B6F47]/50 flex-shrink-0" />
              <span className={hasPhone ? 'text-[#5D4E37] font-medium' : 'text-[#A67A5B]/50'}>{phoneStr}</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-[#A67A5B]/50">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formatDate(business.created_at)}</span>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between pt-3 border-t border-[#E8DCC8]/40">
              <span className="text-xs text-[#8B6F47]/40 font-medium">
                {agent ? 'Agent active' : 'No agent'}
              </span>
              <span className="text-xs font-medium text-[#8B6F47] flex items-center gap-1 group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        businessName={business.name}
        isDeleting={isDeleting && isExploding}
        hasActiveSubscription={subscriptionData?.has_active_subscription && !subscriptionData?.subscription?.cancel_at_period_end && !subscriptionData?.subscription?.cancel_at}
        onManageBilling={() => createPortal.mutate(business.id)}
      />
    </>
  );
}
