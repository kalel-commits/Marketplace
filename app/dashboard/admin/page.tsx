'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, User } from '@/lib/auth'
import { tasks, Task } from '@/lib/tasks'
import { applications, Application } from '@/lib/tasks'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import Navbar from '@/components/Navbar'

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [allApplications, setAllApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const currentUser = await auth.getCurrentUser()
      if (!currentUser || currentUser.role !== 'admin') {
        router.push('/login')
        return
      }
      setUser(currentUser)

      // Load all users
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const usersList: User[] = []
      usersSnapshot.forEach((doc) => {
        const userData = doc.data()
        usersList.push({
          id: doc.id,
          ...userData,
          created_at: userData.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as User)
      })
      setAllUsers(usersList)

      // Load all tasks
      const tasksData = await tasks.getTasks()
      setAllTasks(tasksData)

      // Load all applications
      const applicationsSnapshot = await getDocs(collection(db, 'applications'))
      const applicationsList: Application[] = []
      for (const appDoc of applicationsSnapshot.docs) {
        const appData = appDoc.data()
        
        // Fetch related data
        let freelancer: User | undefined
        let task: Task | undefined

        if (appData.freelancer_id) {
          const freelancerDoc = usersList.find(u => u.id === appData.freelancer_id)
          if (freelancerDoc) freelancer = freelancerDoc
        }

        if (appData.task_id) {
          const taskDoc = tasksData.find(t => t.id === appData.task_id)
          if (taskDoc) task = taskDoc
        }

        applicationsList.push({
          id: appDoc.id,
          ...appData,
          created_at: appData.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          freelancer,
          task,
        } as Application)
      }
      setAllApplications(applicationsList)
    } catch (error) {
      console.error('Failed to load admin dashboard:', error)
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

  const stats = {
    totalUsers: allUsers.length,
    businessOwners: allUsers.filter(u => u.role === 'business_owner').length,
    freelancers: allUsers.filter(u => u.role === 'freelancer').length,
    totalTasks: allTasks.length,
    openTasks: allTasks.filter(t => t.status === 'open').length,
    totalApplications: allApplications.length,
    pendingApplications: allApplications.filter(a => a.status === 'pending').length,
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Total Users</div>
              <div className="mt-2 text-3xl font-bold text-primary-400">{stats.totalUsers}</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.businessOwners} Business Owners, {stats.freelancers} Freelancers
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Total Tasks</div>
              <div className="mt-2 text-3xl font-bold text-blue-400">{stats.totalTasks}</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.openTasks} Open
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Total Applications</div>
              <div className="mt-2 text-3xl font-bold text-green-400">{stats.totalApplications}</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.pendingApplications} Pending
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6">
              <div className="text-sm font-medium text-gray-400">Admin Access</div>
              <div className="mt-2 text-sm text-gray-300">Full System Access</div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-900 shadow-lg rounded-lg border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">All Users ({allUsers.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{u.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          u.role === 'admin' ? 'bg-purple-900/50 text-purple-300 border border-purple-700' :
                          u.role === 'business_owner' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
                          'bg-green-900/50 text-green-300 border border-green-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.location || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="bg-gray-900 shadow-lg rounded-lg border border-gray-800 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">All Tasks ({allTasks.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {allTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        <Link href={`/tasks/${task.id}`} className="text-primary-400 hover:text-primary-300 transition-colors">
                          {task.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{task.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₹{task.budget.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          task.status === 'open' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                          task.status === 'in_progress' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
                          task.status === 'completed' ? 'bg-gray-800 text-gray-300 border border-gray-700' :
                          'bg-red-900/50 text-red-300 border border-red-700'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(task.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-gray-900 shadow-lg rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-bold text-white mb-4">All Applications ({allApplications.length})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Freelancer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Proposed Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Applied</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {allApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {app.freelancer?.full_name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        <Link href={`/tasks/${app.task_id}`} className="text-primary-400 hover:text-primary-300 transition-colors">
                          {app.task?.title || 'Task'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">₹{app.proposed_price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          app.status === 'accepted' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                          app.status === 'rejected' ? 'bg-red-900/50 text-red-300 border border-red-700' :
                          'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

