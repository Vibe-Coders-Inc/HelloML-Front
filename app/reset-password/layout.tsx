import type { Metadata } from 'next';
import { getMetadata } from '@/lib/content';

export const metadata: Metadata = getMetadata({
  title: 'Reset Password',
  description: 'Reset your HelloML account password.',
  path: '/reset-password',
  noIndex: true,
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
