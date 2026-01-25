'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { GlowButton } from '@/components/ui/glow-button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MotionButton } from '@/components/ui/motion-button';
import { useApp } from '@/lib/context';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBusinesses, useCreateBusiness, useDeleteBusiness } from '@/lib/hooks/use-businesses';
import { DashboardLayout } from '@/components/DashboardLayout';
import { WelcomeBanner } from '@/components/WelcomeBanner';
import { BusinessCard } from '@/components/BusinessCard';
import { EmptyState } from '@/components/EmptyState';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  business_email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
});

type BusinessForm = z.infer<typeof businessSchema>;

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
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses(user?.id || '');
  const createBusinessMutation = useCreateBusiness();
  const deleteBusinessMutation = useDeleteBusiness();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<BusinessForm>({
    resolver: zodResolver(businessSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = (data: BusinessForm) => {
    if (!user) return;

    createBusinessMutation.mutate(
      {
        owner_user_id: user.id,
        ...data,
      },
      {
        onSuccess: () => {
          form.reset();
          setIsCreateDialogOpen(false);
        },
      }
    );
  };

  const handleDelete = async (businessId: number) => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      deleteBusinessMutation.mutate(businessId);
    }
  };

  const openCreateDialog = () => setIsCreateDialogOpen(true);

  return (
    <DashboardLayout onCreateBusiness={openCreateDialog}>
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
        <GlowButton onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          New Business
        </GlowButton>
      </div>

      {/* Businesses Grid */}
      {businessesLoading ? (
        <LoadingSkeleton />
      ) : businesses.length === 0 ? (
        <EmptyState onCreateBusiness={openCreateDialog} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business, index) => (
            <BusinessCard
              key={business.id}
              business={business}
              onDelete={handleDelete}
              isDeleting={deleteBusinessMutation.isPending}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Create Business Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-xl border border-[#E8DCC8]/30 rounded-3xl shadow-2xl shadow-black/10 sm:max-w-md">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-semibold text-[#8B6F47]">Create New Business</DialogTitle>
            <DialogDescription className="text-[#A67A5B]/60">
              Set up a new business for your AI voice agent.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#8B6F47] font-medium text-sm">
                Business Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Acme Corporation"
                className="bg-[#FBFAF6] border-[#E8DCC8]/50 focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/30"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_email" className="text-[#8B6F47] font-medium text-sm">
                Business Email
              </Label>
              <Input
                id="business_email"
                type="email"
                placeholder="contact@acme.com"
                className="bg-[#FBFAF6] border-[#E8DCC8]/50 focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/30"
                {...form.register('business_email')}
              />
              {form.formState.errors.business_email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.business_email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#8B6F47] font-medium text-sm">
                Address
              </Label>
              <AddressAutocomplete
                onSelect={(address) => form.setValue('address', address, { shouldValidate: true })}
                placeholder="123 Main St, City, State"
                className="bg-[#FBFAF6] border-[#E8DCC8]/50 focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/30"
                value={form.watch('address') || ''}
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
            <DialogFooter className="gap-3 sm:gap-3 pt-4">
              <MotionButton
                type="button"
                variant="ghost"
                onClick={() => setIsCreateDialogOpen(false)}
                className="text-[#A67A5B]/70 hover:text-[#8B6F47] hover:bg-[#FAF8F3] rounded-xl h-11"
              >
                Cancel
              </MotionButton>
              <MotionButton
                type="submit"
                disabled={createBusinessMutation.isPending}
                className="bg-gradient-to-r from-[#8B6F47] to-[#A67A5B] hover:from-[#8B6F47]/90 hover:to-[#A67A5B]/90 text-white font-medium rounded-xl h-11 px-6 shadow-lg shadow-[#8B6F47]/15"
              >
                {createBusinessMutation.isPending ? 'Creating...' : 'Create Business'}
              </MotionButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
