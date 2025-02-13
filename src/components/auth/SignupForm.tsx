'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { FcGoogle } from 'react-icons/fc'  // We'll need to install react-icons
import { FaApple, FaTiktok } from 'react-icons/fa'

// This will be expanded when we add actual authentication
export function SignupForm() {
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Form submission handler - we'll implement actual auth later
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Add actual authentication
    console.log('Signup submitted:', { email, password })
    setIsLoading(false)
  }

  return (
    <div className="w-full">
    {/* Social Login Buttons */}
    <div className="space-y-3">
      <button className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
        <FcGoogle className="h-5 w-5" />
        Sign in with Google
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
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
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
          Don't have an account?{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">
            Sign up
          </a>
        </span>
      </div>
    </div>
  )
}