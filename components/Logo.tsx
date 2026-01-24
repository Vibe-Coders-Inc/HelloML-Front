'use client';

import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

type LogoSize = 'small' | 'medium' | 'large' | 'hero' | 'responsive-hero' | 'responsive-card';

interface LogoProps {
  size?: LogoSize;
  lightMode?: boolean;
}

const sizeConfig = {
  small: {
    text: 'text-3xl',
    phone: { container: 'w-8 h-8 -translate-y-1', icon: 'w-4 h-4' },
    spacing: 'space-x-2',
    mlSpacing: 'ml-1.5',
  },
  medium: {
    text: 'text-4xl',
    phone: { container: 'w-10 h-10 -translate-y-1', icon: 'w-5 h-5' },
    spacing: 'space-x-2',
    mlSpacing: 'ml-2',
  },
  large: {
    text: 'text-5xl',
    phone: { container: 'w-10 h-10 -translate-y-1.5', icon: 'w-5 h-5' },
    spacing: 'space-x-3',
    mlSpacing: 'ml-3',
  },
  hero: {
    text: 'text-7xl',
    phone: { container: 'w-14 h-14 -translate-y-2', icon: 'w-7 h-7' },
    spacing: 'space-x-4',
    mlSpacing: 'ml-4',
  },
  'responsive-hero': {
    text: 'text-5xl md:text-6xl lg:text-7xl',
    phone: { container: 'w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14', icon: 'w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7' },
    spacing: 'space-x-2 md:space-x-3 lg:space-x-4',
    mlSpacing: 'ml-2 md:ml-3 lg:ml-4',
  },
  'responsive-card': {
    text: 'text-3xl sm:text-4xl md:text-5xl',
    phone: { container: 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10', icon: 'w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5' },
    spacing: 'space-x-2 sm:space-x-2 md:space-x-3',
    mlSpacing: 'ml-1.5 sm:ml-2 md:ml-3',
  },
};

export function Logo({ size = 'medium', lightMode = false }: LogoProps) {
  const [hasRung, setHasRung] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasRung(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const config = sizeConfig[size];
  const textColor = lightMode ? 'text-[#8B6F47]' : 'text-white';
  const mlColor = lightMode ? 'text-[#A67A5B]' : 'text-white/95';
  const phoneContainerBg = lightMode
    ? 'bg-gradient-to-br from-[#8B6F47] to-[#A67A5B]'
    : 'bg-white/20 border-2 border-white/30';
  const phoneIconColor = 'text-white';

  const ringAnimation = !hasRung ? {
    animation: 'phone-ring 0.5s ease-in-out 3'
  } : {};

  return (
    <div className={`flex items-center ${config.spacing}`}>
      <h2 className={`${config.text} tracking-wider leading-none my-0`}>
        <span className={textColor} style={{ fontFamily: 'Borel, cursive' }}>
          hello
        </span>
        <span className={`font-bold ${mlColor} ${config.mlSpacing}`}>ML</span>
      </h2>
      <div
        className={`${config.phone.container} ${phoneContainerBg} rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-2xl`}
        style={ringAnimation}
      >
        <Phone className={`${config.phone.icon} ${phoneIconColor}`} strokeWidth={2.5} />
      </div>
    </div>
  );
}
