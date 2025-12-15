import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

// Auth routes - authenticated users should be redirected away from these
const AUTH_ROUTES = ['/login', '/signup']

// Protected routes that require authentication
const PROTECTED_ROUTE_PREFIXES = ['/library', '/profile', '/settings', '/clubs', '/onboarding']

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Log auth errors for debugging (but don't expose to users)
  if (error) {
    console.error('[Middleware] Auth error:', error.message)
  }

  const pathname = request.nextUrl.pathname

  // Redirect unauthenticated users from protected routes to login
  if (!user && isProtectedRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users from auth routes to library
  if (user && isAuthRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/library'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
