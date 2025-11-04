export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Business {
  id: number;
  owner_user_id: string;
  name: string;
  phone_number?: string;
  business_email?: string;
  address: string;
  created_at: string;
}

export interface Agent {
  id: number;
  business_id: number;
  name: string;
  model_type: string;
  temperature: number;
  voice_model: string;
  prompt?: string;
  greeting: string;
  goodbye: string;
  status: 'inactive' | 'active' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  agent_id: number;
  filename: string;
  storage_url: string;
  file_type: string;
  uploaded_at: string;
  error_message?: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: number;
  document_id: number;
  chunk_index: number;
  chunk_text: string;
  embedding?: unknown;
  created_at: string;
}

export interface Conversation {
  id: number;
  agent_id: number;
  caller_phone?: string;
  started_at: string;
  ended_at?: string;
  status: 'in_progress' | 'completed' | 'failed' | 'cancelled';
}

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'agent' | 'system';
  content: string;
  created_at: string;
}

export interface PhoneNumber {
  id: number;
  agent_id: number;
  phone_number: string;
  country: string;
  area_code: string;
  status: 'provisioning' | 'active' | 'inactive' | 'failed';
  webhook_url?: string;
  created_at: string;
}

// Mock data
export const mockUser: User = {
  id: 'user-1',
  email: 'john@example.com',
  name: 'John Doe'
};

export const mockBusinesses: Business[] = [
  {
    id: 1,
    owner_user_id: 'user-1',
    name: 'Tech Solutions Inc',
    business_email: 'contact@techsolutions.com',
    address: '123 Tech Street, San Francisco, CA',
    phone_number: '+1 (555) 123-4567',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    owner_user_id: 'user-1',
    name: 'Coffee Corner',
    business_email: 'hello@coffeecorner.com',
    address: '456 Main St, Portland, OR',
    created_at: '2024-02-20T14:30:00Z'
  }
];

export const mockAgents: Agent[] = [
  {
    id: 1,
    business_id: 1,
    name: 'Tech Support Agent',
    model_type: 'gpt-4o-mini',
    temperature: 0.7,
    voice_model: 'Joanna',
    prompt: 'You are a helpful tech support agent for Tech Solutions Inc. Help customers with their technical issues.',
    greeting: 'Hello! Welcome to Tech Solutions Inc. How can I help you today?',
    goodbye: 'Thank you for contacting Tech Solutions Inc. Have a great day!',
    status: 'active',
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T09:00:00Z'
  }
];

export const mockPhoneNumbers: PhoneNumber[] = [
  {
    id: 1,
    agent_id: 1,
    phone_number: '+1 (555) 123-4567',
    country: 'US',
    area_code: '555',
    status: 'active',
    webhook_url: 'https://api.voice-support.com/webhook/agent-1',
    created_at: '2024-01-16T10:00:00Z'
  }
];

export const mockDocuments: Document[] = [
  {
    id: 1,
    agent_id: 1,
    filename: 'product-manual.pdf',
    file_type: 'pdf',
    storage_url: '/storage/docs/product-manual.pdf',
    uploaded_at: '2024-01-17T11:00:00Z',
    updated_at: '2024-01-17T11:00:00Z'
  },
  {
    id: 2,
    agent_id: 1,
    filename: 'faq.txt',
    file_type: 'txt',
    storage_url: '/storage/docs/faq.txt',
    uploaded_at: '2024-01-18T15:30:00Z',
    updated_at: '2024-01-18T15:30:00Z'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 1,
    agent_id: 1,
    caller_phone: '+1 (555) 987-6543',
    started_at: '2024-01-20T10:15:00Z',
    ended_at: '2024-01-20T10:25:00Z',
    status: 'completed'
  },
  {
    id: 2,
    agent_id: 1,
    caller_phone: '+1 (555) 456-7890',
    started_at: '2024-01-21T14:30:00Z',
    ended_at: '2024-01-21T14:45:00Z',
    status: 'completed'
  }
];

export const mockMessages: Message[] = [
  {
    id: 1,
    conversation_id: 1,
    role: 'user',
    content: 'Hi, I need help with my account login.',
    created_at: '2024-01-20T10:15:00Z'
  },
  {
    id: 2,
    conversation_id: 1,
    role: 'agent',
    content: 'Hello! I\'d be happy to help you with your account login. Can you tell me what specific issue you\'re experiencing?',
    created_at: '2024-01-20T10:15:30Z'
  },
  {
    id: 3,
    conversation_id: 1,
    role: 'user',
    content: 'I keep getting an error message when I try to log in.',
    created_at: '2024-01-20T10:16:00Z'
  },
  {
    id: 4,
    conversation_id: 1,
    role: 'agent',
    content: 'I understand. Let me help you troubleshoot this. What error message are you seeing exactly?',
    created_at: '2024-01-20T10:16:15Z'
  }
];
