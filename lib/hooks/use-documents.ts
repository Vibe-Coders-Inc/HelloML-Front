'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';
import { createClient } from '../supabase/client';
import type { Document, UploadTextDocumentRequest } from '../types';

// Helper to upload file to Supabase Storage and get public URL
async function uploadToStorage(file: File, agentId: number): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${agentId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);

  return publicUrl;
}

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
    mutationFn: async (data: UploadTextDocumentRequest & { file?: File }) => {
      let storageUrl = data.storage_url;

      // If a file is provided, upload to storage first
      if (data.file) {
        storageUrl = await uploadToStorage(data.file, data.agent_id);
      }

      return apiClient.uploadTextDocument({
        ...data,
        storage_url: storageUrl,
      });
    },
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
    mutationFn: async ({
      agentId,
      file,
      filename,
    }: {
      agentId: number;
      file: File;
      filename?: string;
    }) => {
      // First upload to Supabase Storage
      const storageUrl = await uploadToStorage(file, agentId);

      // Then call backend API with the storage URL
      return apiClient.uploadPDFDocument(agentId, file, filename, storageUrl);
    },
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
