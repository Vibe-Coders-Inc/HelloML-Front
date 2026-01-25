'use client';

import { usePathname } from 'next/navigation';

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages that handle their own full-height layout
  const isFullHeightPage =
    pathname === '/auth' ||
    pathname === '/';

  return (
    <div className={`flex-1 ${isFullHeightPage ? '' : 'flex flex-col'}`}>
      {children}
    </div>
  );
}
