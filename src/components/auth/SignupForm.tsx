// REPLACE entire contents of src/components/auth/SignupForm.tsx with:
'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { FcGoogle } from 'react-icons/fc'
import { FaApple, FaTiktok } from 'react-icons/fa'

interface SignupFormData {
  email: string;
  password: string;
}

interface UserProfileData {
  name: string;
  childAgeMonths?: number;
}

type SignupStep = 'initial' | 'profile'

export function SignupForm() {
  // Changed default mode to 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [step, setStep] = useState<SignupStep>('initial')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: ''
  })
  
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    childAgeMonths: undefined
  })

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
      // Profile submission logic will go here
      console.log('Profile data:', profileData)
      // On success:
      window.location.href = '/pricing'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'profile') {
    return (
      <div className="w-full">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="childAgeMonths" className="sr-only">Child's Age (months)</label>
            <input
              type="number"
              id="childAgeMonths"
              placeholder="Child's Age in Months (optional)"
              value={profileData.childAgeMonths || ''}
              onChange={(e) => setProfileData(prev => ({ 
                ...prev, 
                childAgeMonths: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              min="0"
              max="60"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : 'Continue'}
          </Button>
        </form>
      </div>
    )
  }

  return (
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
          onClick={() => handleSocialLogin('google')}
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
}