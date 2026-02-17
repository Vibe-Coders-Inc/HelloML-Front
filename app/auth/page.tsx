'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/lib/context';
import { RotatingText } from '@/components/ui/rotating-text';
import { Logo } from '@/components/Logo';
import { authContent, commonContent, validationMessages } from '@/lib/content';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

// Password strength calculator
function getPasswordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: 'Weak' };
  if (score <= 4) return { score: 2, label: 'Medium' };
  return { score: 3, label: 'Strong' };
}

// Minimalist password strength bar
function PasswordStrengthBar({ password }: { password: string }) {
  const { score, label } = getPasswordStrength(password);

  const colors = {
    1: 'bg-red-400',
    2: 'bg-amber-400',
    3: 'bg-emerald-400',
  };

  const widths = {
    1: 'w-1/3',
    2: 'w-2/3',
    3: 'w-full',
  };

  return (
    <div className="mt-2">
      <div className="h-1 bg-[#E8DCC8]/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[score as keyof typeof colors]} ${widths[score as keyof typeof widths]} transition-all duration-500 ease-out rounded-full`}
        />
      </div>
      <p className={`text-xs mt-1 transition-colors duration-300 ${
        score === 1 ? 'text-red-400' : score === 2 ? 'text-amber-500' : 'text-emerald-500'
      }`}>
        {label}
      </p>
    </div>
  );
}

// Input validation state classes - show green border when valid and has value
const getInputValidationClass = (isValid: boolean, value: string) => {
  if (!value) return 'border-[#E8DCC8]';
  return isValid
    ? 'border-emerald-400/60 ring-1 ring-emerald-400/20'
    : 'border-[#E8DCC8]';
};

const loginSchema = z.object({
  email: z.string().email(validationMessages.email.invalid),
  password: z.string().min(6, validationMessages.password.tooShort),
});

