import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Privacy Policy',
  description:
    'HelloML privacy notice. Learn how we collect, use, and protect your data when you use our AI voice agent platform.',
  path: '/privacy',
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
