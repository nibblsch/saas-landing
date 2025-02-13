// ADD NEW FILE: src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    console.log('Middleware running for path:', request.nextUrl.pathname)
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })

    // Get session and log status
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('Session status:', session ? 'Active' : 'None')
    if (error) console.error('Session error:', error)

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

// ADD: Configure which routes this middleware runs on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

  // Refresh session if expired
  await supabase.auth.getSession()

  return response
}