'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type { Conversation, EndConversationRequest } from '../types';

// Query keys
export const conversationKeys = {
  all: ['conversations'] as const,
  lists: () => [...conversationKeys.all, 'list'] as const,
  listByAgent: (agentId: number, options?: { limit?: number; offset?: number }) =>
    [...conversationKeys.lists(), 'agent', agentId, options] as const,
  listByBusiness: (businessId: number, options?: { limit?: number; offset?: number }) =>
    [...conversationKeys.lists(), 'business', businessId, options] as const,
  details: () => [...conversationKeys.all, 'detail'] as const,
  detail: (id: number) => [...conversationKeys.details(), id] as const,
  messages: (id: number) => [...conversationKeys.detail(id), 'messages'] as const,
  stats: (agentId: number) => [...conversationKeys.all, 'stats', agentId] as const,
};

// Hooks
export function useConversation(conversationId: number, includeMessages = false) {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: () => apiClient.getConversation(conversationId, includeMessages),
    enabled: !!conversationId,
  });
}

export function useConversationsByAgent(
  agentId: number,
  options: { status?: string; limit?: number; offset?: number } = {}
) {
  return useQuery({
    queryKey: conversationKeys.listByAgent(agentId, options),
    queryFn: () => apiClient.listConversationsByAgent(agentId, options),
    enabled: !!agentId,
  });
}

export function useConversationsByBusiness(
  businessId: number,
  options: { status?: string; limit?: number; offset?: number } = {}
) {
  return useQuery({
    queryKey: conversationKeys.listByBusiness(businessId, options),
    queryFn: () => apiClient.listConversationsByBusiness(businessId, options),
    enabled: !!businessId,
  });
}

export function useConversationMessages(conversationId: number) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => apiClient.getConversationMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function useConversationStats(agentId: number) {
  return useQuery({
    queryKey: conversationKeys.stats(agentId),
    queryFn: () => apiClient.getAgentStats(agentId),
    enabled: !!agentId,
  });
}

export function useEndConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: number;
      data: EndConversationRequest;
    }) => apiClient.endConversation(conversationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.detail(variables.conversationId),
      });
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: number) =>
      apiClient.deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
      queryClient.removeQueries({
        queryKey: conversationKeys.detail(conversationId),
      });
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
    },
  });
}
