'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  onCreateBusiness: () => void;
}

export function DashboardLayout({ children, onCreateBusiness }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FDFCFA] relative flex flex-col">
      {/* Clean modern background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Clean white/cream base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FEFEFE] via-[#FAFAFA] to-[#F5F5F5]" />

        {/* Soft pastel orbs - no brown, using soft blues and lavenders */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-indigo-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-rose-100/30 to-orange-50/40 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-bl from-violet-100/25 to-purple-50/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-gradient-to-tl from-amber-50/40 to-yellow-50/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '5.5s', animationDelay: '0.5s' }}
        />

        {/* Floating accent dots - warm brown to match brand */}
        <div
          className="absolute top-[15%] left-[15%] w-2 h-2 bg-[#8B6F47]/40 rounded-full animate-bounce"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute top-[25%] right-[20%] w-1.5 h-1.5 bg-[#A67A5B]/35 rounded-full animate-bounce"
          style={{ animationDuration: '5s', animationDelay: '0.5s' }}
        />
        <div
          className="absolute top-[50%] left-[8%] w-2.5 h-2.5 bg-[#C9B790]/50 rounded-full animate-bounce"
          style={{ animationDuration: '6s', animationDelay: '1s' }}
        />
        <div
          className="absolute top-[65%] right-[12%] w-1.5 h-1.5 bg-[#8B6F47]/30 rounded-full animate-bounce"
          style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-[80%] left-[25%] w-2 h-2 bg-[#A67A5B]/35 rounded-full animate-bounce"
          style={{ animationDuration: '5.5s', animationDelay: '2s' }}
        />
        <div
          className="absolute top-[35%] right-[35%] w-1.5 h-1.5 bg-[#C9B790]/45 rounded-full animate-bounce"
          style={{ animationDuration: '5s', animationDelay: '0.8s' }}
        />
        <div
          className="absolute top-[72%] left-[45%] w-2 h-2 bg-[#8B6F47]/25 rounded-full animate-bounce"
          style={{ animationDuration: '6.5s', animationDelay: '1.2s' }}
        />
        <div
          className="absolute top-[45%] right-[8%] w-1.5 h-1.5 bg-[#A67A5B]/40 rounded-full animate-bounce"
          style={{ animationDuration: '4.8s', animationDelay: '2.5s' }}
        />

        {/* Very subtle warm tint overlay */}
        <div className="absolute inset-0 bg-[#FAF8F3]/30" />
      </div>

      <Sidebar onCreateBusiness={onCreateBusiness} />

      {/* Main content area - flex-1 to fill available space */}
      <main className="lg:pl-[72px] flex-1 relative z-10">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-8 pt-20 lg:pt-10 pb-12">
          {children}
        </div>
      </main>
    </div>
  );
}
