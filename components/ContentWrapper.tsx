'use client';

import { usePathname } from 'next/navigation';

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No padding on auth page or root (loading) page
  const noPadding = pathname === '/auth' || pathname === '/';

  return (
    <div className={noPadding ? '' : 'pb-20'}>
      {children}
    </div>
  );
}
