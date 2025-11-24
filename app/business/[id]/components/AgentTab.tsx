'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Phone, Play, Pause, Trash2, Edit, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateAgent, useUpdateAgent, useDeleteAgent } from '@/lib/hooks/use-agents';
import { useDeletePhoneByAgent, useProvisionPhoneNumber } from '@/lib/hooks/use-phone-numbers';
import type { AgentWithPhone } from '@/lib/types';

const agentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  area_code: z.string().min(3, 'Area code is required').max(3, 'Area code must be 3 digits'),
  model_type: z.string().min(1, 'Model type is required'),
  temperature: z.number().min(0.6).max(1.2),
  prompt: z.string().optional(),
  greeting: z.string()
    .min(1, 'Greeting is required')
    .max(500, 'Greeting must be less than 500 characters')
    .refine(val => !/(.)\1{10,}/.test(val), 'Please avoid excessive repeated characters'),
  goodbye: z.string()
    .min(1, 'Goodbye is required')
    .max(500, 'Goodbye must be less than 500 characters')
    .refine(val => !/(.)\1{10,}/.test(val), 'Please avoid excessive repeated characters'),
});

const editAgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  model_type: z.string().min(1, 'Model type is required'),
  temperature: z.number().min(0.6).max(1.2),
  prompt: z.string().optional(),
  greeting: z.string()
    .min(1, 'Greeting is required')
    .max(500, 'Greeting must be less than 500 characters')
    .refine(val => !/(.)\1{10,}/.test(val), 'Please avoid excessive repeated characters'),
  goodbye: z.string()
    .min(1, 'Goodbye is required')
    .max(500, 'Goodbye must be less than 500 characters')
    .refine(val => !/(.)\1{10,}/.test(val), 'Please avoid excessive repeated characters'),
  status: z.enum(['inactive', 'active', 'paused']),
});

type AgentForm = z.infer<typeof agentSchema>;
type EditAgentForm = z.infer<typeof editAgentSchema>;

interface AgentTabProps {
  businessId: number;
  agent?: AgentWithPhone;
}

