'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Plus, LogOut, Menu, X, Phone } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/lib/context';

interface SidebarProps {
  onCreateBusiness: () => void;
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
        relative overflow-hidden flex items-center gap-3 transition-all duration-300
        ${isExpanded ? 'w-full px-3' : 'w-12 justify-center'}
        h-12 rounded-2xl
        ${variant === 'accent'
          ? 'bg-gradient-to-r from-[#8B6F47] to-[#A67A5B] text-white shadow-lg shadow-[#8B6F47]/20'
          : isActive
            ? 'bg-[#8B6F47]/10 text-[#8B6F47]'
            : 'text-[#8B6F47]/50 hover:text-[#8B6F47] hover:bg-[#8B6F47]/5'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      title={!isExpanded ? label : undefined}
    >
      {/* Shine effect for accent buttons */}
      {variant === 'accent' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          initial={{ x: '-200%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}
      <span className="relative z-10 flex-shrink-0">{icon}</span>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            className="relative z-10 text-sm font-medium whitespace-nowrap"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
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
    <motion.div
      className={`
        flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#E8DCC8] to-[#D8CBA9] cursor-pointer
        ${isExpanded ? 'w-full px-3 h-12' : 'w-12 h-12 justify-center'}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-8 h-8 rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold text-[#8B6F47]">{initials}</span>
      </div>
      <AnimatePresence>
        {isExpanded && name && (
          <motion.span
            className="text-sm font-medium text-[#8B6F47] truncate"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function LogoFull({ isExpanded }: { isExpanded: boolean }) {
  const router = useRouter();

  return (
    <motion.button
      className={`
        flex items-start gap-3 rounded-2xl transition-all duration-300
        ${isExpanded ? 'w-full px-3 h-14' : 'w-12 h-12 justify-center'}
      `}
      onClick={() => router.push('/')}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B6F47] to-[#A67A5B] flex items-center justify-center shadow-lg shadow-[#8B6F47]/20 flex-shrink-0">
        <Phone className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="flex items-baseline gap-1 overflow-hidden"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-2xl text-[#8B6F47]" style={{ fontFamily: 'Borel, cursive' }}>hello</span>
            <span className="text-2xl font-bold text-[#A67A5B]">ML</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function Sidebar({ onCreateBusiness }: SidebarProps) {
  const { user, signOut } = useApp();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth');
  };

  const sidebarContent = (isExpanded: boolean) => (
    <div className="flex flex-col h-full pt-10 pb-6 px-3">
      {/* Logo */}
      <div className="mb-6">
        <LogoFull isExpanded={isExpanded} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8DCC8] to-transparent mb-4" />

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 flex-1">
        <SidebarButton
          icon={<Home className="w-5 h-5" />}
          label="Home"
          onClick={() => router.push('/dashboard')}
          isActive
          isExpanded={isExpanded}
        />
        <SidebarButton
          icon={<Plus className="w-5 h-5" />}
          label="New Business"
          onClick={onCreateBusiness}
          variant="accent"
          isExpanded={isExpanded}
        />
      </nav>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8DCC8] to-transparent mb-4" />

      {/* User section */}
      <div className="flex flex-col space-y-2">
        <UserAvatar name={user?.user_metadata?.name} isExpanded={isExpanded} />
        <SidebarButton
          icon={<LogOut className="w-5 h-5" />}
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
        className="hidden lg:flex bg-white/70 backdrop-blur-xl border-r border-[#E8DCC8]/30 flex-col fixed left-0 top-0 h-screen z-40"
        initial={{ width: 72 }}
        animate={{ width: isHovered ? 200 : 72 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {sidebarContent(isHovered)}
      </motion.aside>

      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-5 left-5 z-50 w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#E8DCC8]/30 flex items-center justify-center text-[#8B6F47] shadow-lg shadow-black/5"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        className="lg:hidden fixed left-0 top-0 h-screen w-[200px] bg-white/95 backdrop-blur-xl border-r border-[#E8DCC8]/30 z-50"
        initial={{ x: -200 }}
        animate={{ x: isMobileOpen ? 0 : -200 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {sidebarContent(true)}
      </motion.aside>
    </>
  );
}
