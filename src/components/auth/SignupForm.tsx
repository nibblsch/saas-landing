'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { FcGoogle } from 'react-icons/fc'  // We'll need to install react-icons
import { FaApple, FaTiktok } from 'react-icons/fa'
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '@/lib/auth'

// This will be expanded when we add actual authentication
export function SignupForm() {
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState('')

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = mode === 'signin' 
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password)

      if (error) throw error

      // Redirect or show success message
      window.location.href = '/dashboard' // We'll create this route later
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await signInWithGoogle()
      if (error) throw error

       // If successful, data.url will contain the authorization URL
      if (data?.url) {
      window.location.href = data.url
    }

    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
    {error && (
        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Social Login Buttons */}
    <div className="space-y-3">
      <button onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <FcGoogle className="h-5 w-5" />
        {isLoading ? 'Connecting...' : 'Sign in with Google'}
    </button>
      <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
        <FaApple className="h-5 w-5" />
        Sign in with Apple
      </button>
      <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
        <FaTiktok className="h-5 w-5" />
        Sign in with TikTok
      </button>
    </div>

    {/* Divider */}
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">Or continue with</span>
      </div>
    </div>

     {/* Email/Password Form */}
     <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email field */}
      <div>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Submit button */}
      <Button 
        type="submit" 
        className="w-full py-2.5" 
        variant={mode === 'signin' ? 'primary' : 'success'}  // New prop for different colors
        disabled={isLoading}
      >
        {isLoading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
      </Button>
    </form>
  
   {/* Footer Links */}
   <div className="mt-4 text-center text-sm">
        <a href="#" className="text-gray-600 hover:text-gray-900">
          Forgot your password?
        </a>
      </div>
      <div className="mt-2 text-center text-sm">
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
  )
}