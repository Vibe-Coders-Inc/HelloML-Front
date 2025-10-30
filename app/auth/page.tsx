'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Clock, Zap, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/context';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useApp();
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
      const success = await login(data.email, data.password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock registration - just log in the user
      const success = await login(data.email, data.password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock social auth
      const success = await login(`${provider}@example.com`, 'password');
      if (success) {
        router.push('/dashboard');
      } else {
        setError(`${provider} authentication failed`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
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
    <div className="min-h-screen bg-gradient-to-br from-[#FAF2DC] to-[#D8CBA9] flex">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#A67A5B] to-[#C9B790] text-white p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="max-w-md relative z-10">
            <div className="mb-8">
              <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm">
                <Phone className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Pick up the phone.<br />
                Your AI handles it.
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Transform your business with AI voice agents that never sleep, never get tired, and always sound amazing!
              </p>
            </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="w-10 h-10 bg-white/25 rounded-xl flex items-center justify-center shadow-md group-hover:bg-white/30 transition-all duration-300">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-lg font-medium">24/7 Support - Never miss a call again!</span>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="w-10 h-10 bg-white/25 rounded-xl flex items-center justify-center shadow-md group-hover:bg-white/30 transition-all duration-300">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-lg font-medium">Instant Setup - Ready in under 5 minutes!</span>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="w-10 h-10 bg-white/25 rounded-xl flex items-center justify-center shadow-md group-hover:bg-white/30 transition-all duration-300">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-lg font-medium">Human-like Voice - Your customers won't know the difference!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Auth Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-[#FAF2DC]">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#A67A5B] to-[#C9B790] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-[#A67A5B] mb-2">Welcome to Voice Support</CardTitle>
              <CardDescription className="text-[#A67A5B]/70 text-base">
                Join thousands of businesses already using AI voice agents. Let's get you started!
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#D8CBA9]/30 p-1 rounded-xl">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Login</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-[#A67A5B] data-[state=active]:shadow-md rounded-lg font-medium">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6 mt-6">
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-[#A67A5B] font-medium">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl h-12"
                        {...loginForm.register('email')}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-[#A67A5B] font-medium">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl h-12"
                        {...loginForm.register('password')}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
                    )}

                    <Button type="submit" className="w-full bg-gradient-to-r from-[#A67A5B] to-[#C9B790] hover:from-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-medium h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-6 mt-6">
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-[#A67A5B] font-medium">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl h-12"
                        {...registerForm.register('name')}
                      />
                      {registerForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-[#A67A5B] font-medium">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl h-12"
                        {...registerForm.register('email')}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-[#A67A5B] font-medium">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl h-12"
                        {...registerForm.register('password')}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm" className="text-[#A67A5B] font-medium">Confirm Password</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        className="border-[#D8CBA9] focus:border-[#A67A5B] focus:ring-[#A67A5B]/20 rounded-xl h-12"
                        {...registerForm.register('confirmPassword')}
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
                    )}

                    <Button type="submit" className="w-full bg-gradient-to-r from-[#A67A5B] to-[#C9B790] hover:from-[#A67A5B]/90 hover:to-[#C9B790]/90 text-white font-medium h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#D8CBA9]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gradient-to-br from-white to-[#FAF2DC] px-4 text-[#A67A5B]/60 font-medium">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth('Google')}
                    disabled={isLoading}
                    className="w-full border-2 border-[#D8CBA9] hover:border-[#A67A5B] hover:bg-[#A67A5B]/5 rounded-xl h-12 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth('Apple')}
                    disabled={isLoading}
                    className="w-full border-2 border-[#D8CBA9] hover:border-[#A67A5B] hover:bg-[#A67A5B]/5 rounded-xl h-12 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialAuth('Microsoft')}
                    disabled={isLoading}
                    className="w-full border-2 border-[#D8CBA9] hover:border-[#A67A5B] hover:bg-[#A67A5B]/5 rounded-xl h-12 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#f25022" d="M1 1h10v10H1z"/>
                      <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                      <path fill="#7fba00" d="M1 13h10v10H1z"/>
                      <path fill="#ffb900" d="M13 13h10v10H13z"/>
                    </svg>
                  </Button>
                </div>
              </div>

              <p className="mt-6 text-xs text-center text-[#A67A5B]/60">
                By continuing you agree to our Terms and Privacy. We promise to keep your data safe!
              </p>
              
              {/* Quick Test Login Button */}
              <div className="mt-6 pt-6 border-t border-[#D8CBA9]">
                <Button
                  variant="secondary"
                  onClick={() => handleSocialAuth('Test')}
                  disabled={isLoading}
                  className="w-full text-sm bg-[#D8CBA9]/20 hover:bg-[#D8CBA9]/30 text-[#A67A5B] border border-[#D8CBA9] rounded-xl h-10 transition-all duration-300"
                >
                  Quick Test Login (Skip Auth)
                </Button>
                <p className="text-xs text-center text-[#A67A5B]/50 mt-2">
                  For testing purposes only
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
