// ADD NEW FILE: src/lib/stripe.ts
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '@/config/stripeConfig'; // 🟢 Import centralized key


  if (!STRIPE_SECRET_KEY) {
      throw new Error('Missing Stripe secret key (updated logic lib stripe.ts file)')
    }

export const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
})

export async function createCheckoutSession(customerId: string, priceId: string) {
  const session = await stripe.checkout.sessions.create({
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

  return session
}