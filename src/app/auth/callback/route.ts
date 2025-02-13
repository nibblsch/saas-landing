import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url)
    const code = requestUrl.searchParams.get('code')
    
    // If we have an access_token in the hash, redirect to home to handle it client-side
    if (requestUrl.hash && requestUrl.hash.includes('access_token')) {
      // Preserve the hash when redirecting
      const redirectUrl = new URL('/', requestUrl)
      redirectUrl.hash = requestUrl.hash
      return NextResponse.redirect(redirectUrl)
    }

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error

      if (session?.user) {
        const profileData = {
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
          email: session.user.email
        }

        // Create response with redirect
        const response = NextResponse.redirect(new URL('/?step=details', requestUrl))
        
        // Set cookie with more permissive settings
        response.headers.set(
          'Set-Cookie',
          `user_profile=${encodeURIComponent(JSON.stringify(profileData))}; Path=/; Max-Age=3600; SameSite=Lax`
        )
        
        return response
      }
    }

    return NextResponse.redirect(new URL('/?error=auth&message=Invalid authentication response', requestUrl))
  } catch (error) {
    console.error('Callback error:', error)
    // Type guard for Error object
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.redirect(
      new URL('/?error=auth&message=' + encodeURIComponent(errorMessage), req.url)
    )
  }
} 