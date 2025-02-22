// Manages auth state and functions for the entire app
import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // ✅ Frontend (Client)

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Auth helper functions
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { data, error }
}

export const signInWithTikTok = async () => {
    const supabase = createClientComponentClient()
    return await supabase.auth.signInWithOAuth({
      provider: 'tiktok',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })
  }
  
  export const signInWithApple = async () => {
    const supabase = createClientComponentClient()
    return await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })
  }


export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}