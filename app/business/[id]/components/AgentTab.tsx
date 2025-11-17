'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Phone, Play, Pause, Trash2, Edit, TestTube } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateAgent, useUpdateAgent, useDeleteAgent } from '@/lib/hooks/use-agents';
import type { AgentWithPhone } from '@/lib/types';

const agentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  area_code: z.string().min(3, 'Area code is required').max(3, 'Area code must be 3 digits'),
  model_type: z.string().min(1, 'Model type is required'),
  temperature: z.number().min(0).max(2),
  voice_model: z.string().min(1, 'Voice model is required'),
  prompt: z.string().optional(),
  greeting: z.string().min(1, 'Greeting is required'),
  goodbye: z.string().min(1, 'Goodbye is required'),
});

const editAgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  model_type: z.string().min(1, 'Model type is required'),
  temperature: z.number().min(0).max(2),
  voice_model: z.string().min(1, 'Voice model is required'),
  prompt: z.string().optional(),
  greeting: z.string().min(1, 'Greeting is required'),
  goodbye: z.string().min(1, 'Goodbye is required'),
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

  const createAgentMutation = useCreateAgent();
  const updateAgentMutation = useUpdateAgent();
  const deleteAgentMutation = useDeleteAgent();

  const form = useForm<AgentForm>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: 'My Voice Agent',
      area_code: '555',
      model_type: 'gpt-4o-mini',
      temperature: 0.7,
      voice_model: 'Joanna',
      prompt: '',
      greeting: 'Hello! How can I help you today?',
      goodbye: 'Thank you for calling. Have a great day!',
    }
  });

  const editForm = useForm<EditAgentForm>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: {
      name: agent?.name || 'Agent',
      model_type: agent?.model_type || 'gpt-4o-mini',
      temperature: agent?.temperature || 0.7,
      voice_model: agent?.voice_model || 'Joanna',
      prompt: agent?.prompt || '',
      greeting: agent?.greeting || 'Hello! How can I help you today?',
      goodbye: agent?.goodbye || 'Thank you for calling. Have a great day!',
      status: agent?.status || 'inactive',
    }
  });

  const onSubmit = (data: AgentForm) => {
    createAgentMutation.mutate(
      { business_id: businessId, ...data },
      {
        onSuccess: () => {
          form.reset();
          setIsCreateDialogOpen(false);
        },
      }
    );
  };

  const onEditSubmit = (data: EditAgentForm) => {
    if (!agent) return;
    updateAgentMutation.mutate(
      { agentId: agent.id, data },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
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

  const getStatusColor = (status: string) => {
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
                <DialogDescription className="text-[#A67A5B]/70">
                  Configure your voice agent to handle customer calls
                </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Agent Name</Label>
                      <Input
                        id="name"
                        placeholder="My Voice Agent"
                        {...form.register('name')}
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area_code">Area Code</Label>
                      <Input
                        id="area_code"
                        placeholder="555"
                        maxLength={3}
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
                      <Label htmlFor="model_type">AI Model</Label>
                      <select
                        id="model_type"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        {...form.register('model_type')}
                      >
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voice_model">Voice Model</Label>
                      <select
                        id="voice_model"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        {...form.register('voice_model')}
                      >
                        <option value="Joanna">Joanna (Female, US)</option>
                        <option value="Alloy">Alloy (Neutral, US)</option>
                        <option value="Amber">Amber (Female, US)</option>
                        <option value="Riley">Riley (Female, US)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature: {form.watch('temperature')}</Label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      className="w-full"
                      {...form.register('temperature', { valueAsNumber: true })}
                    />
                    <p className="text-xs text-[#A67A5B]/70">
                      Lower values = more focused, Higher values = more creative
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt">System Prompt (Optional)</Label>
                    <textarea
                      id="prompt"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      placeholder="You are a helpful customer service agent..."
                      {...form.register('prompt')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="greeting">Greeting Message</Label>
                    <Input
                      id="greeting"
                      placeholder="Hello! How can I help you today?"
                      {...form.register('greeting')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goodbye">Goodbye Message</Label>
                    <Input
                      id="goodbye"
                      placeholder="Thank you for calling. Have a great day!"
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
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>{agent.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                  {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                </span>
              </CardTitle>
              <CardDescription className="text-[#A67A5B]/70">
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
                <h4 className="font-medium text-sm text-[#A67A5B]/70">AI Model</h4>
                <p className="text-sm">{agent.model_type}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-[#A67A5B]/70">Voice Model</h4>
                <p className="text-sm">{agent.voice_model}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-[#A67A5B]/70">Temperature</h4>
                <p className="text-sm">{agent.temperature}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-[#A67A5B]/70">Greeting</h4>
                <p className="text-sm italic">&quot;{agent.greeting}&quot;</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-[#A67A5B]/70">Goodbye</h4>
                <p className="text-sm italic">&quot;{agent.goodbye}&quot;</p>
              </div>
            </div>
          </div>

          {agent.prompt && (
            <div>
              <h4 className="font-medium text-sm text-[#A67A5B]/70 mb-2">System Prompt</h4>
              <div className="bg-[#FAF8F3] p-3 rounded-md">
                <p className="text-sm">{agent.prompt}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phone Number Section */}
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Phone Number</span>
          </CardTitle>
          <CardDescription className="text-[#A67A5B]/70">
            Phone number provisioned for your agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agent.phone_number ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">{agent.phone_number.phone_number}</p>
                  <p className="text-sm text-[#A67A5B]/70">
                    Status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.phone_number.status)}`}>
                      {agent.phone_number.status}
                    </span>
                  </p>
                  <p className="text-xs text-[#A67A5B]/70 mt-1">
                    Area Code: {agent.phone_number.area_code} • {agent.phone_number.country}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    // Mock test call
                    alert('Test call initiated! Your agent will answer shortly.');
                  }}
                  disabled={agent.phone_number.status !== 'active'}
                  className="bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Call
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-[#A67A5B]/70">Phone number is being provisioned...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-[#A67A5B]/70">
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
                <DialogDescription className="text-[#A67A5B]/70">
                  Update your agent configuration
                </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Agent Name</Label>
                <Input
                  id="edit-name"
                  {...editForm.register('name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model_type">AI Model</Label>
                <select
                  id="edit-model_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  {...editForm.register('model_type')}
                >
                  <option value="gpt-4o-mini">GPT-4o Mini</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-voice_model">Voice Model</Label>
              <select
                id="edit-voice_model"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                {...editForm.register('voice_model')}
              >
                <option value="Joanna">Joanna (Female, US)</option>
                <option value="Alloy">Alloy (Neutral, US)</option>
                <option value="Amber">Amber (Female, US)</option>
                <option value="Riley">Riley (Female, US)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-temperature">Temperature: {editForm.watch('temperature')}</Label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                className="w-full"
                {...editForm.register('temperature', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-prompt">System Prompt (Optional)</Label>
              <textarea
                id="edit-prompt"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                {...editForm.register('prompt')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-greeting">Greeting Message</Label>
              <Input
                id="edit-greeting"
                {...editForm.register('greeting')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-goodbye">Goodbye Message</Label>
              <Input
                id="edit-goodbye"
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
