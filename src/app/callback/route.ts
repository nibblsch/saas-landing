import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    console.log('Callback route hit')
    const url = new URL(req.url)
    console.log('Full URL:', request.url)
    console.log('Hash:', requestUrl.hash)
    const accessToken = url.searchParams.get('access_token')
    
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Parse hash parameters if present
    let session = null
    if (requestUrl.hash) {
      const hashParams = new URLSearchParams(requestUrl.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      if (accessToken) {
        console.log('Access token found in hash')
        return NextResponse.redirect('/?error=auth&message=No access token received')
  }
        // Store token in session or DB if needed
        console.log('Google OAuth Token:', accessToken)
        
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        })
        
        if (error) {
          console.error('Error setting session:', error)
          throw error
        }
        
        session = data.session
      }
    }

    // If no session from hash, try code exchange
    if (!session) {
      const code = requestUrl.searchParams.get('code')
      if (code) {
        console.log('Auth code found in query')
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('Error exchanging code:', error)
          throw error
        }
        session = data.session
      }
    }

    if (!session) {
      console.error('No session established')
      throw new Error('No session established')
    }

    // Get user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }

    if (user?.user_metadata) {
      // Store user data in cookie
      cookieStore.set('user_profile', JSON.stringify({
        name: user.user_metadata.full_name || '',
        email: user.email
      }), {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }

    console.log('Redirecting to details step')
    return NextResponse.redirect(new URL('/?step=details', requestUrl.origin))

  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL('/?error=auth&message=' + encodeURIComponent(error.message), 
      request.url)
    )
  }
}
    
    // ADDING: Handle both URL formats - hash fragment and query parameters
    let token = null
    let refreshToken = null

    // Check if we have data in the hash fragment
    if (requestUrl.hash) {
      // Remove the leading # and parse the parameters
      const hashParams = new URLSearchParams(requestUrl.hash.substring(1))
      token = hashParams.get('access_token')
      refreshToken = hashParams.get('refresh_token')

      if (token) {
        // Set the session with the tokens from the hash
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: refreshToken || ''
        })
      }
    }

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('No user found')
    }

    // Store user profile data in cookies
    cookieStore.set('user_profile', JSON.stringify({
      name: user.user_metadata?.full_name || '',
      email: user.email
    }))

    // Redirect to main page with modal in details step
    return NextResponse.redirect('/?step=details')
}
 catch (error) {
    console.error('Auth callback error:', error)
    // Redirect to home with error
    return NextResponse.redirect(new URL('/?error=auth', request.url))
  }
}