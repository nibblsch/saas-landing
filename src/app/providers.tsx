'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import PostHogPageView from "./PostHogPageView"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize PostHog with debug mode in development
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
            person_profiles: 'identified_only',
            capture_pageview: false, // Disable automatic pageview capture
            loaded: (posthog) => {
                if (process.env.NODE_ENV === 'development') posthog.debug()
            }
        })
    }, [])

    return (
        <PHProvider client={posthog}>
            <PostHogPageView />
            {children}
        </PHProvider>
    )
}