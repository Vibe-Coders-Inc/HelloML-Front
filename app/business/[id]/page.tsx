'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, MapPin, Phone, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/lib/context';
import { Logo } from '@/components/Logo';
import { useBusiness, useUpdateBusiness, useDeleteBusiness } from '@/lib/hooks/use-businesses';
import { useAgentByBusiness } from '@/lib/hooks/use-agents';
import OverviewTab from './components/OverviewTab';
import AgentTab from './components/AgentTab';
import DocumentsTab from './components/DocumentsTab';
import CallsTab from './components/CallsTab';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  business_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  phone_number: z.string().optional(),
});

type BusinessForm = z.infer<typeof businessSchema>;

export default function BusinessPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { isAuthenticated } = useApp();
  const router = useRouter();
  const { id } = React.use(params);
  const resolvedSearch = React.use(searchParams);
  const [activeTab, setActiveTab] = useState(resolvedSearch?.tab || 'overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const businessId = parseInt(id);
  const { data: business, isLoading: businessLoading } = useBusiness(businessId);
  const { data: agent } = useAgentByBusiness(businessId);
  const updateBusinessMutation = useUpdateBusiness();
  const deleteBusinessMutation = useDeleteBusiness();

  const form = useForm<BusinessForm>({
    resolver: zodResolver(businessSchema),
  });

  // Handle redirect when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  // Initialize form with business data when business changes
  useEffect(() => {
    if (business) {
      form.reset({
        name: business.name,
        business_email: business.business_email || '',
        address: business.address,
        phone_number: business.phone_number || '',
      });
    }
  }, [business, form]);

  if (!isAuthenticated) {
    return null;
  }

  const onSubmit = (data: BusinessForm) => {
    if (business) {
      updateBusinessMutation.mutate(
        { businessId: business.id, data },
        {
          onSuccess: () => {
            setIsEditDialogOpen(false);
          },
        }
      );
    }
  };

  const handleDelete = async () => {
    if (business && window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      deleteBusinessMutation.mutate(business.id, {
        onSuccess: () => {
          router.push('/dashboard');
        },
      });
    }
  };

  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8DCC8] via-[#F5EFE6] to-[#D8CBA9]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A67A5B]/30 border-t-[#8B6F47] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8B6F47] font-medium">Loading business...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8DCC8] via-[#F5EFE6] to-[#D8CBA9]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#8B6F47] mb-4">Business not found</h1>
          <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
      <div className="bg-gradient-to-r from-white to-[#FAF2DC] border-b border-[#D8CBA9]/40 shadow-lg backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-28">
            <Logo size="large" lightMode />
            <div className="flex items-center space-x-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Business
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-[#E8DCC8]">
                  <DialogHeader>
                    <DialogTitle className="text-[#8B6F47]">Edit Business</DialogTitle>
                    <DialogDescription className="text-[#A67A5B]/70">
                      Update your business information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="text-[#8B6F47] font-medium text-sm">Business Name</Label>
                      <Input
                        id="edit-name"
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
                      <Label htmlFor="edit-email" className="text-[#8B6F47] font-medium text-sm">Business Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
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
                      <Label htmlFor="edit-address" className="text-[#8B6F47] font-medium text-sm">Address</Label>
                      <Input
                        id="edit-address"
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                        {...form.register('address')}
                      />
                      {form.formState.errors.address && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone" className="text-[#8B6F47] font-medium text-sm">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                        {...form.register('phone_number')}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B]">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">Save Changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleteBusinessMutation.isPending}
                className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleteBusinessMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Details Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 relative z-10">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-[#8B6F47] hover:bg-[#FAF8F3] hover:text-[#A67A5B]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl rounded-xl p-6">
          <h1 className="text-3xl font-bold text-[#8B6F47] mb-4">{business.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center text-[#A67A5B]/70">
              <Mail className="h-5 w-5 mr-2 text-[#A67A5B]" />
              <span className="text-sm">{business.business_email}</span>
            </div>
            <div className="flex items-center text-[#A67A5B]/70">
              <MapPin className="h-5 w-5 mr-2 text-[#A67A5B]" />
              <span className="text-sm">{business.address}</span>
            </div>
            {business.phone_number && (
              <div className="flex items-center text-[#A67A5B]/70">
                <Phone className="h-5 w-5 mr-2 text-[#A67A5B]" />
                <span className="text-sm">{business.phone_number}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#D8CBA9]/30 p-1 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Overview</TabsTrigger>
            <TabsTrigger value="agent" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Agent</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Documents</TabsTrigger>
            <TabsTrigger value="calls" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Calls</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab business={business} agent={agent || undefined} />
          </TabsContent>

          <TabsContent value="agent" className="mt-6">
            <AgentTab businessId={businessId} agent={agent || undefined} />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <DocumentsTab agentId={agent?.id} />
          </TabsContent>

          <TabsContent value="calls" className="mt-6">
            <CallsTab agentId={agent?.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
