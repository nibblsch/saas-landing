'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaTiktok } from 'react-icons/fa'
// ADD back the Google auth function
import { signInWithGoogle } from '@/lib/auth'
import { loadStripe } from '@stripe/stripe-js'
import { PRICING_PLANS } from '@/config/stripeConfig';
import { STRIPE_PUBLISHABLE_KEY } from '@/config/stripeConfig'; // 🟢 Import existing key logic


// Move interfaces to top
interface SignupFormData {
  email: string;
  password: string;
}

interface UserProfileData {
  name: string;
  childAgeMonths?: number;
}

interface SelectedPlan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'annually';
}

interface SignupFormProps {
  initialStep?: SignupStep;
  initialProfile?: {
    name?: string;
    email?: string;
  } | null;
  initialPlan?: SelectedPlan | null;
}

type SignupStep = 'initial' | 'details' | 'checkout' //Added checkout step

export function SignupForm({ 
  initialStep = 'initial', 
  initialProfile = null,
  initialPlan = null 
}: SignupFormProps) {
  // State declarations
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [step, setStep] = useState<SignupStep>(initialStep)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(initialPlan)
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: ''
  })
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: initialProfile?.name || '',
    childAgeMonths: undefined
  })
  const [checkoutSession, setCheckoutSession] = useState<string | null>(null)


  // Effect hooks
  useEffect(() => {
    console.log('Received initialPlan:', initialPlan);
    if (initialPlan) {
      setSelectedPlan(initialPlan);
      console.log('Updating selected plan in state:', initialPlan);
    }
  }, [initialPlan]);

  useEffect(() => {
    if (selectedPlan) {
      console.log('Saving selected plan for manual signup:', selectedPlan);
      sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
    }
  }, [selectedPlan]);

  useEffect(() => {
    console.log('Initial profile received:', initialProfile)
    if (initialProfile?.name) {
      setProfileData(prev => {
        if (prev.name !== initialProfile.name) {
          const newData = {
            ...prev,
            name: initialProfile.name
          }
          console.log('Updated profile data:', newData)
          return newData
        }
        return prev
      })
    }
  }, [initialProfile?.name])

  // Event handlers
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      // Social login logic will go here
      console.log(`${provider} login clicked`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // RESTORE Google sign-in handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await signInWithGoogle()
      if (error) throw error
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      // Initial auth logic will go here
      console.log('Initial auth:', formData)
      // On success:
      setStep('profile')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      if (!selectedPlan) throw new Error('Please select a plan');

      await handlePaymentStart()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  };

  //Stripe handler
  const handlePaymentStart = async () => {
        setIsLoading(true)
        try {
          if (!selectedPlan?.interval) {
              throw new Error('Please select a plan')
            }
          // Make request to create checkout session
          const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planInterval: selectedPlan.interval,  // Send 'monthly' or 'annually' instead of ID
            customerName: profileData.name,
            customerEmail: formData.email
          })
        })
          
          if (!response.ok) {
           const errorData = await response.json()
           throw new Error(errorData.error || 'Failed to create checkout session')
           }

          const { sessionId } = await response.json()

          // Load Stripe and redirect to checkout
          console.log('Using Stripe Publishable Key:', STRIPE_PUBLISHABLE_KEY); // 🟢 Debug log
          const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY!);
          if (!stripe) {
            throw new Error('Failed to load Stripe')
          }
            
          const { error } = await stripe.redirectToCheckout({ sessionId })
          if (error) throw error
          }
         catch (err: any) {
          console.error('Payment error:', err)
          setError(err.message || 'An error occurred during checkout')
        } finally {
          setIsLoading(false)
        }
      }

  // Render methods
  const renderProfileAndDetails = () => (
    <div className="w-full">
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        {/* Name and age inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2"
            required
          />

          <input
            type="number"
            placeholder="Child's Age in Months (optional)"
            value={profileData.childAgeMonths || ''}
            onChange={(e) => setProfileData(prev => ({ 
              ...prev, 
              childAgeMonths: e.target.value ? parseInt(e.target.value) : undefined 
            }))}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Simplified pricing selection */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-center text-sm font-medium text-gray-700 mb-4">
            Select your plan
          </h4>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSelectedPlan(PRICING_PLANS.monthly)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                selectedPlan?.interval === 'monthly' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
            >
              <span>Monthly</span>
              <span className="font-semibold">$29.99/mo</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan(PRICING_PLANS.annually)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border ${
                selectedPlan?.interval === 'annually' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
            >
              <div>
                <span>Annual</span>
                <span className="ml-2 text-sm text-green-600">Save 20%</span>
              </div>
              <span className="font-semibold">$23.99/mo</span>
            </button>
          </div>
        </div>

        {/* Continue button */}
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !selectedPlan}
        >
          {isLoading ? 'Please wait...' : 'Continue to Payment'}
        </Button>
      </form>
    </div>
  )

  const renderInitialForm = () => (
    <>
      <div className="w-full">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin('apple')}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <FaApple className="h-5 w-5" />
            Continue with Apple
          </button>
          <button
            onClick={() => handleSocialLogin('tiktok')}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <FaTiktok className="h-5 w-5" />
            Continue with TikTok
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            variant={mode === 'signin' ? 'primary' : 'success'}
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-600 hover:text-blue-700"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </span>
        </div>
      </div>
    </>
  )

  // Main render
  if (step === 'profile' || step === 'details') {
    return renderProfileAndDetails()
  }

  return renderInitialForm()
}
