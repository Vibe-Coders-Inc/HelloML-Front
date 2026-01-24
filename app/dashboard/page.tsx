'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2, Phone, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/context';
import { Logo } from '@/components/Logo';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBusinesses, useCreateBusiness, useDeleteBusiness } from '@/lib/hooks/use-businesses';
import { useAgentByBusiness } from '@/lib/hooks/use-agents';
import type { Business } from '@/lib/types';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  business_email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
});

type BusinessForm = z.infer<typeof businessSchema>;

interface BusinessCardProps {
  business: Business;
  onDelete: (businessId: number) => void;
  isDeleting: boolean;
}

function BusinessCard({ business, onDelete, isDeleting }: BusinessCardProps) {
  const router = useRouter();
  const { data: agent, isLoading: agentLoading } = useAgentByBusiness(business.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPhoneDisplay = () => {
    if (agentLoading) {
      return <span className="text-[#A67A5B]/60">Loading...</span>;
    }

    if (!agent) {
      return <span className="text-[#A67A5B]/70">No agent</span>;
    }

    if (!agent.phone_number) {
      return <span className="text-[#A67A5B]/70">No phone number</span>;
    }

    if (agent.phone_number.status === 'provisioning') {
      return <span className="text-[#A67A5B]">Provisioning...</span>;
    }

    return <span className="text-[#8B6F47] font-medium">{agent.phone_number.phone_number}</span>;
  };

  return (
    <Card className="relative bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm rounded-2xl overflow-hidden group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-[#8B6F47] truncate">{business.name}</CardTitle>
            <CardDescription className="mt-1 text-[#A67A5B]/80 text-sm truncate">
              {business.business_email}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(business.id)}
            disabled={isDeleting}
            className="text-[#A67A5B]/50 hover:text-red-500 hover:bg-red-50 rounded-xl h-8 w-8 p-0 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2.5">
          <div className="flex items-center text-sm text-[#A67A5B]/80">
            <Building2 className="h-4 w-4 mr-2.5 text-[#A67A5B]/60 flex-shrink-0" />
            <span className="truncate">{business.address}</span>
          </div>

          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-2.5 text-[#A67A5B]/60 flex-shrink-0" />
            {getPhoneDisplay()}
          </div>

          <div className="flex items-center text-sm text-[#A67A5B]/80">
            <Calendar className="h-4 w-4 mr-2.5 text-[#A67A5B]/60 flex-shrink-0" />
            {formatDate(business.created_at)}
          </div>
        </div>

        <div className="mt-5">
          <Button
            className="w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-medium h-11 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => router.push(`/business/${business.id}`)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated, signOut } = useApp();
  const { data: businesses = [], isLoading: businessesLoading } = useBusinesses(user?.id || '');
  const createBusinessMutation = useCreateBusiness();
  const deleteBusinessMutation = useDeleteBusiness();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<BusinessForm>({
    resolver: zodResolver(businessSchema),
  });

  // Handle redirect when not authenticated
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

  const handleLogout = async () => {
    await signOut();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8DCC8] via-[#F5EFE6] to-[#D8CBA9] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Floating animated dots */}
      <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-[#A67A5B]/30 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-[25%] left-[20%] w-2 h-2 bg-[#8B6F47]/25 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      <div className="absolute top-[45%] left-[15%] w-4 h-4 bg-[#C9B790]/20 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      <div className="absolute top-[65%] left-[25%] w-2.5 h-2.5 bg-[#A67A5B]/35 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5.5s', animationDelay: '0.5s' }}></div>
      <div className="absolute top-[35%] right-[15%] w-3 h-3 bg-[#8B6F47]/25 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
      <div className="absolute top-[55%] right-[10%] w-2 h-2 bg-[#C9B790]/30 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5s', animationDelay: '2.5s' }}></div>
      <div className="absolute top-[20%] right-[20%] w-3.5 h-3.5 bg-[#A67A5B]/20 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '6.5s', animationDelay: '0.8s' }}></div>
      <div className="absolute top-[75%] left-[35%] w-2 h-2 bg-[#8B6F47]/25 rounded-full animate-bounce shadow-md" style={{ animationDuration: '4.8s', animationDelay: '1.2s' }}></div>

      {/* Header */}
      <div className="bg-gradient-to-r from-white/95 via-[#FAF8F3]/95 to-[#F5EFE6]/95 border-b border-[#E8DCC8]/60 shadow-lg backdrop-blur-md relative z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Logo size="medium" lightMode />
            <div className="flex items-center gap-4">
              {user?.user_metadata?.name && (
                <span className="text-[#8B6F47] font-medium text-sm">
                  {user.user_metadata.name}
                </span>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-[#E8DCC8] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] rounded-xl h-10 px-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#8B6F47]">Your Businesses</h1>
            <p className="text-sm text-[#A67A5B]/80 mt-1">Manage your AI-powered voice agents</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                New Business
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-[#E8DCC8] rounded-2xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-[#8B6F47]">Create New Business</DialogTitle>
                <DialogDescription className="text-[#A67A5B]">
                  Add a new business and let AI handle your customers 24/7.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#8B6F47] font-medium text-sm">Business Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter business name"
                    className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_email" className="text-[#8B6F47] font-medium text-sm">Business Email</Label>
                  <Input
                    id="business_email"
                    type="email"
                    placeholder="Enter business email"
                    className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                    {...form.register('business_email')}
                  />
                  {form.formState.errors.business_email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.business_email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#8B6F47] font-medium text-sm">Address</Label>
                  <AddressAutocomplete
                    onSelect={(address) => form.setValue('address', address, { shouldValidate: true })}
                    placeholder="Start typing to search for addresses..."
                    className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                    value={form.watch('address') || ''}
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
                <DialogFooter className="gap-3 sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-[#E8DCC8] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] rounded-xl h-11 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createBusinessMutation.isPending}
                    className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold rounded-xl h-11 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {createBusinessMutation.isPending ? 'Creating...' : 'Create Business'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Businesses Grid */}
        {businessesLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="relative bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="h-5 bg-[#E8DCC8]/40 rounded-lg w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-[#E8DCC8]/30 rounded-lg w-1/2 animate-pulse"></div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2.5">
                    <div className="h-4 bg-[#E8DCC8]/25 rounded-lg animate-pulse"></div>
                    <div className="h-4 bg-[#E8DCC8]/25 rounded-lg w-2/3 animate-pulse"></div>
                    <div className="h-4 bg-[#E8DCC8]/25 rounded-lg w-1/2 animate-pulse"></div>
                  </div>
                  <div className="mt-5 h-11 bg-[#E8DCC8]/30 rounded-xl animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12 relative">
            {/* Gradient blob behind empty state */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#A67A5B]/10 rounded-full blur-3xl"></div>

            {/* Floating dots around icon */}
            <div className="absolute top-[20%] left-1/2 -translate-x-24 w-2 h-2 bg-[#A67A5B]/40 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-[30%] left-1/2 translate-x-20 w-3 h-3 bg-[#C9B790]/40 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
            <div className="absolute top-[40%] left-1/2 -translate-x-32 w-2.5 h-2.5 bg-[#8B6F47]/30 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
            <div className="absolute top-[35%] left-1/2 translate-x-28 w-2 h-2 bg-[#A67A5B]/35 rounded-full animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>

            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#A67A5B] to-[#C9B790] rounded-2xl flex items-center justify-center mx-auto shadow-2xl backdrop-blur-sm animate-pulse" style={{ animationDuration: '3s' }}>
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[#8B6F47]">Ready to build something amazing?</h3>
              <p className="mt-2 text-base text-[#A67A5B] font-light max-w-md mx-auto">
                Your first AI voice agent is just one click away. Let&apos;s make it happen!
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Business
                </Button>
              </div>

              {/* Decorative wavy line */}
              <div className="mt-8 flex justify-center">
                <svg width="200" height="40" viewBox="0 0 200 40" className="opacity-30">
                  <path
                    d="M0,20 Q25,10 50,20 T100,20 T150,20 T200,20"
                    stroke="#A67A5B"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onDelete={handleDelete}
                isDeleting={deleteBusinessMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
