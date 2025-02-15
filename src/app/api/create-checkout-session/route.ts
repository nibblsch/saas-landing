// ADD NEW FILE: src/app/api/create-checkout-session/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { PRICING_PLANS } from '@/config/stripeConfig';

export async function POST(request: Request) {
  try {
    //Get Request Data
    // const { priceId, customerName, customerEmail } = await request.json()
    const { planInterval, customerName, customerEmail } = await request.json()
    // Log request data for debugging
    console.log('Checkout request:', { planInterval, customerName, customerEmail })
    
    // Determine price ID based on plan interval and environment
    let priceId: string
    // Select correct price ID based on environment and interval
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
    
    // Get Supabase client
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

    // Create or get Stripe customer
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
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ 
        price: priceId, // Now using server-side price ID
        quantity: 1 
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?step=details`,
      customer_update: {
        name: 'auto',
        address: 'auto'
      },
      billing_address_collection: 'required',
      payment_method_types: ['card'],
      allow_promotion_codes: true
    })

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