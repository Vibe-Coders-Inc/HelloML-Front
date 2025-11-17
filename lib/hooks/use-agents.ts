'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type {
  AgentWithPhone,
  CreateAgentRequest,
  UpdateAgentRequest,
} from '../types';

// Query keys
export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (businessId: number) => [...agentKeys.lists(), businessId] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: number) => [...agentKeys.details(), id] as const,
};

// Hooks
export function useAgent(agentId: number) {
  return useQuery({
    queryKey: agentKeys.detail(agentId),
    queryFn: () => apiClient.getAgent(agentId),
    enabled: !!agentId,
  });
}

export function useAgentByBusiness(businessId: number) {
  return useQuery({
    queryKey: agentKeys.list(businessId),
    queryFn: () => apiClient.getAgentByBusiness(businessId),
    enabled: !!businessId,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgentRequest) => apiClient.createAgent(data),
    onSuccess: (newAgent) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.setQueryData(agentKeys.detail(newAgent.id), newAgent);
      if (newAgent.phone_number) {
        // Invalidate phone queries since a new phone was provisioned
        queryClient.invalidateQueries({ queryKey: ['phoneNumbers'] });
      }
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      data,
    }: {
      agentId: number;
      data: UpdateAgentRequest;
    }) => apiClient.updateAgent(agentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.agentId) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: number) => apiClient.deleteAgent(agentId),
    onSuccess: (_, agentId) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
      queryClient.removeQueries({ queryKey: agentKeys.detail(agentId) });
      queryClient.invalidateQueries({ queryKey: ['phoneNumbers'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
