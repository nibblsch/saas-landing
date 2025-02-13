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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your Personal AI-Powered Parenting Expert
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Get instant, reliable answers to all your parenting questions - from feeding schedules to sleep training
          </p>
          <div className="mt-10">
            <Button onClick={() => console.log('Open signup modal')}>
              Get Started Now
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          {/* Features content will go here */}
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          {/* Pricing content will go here */}
        </section>
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