'use client' // Add this since we're using onClick

import { useState } from 'react' // Add this import
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SignupForm } from '@/components/auth/SignupForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  // Add state for modal
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  
  // Create a handler function
  const handleOpenSignup = () => setIsSignupOpen(true)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass the handler to Header */}
      <Header onOpenSignup={handleOpenSignup} />

      <main className="flex-grow">
        {/* Container div for content width control */}
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12"> {/* Added this container */}

        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your Personal AI-Powered Parenting Expert
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Get instant, reliable answers to all your parenting questions - from feeding schedules to sleep training
          </p>
          <div className="mt-10">
             {/* Update this button to use same handler */}
             <Button onClick={handleOpenSignup}>
              Get Started Now
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <h2 className="text-3xl font-bold text-center">Features</h2>
          {/* Features content coming soon */}
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
            <h2 className="text-3xl font-bold text-center">What Parents Say</h2>
            {/* Testimonials content coming soon */}
          </section>
          
        {/* Pricing Section */}
        <section id="pricing" className="py-20">
        <h2 className="text-3xl font-bold text-center">Pricing</h2>
        {/* Pricing content will go here */}
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-gray-50">
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
            {/* FAQ content coming soon */}
          </section>
          </div>
      </main>
      <Footer />

      {/* Signup Modal */}
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