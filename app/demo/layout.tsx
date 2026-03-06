import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Try Live Demo',
  description:
    'Talk to our AI phone agent live. Experience how HelloML answers calls, books appointments, and responds to questions in real time. No signup needed.',
  path: '/demo',
});

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
