// ADD NEW FILE: src/app/dashboard/page.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { signOut } from '@/lib/auth'

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h1>
      <Button onClick={async () => {
        await signOut()
        router.push('/')
      }}>
        Sign Out
      </Button>
    </div>
  )
}