export default function AgentTab({ businessId, agent }: AgentTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [provisionAreaCode, setProvisionAreaCode] = useState('555');

  const createAgentMutation = useCreateAgent();
  const updateAgentMutation = useUpdateAgent();
  const deleteAgentMutation = useDeleteAgent();
  const deletePhoneByAgentMutation = useDeletePhoneByAgent();
  const provisionPhoneMutation = useProvisionPhoneNumber();

  const form = useForm<AgentForm>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: 'My Voice Agent',
      area_code: '555',
      model_type: 'gpt-realtime',
      temperature: 0.8,
      prompt: '',
      greeting: 'Hello! How can I help you today?',
      goodbye: 'Thank you for calling. Have a great day!',
    }
  });

  const editForm = useForm<EditAgentForm>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: {
      name: agent?.name || 'Agent',
      model_type: agent?.model_type || 'gpt-realtime',
      temperature: agent?.temperature || 0.8,
      prompt: agent?.prompt || '',
      greeting: agent?.greeting || 'Hello! How can I help you today?',
      goodbye: agent?.goodbye || 'Thank you for calling. Have a great day!',
      status: agent?.status || 'inactive',
    }
  });

  // Reset edit form when agent data changes
  useEffect(() => {
    if (agent) {
      editForm.reset({
        name: agent.name,
        model_type: agent.model_type,
        temperature: agent.temperature,
        prompt: agent.prompt || '',
        greeting: agent.greeting,
        goodbye: agent.goodbye,
        status: agent.status,
      });
    }
  }, [agent, editForm]);

  const onSubmit = (data: AgentForm) => {
    console.log('[AgentTab] Creating agent with data:', { business_id: businessId, ...data });
    createAgentMutation.mutate(
      { business_id: businessId, ...data },
      {
        onSuccess: (createdAgent) => {
          console.log('[AgentTab] Agent created successfully:', createdAgent);
          if (createdAgent.phone_number) {
            console.log('[AgentTab] Phone number included in response:', createdAgent.phone_number);
          } else {
            console.warn('[AgentTab] WARNING: No phone number in agent creation response!');
            console.warn('[AgentTab] Backend may not be provisioning phones automatically.');
          }
          form.reset();
          setIsCreateDialogOpen(false);
        },
        onError: (error) => {
          console.error('[AgentTab] Failed to create agent:', error);
        },
      }
    );
  };

  const onEditSubmit = (data: EditAgentForm) => {
    if (!agent) return;
    console.log('[AgentTab] Updating agent with data:', { agentId: agent.id, data });
    updateAgentMutation.mutate(
      { agentId: agent.id, data },
      {
        onSuccess: (updatedAgent) => {
          console.log('[AgentTab] Agent updated successfully:', updatedAgent);
          setIsEditDialogOpen(false);
        },
        onError: (error) => {
          console.error('[AgentTab] Failed to update agent:', error);
          alert(`Failed to update agent: ${error.message}`);
        },
      }
    );
  };

  const handleDelete = () => {
    if (agent && window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      deleteAgentMutation.mutate(agent.id);
    }
  };

  const handleToggleStatus = () => {
    if (!agent) return;
    const newStatus = agent.status === 'active' ? 'paused' : 'active';
    updateAgentMutation.mutate({
      agentId: agent.id,
      data: { status: newStatus },
    });
  };

  const handleDeletePhoneNumber = () => {
    if (!agent) return;
    if (window.confirm('Are you sure you want to delete this phone number?\n\nTo get a new phone number, you will need to delete and recreate the agent.')) {
      deletePhoneByAgentMutation.mutate(agent.id);
    }
  };

  const handleProvisionPhone = () => {
    if (!agent) return;

    // Validate area code
    if (!/^\d{3}$/.test(provisionAreaCode)) {
      alert('Please enter a valid 3-digit area code (e.g., 555, 212, 415)');
      return;
    }

    provisionPhoneMutation.mutate(
      { agentId: agent.id, areaCode: provisionAreaCode },
      {
        onError: (error) => {
          alert(`Failed to provision phone number: ${error.message}`);
        },
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-[#8B6F47] bg-[#C9B790]/30';
      case 'inactive': return 'text-[#8B6F47] bg-[#D8CBA9]/30';
      case 'paused': return 'text-[#A67A5B] bg-[#FAF8F3]';
      default: return 'text-[#8B6F47] bg-[#D8CBA9]/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!agent) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#C9B790]/30 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-[#8B6F47]" />
            </div>
            <CardTitle className="text-2xl text-[#8B6F47]">Create Your First AI Agent</CardTitle>
            <CardDescription className="text-lg text-[#8B6F47]">
              Build a voice agent that handles your customer calls 24/7
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-[#8B6F47]">Smart Responses</h4>
                <p className="text-sm text-[#8B6F47]">
                  Your agent will understand context and provide helpful answers
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[#8B6F47]">Always Available</h4>
                <p className="text-sm text-[#8B6F47]">
                  Never miss a call with 24/7 availability
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[#8B6F47]">Analytics</h4>
                <p className="text-sm text-[#8B6F47]">
                  Track performance and optimize your agent
                </p>
              </div>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Bot className="h-5 w-5 mr-2" />
                  Create Your Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-[#E8DCC8] max-w-2xl">
                <DialogHeader>
                <DialogTitle className="text-[#8B6F47]">Create Your AI Agent</DialogTitle>
                <DialogDescription className="text-[#8B6F47]">
                  Configure your voice agent to handle customer calls
                </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#8B6F47]">Agent Name</Label>
                      <Input
                        id="name"
                        placeholder="My Voice Agent"
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                        {...form.register('name')}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area_code" className="text-[#8B6F47]">Area Code</Label>
                      <Input
                        id="area_code"
                        placeholder="555"
                        maxLength={3}
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                        {...form.register('area_code')}
                      />
                      {form.formState.errors.area_code && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.area_code.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model_type" className="text-[#8B6F47]">Realtime Model</Label>
                      <select
                        id="model_type"
                        className="flex h-10 w-full rounded-md border border-[#E8DCC8] bg-[#FAF8F3] px-3 py-2 text-sm text-[#8B6F47] focus:outline-none focus:ring-2 focus:ring-[#A67A5B]/10 focus:border-[#A67A5B]"
                        {...form.register('model_type')}
                      >
                        <option value="gpt-realtime">GPT Realtime (Latest)</option>
                        <option value="gpt-4o-realtime-preview">GPT-4o Realtime Preview</option>
                        <option value="gpt-4o-realtime-preview-2024-12-17">GPT-4o Realtime (Dec 2024)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature: {form.watch('temperature')?.toFixed(2)}</Label>
                    <input
                      type="range"
                      min="0.6"
                      max="1.2"
                      step="0.05"
                      className="w-full accent-[#A67A5B]"
                      {...form.register('temperature', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-[#A67A5B]">
                      Lower = more consistent and focused, Higher = more creative and varied
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt" className="text-[#8B6F47]">System Prompt (Optional)</Label>
                    <textarea
                      id="prompt"
                      className="flex min-h-[80px] w-full rounded-md border border-[#E8DCC8] bg-[#FAF8F3] px-3 py-2 text-sm text-[#8B6F47] placeholder:text-[#A67A5B]/40 focus:outline-none focus:ring-2 focus:ring-[#A67A5B]/10 focus:border-[#A67A5B]"
                      placeholder="You are a helpful customer service agent..."
                      {...form.register('prompt')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="greeting" className="text-[#8B6F47]">Greeting Message</Label>
                    <Input
                      id="greeting"
                      placeholder="Hello! How can I help you today?"
                      maxLength={500}
                      className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                      {...form.register('greeting')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goodbye" className="text-[#8B6F47]">Goodbye Message</Label>
                    <Input
                      id="goodbye"
                      placeholder="Thank you for calling. Have a great day!"
                      maxLength={500}
                      className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                      {...form.register('goodbye')}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createAgentMutation.isPending}
                      className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {createAgentMutation.isPending ? 'Creating...' : 'Create Agent'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Agent Details */}
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-[#8B6F47]">
                <Bot className="h-5 w-5" />
                <span>{agent.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </span>
              </CardTitle>
              <CardDescription className="text-[#8B6F47]">
                Created {formatDate(agent.created_at)} • Last updated {formatDate(agent.updated_at)}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
              >
                {agent.status === 'active' ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-[#8B6F47]">AI Model</h4>
                <p className="text-sm text-[#8B6F47] font-medium">{agent.model_type}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-[#8B6F47]">Temperature</h4>
                <p className="text-sm text-[#8B6F47] font-medium">{agent.temperature}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-[#8B6F47]">Greeting</h4>
                <p className="text-sm text-[#8B6F47] italic">&quot;{agent.greeting}&quot;</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-[#8B6F47]">Goodbye</h4>
                <p className="text-sm text-[#8B6F47] italic">&quot;{agent.goodbye}&quot;</p>
              </div>
            </div>
          </div>

          {agent.prompt && (
            <div>
              <h4 className="font-medium text-sm text-[#8B6F47] mb-2">System Prompt</h4>
              <div className="bg-[#FAF8F3] p-3 rounded-md">
                <p className="text-sm text-[#8B6F47]">{agent.prompt}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phone Number Section */}
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#8B6F47]">
            <Phone className="h-5 w-5" />
            <span>Phone Number</span>
          </CardTitle>
          <CardDescription className="text-[#8B6F47]">
            Phone number provisioned for your agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agent.phone_number?.status === 'active' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-[#8B6F47] mb-2">{agent.phone_number.phone_number}</p>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.phone_number.status)}`}>
                      {agent.phone_number.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-[#A67A5B]">
                      {agent.phone_number.area_code} • {agent.phone_number.country}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleDeletePhoneNumber}
                    disabled={deletePhoneByAgentMutation.isPending}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deletePhoneByAgentMutation.isPending ? 'Deleting...' : 'Delete Number'}
                  </Button>
                </div>
              </div>
            </div>
          ) : agent.phone_number?.status === 'provisioning' ? (
            <div className="text-center space-y-4 py-6">
              <style jsx>{`
                @keyframes phone-ring {
                  0%, 100% { transform: rotate(0deg); }
                  10%, 30% { transform: rotate(-15deg); }
                  20%, 40% { transform: rotate(15deg); }
                  50% { transform: rotate(0deg); }
                }
                @keyframes pulse-ring {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.5; transform: scale(1.1); }
                }
                .phone-ringing {
                  animation: phone-ring 2s ease-in-out infinite;
                }
                .ring-pulse {
                  animation: pulse-ring 2s ease-in-out infinite;
                }
              `}</style>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 ring-pulse">
                    <div className="w-20 h-20 rounded-full bg-[#8B6F47]/10 border-2 border-[#8B6F47]/30"></div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-[#C9B790]/40 to-[#8B6F47]/20 rounded-full flex items-center justify-center relative z-10">
                    <Phone className="h-10 w-10 text-[#8B6F47] phone-ringing" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-[#8B6F47]">Provisioning phone number...</p>
                  <p className="text-sm text-[#A67A5B] mt-1">This usually takes 10-30 seconds</p>
                  <div className="flex items-center justify-center space-x-1 mt-3">
                    <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : agent.phone_number?.status === 'failed' ? (
            <div className="text-center space-y-4 py-6">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-red-600">Provisioning Failed</p>
                <p className="text-sm text-[#A67A5B] mt-1">
                  Phone number provisioning failed during agent creation. To fix this, you need to:
                </p>
                <ol className="text-sm text-[#A67A5B] mt-2 ml-4 list-decimal space-y-1">
                  <li>Delete this agent (in Danger Zone below)</li>
                  <li>Create a new agent with the same settings</li>
                  <li>Check browser console for error details</li>
                </ol>
              </div>
              <Button
                variant="outline"
                onClick={handleDeletePhoneNumber}
                disabled={deletePhoneByAgentMutation.isPending}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deletePhoneByAgentMutation.isPending ? 'Deleting...' : 'Delete Failed Phone Number'}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4 py-6">
              <div className="mx-auto w-12 h-12 bg-[#C9B790]/30 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-[#8B6F47]" />
              </div>
              <div className="space-y-4">
                <p className="text-[#8B6F47] font-medium">No Phone Number</p>
                <p className="text-sm text-[#A67A5B] mb-4">
                  Provision a phone number for this agent
                </p>
                <div className="max-w-xs mx-auto space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="area-code" className="text-[#8B6F47] text-sm">
                      Area Code
                    </Label>
                    <Input
                      id="area-code"
                      type="text"
                      maxLength={3}
                      value={provisionAreaCode}
                      onChange={(e) => setProvisionAreaCode(e.target.value.replace(/\D/g, ''))}
                      className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl text-center text-lg text-[#8B6F47] font-semibold"
                      disabled={provisionPhoneMutation.isPending}
                    />
                    <p className="text-xs text-[#A67A5B]">
                      Enter a 3-digit area code (e.g., 555, 212, 415)
                    </p>
                  </div>
                  <Button
                    onClick={handleProvisionPhone}
                    disabled={provisionPhoneMutation.isPending || provisionAreaCode.length !== 3}
                    className="w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {provisionPhoneMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Provisioning...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        Provision Phone Number
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-[#8B6F47]">
            These actions cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteAgentMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteAgentMutation.isPending ? 'Deleting...' : 'Delete Agent'}
          </Button>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-[#E8DCC8] max-w-2xl">
          <DialogHeader>
                <DialogTitle className="text-[#8B6F47]">Edit Agent</DialogTitle>
                <DialogDescription className="text-[#8B6F47]">
                  Update your agent configuration
                </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-[#8B6F47]">Agent Name</Label>
                <Input
                  id="edit-name"
                  className="bg-white text-[#8B6F47] border-[#D8CBA9]"
                  {...editForm.register('name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model_type" className="text-[#8B6F47]">Realtime Model</Label>
                <select
                  id="edit-model_type"
                  className="flex h-10 w-full rounded-md border border-[#D8CBA9] bg-white text-[#8B6F47] px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2"
                  {...editForm.register('model_type')}
                >
                  <option value="gpt-realtime">GPT Realtime (Latest)</option>
                  <option value="gpt-4o-realtime-preview">GPT-4o Realtime Preview</option>
                  <option value="gpt-4o-realtime-preview-2024-12-17">GPT-4o Realtime (Dec 2024)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-temperature" className="text-[#8B6F47]">Temperature: {editForm.watch('temperature')?.toFixed(2)}</Label>
              <input
                type="range"
                min="0.6"
                max="1.2"
                step="0.05"
                className="w-full accent-[#8B6F47]"
                {...editForm.register('temperature', { valueAsNumber: true })}
              />
              <p className="text-xs text-[#A67A5B]">
                Lower = more consistent and focused, Higher = more creative and varied
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-prompt" className="text-[#8B6F47]">System Prompt (Optional)</Label>
              <textarea
                id="edit-prompt"
                className="flex min-h-[80px] w-full rounded-md border border-[#D8CBA9] bg-white text-[#8B6F47] px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2"
                placeholder="You are a helpful customer service agent..."
                {...editForm.register('prompt')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-greeting" className="text-[#8B6F47]">Greeting Message</Label>
              <Input
                id="edit-greeting"
                className="bg-white text-[#8B6F47] border-[#D8CBA9]"
                maxLength={500}
                {...editForm.register('greeting')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-goodbye" className="text-[#8B6F47]">Goodbye Message</Label>
              <Input
                id="edit-goodbye"
                className="bg-white text-[#8B6F47] border-[#D8CBA9]"
                maxLength={500}
                {...editForm.register('goodbye')}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateAgentMutation.isPending}
                className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {updateAgentMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
