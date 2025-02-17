// PostHog configuration and initialization
import posthog from 'posthog-js'

// Only initialize PostHog in production to avoid tracking development events
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com',  // PostHog Cloud host
    persistence: 'localStorage',  // Use localStorage for better persistence
    capture_pageview: true,      // Automatically capture pageviews
    capture_pageleave: true,     // Track when users leave pages
    bootstrap: {                 // Set initial user properties
      browser: navigator.userAgent
    }
  })
}

// Export for use in components
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    posthog.capture(eventName, properties)
  } else {
    console.log(`[DEV] PostHog Event:`, eventName, properties)
  }
}

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    posthog.identify(userId, properties)
  } else {
    console.log(`[DEV] PostHog Identify:`, userId, properties)
  }
}

export default posthog