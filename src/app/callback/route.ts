import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const accessToken = url.searchParams.get('access_token')
    
    // If we have an access_token in the URL, redirect to home to handle it client-side
    if (accessToken || url.hash.includes('access_token')) {
      const redirectUrl = new URL('/', req.url)
      redirectUrl.hash = url.hash
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

        const response = NextResponse.redirect(new URL('/?step=details', req.url))
        
        // Set cookie with more permissive settings
        response.headers.set(
          'Set-Cookie',
          `user_profile=${encodeURIComponent(JSON.stringify(profileData))}; Path=/; Max-Age=3600; SameSite=Lax`
        )
        
        return response
      }
    }

    return NextResponse.redirect(new URL('/?error=auth&message=Invalid authentication response', req.url))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL('/?error=auth&message=' + encodeURIComponent(error.message), req.url)
    )
  }
}