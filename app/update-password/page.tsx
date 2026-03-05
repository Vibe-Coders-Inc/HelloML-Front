'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

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

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase will auto-detect the recovery token from the URL hash
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    // Also check if already in a session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
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
            {success ? 'Password updated' : 'Set a new password'}
          </h1>
          <p className="mt-2 text-[#A67A5B]/70 text-sm sm:text-base">
            {success
              ? 'Your password has been updated. Redirecting to your dashboard...'
              : 'Enter your new password below.'}
          </p>
        </div>

        {success ? (
          <div className="text-sm p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-center">
            Password updated successfully. Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#3D2E1F] font-medium text-sm">
                New password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] pr-11 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9B790] hover:text-[#8B6F47] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && <PasswordStrengthBar password={password} />}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-[#3D2E1F] font-medium text-sm">
                Confirm new password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-white border-[#E8DCC8] focus:border-[#8B6F47] focus:ring-2 focus:ring-[#8B6F47]/10 text-[#3D2E1F] placeholder:text-[#C9B790] pr-11 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9B790] hover:text-[#8B6F47] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm p-3 rounded-xl bg-red-50 border border-red-200 text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !sessionReady}
              className="w-full h-12 rounded-xl bg-[#8B6F47] hover:bg-[#7A6140] text-white font-semibold shadow-md shadow-[#8B6F47]/20 hover:shadow-lg hover:shadow-[#8B6F47]/25 transition-all duration-200"
            >
              {isLoading ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/auth"
            className="text-[#8B6F47]/70 hover:text-[#8B6F47] transition-colors text-sm font-medium"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
