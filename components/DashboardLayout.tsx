'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface ActiveBusiness {
  id: number;
  name: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  onCreateBusiness: () => void;
  activeBusiness?: ActiveBusiness;
  activeSection?: 'overview' | 'agent' | 'calls' | 'documents';
}

export function DashboardLayout({
  children,
  onCreateBusiness,
  activeBusiness,
  activeSection
}: DashboardLayoutProps) {
  return (
    <div className="flex-1 bg-[#FAFAF8] relative flex flex-col">
      {/* Clean subtle background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FAFAF8] to-[#F5F3F0]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-[#E8E4DD]/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#E8E4DD]/20 to-transparent rounded-full blur-3xl" />
      </div>

      <Sidebar
        onCreateBusiness={onCreateBusiness}
        activeBusiness={activeBusiness}
        activeSection={activeSection}
      />

      <main className="lg:pl-14 flex-1 relative z-10">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
