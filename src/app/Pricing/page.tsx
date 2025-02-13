// ADD NEW FILE: src/app/pricing/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { loadStripe } from '@stripe/stripe-js'
import { CheckIcon } from 'lucide-react'

export default function PricingPage() {
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get('plan')

  // Set initial billing interval based on selected plan
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    selectedPlan === PRICING_PLANS.annually.id ? 'annually' : 'monthly'
  )

// Define pricing plan types
type BillingInterval = 'monthly' | 'annually'

const PRICING_PLANS = {
  monthly: {
    id: 'prod_RkcmFAgddLLJfn',
    price: 29.99,
    name: 'Monthly Plan',
    description: 'Get started with BabyGPT',
    features: [
      'Unlimited AI consultations',
      '24/7 availability',
      'Personalized advice',
      'Progress tracking'
    ]
  },
  annually: {
    id: 'prod_RkcnX78pXVNKpu',
    price: 287.88,
    name: 'Annual Plan',
    description: 'Save 20% with annual billing',
    features: [
      'All Monthly Plan features',
      'Priority support',
      'Advanced analytics',
      'Custom recommendations'
    ]
  }
}

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')
  const { user, isLoading } = useAuth()

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      // If not logged in, open signup modal
      // We'll implement this next
      return
    }

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId })
      })

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="relative flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`${
              billingInterval === 'monthly'
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-50'
            } relative rounded-md py-2 px-6 text-sm font-medium transition-all`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('annually')}
            className={`${
              billingInterval === 'annually'
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-50'
            } relative rounded-md py-2 px-6 text-sm font-medium transition-all`}
          >
            Annually
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900">
            {PRICING_PLANS[billingInterval].name}
          </h3>
          <p className="mt-4 text-gray-500">
            {PRICING_PLANS[billingInterval].description}
          </p>
          <p className="mt-8">
            <span className="text-4xl font-bold tracking-tight text-gray-900">
              ${PRICING_PLANS[billingInterval].price}
            </span>
            <span className="text-base font-medium text-gray-500">
              /{billingInterval === 'monthly' ? 'month' : 'year'}
            </span>
          </p>
          <Button
            onClick={() => handleSubscribe(PRICING_PLANS[billingInterval].id)}
            className="mt-8 w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Started'}
          </Button>
          <ul className="mt-8 space-y-4">
            {PRICING_PLANS[billingInterval].features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="ml-3 text-gray-500">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title="Create your account"
      >
        <SignupForm />
      </Modal>
    </div>  
  )
}
}