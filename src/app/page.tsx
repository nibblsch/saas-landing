'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SignupForm } from '@/components/auth/SignupForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckIcon } from 'lucide-react'
import { setPlanSelection } from '@/store/planSelection'
import { useSearchParams, useRouter } from 'next/navigation'


const PRICING_PLANS = {
  monthly: {
    id: 'prod_RkcmFAgddLLJfn',
    price: 29.99,
    name: 'Monthly',
    features: [
      'Unlimited AI consultations',
      '24/7 availability',
      'Research-backed answers',
      'Cancel anytime'
    ]
  },
  annually: {
    id: 'prod_RkcnX78pXVNKpu',
    price: 23.99,
    fullPrice: 287.88,
    name: 'Annual',
    features: [
      'All Monthly features',
      'Priority support',
      'Exclusive content',
      'Personalized insights'
    ],
    badge: 'Best Value',
    savings: 'Save 20%'
  }
}

export default function HomePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<'initial' | 'details' | 'payment'>(
    searchParams.get('step') === 'details' ? 'details' : 'initial'
  )
  const handleOpenSignup = () => setIsSignupOpen(true)

  // First useEffect for handling OAuth
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const error = searchParams.get('error')
    const errorMessage = searchParams.get('message')
    
    if (accessToken) {
      console.log('Google OAuth Token:', accessToken)
      localStorage.setItem('googleAccessToken', accessToken)
      router.replace('/?step=details')
    }

    if (error === 'auth') {
      console.error('Auth error:', errorMessage)
      // Show error to user (you can add a toast or alert here)
    }
  }, [router, searchParams])

  // Second useEffect for handling step changes
  useEffect(() => {
    if (searchParams.get('step') === 'details') {
      setIsSignupOpen(true)
      setCurrentStep('details')
    }
  }, [searchParams])

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onOpenSignup={handleOpenSignup} />
        
        <main className="flex-grow">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Hero Section */}
            <section className="py-20 text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Your Personal AI-Powered Parenting Expert
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
                Get instant, reliable answers to all your parenting questions - from feeding schedules to sleep training
              </p>
              <div className="mt-10">
                <Button onClick={handleOpenSignup}>
                  Get Started Now
                </Button>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
              <h2 className="text-3xl font-bold text-center">Features</h2>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-gray-50">
              <h2 className="text-3xl font-bold text-center">What Parents Say</h2>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                <p className="text-lg text-gray-600">
                  30-Day Money-Back Guarantee - Love it or get a full refund
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Monthly Plan */}
                <div className="rounded-2xl bg-white shadow-lg p-8 flex flex-col">
                  <h3 className="text-xl font-semibold">{PRICING_PLANS.monthly.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${PRICING_PLANS.monthly.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {PRICING_PLANS.monthly.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <CheckIcon className="h-5 w-5 text-indigo-600 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Button 
                      onClick={() => {
                        setPlanSelection(PRICING_PLANS.monthly.id)
                        setIsSignupOpen(true)
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* Annual Plan */}
                <div className="rounded-2xl bg-white shadow-lg p-8 flex flex-col relative">
                  <div className="absolute -top-4 right-4">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Best Value
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold">{PRICING_PLANS.annually.name}</h3>
                  <div className="mt-4 flex items-center gap-3">
                    <div>
                      <span className="text-4xl font-bold">${PRICING_PLANS.annually.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <span className="text-indigo-600 font-medium">
                      {PRICING_PLANS.annually.savings}
                    </span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {PRICING_PLANS.annually.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <CheckIcon className="h-5 w-5 text-indigo-600 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <Button 
                      onClick={() => {
                        setPlanSelection(PRICING_PLANS.annually.id)
                        setIsSignupOpen(true)
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-gray-50">
              <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
            </section>
          </div>
        </main>

        <Footer />

        <Modal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          title="Create your account"
        >
          <SignupForm />
        </Modal>
      </div>
    </>
  )
}