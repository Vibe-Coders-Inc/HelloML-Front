'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] px-6">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex mb-8 hover:opacity-80 transition-opacity">
            <Logo size="small" lightMode />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D2E1F] tracking-tight">
            {sent ? 'Check your email' : 'Reset your password'}
          </h1>
          <p className="mt-2 text-[#A67A5B]/70 text-sm sm:text-base">
            {sent
              ? 'We sent a password reset link to your email address. Click the link to set a new password.'
              : 'Enter your email address and we will send you a link to reset your password.'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#3D2E1F] font-medium text-sm">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] transition-all"
              />
            </div>

            {error && (
              <div className="text-sm p-3 rounded-xl bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[#8B6F47] hover:bg-[#7A6140] text-white font-semibold shadow-md shadow-[#8B6F47]/20 hover:shadow-lg hover:shadow-[#8B6F47]/25 transition-all duration-200"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        ) : (
          <div className="text-sm p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center">
            A reset link has been sent to <strong>{email}</strong>. It may take a minute to arrive.
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-[#8B6F47]/70 hover:text-[#8B6F47] transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
