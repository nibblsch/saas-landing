"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { SignupForm } from '@/components/auth/SignupForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckIcon, Brain, Clock, Shield, MessageSquare } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { PRICING_PLANS } from '@/config/stripeConfig';
import { usePostHog } from 'posthog-js/react';
import Image from 'next/image';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'initial' | 'details' | 'payment'>(
    searchParams.get('step') === 'details' ? 'details' : 'initial'
  );
  const posthog = usePostHog();
  const sessionId = searchParams.get('session_id');
  const [isHydrated, setIsHydrated] = useState(false); // ✅ Add state for hydration fix

  
  const [selectedPlanData, setSelectedPlanData] = useState<{
    id: string;
    name: string;
    price: number;
    interval: 'monthly' | 'annually';
  } | null>(null);

  const [userProfile, setUserProfile] = useState<{name?: string, email?: string} | null>(null);

  const handleOpenSignup = () => {
    posthog?.capture('signup_modal_opened');
    setIsSignupOpen(true);
  };

  useEffect(() => {
          if (typeof window !== 'undefined') {
            setIsHydrated(true);
         }
        }, []);
      
  // Track page view on mount
  useEffect(() => {
    posthog?.capture('landing_page_viewed', {
      referrer: document.referrer,
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign')
    });
  }, [searchParams]);

  // Store selected plan before login redirect
  useEffect(() => {
    if (selectedPlanData) {
      console.log('Saving selected plan to sessionStorage:', selectedPlanData);
      sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlanData));
    }
  }, [selectedPlanData]);
 
  // Handle OAuth
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (!accessToken) {
          const error = searchParams.get('error');
          const errorMessage = searchParams.get('message');
          if (error) {
            console.error('Auth error:', errorMessage);
            return;
          }
        }
        
        if (accessToken) {
          console.log('Access token found');
          
          const { data: { session }, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || ''
          });
          
          if (sessionError) throw sessionError;
          
          if (session?.user?.user_metadata) {
            const profileData = {
              name: session.user.user_metadata.full_name || session.user.user_metadata.name || '',
              email: session.user.email
            };
            
            setUserProfile(profileData);
            document.cookie = `user_profile=${encodeURIComponent(JSON.stringify(profileData))}; path=/; max-age=3600; SameSite=Lax`;
            
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('step', 'details');
            window.history.replaceState({}, document.title, newUrl.toString());

            setIsSignupOpen(true);
            setCurrentStep('details');
          }
        }
      } catch (err) {
        console.error('Error handling auth:', err);
      }
    };

    if (window.location.hash || searchParams.get('error')) {
      handleAuth();
    }
  }, [searchParams]);

  // Handle step changes and profile cookie
  useEffect(() => {
    try {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: string });

      const profileCookie = cookies['user_profile'];
      if (profileCookie) {
        const profile = JSON.parse(decodeURIComponent(profileCookie));
        setUserProfile(profile);
      }

      if (searchParams.get('step') === 'details') {
        setIsSignupOpen(true);
        setCurrentStep('details');
      }
    } catch (error) {
      console.error('Error parsing profile cookie:', error);
    }
  }, [searchParams]);

  // Restore selected plan on page load
  useEffect(() => {
    const savedPlan = sessionStorage.getItem('selectedPlan');
    if (savedPlan) {
      setSelectedPlanData(JSON.parse(savedPlan));
    }
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Evidence-Based Guidance",
      description: "Get reliable parenting advice backed by scientific research and expert knowledge"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access instant support whenever you need it, day or night"
    },
    {
      icon: Shield,
      title: "Safe & Private",
      description: "Your conversations are completely private and secure"
    },
    {
      icon: MessageSquare,
      title: "Personalized Support",
      description: "Receive customized advice based on your child's age and needs"
    }
  ];

  const testimonials = [
    {
      quote: "BabyGPT has been a lifesaver during those late-night parenting questions!",
      author: "Sarah M., Mother of two"
    },
    {
      quote: "Finally, evidence-based parenting advice available whenever I need it.",
      author: "Michael P., New parent"
    },
    {
      quote: "The personalized recommendations have helped us establish great routines.",
      author: "Emily R., Mother of a 6-month-old"
    }
  ];

  const faqs = [
    {
      question: "How accurate is BabyGPT's advice?",
      answer: "BabyGPT provides recommendations based on peer-reviewed research and established pediatric guidelines. However, always consult with healthcare professionals for medical advice."
    },
    {
      question: "Can I use BabyGPT for multiple children?",
      answer: "Yes! BabyGPT can provide age-appropriate guidance for children of different ages and developmental stages."
    },
    {
      question: "Is my conversation data private?",
      answer: "Absolutely. We take your privacy seriously and all conversations are encrypted and never shared with third parties."
    }
  ];

  return (
    <>
      <Header onOpenSignup={handleOpenSignup} />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your AI Parenting Assistant
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Get instant, evidence-based answers to all your parenting questions
              </p>
              {!isHydrated ? null : (  // ✅ Prevent UI from rendering before hydration
              <Button
                onClick={handleOpenSignup}
                className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                Try BabyGPT Free
              </Button>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose BabyGPT?</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">What Parents Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-xl text-gray-600">
                Start free, upgrade when you're ready
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Monthly Plan */}
              <div className="rounded-2xl bg-white shadow-lg p-8 flex flex-col border border-gray-200">
                <h3 className="text-xl font-semibold">{PRICING_PLANS.monthly.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${PRICING_PLANS.monthly.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {PRICING_PLANS.monthly.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
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
                      };
                      posthog?.capture('plan_selected', {
                        plan_type: 'monthly',
                        plan_price: PRICING_PLANS.monthly.price
                      });
                      setSelectedPlanData(planData);
                      sessionStorage.setItem('selectedPlan', JSON.stringify(planData));
                      setTimeout(() => setIsSignupOpen(true), 50);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Button>
                </div>
              </div>

              {/* Annual Plan */}
              <div className="rounded-2xl bg-white shadow-lg p-8 flex flex-col border border-gray-200 relative">
                <div className="absolute -top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold">{PRICING_PLANS.annually.name}</h3>
                <div className="mt-4 flex items-center gap-3">
                  <div>
                    <span className="text-4xl font-bold">${PRICING_PLANS.annually.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <span className="text-blue-600 font-medium">
                    {PRICING_PLANS.annually.savings}
                  </span>
                </div>
                <ul className="mt-8 space-y-4">
                  {PRICING_PLANS.annually.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <Button 
                    onClick={() => {
                      const planData = {
                        id: PRICING_PLANS.annually.id,
                        name: 'Annual',
                        price: PRICING_PLANS.annually.price,
                        interval: 'annually' as const
                      };
                      posthog?.capture('plan_selected', {
                        plan_type: 'annual',
                        plan_price: PRICING_PLANS.annually.price
                      });
                      setSelectedPlanData(planData);
                      sessionStorage.setItem('selectedPlan', JSON.stringify(planData));
                      setTimeout(() => setIsSignupOpen(true), 50);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Modal
        isOpen={isSignupOpen}
        onClose={() => {
          console.log('Closing modal, clearing selectedPlanData');
          setIsSignupOpen(false);
          setTimeout(() => setSelectedPlanData(null), 50);
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
  );
}