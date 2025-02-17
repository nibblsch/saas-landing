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
import supabase from '@/lib/supabase'
import { PRICING_PLANS } from '@/config/stripeConfig';
import { usePostHog } from 'posthog-js/react'


export default function HomePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<'initial' | 'details' | 'payment'>(
    searchParams.get('step') === 'details' ? 'details' : 'initial'
  )
  const posthog = usePostHog()
  
  // Add missing state for selected plan
  const [selectedPlanData, setSelectedPlanData] = useState<{
    id: string;
    name: string;
    price: number;
    interval: 'monthly' | 'annually';
  } | null>(null)

  // Add state for user profile
  const [userProfile, setUserProfile] = useState<{name?: string, email?: string} | null>(null)

  const handleOpenSignup = () => {
        posthog?.capture('signup_modal_opened')
        setIsSignupOpen(true)
      }

  console.log("PRICING_PLANS:", PRICING_PLANS);

  // Track page view on mount
  useEffect(() => {
      posthog?.capture('landing_page_viewed', {
        referrer: document.referrer,
        utm_source: searchParams.get('utm_source'),
        utm_medium: searchParams.get('utm_medium'),
        utm_campaign: searchParams.get('utm_campaign')
      })
    }, [searchParams])

 // 🟢 Store the selected plan before login redirect
useEffect(() => {
  if (selectedPlanData) {
    console.log('Saving selected plan to sessionStorage:', selectedPlanData);
    sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlanData));
  }
}, [selectedPlanData]);
 
  // First useEffect for handling OAuth
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        
        // Only check for error if we don't have an access token
        if (!accessToken) {
          const error = searchParams.get('error')
          const errorMessage = searchParams.get('message')
          if (error) {
            console.error('Auth error:', errorMessage)
            // Show error to user (you can add a toast or alert here)
            return // Exit early if there's an error
          }
        }
        
        if (accessToken) {
          console.log('Access token found')
          
          // Use the singleton instance
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || ''
          })
          
          if (sessionError) throw sessionError
          
          if (session?.user?.user_metadata) {
            const profileData = {
              name: session.user.user_metadata.full_name || session.user.user_metadata.name || '',
              email: session.user.email
            }
            
            setUserProfile(profileData)
            
            // Set cookie with more permissive SameSite
            document.cookie = `user_profile=${encodeURIComponent(JSON.stringify(profileData))}; path=/; max-age=3600; SameSite=Lax`
            
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('step', 'details');
            window.history.replaceState({}, document.title, newUrl.toString());

            setIsSignupOpen(true)
            setCurrentStep('details')
          }
        }
      } catch (err) {
        console.error('Error handling auth:', err)
      }
    }

    // Only run handleAuth if we have a hash or error params
    if (window.location.hash || searchParams.get('error')) {
      handleAuth()
    }
  }, [searchParams])

  
  // Second useEffect for handling step changes
  useEffect(() => {
    try {
      // Check for user profile cookie when component mounts
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as { [key: string]: string })

      const profileCookie = cookies['user_profile']
      console.log('Found profile cookie:', profileCookie)
      
      if (profileCookie) {
        const profile = JSON.parse(decodeURIComponent(profileCookie))
        console.log('Parsed profile:', profile)
        setUserProfile(profile)
      }

      // Handle step parameter
      if (searchParams.get('step') === 'details') {
        setIsSignupOpen(true)
        setCurrentStep('details')
      }
    } catch (error) {
      console.error('Error parsing profile cookie:', error)
    }
  }, [searchParams])


// 🟢 Restore selected plan on page load (for both manual & social login)
useEffect(() => {
  const savedPlan = sessionStorage.getItem('selectedPlan');
  if (savedPlan) {
    console.log('Restoring selected plan from sessionStorage:', JSON.parse(savedPlan));
    setSelectedPlanData(JSON.parse(savedPlan));
  }
}, []);


  return (
    <>
      <Header onOpenSignup={handleOpenSignup} />
        <main className="flex-grow">
          <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
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
                            const planData = {
                              id: PRICING_PLANS.monthly.id,
                              name: 'Monthly',
                              price: PRICING_PLANS.monthly.price,
                              interval: 'monthly' as const
                            }
                            posthog?.capture('plan_selected', {
                                    plan_type: 'monthly',
                                    plan_price: PRICING_PLANS.monthly.price
                                  })
                            console.log('Updating selectedPlanData & saving to sessionStorage:', planData);
                            setSelectedPlanData(planData); // ✅ Updates state
                            sessionStorage.setItem('selectedPlan', JSON.stringify(planData)); // ✅ Saves immediately
                            setTimeout(() => setIsSignupOpen(true), 50); // ✅ Ensures state updates before modal opens
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
                            // Create plan data object
                            const planData = {
                              id: PRICING_PLANS.annually.id,
                              name: 'Annual',
                              price: PRICING_PLANS.annually.price,
                              interval: 'annually' as const
                            }
                            posthog?.capture('plan_selected', {
                                    plan_type: 'annual',
                                    plan_price: PRICING_PLANS.annually.price
                                  })
                            console.log('Updating selectedPlanData & saving to sessionStorage:', planData);
                            setSelectedPlanData(planData); // ✅ Updates state
                            sessionStorage.setItem('selectedPlan', JSON.stringify(planData)); // ✅ Saves immediately
                            setTimeout(() => setIsSignupOpen(true), 50); // ✅ Ensures state updates before modal opens
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
          onClose={() => {
            console.log('Closing modal, clearing selectedPlanData');
            setIsSignupOpen(false);
            setTimeout(() => setSelectedPlanData(null), 50); // ✅ Prevents race condition  // Clear selection when modal closes
        }}
          title="Create your account"
        >
          <SignupForm 
            initialStep={currentStep}
            initialProfile={userProfile}
            initialPlan={selectedPlanData}
          />
        </Modal>
      </>
  )
}
