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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (sessionId) {
      posthog?.capture('checkout_completed', {
        signup_step: 'checkout',
        session_id: sessionId,
        timestamp: new Date().toISOString()
      })
    }
  }, [sessionId, posthog])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

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
    </div>
  )
}