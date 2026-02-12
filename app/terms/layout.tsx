import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Terms of Service',
  description:
    'HelloML terms of service. Read the terms and conditions for using our AI voice agent platform.',
  path: '/terms',
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
