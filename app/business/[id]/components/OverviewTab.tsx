'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Activity, TrendingUp, Bot, PhoneCall } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useConversationStats, useConversationsByAgent } from '@/lib/hooks/use-conversations';
import type { Business, AgentWithPhone, Conversation } from '@/lib/types';

interface OverviewTabProps {
  business: Business;
  agent?: AgentWithPhone;
}

export default function OverviewTab({ business, agent }: OverviewTabProps) {
  const router = useRouter();

  const { data: stats } = useConversationStats(agent?.id ?? 0);
  const { data: conversationsData } = useConversationsByAgent(
    agent?.id ?? 0,
    { limit: 1000, offset: 0 }
  );

  const phoneNumber = agent?.phone_number;
  const totalCalls = stats?.total_conversations || 0;
  const completedCalls = stats?.completed || 0;
  const conversations = conversationsData?.conversations || [];

  const getAgentStatus = () => {
    if (!agent) return 'None';
    return agent.status.charAt(0).toUpperCase() + agent.status.slice(1);
  };

  const getAgentStatusColor = (status: string) => {
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
      day: 'numeric'
    });
  };

  // Calculate last 7 days data from real conversations
  const calculateLast7DaysData = (conversations: Conversation[]) => {
    const today = new Date();
    const last7Days = [];

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toISOString().split('T')[0];

      // Count conversations for this day
      const callsForDay = conversations.filter(conv => {
        const convDate = new Date(conv.started_at);
        convDate.setHours(0, 0, 0, 0);
        return convDate.toISOString().split('T')[0] === dateStr;
      }).length;

      last7Days.push({
        day: dayName,
        calls: callsForDay
      });
    }

    return last7Days;
  };

  const last7DaysData = calculateLast7DaysData(conversations);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8B6F47]">Agent Status</CardTitle>
            <Bot className="h-4 w-4 text-[#A67A5B]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAgentStatusColor(getAgentStatus())}`}>
                {getAgentStatus()}
              </span>
            </div>
            <p className="text-xs text-[#A67A5B] mt-1">
              {agent ? `${agent.name} is ${agent.status}` : 'No agent configured'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8B6F47]">Phone Number</CardTitle>
            <Phone className="h-4 w-4 text-[#A67A5B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B6F47]">
              {phoneNumber ? phoneNumber.phone_number : 'Not provisioned'}
            </div>
            <p className="text-xs text-[#A67A5B]">
              {phoneNumber ? `Status: ${phoneNumber.status}` : 'No phone number assigned'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8B6F47]">Total Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-[#A67A5B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B6F47]">{totalCalls}</div>
            <p className="text-xs text-[#A67A5B]">
              {completedCalls} completed successfully
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8B6F47]">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#A67A5B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8B6F47]">
              {totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0}%
            </div>
            <p className="text-xs text-[#A67A5B]">
              Call completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
        <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-[#8B6F47]">Last 7 Days Activity</CardTitle>
            <CardDescription className="text-[#A67A5B]">
              Call volume and activity trends for your voice agent
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end space-x-2">
            {last7DaysData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div
                  className="bg-gradient-to-t from-[#8B6F47] to-[#A67A5B] rounded-t w-full transition-all hover:opacity-90"
                  style={{ height: `${(data.calls / 25) * 180}px` }}
                />
                <span className="text-xs text-[#A67A5B]">{data.day}</span>
                <span className="text-xs font-medium text-[#8B6F47]">{data.calls}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {!agent ? (
          <Card className="flex-1 bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B6F47]">Ready to Launch Your AI Agent?</CardTitle>
              <CardDescription className="text-[#A67A5B]">
                Create your first voice agent and start handling customer calls automatically!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push(`/business/${business.id}?tab=agent`)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Bot className="h-4 w-4 mr-2" />
                Create Your First Agent
              </Button>
            </CardContent>
          </Card>
        ) : !phoneNumber ? (
          <Card className="flex-1 bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-[#8B6F47]">No Phone Number</CardTitle>
              <CardDescription className="text-[#A67A5B]">
                Phone numbers are automatically provisioned when creating agents. If your agent doesn&apos;t have one, check the Agent tab for details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push(`/business/${business.id}?tab=agent`)}
                className="w-full sm:w-auto bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Phone className="h-4 w-4 mr-2" />
                View Agent Details
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Card className="flex-1 bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#8B6F47]">Test Your Agent</CardTitle>
                <CardDescription className="text-[#A67A5B]">
                  Make a test call to see how your agent performs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    // Mock test call
                    alert('Test call initiated! Your agent will answer shortly.');
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!phoneNumber}
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Test Call
                </Button>
              </CardContent>
            </Card>

            <Card className="flex-1 bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-[#8B6F47]">View Analytics</CardTitle>
                <CardDescription className="text-[#A67A5B]">
                  Check detailed call analytics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => router.push(`/business/${business.id}?tab=calls`)}
                  variant="outline"
                  className="w-full sm:w-auto border-[#D8CBA9] text-[#8B6F47] hover:bg-[#FAF8F3] hover:border-[#A67A5B] shadow-sm hover:shadow-md transition-all"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  View Calls
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Business Info */}
      <Card className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-[#8B6F47]">Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-[#A67A5B]">Business Name</h4>
              <p className="text-sm text-[#8B6F47]">{business.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-[#A67A5B]">Email</h4>
              <p className="text-sm text-[#8B6F47]">{business.business_email || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-[#A67A5B]">Address</h4>
              <p className="text-sm text-[#8B6F47]">{business.address}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-[#A67A5B]">Created</h4>
              <p className="text-sm text-[#8B6F47]">{formatDate(business.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
