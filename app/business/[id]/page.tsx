'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Bot, PhoneCall, FileText,
  Trash2, Upload, Download,
  Plus, Loader2, User, MessageSquare, Copy,
  CheckCircle2, MapPin, Building2, Mail, Edit3, Check, X,
  BookOpen
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SetupWizard } from '@/components/SetupWizard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AreaChartComponent } from '@/components/ui/chart';
import { GlowButton } from '@/components/ui/glow-button';
import { DeleteConfirmModal } from '@/components/ui/delete-confirm-modal';
import { BusinessTutorial, TutorialHelpButton, useTutorial } from '@/components/BusinessTutorial';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { useBusiness, useUpdateBusiness, useDeleteBusiness } from '@/lib/hooks/use-businesses';
import { useAgentByBusiness, useCreateAgent, useUpdateAgent } from '@/lib/hooks/use-agents';
import { useConversationsByAgent, useConversationMessages } from '@/lib/hooks/use-conversations';
import { useDocuments, useUploadPDFDocument, useUploadTextDocument, useDeleteDocument } from '@/lib/hooks/use-documents';
import { useProvisionPhoneNumber, useDeletePhoneByAgent } from '@/lib/hooks/use-phone-numbers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Conversation } from '@/lib/types';

const agentSchema = z.object({
  name: z.string().min(1),
  area_code: z.string().length(3),
  model_type: z.string().min(1),
  temperature: z.number().min(0.6).max(1.2),
  prompt: z.string().optional(),
  greeting: z.string().min(1).max(500),
  goodbye: z.string().min(1).max(500),
});

type AgentForm = z.infer<typeof agentSchema>;

// Section Header component (like wizard StepHeader)
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[#5D4E37]">{title}</h2>
      <p className="text-sm text-[#8B6F47]/60 mt-1">{subtitle}</p>
    </div>
  );
}

// Integrations from setup wizard
const integrations = [
  { id: 'google-calendar', name: 'Google Calendar', description: 'Schedule appointments', connected: false },
  { id: 'outlook-calendar', name: 'Outlook', description: 'Sync with Microsoft 365', connected: false },
  { id: 'google-drive', name: 'Google Drive', description: 'Access docs and FAQs', connected: false },
  { id: 'notion', name: 'Notion', description: 'Pull from workspace', connected: false },
  { id: 'dropbox', name: 'Dropbox', description: 'Access shared files', connected: false },
  { id: 'knowledge-base', name: 'Knowledge Base', description: 'Upload documents', connected: true, isInternal: true },
];

const integrationLogos: Record<string, string> = {
  'google-calendar': 'https://img.icons8.com/color/96/google-calendar--v1.png',
  'outlook-calendar': 'https://img.icons8.com/color/96/microsoft-outlook-2019--v2.png',
  'google-drive': 'https://img.icons8.com/color/96/google-drive--v1.png',
  'notion': 'https://img.icons8.com/ios-filled/100/000000/notion.png',
  'dropbox': 'https://img.icons8.com/color/96/dropbox.png',
  'knowledge-base': '', // Uses custom icon
};

// Format phone number as +1 (XXX) XXX-XXXX
function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

// Input style classes for consistent theming
const inputStyles = "bg-white border-[#E8DCC8] text-[#5D4E37] placeholder:text-[#A67A5B]/40 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20";
const textareaStyles = "bg-white border-[#E8DCC8] text-[#5D4E37] placeholder:text-[#A67A5B]/40 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20";

