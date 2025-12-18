'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, User } from '@/lib/auth'
import { tasks, Task } from '@/lib/tasks'
import { applications, Application } from '@/lib/tasks'
import Navbar from '@/components/Navbar'

export default function FreelancerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [myApplications, setMyApplications] = useState<Application[]>([])
  const [availableTasks, setAvailableTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const currentUser = await auth.getCurrentUser()
      if (!currentUser || currentUser.role !== 'freelancer') {
        router.push('/login')
        return
      }
      setUser(currentUser)

      const applicationsData = await applications.getApplicationsByFreelancer(currentUser.id)
      setMyApplications(applicationsData)

      const tasksData = await tasks.getTasks({ status: 'open' })
      setAvailableTasks(tasksData.slice(0, 5))
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </>
    )
  }

  const pendingApps = myApplications.filter(a => a.status === 'pending').length
  const acceptedApps = myApplications.filter(a => a.status === 'accepted').length
  const rejectedApps = myApplications.filter(a => a.status === 'rejected').length

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Freelancer Dashboard</h1>
            <Link
              href="/tasks"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
            >
              Browse All Tasks
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Pending Applications</div>
              <div className="mt-2 text-3xl font-bold text-yellow-400">{pendingApps}</div>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Accepted</div>
              <div className="mt-2 text-3xl font-bold text-green-400">{acceptedApps}</div>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Rejected</div>
              <div className="mt-2 text-3xl font-bold text-red-400">{rejectedApps}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">My Applications</h2>
              </div>
              {myApplications.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No applications yet. <Link href="/tasks" className="text-primary-400 hover:text-primary-300">Browse tasks</Link> to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {myApplications.slice(0, 5).map((app) => (
                    <Link
                      key={app.id}
                      href={`/tasks/${app.task_id}`}
                      className="block border border-gray-800 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{app.task?.title || 'Task'}</h3>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{app.proposal}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            {app.task?.category && <span>{app.task.category}</span>}
                            {app.task?.location && <span>📍 {app.task.location}</span>}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-primary-400">₹{app.proposed_price.toLocaleString()}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            app.status === 'accepted' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                            app.status === 'rejected' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                            'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {myApplications.length > 5 && (
                    <Link
                      href="/tasks"
                      className="block text-center text-primary-400 hover:text-primary-300 text-sm transition-colors"
                    >
                      View all applications →
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Available Tasks</h2>
                <Link
                  href="/tasks"
                  className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
                >
                  View All →
                </Link>
              </div>
              {availableTasks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No available tasks</p>
              ) : (
                <div className="space-y-4">
                  {availableTasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="block border border-gray-800 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{task.title}</h3>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{task.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{task.category}</span>
                            <span>📍 {task.location}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-primary-400">₹{task.budget.toLocaleString()}</p>
                          <span className="text-xs px-2 py-1 rounded bg-green-900/50 text-green-300 border border-green-700">
                            open
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

