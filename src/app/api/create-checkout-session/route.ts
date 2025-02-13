// ADD NEW FILE: src/app/api/create-checkout-session/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Create or get Stripe customer
    const { data: customer } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single()

    let customerId = customer?.stripe_customer_id

    if (!customerId) {
      // Create new Stripe customer
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          user_id: session.user.id
        }
      })
      
      // Save Stripe customer ID
      await supabase
        .from('customers')
        .insert({
          user_id: session.user.id,
          stripe_customer_id: stripeCustomer.id
        })

      customerId = stripeCustomer.id
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}