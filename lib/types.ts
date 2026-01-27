// Core entity types
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
  stripe_customer_id?: string;
  created_at: string;
}

export interface Agent {
  id: number;
  business_id: number;
  name: string;
  model_type: string;
  temperature: number;
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
  status?: 'pending' | 'processing' | 'ready' | 'error';
  file_size?: number;
  chunk_count?: number;
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
  status: 'provisioning' | 'active' | 'paused' | 'released' | 'failed';
  webhook_url?: string;
  created_at: string;
  last_call_at?: string;
  paused_at?: string;
  warning_sent_at?: string;
}

export interface Subscription {
  id: number;
  business_id: number;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  cancel_at?: number | string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionResponse {
  subscription: Subscription | null;
  has_active_subscription: boolean;
}

export interface CheckoutResponse {
  checkout_url: string;
  session_id: string;
}

export interface PortalResponse {
  portal_url: string;
}

export interface UsageResponse {
  minutes_used: number;
  included_minutes: number;
  overage_minutes: number;
  period_start: string | null;
  period_end: string | null;
}

export interface ToolConnection {
  id: number;
  provider: string;
  account_email: string | null;
  created_at: string;
}

// API-specific types

export interface AgentWithPhone extends Agent {
  phone_number?: PhoneNumber;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  limit: number;
  offset: number;
}

export interface ConversationWithMessages extends Conversation {
  messages?: Message[];
}

export interface ConversationStats {
  total_conversations: number;
  completed: number;
  failed: number;
  in_progress: number;
  avg_duration_seconds?: number;
  recent_conversations: Conversation[];
}

export interface DocumentUploadResponse {
  document_id: number;
  chunks_created: number;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
  status?: number;
}

// Request types
export interface CreateBusinessRequest {
  name: string;
  address: string;
  phone_number?: string;
  business_email?: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  address?: string;
  phone_number?: string;
  business_email?: string;
}

export interface CreateAgentRequest {
  business_id: number;
  area_code: string;
  name?: string;
  model_type?: string;
  temperature?: number;
  prompt?: string;
  greeting?: string;
  goodbye?: string;
}

export interface UpdateAgentRequest {
  name?: string;
  model_type?: string;
  temperature?: number;
  prompt?: string;
  greeting?: string;
  goodbye?: string;
  status?: 'inactive' | 'active' | 'paused';
}

export interface UploadTextDocumentRequest {
  agent_id: number;
  filename: string;
  text: string;
  file_type?: string;
  storage_url?: string;
}

export interface EndConversationRequest {
  status: 'completed' | 'failed' | 'cancelled';
}
