'use client' // Add this since we're using onClick

import Link from 'next/link'
import { Button } from '../ui/button'

// Add prop type for modal trigger
type HeaderProps = {
  onOpenSignup: () => void  // Function to open signup modal
}

export default function Header({ onOpenSignup }: HeaderProps) {
  return (
    <header className="border-b sticky top-0 bg-white z-10">
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl">
          BabyGPT
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-gray-900">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="#faq" className="text-gray-600 hover:text-gray-900">
            FAQ
          </Link>
          <Button onClick={onOpenSignup}>
            Sign Up
          </Button>
        </div>

        {/* Mobile menu button - we'll implement this later */}
        <button className="md:hidden">
          <span className="sr-only">Open menu</span>
          {/* Add menu icon here */}
        </button>
        
      </nav>
    </header>
  )
}