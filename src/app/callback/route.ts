// Handles the OAuth callback after social login
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })


    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Check if user's email is verified
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user?.email_confirmed_at) {
    // if email is verified, Redirect to pricing page after successful auth
    return NextResponse.redirect(new URL('/pricing', requestUrl.origin))
  } else {
    // If email is not verified, redirect to home with message
    return NextResponse.redirect(new URL('/?verification=pending', requestUrl.origin))
  }
}
}