'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Phone, Trash2, ArrowRight, Clock, Activity, CreditCard, PhoneCall, Zap } from 'lucide-react';
import { useAgentByBusiness } from '@/lib/hooks/use-agents';
import { useSubscription, useUsage, useCreatePortalSession } from '@/lib/hooks/use-billing';
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

// Warm gradient palette for fallback headers
const gradientPalettes = [
  'from-[#8B6F47] via-[#A67A5B] to-[#C9A86C]',
  'from-[#6B5D4D] via-[#8B6F47] to-[#B8976A]',
  'from-[#A67A5B] via-[#C9A86C] to-[#D4C4A8]',
  'from-[#7A6652] via-[#9B7F5E] to-[#C4A87A]',
  'from-[#5D4E37] via-[#8B6F47] to-[#A67A5B]',
];

export function BusinessCard({ business, onDelete, isDeleting, index }: BusinessCardProps) {
  const router = useRouter();
  const { data: agent, isLoading: agentLoading } = useAgentByBusiness(business.id);
  const { data: subscriptionData } = useSubscription(business.id);
  const { data: usageData } = useUsage(business.id);
  const createPortal = useCreatePortalSession();
  const [isExploding, setIsExploding] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  const hasAddress = !!business.address;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const streetViewUrl = hasAddress && apiKey && !imgError
    ? `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${encodeURIComponent(business.address)}&fov=90&pitch=5&key=${apiKey}`
    : null;
  const mapsLink = hasAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}` : null;

  const phoneStr = getPhoneDisplay();
  const hasPhone = phoneStr !== 'No agent' && phoneStr !== 'No number' && phoneStr !== 'Loading...' && phoneStr !== 'Provisioning...';

  const hasSub = subscriptionData?.has_active_subscription;
  const gradient = gradientPalettes[index % gradientPalettes.length];

  // Agent status
  const agentStatus = agentLoading ? 'loading' : agent ? agent.status : 'none';
  const statusColor = agentStatus === 'active' ? 'bg-green-400' : agentStatus === 'paused' ? 'bg-yellow-400' : 'bg-gray-300';
  const statusLabel = agentStatus === 'active' ? 'Active' : agentStatus === 'paused' ? 'Paused' : agentStatus === 'loading' ? '...' : 'No agent';

  // Usage
  const minutesUsed = usageData?.minutes_used ?? 0;
  const includedMinutes = usageData?.included_minutes ?? 200;
  const usagePercent = includedMinutes > 0 ? Math.min((minutesUsed / includedMinutes) * 100, 100) : 0;

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
          {/* Header */}
          <div className="relative h-[130px] overflow-hidden">
            {streetViewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={streetViewUrl}
                  alt={`Street view of ${business.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D3425]/90 via-[#3D3425]/40 to-transparent" />
              </>
            ) : (
              /* Warm gradient fallback with pattern */
              <div className={`w-full h-full bg-gradient-to-br ${gradient}`}>
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 opacity-[0.08]" style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }} />
                {/* Large faded initial */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[96px] font-bold text-white/[0.12] select-none leading-none tracking-tighter">
                    {business.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
              </div>
            )}

            {/* Business name overlaid */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold truncate text-white drop-shadow-sm">
                {business.name}
              </h3>
              {business.business_email && (
                <p className="text-xs truncate mt-0.5 text-white/60">
                  {business.business_email}
                </p>
              )}
            </div>

            {/* Status badge — top left */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className={`w-2 h-2 rounded-full ${statusColor} ${agentStatus === 'active' ? 'animate-pulse' : ''}`} />
              <span className="text-[11px] font-medium text-white/90">{statusLabel}</span>
            </div>

            {/* Delete button — always visible */}
            <motion.button
              className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 backdrop-blur-sm text-white/60 hover:bg-red-500/80 hover:text-white transition-all duration-200"
              onClick={handleDeleteClick}
              disabled={isDeleting || isExploding}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          {/* Info rows */}
          <div className="p-4 space-y-2">
            {hasAddress && (
              <a
                href={mapsLink!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2.5 text-sm text-[#6B5D4D] hover:text-[#8B6F47] transition-colors group/addr"
              >
                <MapPin className="w-3.5 h-3.5 text-[#8B6F47]/50 group-hover/addr:text-[#8B6F47] flex-shrink-0 transition-colors" />
                <span className="truncate underline decoration-[#E8DCC8] underline-offset-2 group-hover/addr:decoration-[#8B6F47]/40">{business.address}</span>
              </a>
            )}

            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="w-3.5 h-3.5 text-[#8B6F47]/50 flex-shrink-0" />
              <span className={hasPhone ? 'text-[#5D4E37] font-medium' : 'text-[#A67A5B]/50'}>{phoneStr}</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-[#A67A5B]/50">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Created {formatDate(business.created_at)}</span>
            </div>
          </div>

          {/* Usage bar */}
          {hasSub && (
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-[#8B6F47]/60 font-medium flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" />
                  Usage
                </span>
                <span className="text-[#5D4E37] font-semibold">
                  {minutesUsed} / {includedMinutes} min
                </span>
              </div>
              <div className="h-1.5 bg-[#E8DCC8]/40 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${usagePercent > 80 ? 'bg-orange-400' : usagePercent > 50 ? 'bg-[#C9A86C]' : 'bg-[#8B6F47]'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.1 + 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Bottom action bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between pt-3 border-t border-[#E8DCC8]/40">
              <span className="text-xs font-medium flex items-center gap-1.5">
                {hasSub ? (
                  <>
                    <Zap className="w-3 h-3 text-green-500" />
                    <span className="text-green-600">Subscribed</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3 h-3 text-[#8B6F47]/40" />
                    <span className="text-[#8B6F47]/40">No subscription</span>
                  </>
                )}
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
