import type {
  Business,
  Agent,
  AgentWithPhone,
  PhoneNumber,
  Conversation,
  ConversationWithMessages,
  ConversationStats,
  Message,
  Document,
  DocumentUploadResponse,
  CreateBusinessRequest,
  UpdateBusinessRequest,
  CreateAgentRequest,
  UpdateAgentRequest,
  UploadTextDocumentRequest,
  EndConversationRequest,
  ApiError,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        }));
        throw new Error(
          typeof error.detail === 'string'
            ? error.detail
            : 'An error occurred'
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Business endpoints
  async createBusiness(data: CreateBusinessRequest): Promise<Business> {
    return this.fetch<Business>('/business', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBusiness(businessId: number): Promise<Business> {
    return this.fetch<Business>(`/business/${businessId}`);
  }

  async listBusinesses(ownerUserId: string): Promise<Business[]> {
    return this.fetch<Business[]>(`/business?owner_user_id=${ownerUserId}`);
  }

  async updateBusiness(
    businessId: number,
    data: UpdateBusinessRequest
  ): Promise<Business> {
    return this.fetch<Business>(`/business/${businessId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBusiness(businessId: number): Promise<{ success: boolean }> {
    return this.fetch<{ success: boolean }>(`/business/${businessId}`, {
      method: 'DELETE',
    });
  }

  // Agent endpoints
  async createAgent(data: CreateAgentRequest): Promise<AgentWithPhone> {
    return this.fetch<AgentWithPhone>('/agent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAgent(agentId: number): Promise<AgentWithPhone> {
    return this.fetch<AgentWithPhone>(`/agent/${agentId}`);
  }

  async getAgentByBusiness(businessId: number): Promise<AgentWithPhone | null> {
    try {
      return await this.fetch<AgentWithPhone>(
        `/agent/business/${businessId}/agent`
      );
    } catch (error) {
      // Backend returns 404 if no agent exists
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async updateAgent(
    agentId: number,
    data: UpdateAgentRequest
  ): Promise<Agent> {
    return this.fetch<Agent>(`/agent/${agentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(agentId: number): Promise<{ success: boolean }> {
    return this.fetch<{ success: boolean }>(`/agent/${agentId}`, {
      method: 'DELETE',
    });
  }

  // Phone number endpoints
  async getPhoneByAgent(agentId: number): Promise<PhoneNumber | null> {
    try {
      return await this.fetch<PhoneNumber>(`/phone/agent/${agentId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getPhone(phoneId: number): Promise<PhoneNumber> {
    return this.fetch<PhoneNumber>(`/phone/${phoneId}`);
  }

  async deletePhone(phoneId: number): Promise<{ success: boolean }> {
    return this.fetch<{ success: boolean }>(`/phone/${phoneId}`, {
      method: 'DELETE',
    });
  }

  async deletePhoneByAgent(agentId: number): Promise<{ success: boolean }> {
    return this.fetch<{ success: boolean }>(`/phone/agent/${agentId}`, {
      method: 'DELETE',
    });
  }

  // Conversation endpoints
  async getConversation(
    conversationId: number,
    includeMessages = false
  ): Promise<ConversationWithMessages> {
    return this.fetch<ConversationWithMessages>(
      `/conversation/${conversationId}?include_messages=${includeMessages}`
    );
  }

  async listConversationsByAgent(
    agentId: number,
    options: {
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{
    conversations: Conversation[];
    count: number;
    limit: number;
    offset: number;
  }> {
    const { status, limit = 50, offset = 0 } = options;
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (status) params.append('status', status);

    return this.fetch(
      `/conversation/agent/${agentId}/list?${params.toString()}`
    );
  }

  async listConversationsByBusiness(
    businessId: number,
    options: {
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{
    conversations: Conversation[];
    count: number;
    limit: number;
    offset: number;
  }> {
    const { status, limit = 50, offset = 0 } = options;
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (status) params.append('status', status);

    return this.fetch(
      `/conversation/business/${businessId}/list?${params.toString()}`
    );
  }

  async getConversationMessages(
    conversationId: number
  ): Promise<{ messages: Message[]; count: number }> {
    return this.fetch(`/conversation/${conversationId}/messages`);
  }

  async endConversation(
    conversationId: number,
    data: EndConversationRequest
  ): Promise<Conversation> {
    return this.fetch<Conversation>(`/conversation/${conversationId}/end`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteConversation(conversationId: number): Promise<{ success: boolean }> {
    return this.fetch<{ success: boolean }>(`/conversation/${conversationId}`, {
      method: 'DELETE',
    });
  }

  async getAgentStats(agentId: number): Promise<ConversationStats> {
    return this.fetch<ConversationStats>(`/conversation/agent/${agentId}/stats`);
  }

  // Document/RAG endpoints
  async uploadTextDocument(
    data: UploadTextDocumentRequest
  ): Promise<DocumentUploadResponse> {
    return this.fetch<DocumentUploadResponse>('/rag/documents/text', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadPDFDocument(
    agentId: number,
    file: File,
    filename?: string
  ): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('agent_id', agentId.toString());
    formData.append('file', file);
    if (filename) formData.append('filename', filename);

    const url = `${API_URL}/rag/documents/pdf`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      }));
      throw new Error(
        typeof error.detail === 'string' ? error.detail : 'Upload failed'
      );
    }

    return await response.json();
  }

  async listDocuments(agentId: number): Promise<Document[]> {
    return this.fetch<Document[]>(`/rag/documents/${agentId}`);
  }

  async deleteDocument(documentId: number): Promise<{ success: boolean }> {
    return this.fetch<{ success: boolean }>(`/rag/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  async semanticSearch(
    agentId: number,
    query: string,
    k = 5,
    minSimilarity = 0.7
  ): Promise<unknown[]> {
    return this.fetch('/rag/semantic-search', {
      method: 'POST',
      body: JSON.stringify({
        agent_id: agentId,
        query,
        k,
        min_similarity: minSimilarity,
      }),
    });
  }
}

export const apiClient = new ApiClient();
