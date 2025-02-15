// ADD NEW FILE: src/app/api/create-checkout-session/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const { priceId, customerName, customerEmail } = await request.json()
    // Log request data for debugging
    console.log('Checkout request:', { priceId, customerName, customerEmail })
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

    try {
      const { data: customer } = await supabase
        .from('customers')
        .select('stripe_customer_id')
        .eq('user_id', session.user.id)
        .single()

      if (customer?.stripe_customer_id) {
        customerId = customer.stripe_customer_id
      } else {
        const stripeCustomer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
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
    } catch (error) {
      console.error('Customer creation error:', error)
      throw error
    }


    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
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