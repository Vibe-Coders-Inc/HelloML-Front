'use client';

import { usePathname } from 'next/navigation';

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // No padding on auth page, root page, or dashboard (DashboardLayout handles its own layout)
  // Business pages get padding since they use FooterWrapper
  const noPadding =
    pathname === '/auth' ||
    pathname === '/' ||
    pathname === '/dashboard';

  return (
    <div className={noPadding ? '' : 'pb-20'}>
      {children}
    </div>
  );
}
