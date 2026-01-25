'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { GlowButton } from '@/components/ui/glow-button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useApp } from '@/lib/context';
import { useBusinesses, useDeleteBusiness } from '@/lib/hooks/use-businesses';
import { SetupWizard } from '@/components/SetupWizard';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WelcomeBanner } from '@/components/WelcomeBanner';
import { BusinessCard } from '@/components/BusinessCard';
import { EmptyState } from '@/components/EmptyState';

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card
          key={i}
          className="relative bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-2xl overflow-hidden"
        >
          <CardHeader className="pb-4">
            <div className="h-5 bg-[#E8DCC8]/40 rounded-lg w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-[#E8DCC8]/30 rounded-lg w-1/2 animate-pulse" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-[#E8DCC8]/20 animate-pulse mr-3" />
                <div className="h-4 bg-[#E8DCC8]/25 rounded-lg flex-1 animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-[#E8DCC8]/20 animate-pulse mr-3" />
                <div className="h-4 bg-[#E8DCC8]/25 rounded-lg w-2/3 animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-[#E8DCC8]/20 animate-pulse mr-3" />
                <div className="h-4 bg-[#E8DCC8]/25 rounded-lg w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="mt-5 h-11 bg-[#E8DCC8]/30 rounded-xl animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useApp();
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses();
  const deleteBusinessMutation = useDeleteBusiness();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleDelete = async (businessId: number) => {
    // Confirmation is handled in BusinessCard with the burst animation
    deleteBusinessMutation.mutate(businessId);
  };

  const openWizard = () => setIsWizardOpen(true);

  const handleWizardComplete = (businessId: number) => {
    // Optionally navigate to the new business
    router.push(`/business/${businessId}`);
  };

  return (
    <DashboardLayout onCreateBusiness={openWizard}>
      <WelcomeBanner userName={user?.user_metadata?.name} />

      {/* Section Header - Clean and minimal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-[#8B6F47]">Your Businesses</h2>
          <p className="text-sm text-[#A67A5B]/50 mt-1">
            {businesses.length === 0
              ? 'Get started by creating your first business'
              : `${businesses.length} ${businesses.length === 1 ? 'business' : 'businesses'} configured`}
          </p>
        </div>

        {/* New Business Button with mouse-following glow */}
        <GlowButton onClick={openWizard}>
          <Plus className="h-4 w-4" />
          New Business
        </GlowButton>
      </div>

      {/* Businesses Grid */}
      {businessesLoading ? (
        <LoadingSkeleton />
      ) : businesses.length === 0 ? (
        <EmptyState onCreateBusiness={openWizard} />
      ) : (
        <LayoutGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {businesses.map((business, index) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onDelete={handleDelete}
                  isDeleting={deleteBusinessMutation.isPending}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      )}

      {/* Setup Wizard */}
      <SetupWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
      />
    </DashboardLayout>
  );
}