const registerSchema = z.object({
  name: z.string().min(2, validationMessages.name.tooShort),
  email: z.string().email(validationMessages.email.invalid),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: validationMessages.confirmPassword.noMatch,
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

function AuthContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mobileView, setMobileView] = useState<'landing' | 'login' | 'register'>('landing');
  const [isMobile, setIsMobile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerPassword, setRegisterPassword] = useState('');
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);
  const { signIn, signUp, signInWithGoogle, isAuthenticated } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set initial tab based on URL query param
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'register') {
      setActiveTab('register');
      setMobileView('register');
    } else if (mode === 'signin' || mode === 'login') {
      setActiveTab('login');
      setMobileView('login');
    }
  }, [searchParams]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleTabChange = (tab: 'login' | 'register') => {
    if (tab !== activeTab) {
      setIsAnimating(true);
      setActiveTab(tab);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');

    try {
      await signIn(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : commonContent.errors.genericError);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');

    try {
      await signUp(data.email, data.password, data.name);
      // Fire Google Ads conversion tracking (old account)
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_location: 'https://www.helloml.app/signup-success',
          page_path: '/signup-success',
          send_to: 'AW-11501080696',
        });
        // Fire Google Ads conversion tracking (new account)
        window.gtag('event', 'conversion', {
          send_to: 'AW-17958638557/dcSMCKWl8fkbEN2nrPNC',
          page_location: 'https://www.helloml.app/signup-success',
          page_path: '/signup-success',
        });
      }
      // Show success message - user needs to verify email
      setError('Check your email to verify your account!');
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : commonContent.errors.genericError);
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    if (provider.toLowerCase() !== 'google') {
      setError(`${provider} authentication coming soon!`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      // OAuth will redirect, no need to manually navigate
    } catch (err) {
      setError(err instanceof Error ? err.message : commonContent.errors.genericError);
      setIsLoading(false);
    }
  };

  // Handle redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  // Helper function for view transitions - subtle fade
  const transitionToView = (view: 'landing' | 'login' | 'register') => {
    setIsViewTransitioning(true);
    setTimeout(() => {
      setMobileView(view);
      setError('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      if (view === 'register') setRegisterPassword('');
      setTimeout(() => setIsViewTransitioning(false), 30);
    }, 120);
  };

  // Mobile Landing View
  if (isMobile && mobileView === 'landing') {
    return (
      <div className={`h-screen bg-gradient-to-br from-[#8B6F47] via-[#A67A5B] to-[#C9B790] flex flex-col relative overflow-hidden transition-all duration-150 ease-out ${isViewTransitioning ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'}`}>
        {/* Background decorations - matching desktop hero */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-36 translate-x-36 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-28 -translate-x-28 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating circles */}
        <div className="absolute top-[15%] left-[12%] w-2 h-2 bg-white/30 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[25%] right-[18%] w-2.5 h-2.5 bg-white/25 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-[45%] left-[8%] w-3 h-3 bg-white/20 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-[55%] right-[10%] w-2 h-2 bg-white/35 rounded-full animate-bounce shadow-md" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
        <div className="absolute top-[70%] left-[20%] w-1.5 h-1.5 bg-white/25 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '5.5s', animationDelay: '2s' }}></div>
        <div className="absolute top-[35%] right-[25%] w-2 h-2 bg-white/20 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5s', animationDelay: '0.8s' }}></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .08) 25%, rgba(255, 255, 255, .08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .08) 75%, rgba(255, 255, 255, .08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .08) 25%, rgba(255, 255, 255, .08) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .08) 75%, rgba(255, 255, 255, .08) 76%, transparent 77%, transparent)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
          <div className="mb-8">
            <Logo size="large" />
          </div>

          <h1 className="text-3xl font-bold text-white text-center leading-tight mb-2">
            {authContent.hero.headline}
          </h1>
          <RotatingText
            phrases={authContent.hero.taglines}
            className="text-white/90 text-3xl font-bold"
          />

          <p className="text-white/60 text-center mt-8 max-w-[280px] text-sm leading-relaxed">
            {authContent.hero.description}
          </p>

          {/* Decorative wave */}
          <svg className="w-32 h-6 mt-6 opacity-30" viewBox="0 0 120 24">
            <path d="M0,12 Q15,4 30,12 T60,12 T90,12 T120,12" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-10 pt-4 space-y-3 relative z-10">
          <Button
            onClick={() => transitionToView('login')}
            className="w-full bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] text-[#8B6F47] hover:opacity-95 font-semibold h-14 rounded-xl shadow-xl transition-all duration-200"
          >
            {commonContent.buttons.signIn}
          </Button>
          <Button
            onClick={() => transitionToView('register')}
            variant="outline"
            className="w-full bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 font-semibold h-14 rounded-xl transition-all duration-200"
          >
            {commonContent.buttons.signUp}
          </Button>
        </div>
      </div>
    );
  }

  // Mobile Login View - uses same styling as desktop card
  if (isMobile && mobileView === 'login') {
    return (
      <div className={`h-screen bg-[#FAF8F3] flex flex-col overflow-hidden relative transition-all duration-150 ease-out ${isViewTransitioning ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'}`}>
        {/* Organic blob shapes - extends across screen */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main large blob - dark brown top-right, extended 80% across */}
          <svg className="absolute -top-20 -right-5 w-[140%] h-[60%]" viewBox="0 0 500 400" preserveAspectRatio="none">
            <path
              d="M500,0 L80,0 Q30,20 50,80 Q90,180 150,220 Q230,270 320,240 Q420,210 500,280 Z"
              fill="#8B6F47"
            />
          </svg>
          {/* Secondary blob - medium brown top-left */}
          <svg className="absolute -top-10 -left-20 w-[80%] h-[55%]" viewBox="0 0 400 350" preserveAspectRatio="none">
            <path
              d="M0,0 L0,200 Q40,280 120,250 Q200,220 240,280 Q260,320 200,350 L0,350 Z"
              fill="#A67A5B"
              opacity="0.85"
            />
          </svg>
          {/* Accent blob - tan/gold flowing down left side */}
          <svg className="absolute top-[15%] -left-10 w-[45%] h-[50%]" viewBox="0 0 200 300" preserveAspectRatio="none">
            <path
              d="M0,0 L0,300 Q40,280 60,220 Q80,160 50,100 Q20,40 0,0 Z"
              fill="#C9B790"
              opacity="0.8"
            />
          </svg>
          {/* Bottom accent blob - full width */}
          <svg className="absolute -bottom-10 left-0 w-full h-[28%]" viewBox="0 0 500 180" preserveAspectRatio="none">
            <path
              d="M0,180 L0,100 Q80,60 180,90 Q300,130 400,80 Q460,50 500,70 L500,180 Z"
              fill="#C9B790"
              opacity="0.5"
            />
          </svg>
          {/* Floating accents */}
          <div className="absolute top-[20%] right-[12%] w-12 h-12 bg-[#E8DCC8] rounded-full opacity-50"></div>
          <div className="absolute top-[35%] left-[8%] w-6 h-6 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-[25%] right-[8%] w-8 h-8 bg-[#A67A5B]/20 rounded-full"></div>
        </div>

        {/* Header with logo */}
        <div className="flex items-center justify-between px-4 pt-8 pb-2 relative z-10">
          <button
            onClick={() => transitionToView('landing')}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="h-10 flex items-center">
            <Logo size="small" />
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Form Card - matches desktop styling */}
        <div className="flex-1 px-5 pb-4 overflow-y-auto relative z-10 flex items-center">
          <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            {/* Header */}
            <div className="text-center pb-5">
              <h1 className="text-xl font-bold text-[#8B6F47] mb-1">{authContent.mobile.login.title}</h1>
              <p className="text-sm text-[#A67A5B]/70">{authContent.mobile.login.subtitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="mobile-login-email" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.email}</Label>
                <Input
                  id="mobile-login-email"
                  type="email"
                  placeholder={authContent.forms.placeholders.email}
                  className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300 ${
                    getInputValidationClass(
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.watch('email') || ''),
                      loginForm.watch('email') || ''
                    )
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('mobile-login-password')?.focus();
                    }
                  }}
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-600">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile-login-password" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.password}</Label>
                <div className="relative">
                  <Input
                    id="mobile-login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={authContent.forms.placeholders.password}
                    className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/40 pr-10 transition-all duration-300 ${
                      getInputValidationClass(
                        (loginForm.watch('password') || '').length >= 6,
                        loginForm.watch('password') || ''
                      )
                    }`}
                    {...loginForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A67A5B]/50 hover:text-[#8B6F47] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-600">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end text-sm">
                <button type="button" className="text-[#8B6F47] font-medium hover:underline">
                  {authContent.mobile.login.forgotPassword}
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? commonContent.buttons.signingIn : commonContent.buttons.signIn}
              </Button>

              {/* Divider */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#E8DCC8]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] px-3 text-[#A67A5B]/50 font-medium">
                    {authContent.socialAuth.divider}
                  </span>
                </div>
              </div>

              {/* Google Auth */}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialAuth('Google')}
                disabled={isLoading}
                className="w-full bg-[#FAF8F3] border-[#E8DCC8] hover:border-[#A67A5B] hover:bg-white rounded-xl h-11 transition-all duration-300 text-[#8B6F47]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2 text-sm">Continue with Google</span>
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-[#A67A5B]/70 pt-1">
                {authContent.mobile.login.noAccount}{' '}
                <button
                  type="button"
                  onClick={() => transitionToView('register')}
                  className="text-[#8B6F47] font-semibold hover:underline"
                >
                  {authContent.mobile.login.signUp}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Register View - uses same styling as desktop card
  if (isMobile && mobileView === 'register') {
    return (
      <div className={`h-screen bg-[#FAF8F3] flex flex-col overflow-hidden relative transition-all duration-150 ease-out ${isViewTransitioning ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'}`}>
        {/* Organic blob shapes - mirrored variation, extends across screen */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main large blob - dark brown top-left, extended 80% across */}
          <svg className="absolute -top-20 -left-5 w-[140%] h-[60%]" viewBox="0 0 500 400" preserveAspectRatio="none">
            <path
              d="M0,0 L420,0 Q470,20 450,80 Q410,180 350,220 Q270,270 180,240 Q80,210 0,280 Z"
              fill="#8B6F47"
            />
          </svg>
          {/* Secondary blob - medium brown top-right */}
          <svg className="absolute -top-10 -right-20 w-[80%] h-[55%]" viewBox="0 0 400 350" preserveAspectRatio="none">
            <path
              d="M400,0 L400,200 Q360,280 280,250 Q200,220 160,280 Q140,320 200,350 L400,350 Z"
              fill="#A67A5B"
              opacity="0.85"
            />
          </svg>
          {/* Accent blob - tan/gold flowing down right side */}
          <svg className="absolute top-[15%] -right-10 w-[45%] h-[50%]" viewBox="0 0 200 300" preserveAspectRatio="none">
            <path
              d="M200,0 L200,300 Q160,280 140,220 Q120,160 150,100 Q180,40 200,0 Z"
              fill="#C9B790"
              opacity="0.8"
            />
          </svg>
          {/* Bottom accent blob - full width */}
          <svg className="absolute -bottom-10 left-0 w-full h-[28%]" viewBox="0 0 500 180" preserveAspectRatio="none">
            <path
              d="M0,180 L0,100 Q80,60 180,90 Q300,130 400,80 Q460,50 500,70 L500,180 Z"
              fill="#C9B790"
              opacity="0.5"
            />
          </svg>
          {/* Floating accents */}
          <div className="absolute top-[20%] left-[12%] w-12 h-12 bg-[#E8DCC8] rounded-full opacity-50"></div>
          <div className="absolute top-[35%] right-[8%] w-6 h-6 bg-white/30 rounded-full"></div>
          <div className="absolute bottom-[25%] left-[8%] w-8 h-8 bg-[#A67A5B]/20 rounded-full"></div>
        </div>

        {/* Header with logo */}
        <div className="flex items-center justify-between px-4 pt-8 pb-2 relative z-10">
          <button
            onClick={() => transitionToView('landing')}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="h-10 flex items-center">
            <Logo size="small" />
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Form Card - matches desktop styling */}
        <div className="flex-1 px-5 pb-4 overflow-y-auto relative z-10 flex items-center">
          <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            {/* Header */}
            <div className="text-center pb-4">
              <h1 className="text-xl font-bold text-[#8B6F47] mb-1">{authContent.mobile.register.title}</h1>
              <p className="text-sm text-[#A67A5B]/70">{authContent.mobile.register.subtitle}</p>
            </div>

            {/* Form */}
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="mobile-register-name" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.name}</Label>
                <Input
                  id="mobile-register-name"
                  type="text"
                  placeholder={authContent.forms.placeholders.name}
                  className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300 ${
                    getInputValidationClass(
                      (registerForm.watch('name') || '').length >= 2,
                      registerForm.watch('name') || ''
                    )
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('mobile-register-email')?.focus();
                    }
                  }}
                  {...registerForm.register('name')}
                />
                {registerForm.formState.errors.name && (
                  <p className="text-xs text-red-600">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile-register-email" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.email}</Label>
                <Input
                  id="mobile-register-email"
                  type="email"
                  placeholder={authContent.forms.placeholders.email}
                  className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300 ${
                    getInputValidationClass(
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.watch('email') || ''),
                      registerForm.watch('email') || ''
                    )
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('mobile-register-password')?.focus();
                    }
                  }}
                  {...registerForm.register('email')}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-xs text-red-600">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile-register-password" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.password}</Label>
                <div className="relative">
                  <Input
                    id="mobile-register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/40 pr-10 transition-all duration-300"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('mobile-register-confirm')?.focus();
                      }
                    }}
                    {...registerForm.register('password', {
                      onChange: (e) => setRegisterPassword(e.target.value)
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A67A5B]/50 hover:text-[#8B6F47] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Bar */}
                {registerPassword.length > 0 && (
                  <PasswordStrengthBar password={registerPassword} />
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile-register-confirm" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.confirmPassword}</Label>
                <div className="relative">
                  <Input
                    id="mobile-register-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-12 text-[#8B6F47] placeholder:text-[#A67A5B]/40 pr-10 transition-all duration-300 ${
                      getInputValidationClass(
                        (registerForm.watch('confirmPassword') || '') === registerPassword && registerPassword.length > 0,
                        registerForm.watch('confirmPassword') || ''
                      )
                    }`}
                    {...registerForm.register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A67A5B]/50 hover:text-[#8B6F47] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? commonContent.buttons.creatingAccount : commonContent.buttons.createAccount}
              </Button>

              {/* Divider */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#E8DCC8]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] px-3 text-[#A67A5B]/50 font-medium">
                    {authContent.socialAuth.divider}
                  </span>
                </div>
              </div>

              {/* Google Auth */}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialAuth('Google')}
                disabled={isLoading}
                className="w-full bg-[#FAF8F3] border-[#E8DCC8] hover:border-[#A67A5B] hover:bg-white rounded-xl h-11 transition-all duration-300 text-[#8B6F47]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2 text-sm">Continue with Google</span>
              </Button>

              {/* Terms + Sign In Link combined */}
              <div className="text-center space-y-1 pt-1">
                <p className="text-xs text-[#A67A5B]/50">
                  By continuing you agree to our{' '}
                  <Link href="/terms" className="text-[#8B6F47] hover:underline">Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#8B6F47] hover:underline">Privacy</Link>
                </p>
                <p className="text-sm text-[#A67A5B]/70">
                  {authContent.mobile.register.hasAccount}{' '}
                  <button
                    type="button"
                    onClick={() => transitionToView('login')}
                    className="text-[#8B6F47] font-semibold hover:underline"
                  >
                    {authContent.mobile.register.signIn}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Desktop View (default)
  return (
    <div className="min-h-screen lg:min-h-screen bg-gradient-to-br from-[#E8DCC8] to-[#C9B790] flex flex-col lg:flex-row relative">
      {/* Hero Section - 60% on desktop */}
      <div className="hidden lg:flex w-full lg:w-[60%] bg-gradient-to-br from-[#8B6F47] via-[#A67A5B] to-[#C9B790] text-white flex-col justify-center items-center relative overflow-hidden min-h-screen">
        {/* Animated decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating animated circles */}
        <div className="absolute top-[15%] left-[10%] w-3 h-3 bg-white/30 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-white/25 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-[55%] left-[15%] w-4 h-4 bg-white/20 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        <div className="absolute top-[70%] left-[25%] w-2.5 h-2.5 bg-white/35 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-[40%] right-[15%] w-3 h-3 bg-white/25 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
        <div className="absolute top-[60%] right-[10%] w-2 h-2 bg-white/30 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5s', animationDelay: '2.5s' }}></div>
        <div className="absolute top-[20%] right-[20%] w-3.5 h-3.5 bg-white/20 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '6.5s', animationDelay: '0.8s' }}></div>
        <div className="absolute top-[80%] left-[35%] w-2 h-2 bg-white/25 rounded-full animate-bounce shadow-md" style={{ animationDuration: '4.8s', animationDelay: '1.2s' }}></div>
        <div className="absolute top-[45%] left-[30%] w-2.5 h-2.5 bg-white/30 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '5.2s', animationDelay: '2.8s' }}></div>
        <div className="absolute top-[10%] right-[25%] w-3 h-3 bg-white/20 rounded-full animate-bounce shadow-md" style={{ animationDuration: '6.2s', animationDelay: '1.8s' }}></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="w-full max-w-3xl px-16 relative z-10 text-center flex flex-col items-center justify-center">
          {/* HelloML Logo */}
          <div className="mb-8">
            <Logo size="hero" />
          </div>
          <h1 className="text-7xl font-bold mb-6 leading-tight">
            {authContent.hero.headline}
          </h1>
          <div>
            <RotatingText
              phrases={authContent.hero.taglines}
              className="text-[#FAF8F3] drop-shadow-lg text-7xl"
            />
          </div>
          <p className="text-2xl text-white/80 mb-12 leading-relaxed font-light">
            {authContent.hero.description}
          </p>

          {/* Decorative element */}
          <div className="mt-8">
            <svg width="400" height="80" viewBox="0 0 400 80" className="opacity-30 mx-auto">
              <path
                d="M0,40 Q50,10 100,40 T200,40 T300,40 T400,40"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Auth Section - centered on desktop */}
      <div className="w-full lg:w-[40%] min-h-screen flex flex-col justify-center items-center px-10 py-0 bg-gradient-to-br from-[#E8DCC8] to-[#C9B790] lg:bg-transparent">
        {/* Floating Card */}
        <div className="w-full max-w-md mx-auto bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <Logo size="large" lightMode />
            </div>
            <h2 className="text-2xl font-bold text-[#8B6F47] mb-2">{authContent.card.title}</h2>
            <p className="text-[#A67A5B]/70">
              {authContent.card.description}
            </p>
          </div>

          {/* Custom Animated Tabs - Sliding Switch */}
          <div className="mb-6">
            <div className="relative grid grid-cols-2 gap-2 p-1 bg-[#E8DCC8] rounded-xl">
              {/* Sliding indicator */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-md transition-all duration-300 ease-out ${
                  activeTab === 'login' ? 'left-1' : 'left-[calc(50%+2px)]'
                }`}
              />
              <button
                onClick={() => handleTabChange('login')}
                className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 relative z-10 ${
                  activeTab === 'login'
                    ? 'text-[#8B6F47]'
                    : 'text-[#A67A5B]/60 hover:text-[#8B6F47]'
                }`}
              >
                {authContent.tabs.login}
              </button>
              <button
                onClick={() => handleTabChange('register')}
                className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 relative z-10 ${
                  activeTab === 'register'
                    ? 'text-[#8B6F47]'
                    : 'text-[#A67A5B]/60 hover:text-[#8B6F47]'
                }`}
              >
                {authContent.tabs.register}
              </button>
            </div>
          </div>

          {/* Animated Content Container - Sliding effect */}
          <div className="relative overflow-hidden">
            <div
              className={`transition-all duration-300 ease-in-out ${
                isAnimating
                  ? activeTab === 'register'
                    ? 'opacity-0 -translate-x-8'
                    : 'opacity-0 translate-x-8'
                  : 'opacity-100 translate-x-0'
              }`}
              key={activeTab}
            >
              {activeTab === 'login' ? (
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.email}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder={authContent.forms.placeholders.email}
                      className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300 ${
                        getInputValidationClass(
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.watch('email') || ''),
                          loginForm.watch('email') || ''
                        )
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          document.getElementById('login-password')?.focus();
                        }
                      }}
                      {...loginForm.register('email')}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-red-600">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.password}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder={authContent.forms.placeholders.password}
                      className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300 ${
                        getInputValidationClass(
                          (loginForm.watch('password') || '').length >= 6,
                          loginForm.watch('password') || ''
                        )
                      }`}
                      {...loginForm.register('password')}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-red-600">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
                  )}

                  <Button type="submit" className="w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
                    {isLoading ? commonContent.buttons.signingIn : commonContent.buttons.signIn}
                  </Button>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.name}</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder={authContent.forms.placeholders.name}
                      className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300 ${
                        getInputValidationClass(
                          (registerForm.watch('name') || '').length >= 2,
                          registerForm.watch('name') || ''
                        )
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          document.getElementById('register-email')?.focus();
                        }
                      }}
                      {...registerForm.register('name')}
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-xs text-red-600">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.email}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder={authContent.forms.placeholders.email}
                      className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300 ${
                        getInputValidationClass(
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.watch('email') || ''),
                          registerForm.watch('email') || ''
                        )
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          document.getElementById('register-password')?.focus();
                        }
                      }}
                      {...registerForm.register('email')}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-xs text-red-600">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.password}</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder={authContent.forms.placeholders.createPassword}
                      className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          document.getElementById('register-confirm')?.focus();
                        }
                      }}
                      {...registerForm.register('password', {
                        onChange: (e) => setRegisterPassword(e.target.value)
                      })}
                    />
                    {/* Password Strength Bar */}
                    {registerPassword.length > 0 && (
                      <PasswordStrengthBar password={registerPassword} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.confirmPassword}</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder={authContent.forms.placeholders.confirmPassword}
                      className={`bg-[#FAF8F3] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/20 rounded-xl h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40 transition-all duration-300 ${
                        getInputValidationClass(
                          (registerForm.watch('confirmPassword') || '') === registerPassword && registerPassword.length > 0,
                          registerForm.watch('confirmPassword') || ''
                        )
                      }`}
                      {...registerForm.register('confirmPassword')}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-red-600">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
                  )}

                  <Button type="submit" className="w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
                    {isLoading ? commonContent.buttons.creatingAccount : commonContent.buttons.createAccount}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Social Auth Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E8DCC8]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] px-3 text-[#A67A5B]/50 font-medium">
                  {authContent.socialAuth.divider}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <Button
                variant="outline"
                onClick={() => handleSocialAuth('Google')}
                disabled={isLoading}
                className="w-full bg-[#FAF8F3] border-[#E8DCC8] hover:border-[#A67A5B] hover:bg-white hover:text-[#8B6F47] rounded-xl h-12 transition-all duration-300 text-[#8B6F47]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Continue with Google</span>
              </Button>
            </div>
          </div>

          <p className="mt-5 text-xs text-center text-[#A67A5B]/50">
            By continuing you agree to our{' '}
            <Link href="/terms" className="text-[#8B6F47] hover:underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-[#8B6F47] hover:underline">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
