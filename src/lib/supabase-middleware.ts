import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  const staffSession = request.cookies.get('origine_session')?.value;
  const isProtectedAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Guard: Protect /admin routes at the SSR level
  if (isProtectedAdminRoute && !staffSession) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseKey) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const res = await supabase.auth.getUser();
    user = res.data.user;
  } catch (_) {}

  if (!user && !staffSession && isProtectedAdminRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse
}
