import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Detect if this is a brand-new signup (created within last 60 seconds)
    if (data?.user?.created_at) {
      const createdAt = new Date(data.user.created_at).getTime();
      const now = Date.now();
      if (now - createdAt < 60_000) {
        return NextResponse.redirect(`${origin}/dashboard?new_signup=true`);
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/dashboard`);
}