// Editable Field component
function EditableField({
  label,
  value,
  onSave,
  icon: Icon,
  type = 'text'
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
  icon: React.ElementType;
  type?: 'text' | 'email' | 'textarea';
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8DCC8]/50 hover:border-[#8B6F47]/30 transition-colors min-h-[72px]">
      <div className="w-10 h-10 rounded-lg bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#8B6F47]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#8B7355] uppercase tracking-wide mb-1">{label}</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            {type === 'textarea' ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={`flex-1 text-sm ${textareaStyles}`}
                rows={2}
                autoFocus
              />
            ) : (
              <Input
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={`flex-1 h-9 text-sm ${inputStyles}`}
                autoFocus
              />
            )}
            <button onClick={handleSave} className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors flex-shrink-0">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={handleCancel} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[#5D4E37] flex-1">{value || '—'}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 rounded-lg bg-[#F5F0E8] hover:bg-[#E8DCC8] flex items-center justify-center text-[#8B7355] transition-colors flex-shrink-0"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Address Editable Field with Google Places autocomplete
function AddressEditableField({
  label,
  value,
  onSave,
  icon: Icon,
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
  icon: React.ElementType;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleAddressSelect = (address: string) => {
    setEditValue(address);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E8DCC8]/50 hover:border-[#8B6F47]/30 transition-colors min-h-[72px]">
      <div className="w-10 h-10 rounded-lg bg-[#F5F0E8] flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#8B6F47]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#8B7355] uppercase tracking-wide mb-1">{label}</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <AddressAutocomplete
                value={editValue}
                onSelect={handleAddressSelect}
                placeholder="Start typing your address..."
                className={`h-9 text-sm ${inputStyles}`}
              />
            </div>
            <button onClick={handleSave} className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors flex-shrink-0">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={handleCancel} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[#5D4E37] flex-1">{value || '—'}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 rounded-lg bg-[#F5F0E8] hover:bg-[#E8DCC8] flex items-center justify-center text-[#8B7355] transition-colors flex-shrink-0"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useApp();
  const router = useRouter();
  const { id } = React.use(params);
  const businessId = parseInt(id);

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCall, setSelectedCall] = useState<number | null>(null);
  const [provisionAreaCode, setProvisionAreaCode] = useState('555');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAgentEditing, setIsAgentEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPhoneChangeModal, setShowPhoneChangeModal] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);

  const { data: business, isLoading } = useBusiness(businessId);
  const { data: agent } = useAgentByBusiness(businessId);
  const { data: conversationsData } = useConversationsByAgent(agent?.id ?? 0, { limit: 100, offset: 0 });
  const { data: documents = [] } = useDocuments(agent?.id ?? 0);
  const { data: messagesData } = useConversationMessages(selectedCall ?? 0);

  const updateBusiness = useUpdateBusiness();
  const deleteBusiness = useDeleteBusiness();
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();
  const provisionPhone = useProvisionPhoneNumber();
  const deletePhone = useDeletePhoneByAgent();
  const uploadPDF = useUploadPDFDocument();
  const uploadText = useUploadTextDocument();
  const deleteDocument = useDeleteDocument();

  // Tutorial
  const { showTutorial, openTutorial, closeTutorial } = useTutorial(businessId);

  const conversations = useMemo(() => conversationsData?.conversations || [], [conversationsData]);
  const messages = messagesData?.messages || [];

  const form = useForm<AgentForm>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: 'Voice Agent',
      area_code: '555',
      model_type: 'gpt-realtime',
      temperature: 0.8,
      prompt: '',
      greeting: 'Hello! Thank you for calling. How can I help you today?',
      goodbye: 'Thank you for calling. Have a great day!',
    },
  });

  useEffect(() => {
    if (agent && isEditMode) {
      form.reset({
        name: agent.name,
        area_code: '555',
        model_type: agent.model_type,
        temperature: agent.temperature,
        prompt: agent.prompt || '',
        greeting: agent.greeting,
        goodbye: agent.goodbye,
      });
    }
  }, [agent, isEditMode, form]);

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth');
  }, [isAuthenticated, router]);

  // Sync activeTab with URL hash
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'agent', 'calls', 'documents'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  // Chart data
  const chartData = useMemo(() => {
    const last7Days: { name: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toISOString().split('T')[0];
      const count = conversations.filter((c: Conversation) =>
        c.started_at.split('T')[0] === dateStr
      ).length;
      last7Days.push({ name: dayStr, value: count });
    }
    return last7Days;
  }, [conversations]);

  const handleAgentSubmit = (data: AgentForm) => {
    if (isEditMode && agent) {
      updateAgent.mutate({ agentId: agent.id, data }, {
        onSuccess: () => { setIsAgentDialogOpen(false); setIsEditMode(false); toast.success('Agent updated'); },
      });
    } else {
      createAgent.mutate({ business_id: businessId, ...data }, {
        onSuccess: () => { setIsAgentDialogOpen(false); form.reset(); toast.success('Agent created'); },
      });
    }
  };

  const handleFileUpload = useCallback((files: FileList) => {
    if (!agent) return;
    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        uploadPDF.mutate({ agentId: agent.id, file, filename: file.name }, {
          onSuccess: () => toast.success('Uploaded'),
        });
      } else if (ext === 'txt') {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadText.mutate({
            agent_id: agent.id,
            filename: file.name,
            text: e.target?.result as string,
            file_type: 'text/plain',
            storage_url: '',
          }, { onSuccess: () => toast.success('Uploaded') });
        };
        reader.readAsText(file);
      }
    });
  }, [agent, uploadPDF, uploadText]);

  const handleUpdateBusiness = (field: string, value: string) => {
    updateBusiness.mutate({ businessId, data: { [field]: value } }, {
      onSuccess: () => toast.success('Updated'),
    });
  };

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteModal(false);
    deleteBusiness.mutate(business?.id || 0, { onSuccess: () => router.push('/dashboard') });
  }, [business?.id, deleteBusiness, router]);

  // Phone number change handler
  const handlePhoneChange = useCallback(async () => {
    if (!agent) return;
    setIsChangingPhone(true);

    // First delete the old phone number
    deletePhone.mutate(agent.id, {
      onSuccess: () => {
        // Then provision a new one
        provisionPhone.mutate(
          { agentId: agent.id, areaCode: provisionAreaCode },
          {
            onSuccess: () => {
              setIsChangingPhone(false);
              setShowPhoneChangeModal(false);
              toast.success('Phone number updated');
            },
            onError: (error) => {
              setIsChangingPhone(false);
              toast.error('Failed to provision new number');
              console.error(error);
            },
          }
        );
      },
      onError: (error) => {
        setIsChangingPhone(false);
        toast.error('Failed to release old number');
        console.error(error);
      },
    });
  }, [agent, deletePhone, provisionPhone, provisionAreaCode]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  // Agent inline update helper
  const handleAgentFieldUpdate = (field: string, value: string | number) => {
    if (!agent) return;
    updateAgent.mutate({ agentId: agent.id, data: { [field]: value } }, {
      onSuccess: () => toast.success('Agent updated'),
    });
  };

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <DashboardLayout onCreateBusiness={() => setIsWizardOpen(true)}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B6F47]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!business) {
    return (
      <DashboardLayout onCreateBusiness={() => setIsWizardOpen(true)}>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-[#5D4E37] text-lg">Business not found</p>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats from conversations (same source as chart for consistency)
  const totalCalls = conversations.length;
  const completedCalls = conversations.filter((c: Conversation) => c.status === 'completed').length;
  const successRate = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;

  // Map URL
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  const encodedAddress = encodeURIComponent(business.address || '');
  const mapUrl = business.address && apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=600x200&scale=2&maptype=roadmap&markers=color:brown%7C${encodedAddress}&key=${apiKey}`
    : '';

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F5F0E8] to-white border border-[#E8DCC8]/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="relative px-8 py-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#5D4E37]">
                  Welcome back! 👋
                </h1>
                <p className="text-base text-[#8B7355] mt-2">
                  Manage <span className="font-semibold text-[#8B6F47]">{business.name}</span> settings and monitor call activity.
                </p>
              </div>
            </motion.div>

            {/* Business Info + Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Editable Fields */}
              <div className="space-y-3">
                <EditableField
                  label="Business Name"
                  value={business.name}
                  onSave={(value) => handleUpdateBusiness('name', value)}
                  icon={Building2}
                />
                <EditableField
                  label="Email"
                  value={business.business_email || ''}
                  onSave={(value) => handleUpdateBusiness('business_email', value)}
                  icon={Mail}
                  type="email"
                />
                <AddressEditableField
                  label="Address"
                  value={business.address}
                  onSave={(value) => handleUpdateBusiness('address', value)}
                  icon={MapPin}
                />
              </div>

              {/* Map Preview */}
              <div className="bg-white rounded-xl border border-[#E8DCC8]/50 overflow-hidden">
                {business.address ? (
                  apiKey ? (
                    <img src={mapUrl} alt="Location" className="w-full h-[200px] object-cover object-center" />
                  ) : (
                    <div className="h-[200px] bg-[#F5F0E8] flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-[#8B6F47]/30 mx-auto mb-2" />
                        <p className="text-sm text-[#8B7355]">Map preview</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="h-[200px] bg-[#F5F0E8] flex items-center justify-center">
                    <p className="text-sm text-[#8B7355]">Add an address to see the map</p>
                  </div>
                )}
                {business.address && (
                  <div className="p-3 flex items-center gap-3 border-t border-[#E8DCC8]/50">
                    <div className="w-8 h-8 rounded-lg bg-[#8B6F47]/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#8B6F47]" />
                    </div>
                    <p className="text-sm text-[#5D4E37] truncate flex-1">{business.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-[#E8DCC8]/50 p-5">
                <h3 className="text-sm font-semibold text-[#5D4E37] mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B7355]">Total Calls</span>
                    <span className="text-lg font-bold text-[#5D4E37]">{totalCalls}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B7355]">Completed</span>
                    <span className="text-lg font-bold text-[#5D4E37]">{completedCalls}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B7355]">Success Rate</span>
                    <span className="text-lg font-bold text-[#5D4E37]">{successRate}%</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DCC8]/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#5D4E37]">Call Activity</h3>
                  <span className="text-xs text-[#8B7355]">Last 7 days</span>
                </div>
                <div className="h-[180px]">
                  <AreaChartComponent data={chartData} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'agent':
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Voice Agent"
              subtitle="Configure how your agent behaves and what tools it can access"
            />

            {agent ? (
              <>
                {/* Agent Config */}
                <div className="bg-white rounded-xl border border-[#E8DCC8]/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B6F47] to-[#A67A5B] flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        {isAgentEditing ? (
                          <Input
                            defaultValue={agent.name}
                            className={`h-9 text-lg font-semibold w-48 ${inputStyles}`}
                            onBlur={(e) => {
                              if (e.target.value !== agent.name) handleAgentFieldUpdate('name', e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if ((e.target as HTMLInputElement).value !== agent.name) {
                                  handleAgentFieldUpdate('name', (e.target as HTMLInputElement).value);
                                }
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <h3 className="text-lg font-semibold text-[#5D4E37]">{agent.name}</h3>
                        )}
                        <span className="text-xs text-[#8B7355]">{agent.model_type}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAgentEditing(!isAgentEditing)}
                    >
                      {isAgentEditing ? (
                        <>
                          <Check className="w-4 h-4 mr-1.5" />
                          Done
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-1.5" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Agent Details - Editable */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-[#F5F0E8]/30 rounded-xl">
                      <p className="text-xs text-[#8B7355] mb-2">Phone Number</p>
                      {agent.phone_number?.phone_number ? (
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-[#5D4E37]">{formatPhoneNumber(agent.phone_number.phone_number)}</p>
                          {isAgentEditing && (
                            <button
                              onClick={() => setShowPhoneChangeModal(true)}
                              className="text-xs text-[#8B6F47] hover:text-[#5D4E37] hover:underline transition-colors"
                            >
                              Change
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input
                            className={`w-20 h-8 text-sm px-2 ${inputStyles}`}
                            value={provisionAreaCode}
                            onChange={(e) => setProvisionAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="Area"
                          />
                          <Button
                            size="sm"
                            className="h-8 text-xs px-3 bg-gradient-to-r from-[#8B6F47] to-[#A67A5B] text-white"
                            disabled={provisionPhone.isPending || provisionAreaCode.length !== 3}
                            onClick={() => provisionPhone.mutate({ agentId: agent.id, areaCode: provisionAreaCode })}
                          >
                            {provisionPhone.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Get Number'}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-[#F5F0E8]/30 rounded-xl">
                      <p className="text-xs text-[#8B7355] mb-2">Temperature</p>
                      {isAgentEditing ? (
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0.6"
                            max="1.2"
                            step="0.1"
                            defaultValue={agent.temperature}
                            className="flex-1 h-2"
                            onChange={(e) => handleAgentFieldUpdate('temperature', parseFloat(e.target.value))}
                          />
                          <span className="text-sm font-medium text-[#5D4E37] w-8">{agent.temperature}</span>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-[#5D4E37]">{agent.temperature}</p>
                      )}
                    </div>
                  </div>

                  {/* Greeting */}
                  <div className="mb-4">
                    <p className="text-xs text-[#8B7355] mb-2">Greeting Message</p>
                    {isAgentEditing ? (
                      <Textarea
                        defaultValue={agent.greeting}
                        className={`text-sm min-h-[60px] ${textareaStyles}`}
                        onBlur={(e) => {
                          if (e.target.value !== agent.greeting) handleAgentFieldUpdate('greeting', e.target.value);
                        }}
                      />
                    ) : (
                      <p className="text-sm text-[#5D4E37] bg-[#F5F0E8]/30 p-3 rounded-lg">{agent.greeting}</p>
                    )}
                  </div>

                  {/* Goodbye */}
                  <div className="mb-4">
                    <p className="text-xs text-[#8B7355] mb-2">Goodbye Message</p>
                    {isAgentEditing ? (
                      <Textarea
                        defaultValue={agent.goodbye}
                        className={`text-sm min-h-[60px] ${textareaStyles}`}
                        onBlur={(e) => {
                          if (e.target.value !== agent.goodbye) handleAgentFieldUpdate('goodbye', e.target.value);
                        }}
                      />
                    ) : (
                      <p className="text-sm text-[#5D4E37] bg-[#F5F0E8]/30 p-3 rounded-lg">{agent.goodbye}</p>
                    )}
                  </div>

                  {/* System Prompt */}
                  <div className="pt-4 border-t border-[#E8DCC8]/50">
                    <p className="text-xs text-[#8B7355] mb-2">System Prompt</p>
                    {isAgentEditing ? (
                      <Textarea
                        defaultValue={agent.prompt || ''}
                        placeholder="Describe how your agent should behave..."
                        className={`text-sm min-h-[100px] ${textareaStyles}`}
                        onBlur={(e) => {
                          if (e.target.value !== (agent.prompt || '')) handleAgentFieldUpdate('prompt', e.target.value);
                        }}
                      />
                    ) : (
                      <p className="text-sm text-[#5D4E37] bg-[#F5F0E8]/50 p-3 rounded-lg">
                        {agent.prompt || <span className="text-[#8B7355]/50 italic">No system prompt configured</span>}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connected Tools */}
                <div className="bg-white rounded-xl border border-[#E8DCC8]/50 p-6">
                  <h3 className="text-sm font-semibold text-[#5D4E37] mb-1">Connected Tools</h3>
                  <p className="text-xs text-[#8B7355] mb-4">Connect tools to help your agent assist customers better</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {integrations.map((int) => (
                      <div
                        key={int.id}
                        className={`p-4 rounded-xl border text-center transition-colors cursor-pointer ${
                          int.connected
                            ? 'border-emerald-200 bg-emerald-50/50'
                            : 'border-[#E8DCC8] bg-[#FDFCFA] hover:border-[#8B6F47]/50'
                        }`}
                        onClick={() => {
                          if (int.id === 'knowledge-base') {
                            window.history.pushState(null, '', '#documents');
                            window.dispatchEvent(new HashChangeEvent('hashchange'));
                          }
                        }}
                      >
                        {int.id === 'knowledge-base' ? (
                          <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-[#8B6F47]/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-[#8B6F47]" />
                          </div>
                        ) : (
                          <img
                            src={integrationLogos[int.id]}
                            alt={int.name}
                            className="w-10 h-10 mx-auto mb-2"
                          />
                        )}
                        <p className="text-sm font-medium text-[#5D4E37]">{int.name}</p>
                        <p className="text-[10px] text-[#8B7355] mt-0.5 mb-3">{int.description}</p>
                        {int.connected ? (
                          <div className="flex items-center justify-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Connected
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-7 text-xs"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-[#E8DCC8]/50 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F0E8] flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-[#C9B790]" />
                </div>
                <h3 className="text-lg font-semibold text-[#5D4E37] mb-2">No Agent Configured</h3>
                <p className="text-sm text-[#8B7355] mb-6 max-w-sm mx-auto">
                  Create a voice agent to start handling calls for your business.
                </p>
                <GlowButton onClick={() => { setIsEditMode(false); setIsAgentDialogOpen(true); }}>
                  <Plus className="w-5 h-5" />
                  Create Agent
                </GlowButton>
              </div>
            )}
          </div>
        );

      case 'calls':
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Call History"
              subtitle="View transcripts and details from all incoming calls"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Call List */}
              <div className="lg:col-span-1 bg-white rounded-xl border border-[#E8DCC8]/50 overflow-hidden">
                <div className="p-4 border-b border-[#E8DCC8]/50">
                  <h3 className="text-sm font-semibold text-[#5D4E37]">Recent Calls</h3>
                  <p className="text-xs text-[#8B7355]">{conversations.length} total</p>
                </div>
                {conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F0E8] flex items-center justify-center mx-auto mb-3">
                      <PhoneCall className="w-6 h-6 text-[#C9B790]" />
                    </div>
                    <p className="text-sm text-[#8B7355]">No calls yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8DCC8]/30 max-h-[500px] overflow-y-auto">
                    {conversations.map((call: Conversation) => (
                      <motion.div
                        key={call.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                          selectedCall === call.id ? 'bg-[#8B6F47]/10' : 'hover:bg-[#F5F0E8]/50'
                        }`}
                        onClick={() => setSelectedCall(call.id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedCall === call.id ? 'bg-[#8B6F47] text-white' : 'bg-[#F5F0E8] text-[#8B6F47]'
                        }`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#5D4E37] truncate">
                            {call.caller_phone ? formatPhoneNumber(call.caller_phone) : 'Unknown'}
                          </p>
                          <p className="text-xs text-[#8B7355]">
                            {new Date(call.started_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          call.status === 'completed' ? 'bg-emerald-500' :
                          call.status === 'failed' ? 'bg-red-500' :
                          call.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Transcript Panel */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8DCC8]/50 overflow-hidden">
                {selectedCall ? (
                  <>
                    {/* Transcript Header */}
                    <div className="p-4 border-b border-[#E8DCC8]/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-[#8B6F47]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[#5D4E37]">Conversation Transcript</h3>
                          <p className="text-xs text-[#8B7355]">
                            {conversations.find(c => c.id === selectedCall)?.caller_phone
                              ? formatPhoneNumber(conversations.find(c => c.id === selectedCall)?.caller_phone || '')
                              : 'Unknown caller'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(messages.map(m => `${m.role}: ${m.content}`).join('\n'));
                          toast.success('Transcript copied');
                        }}
                      >
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy
                      </Button>
                    </div>

                    {/* Messages */}
                    <div className="p-4 max-h-[400px] overflow-y-auto space-y-3">
                      {messages.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-sm text-[#8B7355]">No messages in this conversation.</p>
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex gap-3 ${msg.role === 'agent' ? '' : 'flex-row-reverse'}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-[#F5F0E8] text-[#8B6F47]'
                            }`}>
                              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`flex-1 max-w-[80%] ${msg.role === 'agent' ? '' : 'text-right'}`}>
                              <p className="text-xs text-[#8B7355] mb-1 capitalize font-medium">{msg.role === 'user' ? 'Customer' : 'Agent'}</p>
                              <div className={`inline-block text-sm p-3 rounded-2xl ${
                                msg.role === 'user'
                                  ? 'bg-blue-50 text-blue-900 rounded-tr-md'
                                  : 'bg-[#F5F0E8] text-[#5D4E37] rounded-tl-md'
                              }`}>
                                {msg.content}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[450px]">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#F5F0E8] flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-[#C9B790]" />
                      </div>
                      <h4 className="text-lg font-medium text-[#5D4E37] mb-2">Select a call</h4>
                      <p className="text-sm text-[#8B7355]">Choose a call from the list to view the transcript.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Knowledge Base"
              subtitle="Upload documents to help your agent answer customer questions"
            />

            <div className="bg-white rounded-xl border border-[#E8DCC8]/50 p-6">
              {agent ? (
                <div className="space-y-6">
                  {/* Drag & Drop Upload Area */}
                  <label
                    className={`relative flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#8B6F47] bg-[#8B6F47]/10 scale-[1.02]'
                        : 'border-[#E8DCC8] hover:border-[#8B6F47] hover:bg-[#F5F0E8]/30'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <AnimatePresence mode="wait">
                      {isDragging ? (
                        <motion.div
                          key="dragging"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-[#8B6F47] flex items-center justify-center mb-3">
                            <Upload className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-lg font-medium text-[#8B6F47]">Drop files here</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-14 h-14 rounded-xl bg-[#F5F0E8] flex items-center justify-center mb-3">
                            <Upload className="w-7 h-7 text-[#8B7355]" />
                          </div>
                          <span className="text-sm font-medium text-[#5D4E37]">Drag and drop files here</span>
                          <span className="text-xs text-[#8B7355] mt-1">or click to browse</span>
                          <span className="text-xs text-[#8B7355]/60 mt-2">PDF and TXT files supported</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt"
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    />
                  </label>

                  {/* File List */}
                  {documents.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#5D4E37]">{documents.length} file{documents.length !== 1 ? 's' : ''} uploaded</p>
                      </div>
                      {documents.map((doc) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#F5F0E8]/30 hover:bg-[#F5F0E8]/50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                              <FileText className="w-5 h-5 text-[#8B6F47]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#5D4E37]">{doc.filename}</p>
                              <p className="text-xs text-[#8B7355]">{doc.file_type}</p>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.open(doc.storage_url)}>
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => deleteDocument.mutate(doc.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#F5F0E8] flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[#C9B790]" />
                  </div>
                  <h4 className="text-lg font-medium text-[#5D4E37] mb-2">Create an agent first</h4>
                  <p className="text-sm text-[#8B7355]">You need to configure an agent before uploading documents.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      onCreateBusiness={() => setIsWizardOpen(true)}
      activeBusiness={{ id: business.id, name: business.name }}
      activeSection={activeTab as 'overview' | 'agent' | 'calls' | 'documents'}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-9 h-9 rounded-xl bg-white border border-[#E8DCC8]/50 flex items-center justify-center text-[#8B7355] hover:text-[#5D4E37] hover:border-[#8B6F47]/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-xl font-bold text-[#5D4E37]">{business.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <TutorialHelpButton onClick={openTutorial} />
          <Button
            variant="ghost"
            size="sm"
            className="text-[#8B7355] hover:text-red-500 hover:bg-red-50"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content based on active tab */}
      {renderContent()}

      {/* Agent Dialog */}
      <Dialog open={isAgentDialogOpen} onOpenChange={setIsAgentDialogOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#5D4E37]">{isEditMode ? 'Edit Agent' : 'Create Agent'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleAgentSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#8B7355]">Name</Label>
                <Input className={`mt-1.5 ${inputStyles}`} {...form.register('name')} />
              </div>
              <div>
                <Label className="text-[#8B7355]">Area Code</Label>
                <Input className={`mt-1.5 ${inputStyles}`} {...form.register('area_code')} maxLength={3} disabled={isEditMode} />
              </div>
            </div>
            <div>
              <Label className="text-[#8B7355]">Model</Label>
              <select className="w-full h-10 mt-1.5 rounded-md border border-[#E8DCC8] bg-white px-3 text-sm text-[#5D4E37]" {...form.register('model_type')}>
                <option value="gpt-realtime">GPT Realtime</option>
                <option value="gpt-4o-realtime-preview">GPT-4o Preview</option>
              </select>
            </div>
            <div>
              <Label className="text-[#8B7355]">Temperature: {form.watch('temperature')}</Label>
              <input type="range" min="0.6" max="1.2" step="0.1" className="w-full mt-1.5 accent-[#8B6F47]" {...form.register('temperature', { valueAsNumber: true })} />
            </div>
            <div>
              <Label className="text-[#8B7355]">System Prompt</Label>
              <Textarea
                className={`mt-1.5 min-h-[100px] ${textareaStyles}`}
                placeholder="Describe how your agent should behave..."
                {...form.register('prompt')}
              />
            </div>
            <div>
              <Label className="text-[#8B7355]">Greeting Message</Label>
              <Input className={`mt-1.5 ${inputStyles}`} {...form.register('greeting')} />
            </div>
            <div>
              <Label className="text-[#8B7355]">Goodbye Message</Label>
              <Input className={`mt-1.5 ${inputStyles}`} {...form.register('goodbye')} />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" className="border-[#E8DCC8] text-[#5D4E37] hover:bg-[#F5F0E8]" onClick={() => setIsAgentDialogOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                disabled={createAgent.isPending || updateAgent.isPending}
                className="bg-gradient-to-r from-[#8B6F47] to-[#A67A5B] text-white"
              >
                {(createAgent.isPending || updateAgent.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isEditMode ? 'Save Changes' : 'Create Agent'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        businessName={business.name}
        isDeleting={deleteBusiness.isPending}
      />

      {/* Phone Change Confirmation Modal */}
      <Dialog open={showPhoneChangeModal} onOpenChange={setShowPhoneChangeModal}>
        <DialogContent className="max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#5D4E37]">Change Phone Number</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-[#5D4E37]">
              Your current number <span className="font-medium">{agent?.phone_number?.phone_number ? formatPhoneNumber(agent.phone_number.phone_number) : ''}</span> will be permanently released and cannot be recovered.
            </p>
            <div>
              <label className="block text-xs text-[#8B7355] mb-2">New area code</label>
              <Input
                className={`w-full h-10 ${inputStyles}`}
                value={provisionAreaCode}
                onChange={(e) => setProvisionAreaCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="e.g. 415"
                maxLength={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="border-[#E8DCC8] text-[#5D4E37] hover:bg-[#F5F0E8]"
              onClick={() => setShowPhoneChangeModal(false)}
              disabled={isChangingPhone}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-[#8B6F47] to-[#A67A5B] text-white"
              onClick={handlePhoneChange}
              disabled={isChangingPhone || provisionAreaCode.length !== 3}
            >
              {isChangingPhone ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                'Change Number'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SetupWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={(id) => { setIsWizardOpen(false); router.push(`/business/${id}`); }}
      />

      {/* Tutorial Overlay */}
      <BusinessTutorial
        businessId={businessId}
        isOpen={showTutorial}
        onClose={closeTutorial}
      />
    </DashboardLayout>
  );
}
