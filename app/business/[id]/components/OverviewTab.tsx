'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Activity, TrendingUp, Bot, PhoneCall } from 'lucide-react';
import { Business, Agent } from '@/lib/mock-data';
import { useApp } from '@/lib/context';
import { useRouter } from 'next/navigation';

interface OverviewTabProps {
  business: Business;
  agent?: Agent;
}

export default function OverviewTab({ business, agent }: OverviewTabProps) {
  const { phoneNumbers, conversations } = useApp();
  const router = useRouter();

  const phoneNumber = phoneNumbers.find(phone => phone.agent_id === agent?.id);
  const businessConversations = conversations.filter(conv => conv.agent_id === agent?.id);
  const totalCalls = businessConversations.length;
  const completedCalls = businessConversations.filter(conv => conv.status === 'completed').length;

  const getAgentStatus = () => {
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

  // Mock data for the chart
  const last7DaysData = [
    { day: 'Mon', calls: 12 },
    { day: 'Tue', calls: 8 },
    { day: 'Wed', calls: 15 },
    { day: 'Thu', calls: 22 },
    { day: 'Fri', calls: 18 },
    { day: 'Sat', calls: 6 },
    { day: 'Sun', calls: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAgentStatusColor(getAgentStatus())}`}>
                {getAgentStatus()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {agent ? `${agent.name} is ${agent.status}` : 'No agent configured'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Number</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phoneNumber ? phoneNumber.phone_number : 'Not provisioned'}
            </div>
            <p className="text-xs text-muted-foreground">
              {phoneNumber ? `Status: ${phoneNumber.status}` : 'No phone number assigned'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              {completedCalls} completed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Call completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Last 7 Days Activity</CardTitle>
            <CardDescription>
              Call volume and activity trends for your voice agent
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end space-x-2">
            {last7DaysData.map((data, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full transition-all hover:bg-blue-600"
                  style={{ height: `${(data.calls / 25) * 180}px` }}
                />
                <span className="text-xs text-muted-foreground">{data.day}</span>
                <span className="text-xs font-medium">{data.calls}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {!agent ? (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Ready to Launch Your AI Agent?</CardTitle>
              <CardDescription>
                Create your first voice agent and start handling customer calls automatically!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push(`/business/${business.id}?tab=agent`)}
                className="w-full sm:w-auto"
              >
                <Bot className="h-4 w-4 mr-2" />
                Create Your First Agent
              </Button>
            </CardContent>
          </Card>
        ) : !phoneNumber ? (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Get Your Phone Number</CardTitle>
              <CardDescription>
                Your agent is ready! Provision a phone number to start receiving calls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push(`/business/${business.id}?tab=agent`)}
                className="w-full sm:w-auto"
              >
                <Phone className="h-4 w-4 mr-2" />
                Provision Phone Number
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg">Test Your Agent</CardTitle>
                <CardDescription>
                  Make a test call to see how your agent performs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => {
                    // Mock test call
                    alert('Test call initiated! Your agent will answer shortly.');
                  }}
                  className="w-full sm:w-auto"
                  disabled={!phoneNumber}
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Test Call
                </Button>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-lg">View Analytics</CardTitle>
                <CardDescription>
                  Check detailed call analytics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => router.push(`/business/${business.id}?tab=calls`)}
                  variant="outline"
                  className="w-full sm:w-auto"
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
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Business Name</h4>
              <p className="text-sm">{business.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
              <p className="text-sm">{business.business_email || 'Not provided'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Address</h4>
              <p className="text-sm">{business.address}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Created</h4>
              <p className="text-sm">{formatDate(business.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
