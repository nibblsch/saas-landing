// ADD NEW FILE: src/app/auth/verify/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function VerifyPage() {
  const [message, setMessage] = useState('Verifying your email...')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get tokens from URL
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type') as "sms" | "email";
        const next = searchParams.get('next') ?? '/pricing'

        if (token_hash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
          })

          if (error) {
            setMessage('Error verifying your email. Please try signing up again.')
          } else {
            // Redirect to pricing page after verification
            router.push(next)
          }
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.')
      }
    }

    verifyEmail()
  }, [router, searchParams, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
          <p>{message}</p>
        </div>
      </div>
    </div>
  )
}