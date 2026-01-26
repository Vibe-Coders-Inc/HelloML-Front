'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../api-client';

// Query keys
export const billingKeys = {
  all: ['billing'] as const,
  subscriptions: () => [...billingKeys.all, 'subscription'] as const,
  subscription: (businessId: number) => [...billingKeys.subscriptions(), businessId] as const,
  usage: () => [...billingKeys.all, 'usage'] as const,
  usageByBusiness: (businessId: number) => [...billingKeys.usage(), businessId] as const,
};

// Hooks
export function useSubscription(businessId: number) {
  return useQuery({
    queryKey: billingKeys.subscription(businessId),
    queryFn: () => apiClient.getSubscription(businessId),
    enabled: !!businessId,
  });
}

export function useUsage(businessId: number) {
  return useQuery({
    queryKey: billingKeys.usageByBusiness(businessId),
    queryFn: () => apiClient.getUsage(businessId),
    enabled: !!businessId,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (businessId: number) => apiClient.createCheckoutSession(businessId),
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
  });
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: (businessId: number) => apiClient.createPortalSession(businessId),
    onSuccess: (data) => {
      // Open Stripe Billing Portal in new tab
      if (data.portal_url) {
        window.open(data.portal_url, '_blank');
      }
    },
  });
}
