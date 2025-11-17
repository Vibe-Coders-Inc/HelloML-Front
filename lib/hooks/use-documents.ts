'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import type { Document, UploadTextDocumentRequest } from '../types';

// Query keys
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (agentId: number) => [...documentKeys.lists(), agentId] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: number) => [...documentKeys.details(), id] as const,
};

// Hooks
export function useDocuments(agentId: number) {
  return useQuery({
    queryKey: documentKeys.list(agentId),
    queryFn: () => apiClient.listDocuments(agentId),
    enabled: !!agentId,
  });
}

export function useUploadTextDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadTextDocumentRequest) =>
      apiClient.uploadTextDocument(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.list(variables.agent_id),
      });
    },
  });
}

export function useUploadPDFDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      file,
      filename,
    }: {
      agentId: number;
      file: File;
      filename?: string;
    }) => apiClient.uploadPDFDocument(agentId, file, filename),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: documentKeys.list(variables.agentId),
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) => apiClient.deleteDocument(documentId),
    onSuccess: () => {
      // Invalidate all document lists since we don't know which agent it belongs to
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
}
