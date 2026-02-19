import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Pricing — AI Phone Agent Starting at $5/mo',
  description:
    'HelloML AI phone agent pricing: free tier available, Starter plan just $5/mo for 100 minutes. The most affordable AI receptionist and automated phone answering service for small business.',
  path: '/pricing',
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
