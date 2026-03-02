import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Pricing — AI Phone Agent Starting at $29/mo',
  description:
    'HelloML AI phone agent pricing: free tier available, Starter plan just $29/mo for 200 minutes. The most affordable AI receptionist and automated phone answering service for small business.',
  path: '/pricing',
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
