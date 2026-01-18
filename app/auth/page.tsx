'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/context';
import { RotatingText } from '@/components/ui/rotating-text';
import { Logo } from '@/components/Logo';
import { authContent, commonContent, validationMessages } from '@/lib/content';

const loginSchema = z.object({
  email: z.string().email(validationMessages.email.invalid),
  password: z.string().min(6, validationMessages.password.tooShort),
});

const registerSchema = z.object({
  name: z.string().min(2, validationMessages.name.tooShort),
  email: z.string().email(validationMessages.email.invalid),
  password: z.string().min(6, validationMessages.password.tooShort),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: validationMessages.confirmPassword.noMatch,
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp, signInWithGoogle, isAuthenticated } = useApp();
  const router = useRouter();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8DCC8] to-[#C9B790] flex flex-col lg:flex-row relative">
      {/* Mobile/Tablet Hero Header - visible below lg breakpoint */}
      <div className="lg:hidden bg-gradient-to-br from-[#8B6F47] via-[#A67A5B] to-[#C9B790] text-white py-6 sm:py-8 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 blur-2xl"></div>

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Logo size="responsive-hero" />
          </div>
          <p className="text-sm sm:text-base text-white/80 max-w-md mx-auto">
            {authContent.hero.description}
          </p>
        </div>
      </div>

      {/* Left Hero Section - 60% width, desktop only */}
      <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-[#8B6F47] via-[#A67A5B] to-[#C9B790] text-white flex-col justify-center items-center relative overflow-hidden">
        {/* Animated decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-40 -translate-x-40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating animated circles - multiple dots at different positions */}
        <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-white/30 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[35%] left-[25%] w-2 h-2 bg-white/25 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-[60%] left-[20%] w-4 h-4 bg-white/20 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        <div className="absolute top-[75%] left-[30%] w-2.5 h-2.5 bg-white/35 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-[45%] right-[20%] w-3 h-3 bg-white/25 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
        <div className="absolute top-[65%] right-[15%] w-2 h-2 bg-white/30 rounded-full animate-bounce shadow-md" style={{ animationDuration: '5s', animationDelay: '2.5s' }}></div>
        <div className="absolute top-[25%] right-[25%] w-3.5 h-3.5 bg-white/20 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '6.5s', animationDelay: '0.8s' }}></div>
        <div className="absolute top-[85%] left-[40%] w-2 h-2 bg-white/25 rounded-full animate-bounce shadow-md" style={{ animationDuration: '4.8s', animationDelay: '1.2s' }}></div>
        <div className="absolute top-[50%] left-[35%] w-2.5 h-2.5 bg-white/30 rounded-full animate-bounce shadow-lg" style={{ animationDuration: '5.2s', animationDelay: '2.8s' }}></div>
        <div className="absolute top-[15%] right-[30%] w-3 h-3 bg-white/20 rounded-full animate-bounce shadow-md" style={{ animationDuration: '6.2s', animationDelay: '1.8s' }}></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="w-full max-w-3xl px-16 relative z-10">
          <div className="mb-12">
            {/* HelloML Logo */}
            <div className="mb-8">
              <Logo size="hero" />
            </div>
            <h1 className="text-7xl font-bold mb-6 leading-tight">
              {authContent.hero.headline} <br />
              <RotatingText
                phrases={authContent.hero.taglines}
                className="text-[#FAF8F3] drop-shadow-lg"
              />
            </h1>
            <p className="text-2xl text-white/80 mb-12 leading-relaxed font-light">
              {authContent.hero.description}
            </p>
          </div>

          {/* Decorative element */}
          <div className="mt-8">
            <svg width="400" height="80" viewBox="0 0 400 80" className="opacity-30">
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

      {/* Right Auth Section - 40% width on desktop, full width on mobile/tablet */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-4 sm:p-6 lg:p-10 flex-1 lg:flex-none">
        <div className="w-full max-w-lg">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-[#FAF8F3] to-[#F5EFE6] backdrop-blur-sm">
            <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8 lg:pt-10">
              {/* HelloML Logo - Auth Card - hidden on mobile since we show it in header */}
              <div className="hidden sm:flex justify-center mb-4 sm:mb-6">
                <Logo size="responsive-card" lightMode />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-[#8B6F47] mb-1 sm:mb-2">{authContent.card.title}</CardTitle>
              <CardDescription className="text-[#A67A5B]/70 text-sm sm:text-base">
                {authContent.card.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-xl">
                  <TabsTrigger value="login" className="rounded-lg cursor-pointer">{authContent.tabs.login}</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-lg cursor-pointer">{authContent.tabs.register}</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 sm:space-y-5 mt-4 sm:mt-6">
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4 sm:space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.email}</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={authContent.forms.placeholders.email}
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-11 sm:h-12 lg:h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
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
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-11 sm:h-12 lg:h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
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

                    <Button type="submit" className="w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold h-11 sm:h-12 lg:h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
                      {isLoading ? commonContent.buttons.signingIn : commonContent.buttons.signIn}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.name}</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder={authContent.forms.placeholders.name}
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-11 sm:h-12 lg:h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
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
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-11 sm:h-12 lg:h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
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
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-11 sm:h-12 lg:h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
                        {...registerForm.register('password')}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-xs text-red-600">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm" className="text-[#8B6F47] font-medium text-sm">{authContent.forms.labels.confirmPassword}</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder={authContent.forms.placeholders.confirmPassword}
                        className="bg-[#FAF8F3] border-[#E8DCC8] focus:border-[#A67A5B] focus:ring-2 focus:ring-[#A67A5B]/10 rounded-xl h-11 sm:h-12 lg:h-14 text-[#8B6F47] placeholder:text-[#A67A5B]/40"
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

                    <Button type="submit" className="w-full bg-gradient-to-r from-[#8B6F47] via-[#A67A5B] to-[#C9B790] hover:from-[#8B6F47]/90 hover:via-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-semibold h-11 sm:h-12 lg:h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
                      {isLoading ? commonContent.buttons.creatingAccount : commonContent.buttons.createAccount}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4 sm:mt-6">
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

                <div className="mt-4 sm:mt-5">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth('Google')}
                    disabled={isLoading}
                    className="w-full bg-[#FAF8F3] border-[#E8DCC8] hover:border-[#A67A5B] hover:bg-white hover:text-[#8B6F47] rounded-xl h-10 sm:h-11 lg:h-12 transition-all duration-300 text-[#8B6F47]"
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

              <p className="mt-4 sm:mt-5 text-xs text-center text-[#A67A5B]/50">
                {authContent.legal.terms}
              </p>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
