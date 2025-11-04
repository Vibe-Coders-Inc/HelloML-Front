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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  business_email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
});

type BusinessForm = z.infer<typeof businessSchema>;

export default function DashboardPage() {
  const { businesses, agents, createBusiness, deleteBusiness, isAuthenticated, logout } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
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
    createBusiness(data);
    form.reset();
    setIsCreateDialogOpen(false);
  };

  const handleDelete = async (businessId: number) => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      setIsDeleting(businessId);
      deleteBusiness(businessId);
      setIsDeleting(null);
    }
  };

  const getAgentStatus = (businessId: number) => {
    const agent = agents.find(a => a.business_id === businessId);
    if (!agent) return 'None';
    return agent.status.charAt(0).toUpperCase() + agent.status.slice(1);
  };

  const getAgentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF2DC] to-[#D8CBA9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#FAF2DC] border-b border-[#D8CBA9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A67A5B] to-[#C9B790] rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <Building2 className="h-6 w-6 text-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-[#A67A5B]">Your Businesses</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#A67A5B]/70 font-medium">Ready to scale? Let&apos;s do this!</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Business Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-medium text-[#A67A5B]">Your Voice Agents</h2>
            <p className="text-sm text-[#A67A5B]/70">Manage your AI-powered voice agents and watch your business grow!</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Business
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Business</DialogTitle>
                <DialogDescription>
                  Add a new business and let AI handle your customers 24/7.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#A67A5B] font-medium">Business Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter business name"
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
                  <Label htmlFor="business_email" className="text-[#A67A5B] font-medium">Business Email</Label>
                  <Input
                    id="business_email"
                    type="email"
                    placeholder="Enter business email"
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
                  <Label htmlFor="address" className="text-[#A67A5B] font-medium">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter business address"
                    className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl"
                    {...form.register('address')}
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.address.message}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Business</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Businesses Grid */}
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-[#A67A5B] to-[#C9B790] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Building2 className="h-8 w-8 text-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-[#A67A5B]">Ready to build something amazing?</h3>
            <p className="mt-2 text-sm text-[#A67A5B]/70">
              Your first AI voice agent is just one click away. Let&apos;s make it happen!
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Business
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => {
              const agentStatus = getAgentStatus(business.id);
              const isDeletingThis = isDeleting === business.id;
              
              return (
                <Card key={business.id} className="relative bg-gradient-to-br from-white to-[#FAF2DC] border-[#D8CBA9] shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-[#A67A5B]">{business.name}</CardTitle>
                        <CardDescription className="mt-1 text-[#A67A5B]/70">
                          {business.business_email}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(business.id)}
                          disabled={isDeletingThis}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-[#A67A5B]/70">
                        <Building2 className="h-4 w-4 mr-2" />
                        {business.address}
                      </div>
                      
                      <div className="flex items-center text-sm text-[#A67A5B]/70">
                        <Phone className="h-4 w-4 mr-2" />
                        {business.phone_number || 'No number'}
                      </div>
                      
                      <div className="flex items-center text-sm text-[#A67A5B]/70">
                        <Calendar className="h-4 w-4 mr-2" />
                        Created {formatDate(business.created_at)}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#A67A5B]/70">Agent Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAgentStatusColor(agentStatus)}`}>
                          {agentStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button
                        className="flex-1"
                        onClick={() => router.push(`/business/${business.id}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                  
                  {/* Built with v0 chip */}
                  <div className="absolute bottom-2 right-2">
                    <span className="text-xs text-[#A67A5B]/50 bg-[#D8CBA9]/30 px-2 py-1 rounded-lg">
                      Built with v0
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
