import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  // Simple middleware that just redirects to login for protected routes
  // The actual auth check will be handled by the client-side components
  if (req.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // Check if there's a session cookie (Supabase automatically sets these)
    const sessionCookie = req.cookies.get('sb-access-token') || 
                         req.cookies.get('supabase-auth-token') ||
                         req.cookies.get('supabase.auth.token')
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*']
}