'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function FooterWrapper() {
  const pathname = usePathname();

  // Don't show footer on auth page or landing page (landing has its own footer)
  if (pathname === '/auth' || pathname === '/') {
    return null;
  }

  return <Footer />;
}
