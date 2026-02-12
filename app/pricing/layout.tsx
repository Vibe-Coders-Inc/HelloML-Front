import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Pricing',
  description:
    'Simple, transparent pricing for HelloML AI voice agents. Start free and upgrade when you are ready. No credit card required.',
  path: '/pricing',
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
