/*******************************************
 * FILE: src/app/api/create-checkout-session/route.ts
 * PURPOSE: Creates Stripe checkout sessions for subscription purchases
 *******************************************/
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PRICING_PLANS } from '@/config/stripeConfig';

export async function POST(request: Request) {
  try {
     // 1. Extract and validate request data
    const { planInterval, customerName, customerEmail } = await request.json()
    // Log request data for debugging
    console.log('Checkout request:', { planInterval, customerName, customerEmail })
    
    // 2.Determine price ID based on plan interval and environment
    let priceId: string
    if (process.env.NODE_ENV === 'production') {
      priceId = planInterval === 'monthly' 
        ? process.env.STRIPE_PRICE_MONTHLY_PROD!
        : process.env.STRIPE_PRICE_ANNUALLY_PROD!
    } else {
      priceId = planInterval === 'monthly'
        ? process.env.STRIPE_PRICE_MONTHLY_TEST!
        : process.env.STRIPE_PRICE_ANNUALLY_TEST!
    }
    console.log('Using Stripe price ID:', priceId)
    
    // 3. Get authenticated user session - Supabase client
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    // Get user session
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError) throw authError
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 4. Create or get Stripe customer
    let customerId: string
    // Find existing customer or create new one
      const { data: customer } = await supabase
        .from('customers')
        .select('stripe_customer_id')
        .eq('user_id', session.user.id)
        .single()

      if (customer?.stripe_customer_id) {
        customerId = customer.stripe_customer_id
      } else {
        // Create new Stripe customer
        const stripeCustomer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            user_id: session.user.id
          }
        })
         // Save Stripe customer ID to DB
        await supabase
          .from('customers')
          .insert({
            user_id: session.user.id,
            stripe_customer_id: stripeCustomer.id
          })

        customerId = stripeCustomer.id
      }

    // 5. Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ 
        price: priceId, // Now using server-side price ID
        quantity: 1 
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?step=details`,
      payment_method_types: ['card', 'paypal'],
      billing_address_collection: 'required',
      // customer_email: customerEmail, // Pre-fill email - removed so its not sent to Stripe to cause error
      customer_update: {
        name: 'auto',
        address: 'auto'
      },
      allow_promotion_codes: true
    })

    // 6. Return session details
    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      customerId 
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}