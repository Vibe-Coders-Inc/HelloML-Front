'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PhoneCall, Search, Eye, Download, Copy, Clock, User, Bot, MessageSquare, AlertCircle } from 'lucide-react';
import { Conversation, Message } from '@/lib/mock-data';
import { useApp } from '@/lib/context';

interface CallsTabProps {
  agentId?: number;
}

export default function CallsTab({ agentId }: CallsTabProps) {
  const { conversations, messages, phoneNumbers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const agentConversations = agentId 
    ? conversations.filter(conv => conv.agent_id === agentId)
    : [];

  const filteredConversations = agentConversations.filter(conv => 
    conv.caller_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversationMessages = selectedConversation 
    ? messages.filter(msg => msg.conversation_id === selectedConversation.id)
    : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const formatDuration = (startedAt: string, endedAt?: string) => {
    if (!endedAt) return 'In progress';
    
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleViewTranscript = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsTranscriptOpen(true);
  };

  const handleExportTranscript = () => {
    if (!selectedConversation || conversationMessages.length === 0) return;
    
    const transcript = conversationMessages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript-${selectedConversation.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTranscript = () => {
    if (!selectedConversation || conversationMessages.length === 0) return;
    
    const transcript = conversationMessages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(transcript);
    alert('Transcript copied to clipboard!');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'user': return <User className="h-4 w-4" />;
      case 'agent': return <Bot className="h-4 w-4" />;
      case 'system': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!agentId) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-xl">No Agent Found</CardTitle>
          <CardDescription>
            Create an agent first to view call logs
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const phoneNumber = phoneNumbers.find(phone => phone.agent_id === agentId);
  const hasPhoneNumber = phoneNumber && phoneNumber.status === 'active';

  return (
    <div className="space-y-6">
      {/* Phone Number Status */}
      {!hasPhoneNumber && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>No Phone Number Provisioned</span>
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Provision a phone number to start receiving calls and view call logs here.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PhoneCall className="h-5 w-5" />
            <span>Call Logs</span>
          </CardTitle>
          <CardDescription>
            View and analyze all conversations with your voice agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by phone number or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PhoneCall className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {agentConversations.length === 0 ? 'No calls yet' : 'No calls match your search'}
              </h3>
              <p className="text-gray-500">
                {agentConversations.length === 0 
                  ? 'Calls will appear here once your agent starts receiving them'
                  : 'Try adjusting your search terms'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <PhoneCall className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {conversation.caller_phone || 'Unknown Caller'}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(conversation.started_at)}
                        </span>
                        <span>•</span>
                        <span>Duration: {formatDuration(conversation.started_at, conversation.ended_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                      {conversation.status}
                    </span>
                    <Dialog open={isTranscriptOpen && selectedConversation?.id === conversation.id} onOpenChange={setIsTranscriptOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTranscript(conversation)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5" />
                            <span>Call Transcript</span>
                          </DialogTitle>
                          <DialogDescription>
                            Conversation with {conversation.caller_phone} on {formatDate(conversation.started_at)}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex-1 overflow-y-auto space-y-4">
                          {conversationMessages.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                              No messages found for this conversation
                            </p>
                          ) : (
                            conversationMessages.map((message) => (
                              <div key={message.id} className="flex space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleColor(message.role)}`}>
                                  {getRoleIcon(message.role)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium capitalize">{message.role}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(message.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={handleCopyTranscript}
                            disabled={conversationMessages.length === 0}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleExportTranscript}
                            disabled={conversationMessages.length === 0}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Call Statistics */}
      {agentConversations.length > 0 && (
        <Card>
        <CardHeader>
          <CardTitle>Call Statistics</CardTitle>
        </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {agentConversations.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Calls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {agentConversations.filter(c => c.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {agentConversations.filter(c => c.status === 'failed').length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(
                    (agentConversations.filter(c => c.status === 'completed').length / 
                     agentConversations.length) * 100
                  )}%
                </div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
