import Link from 'next/link';
import { Logo } from './Logo';

const productLinks = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Support', href: '/support' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="w-full relative">
      {/* Top separator - gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8DCC8]/60 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#E8DCC8]/10 to-transparent pointer-events-none" />

      <div className="bg-[#F5F3EE]">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20">
          {/* Main Footer Content */}
          <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
            {/* Brand Column - Takes 2 columns on md+ */}
            <div className="col-span-2 pl-4 lg:pl-8">
              <Logo size="small" lightMode />
              <p className="mt-4 text-[#8B6F47]/60 text-sm leading-relaxed max-w-xs">
                AI-powered voice agents that handle customer calls 24/7. Never miss an opportunity.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-[#8B6F47] font-semibold text-sm mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#8B6F47]/50 hover:text-[#8B6F47] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-[#8B6F47] font-semibold text-sm mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#8B6F47]/50 hover:text-[#8B6F47] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-6 border-t border-[#E8DCC8]/30">
            <p className="text-[#8B6F47]/40 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} HelloML. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
