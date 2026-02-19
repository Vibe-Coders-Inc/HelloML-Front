import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Blog — AI Phone Agent Tips & Small Business Automation',
  description:
    'Learn how AI phone agents, virtual receptionists, and automated phone answering can transform your small business. Tips, guides, and product updates from HelloML.',
  path: '/blog',
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
