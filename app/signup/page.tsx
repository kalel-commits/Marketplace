'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, UserRole } from '@/lib/auth'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!role) {
      toast.error('Please select a role')
      return
    }

    setLoading(true)

    try {
      await auth.signUp(email, password, fullName, role as UserRole)
      toast.success('Account created! Please check your email to verify.')
      
      // Sign in after signup
      await auth.signIn(email, password)
      const user = await auth.getCurrentUser()
      
      if (user?.role === 'business_owner') {
        router.push('/dashboard/business')
      } else if (user?.role === 'freelancer') {
        router.push('/dashboard/freelancer')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Choose your role to get started
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('business_owner')}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      role === 'business_owner'
                        ? 'border-primary-500 bg-primary-900/30 text-primary-300'
                        : 'border-gray-700 hover:border-primary-600 text-white bg-gray-800'
                    }`}
                  >
                    <div className="font-semibold">Business Owner</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Post tasks and find freelancers
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('freelancer')}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      role === 'freelancer'
                        ? 'border-primary-500 bg-primary-900/30 text-primary-300'
                        : 'border-gray-700 hover:border-primary-600 text-white bg-gray-800'
                    }`}
                  >
                    <div className="font-semibold">Freelancer</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Browse and apply to tasks
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

