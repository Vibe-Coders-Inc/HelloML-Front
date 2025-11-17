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
  owner_user_id: string;
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
  voice_model?: string;
  prompt?: string;
  greeting?: string;
  goodbye?: string;
}

export interface UpdateAgentRequest {
  name?: string;
  model_type?: string;
  temperature?: number;
  voice_model?: string;
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
