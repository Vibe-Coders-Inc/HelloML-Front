'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/lib/context';
import { Logo } from '@/components/Logo';
import { authContent, commonContent, validationMessages } from '@/lib/content';
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
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

function PasswordStrengthBar({ password }: { password: string }) {
  const { score, label } = getPasswordStrength(password);
  const colors = { 1: 'bg-red-400', 2: 'bg-amber-400', 3: 'bg-emerald-400' };
  const widths = { 1: 'w-1/3', 2: 'w-2/3', 3: 'w-full' };

  return (
    <div className="mt-2">
      <div className="h-1 bg-[#E8DCC8]/30 rounded-full overflow-hidden">
        <div className={`h-full ${colors[score as keyof typeof colors]} ${widths[score as keyof typeof widths]} transition-all duration-500 ease-out rounded-full`} />
      </div>
      <p className={`text-xs mt-1 ${score === 1 ? 'text-red-400' : score === 2 ? 'text-amber-500' : 'text-emerald-500'}`}>
        {label}
      </p>
    </div>
  );
}

// Gentle floating orb for the left panel
function FloatingOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 380;
    canvas.width = size;
    canvas.height = size;
    let animId: number;
    const center = size / 2;
    const baseRadius = 130;

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);

      // Slow breathing scale
      const breath = 1 + Math.sin(t * 0.0008) * 0.04;
      const r = baseRadius * breath;

      // Main sphere gradient
      const grad = ctx.createRadialGradient(
        center - r * 0.25, center - r * 0.25, r * 0.05,
        center, center, r
      );
      grad.addColorStop(0, 'rgba(245, 235, 215, 1.0)');     // bright warm white
      grad.addColorStop(0.3, 'rgba(220, 195, 155, 0.9)');   // warm gold
      grad.addColorStop(0.6, 'rgba(180, 145, 100, 0.6)');   // mid brown
      grad.addColorStop(1, 'rgba(139, 111, 71, 0.0)');

      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Drifting highlight
      const hx = center + Math.cos(t * 0.0004) * r * 0.3;
      const hy = center + Math.sin(t * 0.0006) * r * 0.25;
      const hGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.5);
      hGrad.addColorStop(0, 'rgba(255, 252, 245, 0.5)');
      hGrad.addColorStop(1, 'rgba(255, 252, 245, 0.0)');
      ctx.beginPath();
      ctx.arc(center, center, r, 0, Math.PI * 2);
      ctx.fillStyle = hGrad;
      ctx.fill();

      // Outer glow
      const glowR = r + 30 + Math.sin(t * 0.001) * 8;
      const glow = ctx.createRadialGradient(center, center, r * 0.8, center, center, glowR);
      glow.addColorStop(0, 'rgba(220, 200, 165, 0.0)');
      glow.addColorStop(0.5, 'rgba(220, 200, 165, 0.12)');
      glow.addColorStop(1, 'rgba(220, 200, 165, 0.0)');
      ctx.beginPath();
      ctx.arc(center, center, glowR, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      animId = requestAnimationFrame(() => draw(performance.now()));
    }

    draw(performance.now());
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[380px] h-[380px]"
      style={{ imageRendering: 'auto' }}
    />
  );
}

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

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function AuthContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const { signIn, signUp, signInWithGoogle, isAuthenticated } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'register') {
      setActiveTab('register');
    } else if (mode === 'signin' || mode === 'login') {
      setActiveTab('login');
    }
  }, [searchParams]);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (tab === 'register') { setRegisterPassword(''); setRegisterStep(1); }
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
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('set', 'user_data', {
          email: data.email,
        });
        window.gtag('event', 'conversion', {
          send_to: 'AW-17958638557/dcSMCKWl8fkbEN2nrPNC',
        });
      }
      setError('Check your email to verify your account!');
    } catch (err) {
      setError(err instanceof Error ? err.message : commonContent.errors.genericError);
    } finally {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : commonContent.errors.genericError);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF8F3]">
      {/* Left branding panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        {/* Warm mid-brown base — visible contrast without going too dark */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6B5540] via-[#7A6350] to-[#5C4735]" />

        {/* Subtle warm glow accents */}
        <div className="absolute top-[15%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#8B6F47]/15 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#A67A5B]/10 blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
          {/* Logo */}
          <Link href="/" className="inline-flex hover:opacity-80 transition-opacity">
            <Logo size="small" />
          </Link>

          {/* Center: Orb + tagline */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <FloatingOrb />
            <h2 className="mt-10 text-4xl xl:text-5xl font-bold text-[#FAF8F3] tracking-tight text-center leading-tight">
              AI that{' '}
              <span style={{ fontFamily: 'Borel, cursive' }} className="text-[#DCC8A0]">
                answers
              </span>
              <br />
              your phone.
            </h2>
            <p className="mt-5 text-lg text-[#D4C4A8]/50 text-center max-w-sm leading-relaxed">
              Set up a voice agent in minutes. No code, no complexity.
            </p>
          </div>

          {/* Bottom spacer */}
          <div />
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top nav bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5">
          <Link href="/" className="inline-flex items-center gap-2 text-[#8B6F47]/70 hover:text-[#8B6F47] transition-colors text-sm font-medium group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden hover:opacity-80 transition-opacity">
            <Logo size="small" lightMode />
          </Link>
          {/* Tab switch link */}
          <p className="text-sm text-[#A67A5B]/60">
            {activeTab === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => switchTab(activeTab === 'login' ? 'register' : 'login')}
              className="text-[#8B6F47] font-semibold hover:underline underline-offset-2"
            >
              {activeTab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 pb-10">
          <div className="w-full max-w-[400px]">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2E1F] tracking-tight">
                {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="mt-2 text-[#A67A5B]/70 text-sm sm:text-base">
                {activeTab === 'login'
                  ? 'Enter your credentials to access your dashboard'
                  : 'Get started with your first voice agent in minutes'}
              </p>
            </div>

            {/* Google OAuth - always on top */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialAuth('Google')}
              disabled={isLoading}
              className="w-full h-12 rounded-xl border-[#E8DCC8] bg-white hover:bg-[#FAF8F3] hover:border-[#C9B790] text-[#3D2E1F] font-medium transition-all duration-200 shadow-sm"
            >
              <GoogleIcon />
              <span className="ml-3">Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8DCC8]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-[#FAF8F3] px-4 text-[#A67A5B]/50 font-medium">
                  or
                </span>
              </div>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-[#3D2E1F] font-medium text-sm">
                    {authContent.forms.labels.email}
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder={authContent.forms.placeholders.email}
                    className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] transition-all"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('login-password')?.focus(); } }}
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="login-password" className="text-[#3D2E1F] font-medium text-sm">
                    {authContent.forms.labels.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={authContent.forms.placeholders.password}
                      className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] pr-11 transition-all"
                      {...loginForm.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9B790] hover:text-[#8B6F47] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                {error && (
                  <div className={`text-sm p-3 rounded-xl border ${
                    error.includes('verify') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-[#8B6F47] hover:bg-[#7A6140] text-white font-semibold shadow-md shadow-[#8B6F47]/20 hover:shadow-lg hover:shadow-[#8B6F47]/25 transition-all duration-200"
                >
                  {isLoading ? commonContent.buttons.signingIn : commonContent.buttons.signIn}
                </Button>
              </form>
            )}

            {/* Register Form - Step 1 */}
            {activeTab === 'register' && registerStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="register-name" className="text-[#3D2E1F] font-medium text-sm">
                    {authContent.forms.labels.name}
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder={authContent.forms.placeholders.name}
                    className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] transition-all"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('register-email')?.focus(); } }}
                    {...registerForm.register('name')}
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-red-500">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-email" className="text-[#3D2E1F] font-medium text-sm">
                    {authContent.forms.labels.email}
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder={authContent.forms.placeholders.email}
                    className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] transition-all"
                    {...registerForm.register('email')}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-xs text-red-500">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                {error && (
                  <div className="text-sm p-3 rounded-xl bg-red-50 border border-red-200 text-red-600">
                    {error}
                  </div>
                )}

                {/* Step indicator */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-1 flex-1 rounded-full bg-[#8B6F47]" />
                  <div className="h-1 flex-1 rounded-full bg-[#E8DCC8]" />
                </div>

                <Button
                  type="button"
                  onClick={async () => {
                    const valid = await registerForm.trigger(['name', 'email']);
                    if (valid) { setRegisterStep(2); setError(''); }
                  }}
                  className="w-full h-12 rounded-xl bg-[#8B6F47] hover:bg-[#7A6140] text-white font-semibold shadow-md shadow-[#8B6F47]/20 hover:shadow-lg transition-all duration-200 group"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            )}

            {/* Register Form - Step 2 */}
            {activeTab === 'register' && registerStep === 2 && (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="register-password" className="text-[#3D2E1F] font-medium text-sm">
                    {authContent.forms.labels.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] pr-11 transition-all"
                      {...registerForm.register('password', {
                        onChange: (e) => setRegisterPassword(e.target.value)
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9B790] hover:text-[#8B6F47] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerPassword.length > 0 && <PasswordStrengthBar password={registerPassword} />}
                  {registerForm.formState.errors.password && (
                    <p className="text-xs text-red-500">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="register-confirm" className="text-[#3D2E1F] font-medium text-sm">
                    {authContent.forms.labels.confirmPassword}
                  </Label>
                  <div className="relative">
                    <Input
                      id="register-confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] pr-11 transition-all"
                      {...registerForm.register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9B790] hover:text-[#8B6F47] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {error && (
                  <div className={`text-sm p-3 rounded-xl border ${
                    error.includes('verify') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
                  }`}>
                    {error}
                  </div>
                )}

                {/* Step indicator */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-1 flex-1 rounded-full bg-[#8B6F47]" />
                  <div className="h-1 flex-1 rounded-full bg-[#8B6F47]" />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRegisterStep(1)}
                    className="h-12 px-4 rounded-xl border-[#E8DCC8] text-[#8B6F47] hover:bg-[#F5EFE6] hover:text-[#8B6F47] transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl bg-[#8B6F47] hover:bg-[#7A6140] text-white font-semibold shadow-md shadow-[#8B6F47]/20 hover:shadow-lg transition-all duration-200"
                  >
                    {isLoading ? commonContent.buttons.creatingAccount : commonContent.buttons.createAccount}
                  </Button>
                </div>
              </form>
            )}

            {/* Legal */}
            <p className="mt-6 text-xs text-center text-[#A67A5B]/40 leading-relaxed">
              By continuing you agree to our{' '}
              <Link href="/terms" className="text-[#8B6F47]/60 hover:text-[#8B6F47] underline underline-offset-2">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#8B6F47]/60 hover:text-[#8B6F47] underline underline-offset-2">Privacy Policy</Link>
            </p>
          </div>
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
