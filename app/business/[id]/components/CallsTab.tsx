'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PhoneCall, Search, Eye, Download, Copy, Clock, User, Bot, MessageSquare, AlertCircle } from 'lucide-react';
import { useConversationsByAgent, useConversationMessages } from '@/lib/hooks/use-conversations';

interface CallsTabProps {
  agentId?: number;
}

export default function CallsTab({ agentId }: CallsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const { data: conversationsData, isLoading: conversationsLoading } = useConversationsByAgent(
    agentId || 0,
    { limit: 100, offset: 0 }
  );

  const { data: messagesData, isLoading: messagesLoading } = useConversationMessages(
    selectedConversationId || 0
  );

  // Extract conversations from paginated response
  const agentConversations = conversationsData?.conversations || [];
  const messages = messagesData?.messages || [];

  const filteredConversations = agentConversations.filter(conv =>
    conv.caller_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = agentConversations.find(c => c.id === selectedConversationId) || null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-[#8B6F47] bg-[#C9B790]/30';
      case 'in_progress': return 'text-[#A67A5B] bg-[#FAF8F3]';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-[#8B6F47] bg-[#D8CBA9]/30';
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

  const formatDuration = (startedAt: string, endedAt?: string) => {
    if (!endedAt) return 'In progress';
    
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleViewTranscript = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsTranscriptOpen(true);
  };

  const handleExportTranscript = () => {
    if (!selectedConversation || messages.length === 0) return;

    const transcript = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `transcript-${selectedConversation.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTranscript = () => {
    if (!selectedConversation || messages.length === 0) return;

    const transcript = messages
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
      case 'user': return 'bg-[#C9B790]/30 text-[#8B6F47]';
      case 'agent': return 'bg-[#D8CBA9]/30 text-[#A67A5B]';
      case 'system': return 'bg-[#FAF8F3] text-[#A67A5B]';
      default: return 'bg-[#FAF8F3] text-[#A67A5B]';
    }
  };

  if (!agentId) {
    return (
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#C9B790]/30 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-[#8B6F47]" />
          </div>
          <CardTitle className="text-xl text-[#8B6F47]">No Agent Found</CardTitle>
          <CardDescription className="text-[#A67A5B]">
            Create an agent first to view call logs
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#8B6F47]">
            <PhoneCall className="h-5 w-5" />
            <span>Call Logs</span>
          </CardTitle>
          <CardDescription className="text-[#A67A5B]">
            View and analyze all conversations with your voice agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A67A5B]" />
              <Input
                placeholder="Search by phone number or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl"
              />
            </div>
          </div>

          {conversationsLoading ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 border-4 border-[#C9B790] border-t-[#8B6F47] rounded-full animate-spin"></div>
              <p className="mt-4 text-[#A67A5B]">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-[#C9B790]/30 rounded-full flex items-center justify-center mb-4">
                <PhoneCall className="w-8 h-8 text-[#8B6F47]" />
              </div>
              <h3 className="text-lg font-medium text-[#8B6F47] mb-2">
                {agentConversations.length === 0 ? 'No calls yet' : 'No calls match your search'}
              </h3>
              <p className="text-[#A67A5B]">
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
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-[#FAF8F3]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <PhoneCall className="h-5 w-5 text-[#8B6F47]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[#8B6F47]">
                        {conversation.caller_phone || 'Unknown Caller'}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-[#A67A5B]">
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
                    <Dialog open={isTranscriptOpen && selectedConversationId === conversation.id} onOpenChange={setIsTranscriptOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTranscript(conversation.id)}
                          className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-[#E8DCC8] max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                        <DialogHeader>
                          <DialogTitle className="text-[#8B6F47] flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5" />
                            <span>Call Transcript</span>
                          </DialogTitle>
                          <DialogDescription className="text-[#A67A5B]">
                            Conversation with {conversation.caller_phone} on {formatDate(conversation.started_at)}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex-1 overflow-y-auto space-y-4">
                          {messagesLoading ? (
                            <div className="text-center py-8">
                              <div className="mx-auto w-12 h-12 border-4 border-[#C9B790] border-t-[#8B6F47] rounded-full animate-spin"></div>
                              <p className="mt-4 text-[#A67A5B]">Loading messages...</p>
                            </div>
                          ) : messages.length === 0 ? (
                            <p className="text-center text-[#A67A5B] py-8">
                              No messages found for this conversation
                            </p>
                          ) : (
                            messages.map((message) => (
                              <div key={message.id} className="flex space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleColor(message.role)}`}>
                                  {getRoleIcon(message.role)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium capitalize text-[#8B6F47]">{message.role}</span>
                                    <span className="text-xs text-[#A67A5B]">
                                      {formatDate(message.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#8B6F47]">{message.content}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={handleCopyTranscript}
                            disabled={messagesLoading || messages.length === 0}
                            className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleExportTranscript}
                            disabled={messagesLoading || messages.length === 0}
                            className="border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
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
        <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-[#8B6F47]">Call Statistics</CardTitle>
        </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8B6F47]">
                  {agentConversations.length}
                </div>
                <div className="text-sm text-[#A67A5B]">Total Calls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8B6F47]">
                  {agentConversations.filter(c => c.status === 'completed').length}
                </div>
                <div className="text-sm text-[#A67A5B]">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {agentConversations.filter(c => c.status === 'failed').length}
                </div>
                <div className="text-sm text-[#A67A5B]">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8B6F47]">
                  {Math.round(
                    (agentConversations.filter(c => c.status === 'completed').length /
                     agentConversations.length) * 100
                  )}%
                </div>
                <div className="text-sm text-[#A67A5B]">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
