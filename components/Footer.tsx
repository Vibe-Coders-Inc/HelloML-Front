import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-[#D8CBA9]/40 bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="text-center space-y-3">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo size="small" lightMode />
          </div>

          {/* Description */}
          <p className="text-[#8B6F47] text-sm font-medium">
            Provision AI voice agents in minutes.
          </p>

          {/* Navigation Links */}
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="text-[#A67A5B] hover:text-[#8B6F47] transition-colors text-xs font-medium"
            >
              Product
            </a>
            <a
              href="#"
              className="text-[#A67A5B] hover:text-[#8B6F47] transition-colors text-xs font-medium"
            >
              Documentation
            </a>
            <a
              href="#"
              className="text-[#A67A5B] hover:text-[#8B6F47] transition-colors text-xs font-medium"
            >
              Support
            </a>
            <a
              href="#"
              className="text-[#A67A5B] hover:text-[#8B6F47] transition-colors text-xs font-medium"
            >
              Company
            </a>
          </div>

          {/* Copyright */}
          <p className="text-[#A67A5B] text-xs pt-2">
            © {new Date().getFullYear()} HelloML. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
