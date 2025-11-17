'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type {
  Business,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from '../types';

// Query keys
export const businessKeys = {
  all: ['businesses'] as const,
  lists: () => [...businessKeys.all, 'list'] as const,
  list: (userId: string) => [...businessKeys.lists(), userId] as const,
  details: () => [...businessKeys.all, 'detail'] as const,
  detail: (id: number) => [...businessKeys.details(), id] as const,
};

// Hooks
export function useBusinesses(userId: string) {
  return useQuery({
    queryKey: businessKeys.list(userId),
    queryFn: () => apiClient.listBusinesses(userId),
    enabled: !!userId,
  });
}

export function useBusiness(businessId: number) {
  return useQuery({
    queryKey: businessKeys.detail(businessId),
    queryFn: () => apiClient.getBusiness(businessId),
    enabled: !!businessId,
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBusinessRequest) =>
      apiClient.createBusiness(data),
    onSuccess: (newBusiness) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.setQueryData(
        businessKeys.detail(newBusiness.id),
        newBusiness
      );
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      data,
    }: {
      businessId: number;
      data: UpdateBusinessRequest;
    }) => apiClient.updateBusiness(businessId, data),
    onSuccess: (updatedBusiness) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.setQueryData(
        businessKeys.detail(updatedBusiness.id),
        updatedBusiness
      );
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessId: number) => apiClient.deleteBusiness(businessId),
    onSuccess: (_, businessId) => {
      queryClient.invalidateQueries({ queryKey: businessKeys.lists() });
      queryClient.removeQueries({ queryKey: businessKeys.detail(businessId) });
    },
  });
}
