// /app/api/verify-recaptcha/route.ts
import { NextResponse } from 'next/server'

// Constants
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'

// Types
interface RecaptchaResponse {
  success: boolean
  score: number
  action: string
  challenge_ts: string
  hostname: string
  'error-codes'?: string[]
}

export async function POST(request: Request) {
  try {
    // Extract token from request body
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      )
    }

    if (!RECAPTCHA_SECRET_KEY) {
      console.error('RECAPTCHA_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    // Verify token with Google's reCAPTCHA API
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    })

    const data: RecaptchaResponse = await response.json()

    console.log('reCAPTCHA verification response:', data);  // Add logging


    // Check if verification was successful
    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes'])
      return NextResponse.json(
        { error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'unknown error'}` },
        { status: 400 }
      )
    }

    // Verify the score - 1.0 is very likely a good interaction, 0.0 is very likely a bot
    // Adjust this threshold based on your security needs
    if (data.score < 0.5) {
      return NextResponse.json(
        { error: 'reCAPTCHA score too low' },
        { status: 400 }
      )
    }

 

    // All checks passed
    return NextResponse.json({
      success: true,
      score: data.score,
    })

  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error)
    return NextResponse.json(
      { error: 'Failed to verify reCAPTCHA' },
      { status: 500 }
    )
  }
}
