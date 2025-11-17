'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type { PhoneNumber } from '../types';

// Query keys
export const phoneKeys = {
  all: ['phoneNumbers'] as const,
  details: () => [...phoneKeys.all, 'detail'] as const,
  detail: (id: number) => [...phoneKeys.details(), id] as const,
  byAgent: (agentId: number) => [...phoneKeys.all, 'agent', agentId] as const,
};

// Hooks
export function usePhoneNumber(phoneId: number) {
  return useQuery({
    queryKey: phoneKeys.detail(phoneId),
    queryFn: () => apiClient.getPhone(phoneId),
    enabled: !!phoneId,
  });
}

export function usePhoneByAgent(agentId: number) {
  return useQuery({
    queryKey: phoneKeys.byAgent(agentId),
    queryFn: () => apiClient.getPhoneByAgent(agentId),
    enabled: !!agentId,
  });
}

export function useDeletePhoneNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phoneId: number) => apiClient.deletePhone(phoneId),
    onSuccess: (_, phoneId) => {
      queryClient.invalidateQueries({ queryKey: phoneKeys.all });
      queryClient.removeQueries({ queryKey: phoneKeys.detail(phoneId) });
    },
  });
}

export function useDeletePhoneByAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: number) => apiClient.deletePhoneByAgent(agentId),
    onSuccess: (_, agentId) => {
      queryClient.invalidateQueries({ queryKey: phoneKeys.all });
      queryClient.removeQueries({ queryKey: phoneKeys.byAgent(agentId) });
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}

export function useProvisionPhoneNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, areaCode }: { agentId: number; areaCode: string }) =>
      apiClient.provisionPhoneNumber(agentId, areaCode),
    onSuccess: (newPhone, variables) => {
      queryClient.invalidateQueries({ queryKey: phoneKeys.all });
      queryClient.invalidateQueries({ queryKey: phoneKeys.byAgent(variables.agentId) });
      queryClient.setQueryData(phoneKeys.byAgent(variables.agentId), newPhone);
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
