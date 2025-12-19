import { useState, useEffect } from 'react'
import { auth, User } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function useAuth(requiredRole?: User['role']) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        if (!currentUser) {
          if (requiredRole) {
            router.push('/login')
          }
          setUser(null)
          return
        }

        if (requiredRole && currentUser.role !== requiredRole) {
          router.push('/login')
          return
        }

        setUser(currentUser)
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [requiredRole, router])

  const signOut = async () => {
    await auth.signOut()
    router.push('/login')
  }

  return { user, loading, signOut }
}
