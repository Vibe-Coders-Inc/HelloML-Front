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
      case 'active': return 'text-[#8B6F47] bg-[#C9B790]/30';
      case 'inactive': return 'text-[#A67A5B]/50 bg-[#D8CBA9]/30';
      case 'paused': return 'text-[#A67A5B] bg-[#FAF8F3]';
      default: return 'text-[#A67A5B]/50 bg-[#D8CBA9]/30';
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
      <div className="bg-gradient-to-r from-white to-[#FAF2DC] border-b border-[#D8CBA9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <Logo size="medium" lightMode />
              <h1 className="text-2xl font-bold text-[#8B6F47]">Your Businesses</h1>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 relative z-10">
        {/* New Business Button */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#8B6F47]">Your Voice Agents</h2>
            <p className="text-base text-[#A67A5B]/70 font-light mt-2">Manage your AI-powered voice agents and watch your business grow!</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg hover:shadow-xl">
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
                  <Button type="submit" className="shadow-lg hover:shadow-xl">Create Business</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Businesses Grid */}
        {businesses.length === 0 ? (
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
              <p className="mt-2 text-base text-[#A67A5B]/70 font-light max-w-md mx-auto">
                Your first AI voice agent is just one click away. Let&apos;s make it happen!
              </p>
              <div className="mt-6">
                <Button onClick={() => setIsCreateDialogOpen(true)} size="lg" className="shadow-lg hover:shadow-xl">
                  <Plus className="h-4 w-4 mr-2" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business) => {
              const agentStatus = getAgentStatus(business.id);
              const isDeletingThis = isDeleting === business.id;
              
              return (
                <Card key={business.id} className="relative bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold text-[#8B6F47]">{business.name}</CardTitle>
                        <CardDescription className="mt-1.5 text-[#A67A5B]/70 text-sm">
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
                        className="flex-1 shadow-lg hover:shadow-xl"
                        onClick={() => router.push(`/business/${business.id}`)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
