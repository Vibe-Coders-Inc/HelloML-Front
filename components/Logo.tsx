import { Phone } from 'lucide-react';

type LogoSize = 'small' | 'medium' | 'large' | 'hero';

interface LogoProps {
  size?: LogoSize;
  lightMode?: boolean;
}

const sizeConfig = {
  small: {
    text: 'text-3xl',
    phone: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    spacing: 'space-x-2',
  },
  medium: {
    text: 'text-4xl',
    phone: { container: 'w-10 h-10', icon: 'w-5 h-5' },
    spacing: 'space-x-2',
  },
  large: {
    text: 'text-5xl',
    phone: { container: 'w-10 h-10', icon: 'w-5 h-5' },
    spacing: 'space-x-3',
  },
  hero: {
    text: 'text-7xl',
    phone: { container: 'w-14 h-14', icon: 'w-7 h-7' },
    spacing: 'space-x-4',
  },
};

export function Logo({ size = 'medium', lightMode = false }: LogoProps) {
  const config = sizeConfig[size];
  const textColor = lightMode ? 'text-[#8B6F47]' : 'text-white';
  const mlColor = lightMode ? 'text-[#A67A5B]' : 'text-white/95';
  const phoneContainerBg = lightMode
    ? 'bg-gradient-to-br from-[#8B6F47] to-[#A67A5B]'
    : 'bg-white/20 border-2 border-white/30';
  const phoneIconColor = 'text-white';

  return (
    <div className={`flex items-center ${config.spacing}`}>
      <h2 className={`${config.text} tracking-wider`}>
        <span className={textColor} style={{ fontFamily: 'Borel, cursive' }}>
          hello
        </span>
        <span className={`font-bold ${mlColor} ml-2`}>ML</span>
      </h2>
      <div
        className={`${config.phone.container} ${phoneContainerBg} rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-2xl animate-pulse`}
        style={{ animationDuration: '3s' }}
      >
        <Phone className={`${config.phone.icon} ${phoneIconColor}`} strokeWidth={2.5} />
      </div>
    </div>
  );
}
