'use client' // Add this since we're using onClick

import Link from 'next/link'
import { Button } from '../ui/Button'

export default function Header() {
  return (
    <header className="border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl">
          BabyGPT
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Button onClick={() => console.log('Open signup modal')}>
            Sign Up
          </Button>
        </div>
      </nav>
    </header>
  )
}