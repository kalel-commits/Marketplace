'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, User } from '@/lib/auth'
import { tasks, Task } from '@/lib/tasks'
import { applications, Application } from '@/lib/tasks'
import Navbar from '@/components/Navbar'

export default function BusinessDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [myTasks, setMyTasks] = useState<Task[]>([])
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const currentUser = await auth.getCurrentUser()
      if (!currentUser || currentUser.role !== 'business_owner') {
        router.push('/login')
        return
      }
      setUser(currentUser)

      const tasksData = await tasks.getTasks({ business_owner_id: currentUser.id })
      setMyTasks(tasksData)

      // Get applications for all tasks
      const allApplications: Application[] = []
      for (const task of tasksData) {
        const apps = await applications.getApplicationsByTask(task.id)
        allApplications.push(...apps)
      }
      setRecentApplications(allApplications.slice(0, 5))
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

  const openTasks = myTasks.filter(t => t.status === 'open').length
  const inProgressTasks = myTasks.filter(t => t.status === 'in_progress').length
  const completedTasks = myTasks.filter(t => t.status === 'completed').length
  const pendingApplications = recentApplications.filter(a => a.status === 'pending').length

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Business Dashboard</h1>
            <Link
              href="/tasks/create"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
            >
              + Create New Task
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Open Tasks</div>
              <div className="mt-2 text-3xl font-bold text-primary-400">{openTasks}</div>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">In Progress</div>
              <div className="mt-2 text-3xl font-bold text-blue-400">{inProgressTasks}</div>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Completed</div>
              <div className="mt-2 text-3xl font-bold text-green-400">{completedTasks}</div>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Pending Applications</div>
              <div className="mt-2 text-3xl font-bold text-yellow-400">{pendingApplications}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">My Tasks</h2>
                <Link
                  href="/tasks/create"
                  className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
                >
                  + New Task
                </Link>
              </div>
              {myTasks.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No tasks yet. <Link href="/tasks/create" className="text-primary-400 hover:text-primary-300">Create your first task</Link>
                </p>
              ) : (
                <div className="space-y-4">
                  {myTasks.slice(0, 5).map((task) => (
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
                            <span className="font-semibold text-primary-400">₹{task.budget.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className={`ml-4 px-2 py-1 text-xs rounded ${
                          task.status === 'open' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                          task.status === 'in_progress' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
                          task.status === 'completed' ? 'bg-gray-800 text-gray-300 border border-gray-700' :
                          'bg-red-900/50 text-red-300 border border-red-700'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                  {myTasks.length > 5 && (
                    <Link
                      href="/tasks"
                      className="block text-center text-primary-400 hover:text-primary-300 text-sm transition-colors"
                    >
                      View all tasks →
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Applications</h2>
              {recentApplications.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No applications yet</p>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <Link
                      key={app.id}
                      href={`/tasks/${app.task_id}`}
                      className="block border border-gray-800 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">
                            {app.freelancer?.full_name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">{app.proposal}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Applied to: {app.task?.title || 'Task'}
                          </p>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

