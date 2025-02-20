// ADD: src/components/checkout/PaymentOptions.tsx
'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { FaGoogle, FaApple, FaPaypal } from 'react-icons/fa'

interface PaymentOptionsProps {
  amount: number
  onSuccess: (paymentMethod: string) => void
  onError: (error: Error) => void
}

export function PaymentOptions({ amount, onSuccess, onError }: PaymentOptionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="space-y-4">
      {/* Quick payment options */}
      <div className="space-y-3">
        <button
          onClick={() => {/* Google Pay integration */}}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          <FaGoogle className="h-5 w-5" />
          <span>Pay with Google Pay</span>
        </button>
        
        <button
          onClick={() => {/* Apple Pay integration */}}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          <FaApple className="h-5 w-5" />
          <span>Pay with Apple Pay</span>
        </button>

        <button
          onClick={() => {/* PayPal integration */}}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          <FaPaypal className="h-5 w-5" />
          <span>Pay with PayPal</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or pay with card</span>
        </div>
      </div>

      {/* Stripe Card Element will go here */}
    </div>
  )
}