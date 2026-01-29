'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

export const integrationKeys = {
  all: ['integrations'] as const,
  connections: () => [...integrationKeys.all, 'connections'] as const,
  connectionsByBusiness: (businessId: number) =>
    [...integrationKeys.connections(), businessId] as const,
};

export function useConnections(businessId: number) {
  return useQuery({
    queryKey: integrationKeys.connectionsByBusiness(businessId),
    queryFn: () => apiClient.getConnections(businessId),
    enabled: !!businessId,
  });
}

export function useDisconnectIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      provider,
    }: {
      businessId: number;
      provider: string;
    }) => apiClient.disconnectIntegration(businessId, provider),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: integrationKeys.connectionsByBusiness(variables.businessId),
      });
    },
  });
}

export function useUpdateToolSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      provider,
      settings,
    }: {
      businessId: number;
      provider: string;
      settings: Record<string, unknown>;
    }) => apiClient.updateToolSettings(businessId, provider, settings),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: integrationKeys.connectionsByBusiness(variables.businessId),
      });
    },
  });
}
