/******************************************
 * FILE: src/app/dashboard/page.tsx
 * PURPOSE: Main dashboard interface mimicking ChatGPT's design
 ******************************************/

'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { SendHorizontal, Menu, Plus, Settings } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'

// Message interface for type safety
interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

  // Add new interface for popup state
  interface HighTrafficPopup {
    show: boolean
    message: string
  }

export default function SuccessPage() {
  // State management
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const sessionId = searchParams.get('session_id')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)


     // Add new state for contact form and popup
   const [showContactForm, setShowContactForm] = useState(false)
   const [contactEmail, setContactEmail] = useState('')
   const [contactMessage, setContactMessage] = useState('')
   const [popup, setPopup] = useState<HighTrafficPopup>({
     show: true,
     message: 'BabyGPT is currently experiencing a period of increased requests. Please check back in a few minutes.'
   })

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (sessionId) {
    // Track checkout completion
      posthog?.capture('checkout_completed', {
        signup_step: 'checkout',
        session_id: sessionId,
        timestamp: new Date().toISOString()
      })

    // Track payment success
      posthog?.capture('payment_successful', {
        session_id: sessionId,
        timestamp: new Date().toISOString()
      })
    }
  }, [sessionId, posthog])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Show high traffic popup on first message
    if (messages.length === 0) {
      setPopup({
        show: true,
        message: 'BabyGPT is currently experiencing a period of increased requests. Please check back in a few minutes.'
      })
      return
    }

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'This is a placeholder response. API integration coming soon!',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    setInput(textarea.value)
  }

     // Add contact form handler
   const handleContactSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     try {
       const response = await fetch('/api/contact', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           email: contactEmail,
           message: contactMessage,
           to: 'thebabygpt@gmail.com'
         })
       })
       
       if (!response.ok) throw new Error('Failed to send message')
       
       setContactEmail('')
       setContactMessage('')
       setShowContactForm(false)
       
       // Show success message
       alert('Message sent successfully!')
     } catch (error) {
       console.error('Error sending message:', error)
       alert('Failed to send message. Please try again.')
     }
   }

   {/*
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to BabyGPT!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your subscription has been successfully activated.
        </p>
      </div>
    </div>
  )
    */}

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4 flex flex-col">
        <Button 
          className="flex items-center gap-2 w-full mb-4"
          variant="outline"
        >
          <Plus size={16} /> New Chat
        </Button>
        
        <div className="flex-grow">
          {/* Chat history goes here */}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <Button
            className="flex items-center gap-2 w-full text-gray-300"
            variant="ghost"
          >
            <Settings size={16} /> Settings
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* High Traffic Popup */}
        {popup.show && (
          <div className="absolute top-4 right-4 left-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 z-50 flex justify-between items-center">
            <p className="text-yellow-800">{popup.message}</p>
            <button
              onClick={() => setPopup(prev => ({ ...prev, show: false }))}
              className="text-yellow-800 hover:text-yellow-900"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {/* Chat header */}
        <header className="p-4 border-b">
          <h1 className="text-xl font-semibold">BabyGPT Chat</h1>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              placeholder="Ask anything about parenting..."
              className="w-full p-3 pr-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              rows={1}
              style={{ maxHeight: '200px' }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2"
              variant="ghost"
            >
              <SendHorizontal 
                className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`}
              />
            </Button>
          </form>
        </div>
      </div>

            {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Contact Us</h2>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}