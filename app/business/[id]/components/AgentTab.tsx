'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Phone, Play, Pause, Trash2, Edit, TestTube } from 'lucide-react';
import { Agent } from '@/lib/mock-data';
import { useApp } from '@/lib/context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const agentSchema = z.object({
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

interface AgentTabProps {
  businessId: number;
  agent?: Agent;
}

export default function AgentTab({ businessId, agent }: AgentTabProps) {
  const { phoneNumbers, createAgent, updateAgent, deleteAgent, createPhoneNumber } = useApp();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<AgentForm>({
    resolver: zodResolver(agentSchema),
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

  const phoneNumber = phoneNumbers.find(phone => phone.agent_id === agent?.id);

  const onSubmit = (data: AgentForm) => {
    if (agent) {
      updateAgent(agent.id, data);
      setIsEditDialogOpen(false);
    } else {
      createAgent({
        ...data,
        business_id: businessId,
      });
      setIsCreateDialogOpen(false);
    }
    form.reset();
  };

  const handleDelete = async () => {
    if (agent && window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      setIsDeleting(true);
      deleteAgent(agent.id);
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = () => {
    if (agent) {
      const newStatus = agent.status === 'active' ? 'paused' : 'active';
      updateAgent(agent.id, { status: newStatus });
    }
  };

  const handleProvisionNumber = () => {
    if (agent) {
      createPhoneNumber({
        agent_id: agent.id,
        phone_number: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        country: 'US',
        area_code: '555',
        status: 'provisioning',
        webhook_url: `https://api.voice-support.com/webhook/agent-${agent.id}`,
      });
    }
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
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Create Your First AI Agent</CardTitle>
            <CardDescription className="text-lg">
              Build a voice agent that handles your customer calls 24/7
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold">Smart Responses</h4>
                <p className="text-sm text-muted-foreground">
                  Your agent will understand context and provide helpful answers
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Always Available</h4>
                <p className="text-sm text-muted-foreground">
                  Never miss a call with 24/7 availability
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Track performance and optimize your agent
                </p>
              </div>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                  <Bot className="h-5 w-5 mr-2" />
                  Create Your Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                <DialogTitle>Create Your AI Agent</DialogTitle>
                <DialogDescription>
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
                    <p className="text-xs text-muted-foreground">
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
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Agent</Button>
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
              <CardDescription>
                Created {formatDate(agent.created_at)} • Last updated {formatDate(agent.updated_at)}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
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
                <h4 className="font-medium text-sm text-muted-foreground">AI Model</h4>
                <p className="text-sm">{agent.model_type}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Voice Model</h4>
                <p className="text-sm">{agent.voice_model}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Temperature</h4>
                <p className="text-sm">{agent.temperature}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Greeting</h4>
                <p className="text-sm italic">&quot;{agent.greeting}&quot;</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Goodbye</h4>
                <p className="text-sm italic">&quot;{agent.goodbye}&quot;</p>
              </div>
            </div>
          </div>

          {agent.prompt && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">System Prompt</h4>
              <div className="bg-gray-50 p-3 rounded-md">
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
          <CardDescription>
            Configure phone number for your agent to receive calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          {phoneNumber ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">{phoneNumber.phone_number}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phoneNumber.status)}`}>
                      {phoneNumber.status}
                    </span>
                  </p>
                </div>
                <Button
                  onClick={() => {
                    // Mock test call
                    alert('Test call initiated! Your agent will answer shortly.');
                  }}
                  disabled={phoneNumber.status !== 'active'}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Call
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">No phone number provisioned yet</p>
              <Button onClick={handleProvisionNumber}>
                <Phone className="h-4 w-4 mr-2" />
                Provision Phone Number
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            These actions cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Agent'}
          </Button>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
                <DialogTitle>Edit Agent</DialogTitle>
                <DialogDescription>
                  Update your agent configuration
                </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Agent Name</Label>
                <Input
                  id="edit-name"
                  {...form.register('name')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model_type">AI Model</Label>
                <select
                  id="edit-model_type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  {...form.register('model_type')}
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
                {...form.register('voice_model')}
              >
                <option value="Joanna">Joanna (Female, US)</option>
                <option value="Alloy">Alloy (Neutral, US)</option>
                <option value="Amber">Amber (Female, US)</option>
                <option value="Riley">Riley (Female, US)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-temperature">Temperature: {form.watch('temperature')}</Label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                className="w-full"
                {...form.register('temperature', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-prompt">System Prompt (Optional)</Label>
              <textarea
                id="edit-prompt"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                {...form.register('prompt')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-greeting">Greeting Message</Label>
              <Input
                id="edit-greeting"
                {...form.register('greeting')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-goodbye">Goodbye Message</Label>
              <Input
                id="edit-goodbye"
                {...form.register('goodbye')}
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
    </div>
  );
}
