'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const session = await auth.getSession()
      if (session) {
        const user = await auth.getCurrentUser()
        if (user?.role === 'admin') {
          router.push('/dashboard/admin')
        } else if (user?.role === 'business_owner') {
          router.push('/dashboard/business')
        } else if (user?.role === 'freelancer') {
          router.push('/dashboard/freelancer')
        }
      } else {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
  )
}

