'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function FooterWrapper() {
  const pathname = usePathname();

  // Don't show footer on auth page
  if (pathname === '/auth') {
    return null;
  }

  return <Footer />;
}
