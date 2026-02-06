'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plus, LogOut, Menu, X, Phone, LayoutGrid, Bot, PhoneCall, FileText } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/lib/context';

interface ActiveBusiness {
  id: number;
  name: string;
}

interface SidebarProps {
  onCreateBusiness: () => void;
  activeBusiness?: ActiveBusiness;
  activeSection?: 'overview' | 'agent' | 'calls' | 'documents';
}

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'accent';
  isActive?: boolean;
  isExpanded: boolean;
}

function SidebarButton({ icon, label, onClick, variant = 'default', isActive, isExpanded }: SidebarButtonProps) {
  return (
    <motion.button
      className={`
        relative overflow-hidden flex items-center gap-3 transition-all duration-200
        ${isExpanded ? 'w-full px-3' : 'w-10 justify-center'}
        h-10 rounded-xl
        ${variant === 'accent'
          ? 'bg-[#5D4E37] text-white hover:bg-[#4A3E2C]'
          : isActive
            ? 'bg-[#5D4E37]/10 text-[#5D4E37]'
            : 'text-[#8B7355] hover:text-[#5D4E37] hover:bg-[#5D4E37]/5'
        }
      `}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      title={!isExpanded ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            className="text-sm font-medium whitespace-nowrap"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function SidebarLink({ icon, label, href, isActive, isExpanded, tutorialId }: {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  isExpanded: boolean;
  tutorialId?: string;
}) {
  const handleClick = () => {
    // Update URL hash to sync with tabs
    window.history.pushState(null, '', href);
    // Dispatch a custom event to notify the business page
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return (
    <motion.button
      className={`
        flex items-center gap-3 transition-all duration-200
        ${isExpanded ? 'w-full px-3' : 'w-10 justify-center'}
        h-10 rounded-xl text-sm
        ${isActive
          ? 'bg-[#5D4E37]/10 text-[#5D4E37] font-medium'
          : 'text-[#8B7355] hover:text-[#5D4E37] hover:bg-[#5D4E37]/5'
        }
      `}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      title={!isExpanded ? label : undefined}
      data-tutorial={tutorialId}
    >
      <span className="flex-shrink-0">{icon}</span>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            className="whitespace-nowrap"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function UserAvatar({ name, isExpanded }: { name?: string; isExpanded: boolean }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div
      className={`
        flex items-center gap-3 rounded-xl bg-[#F5F0E8]
        ${isExpanded ? 'w-full px-3 h-10' : 'w-10 h-10 justify-center'}
      `}
    >
      <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-semibold text-[#5D4E37]">{initials}</span>
      </div>
      <AnimatePresence>
        {isExpanded && name && (
          <motion.span
            className="text-sm font-medium text-[#5D4E37] truncate"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function LogoMark({ isExpanded }: { isExpanded: boolean }) {
  const router = useRouter();

  return (
    <button
      className={`
        flex items-center gap-2 transition-all duration-200
        ${isExpanded ? 'w-full px-1' : 'w-10 justify-center'}
        h-10
      `}
      onClick={() => router.push('/')}
    >
      <div className="w-8 h-8 rounded-lg bg-[#5D4E37] flex items-center justify-center flex-shrink-0">
        <Phone className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="flex items-baseline gap-0.5 overflow-hidden"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-lg text-[#5D4E37]" style={{ fontFamily: 'Borel, cursive' }}>hello</span>
            <span className="text-lg font-bold text-[#8B6F47]">ML</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function Sidebar({ onCreateBusiness, activeBusiness, activeSection }: SidebarProps) {
  const { user, signOut } = useApp();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const sidebarContent = (isExpanded: boolean) => (
    <div className="flex flex-col h-full py-4 px-2">
      {/* Logo */}
      <div className="mb-4">
        <LogoMark isExpanded={isExpanded} />
      </div>

      {/* Divider */}
      <div className="h-px bg-[#E8DCC8] mx-2 mb-3" />

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        <SidebarButton
          icon={<Home className="w-[18px] h-[18px]" />}
          label="Home"
          onClick={() => router.push('/dashboard')}
          isActive={!activeBusiness}
          isExpanded={isExpanded}
        />

        <SidebarButton
          icon={<Plus className="w-[18px] h-[18px]" />}
          label="New Business"
          onClick={onCreateBusiness}
          variant="accent"
          isExpanded={isExpanded}
        />

        {/* Business Section Links - Direct, no subtab */}
        {activeBusiness && (
          <>
            <div className="h-px bg-[#E8DCC8] mx-2 my-3" />

            <SidebarLink
              icon={<LayoutGrid className="w-[18px] h-[18px]" />}
              label="Overview"
              href="#overview"
              isActive={activeSection === 'overview'}
              isExpanded={isExpanded}
              tutorialId="overview"
            />
            <SidebarLink
              icon={<Bot className="w-[18px] h-[18px]" />}
              label="Agent"
              href="#agent"
              isActive={activeSection === 'agent'}
              isExpanded={isExpanded}
              tutorialId="agent"
            />
            <SidebarLink
              icon={<PhoneCall className="w-[18px] h-[18px]" />}
              label="Calls"
              href="#calls"
              isActive={activeSection === 'calls'}
              isExpanded={isExpanded}
              tutorialId="calls"
            />
            <SidebarLink
              icon={<FileText className="w-[18px] h-[18px]" />}
              label="Documents"
              href="#documents"
              isActive={activeSection === 'documents'}
              isExpanded={isExpanded}
              tutorialId="documents"
            />
          </>
        )}
      </nav>

      {/* Divider */}
      <div className="h-px bg-[#E8DCC8] mx-2 mb-3" />

      {/* User section */}
      <div className="flex flex-col gap-1">
        <UserAvatar name={user?.user_metadata?.name} isExpanded={isExpanded} />
        <SidebarButton
          icon={<LogOut className="w-[18px] h-[18px]" />}
          label="Logout"
          onClick={handleLogout}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex bg-white border-r border-[#E8DCC8]/50 flex-col fixed left-0 top-0 h-screen z-40"
        initial={{ width: 56 }}
        animate={{ width: isHovered ? 180 : 56 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {sidebarContent(isHovered)}
      </motion.aside>

      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white border border-[#E8DCC8]/50 flex items-center justify-center text-[#5D4E37] shadow-sm"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        className="lg:hidden fixed left-0 top-0 h-screen w-[180px] bg-white border-r border-[#E8DCC8]/50 z-50"
        initial={{ x: -180 }}
        animate={{ x: isMobileOpen ? 0 : -180 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {sidebarContent(true)}
      </motion.aside>
    </>
  );
}
