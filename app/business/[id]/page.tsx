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
  const { businesses, agents, isAuthenticated, updateBusiness, deleteBusiness } = useApp();
  const router = useRouter();
  const { id } = React.use(params);
  const resolvedSearch = React.use(searchParams);
  const [activeTab, setActiveTab] = useState(resolvedSearch?.tab || 'overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<BusinessForm>({
    resolver: zodResolver(businessSchema),
  });

  const businessId = parseInt(id);
  const business = businesses.find(b => b.id === businessId);
  const agent = agents.find(a => a.business_id === businessId);

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
      updateBusiness(business.id, data);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (business && window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      setIsDeleting(true);
      deleteBusiness(business.id);
      router.push('/dashboard');
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAF2DC] to-[#D8CBA9]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#A67A5B] mb-4">Business not found</h1>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF2DC] to-[#D8CBA9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#FAF2DC] border-b border-[#D8CBA9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[#A67A5B]">{business.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-[#A67A5B]/70">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {business.business_email}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {business.address}
                  </div>
                  {business.phone_number && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {business.phone_number}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Business
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Business</DialogTitle>
                    <DialogDescription>
                      Update your business information
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="text-[#A67A5B] font-medium">Business Name</Label>
                      <Input
                        id="edit-name"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl"
                        {...form.register('name')}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email" className="text-[#A67A5B] font-medium">Business Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl"
                        {...form.register('business_email')}
                      />
                      {form.formState.errors.business_email && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.business_email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-address" className="text-[#A67A5B] font-medium">Address</Label>
                      <Input
                        id="edit-address"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl"
                        {...form.register('address')}
                      />
                      {form.formState.errors.address && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone" className="text-[#A67A5B] font-medium">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl"
                        {...form.register('phone_number')}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#D8CBA9]/30 p-1 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Overview</TabsTrigger>
            <TabsTrigger value="agent" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Agent</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Documents</TabsTrigger>
            <TabsTrigger value="calls" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Calls</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab business={business} agent={agent} />
          </TabsContent>

          <TabsContent value="agent" className="mt-6">
            <AgentTab businessId={businessId} agent={agent} />
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
