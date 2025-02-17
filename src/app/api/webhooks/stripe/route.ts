/*******************************************
 * FILE: src/app/api/webhooks/stripe/route.ts
 * PURPOSE: Handles Stripe webhook events for updating billing info
 *******************************************/

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    // Extract webhook data
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') as string

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      )
    }

    // Get Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Handle different webhook events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      // Save billing details to database
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: session.customer,
          billing_name: session.customer_details?.name,
          billing_address: session.customer_details?.address,
          billing_email: session.customer_details?.email,
          updated_at: new Date().toISOString()
        })
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}