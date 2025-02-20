'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from 'react'

function AuthPage() {
  useEffect(() => {
    const initiateAuth = async () => {
      const supabase = createClientComponentClient()
      
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        })

        if (error) throw error

        // Redirect to the authorization URL
        if (data?.url) {
          window.location.href = data.url
        }
      } catch (error) {
        console.error('Auth error:', error)
        window.location.href = '/?error=auth&message=' + encodeURIComponent(
          error instanceof Error ? error.message : 'Authentication failed'
        )
      }
    }

    initiateAuth()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to authentication...</p>
      </div>
    </div>
  )
}

export default AuthPage