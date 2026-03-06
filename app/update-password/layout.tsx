import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Update Password',
  description: 'Set a new password for your HelloML account.',
  path: '/update-password',
  noIndex: true,
});

export default function UpdatePasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
