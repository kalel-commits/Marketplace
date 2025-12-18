'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { tasks, Task } from '@/lib/tasks'
import { applications, Application } from '@/lib/tasks'
import { auth, User } from '@/lib/auth'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'

export default function TaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [applicationsList, setApplicationsList] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [proposal, setProposal] = useState('')
  const [proposedPrice, setProposedPrice] = useState('')
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    setLoading(true)
    try {
      const currentUser = await auth.getCurrentUser()
      setUser(currentUser)

      const taskData = await tasks.getTaskById(params.id as string)
      setTask(taskData)

      // Load applications if user is the business owner
      if (currentUser?.role === 'business_owner' && currentUser.id === taskData.business_owner_id) {
        try {
          const apps = await applications.getApplicationsByTask(taskData.id)
          setApplicationsList(apps)
          console.log('Loaded applications:', apps.length)
        } catch (error) {
          console.error('Error loading applications:', error)
          toast.error('Failed to load applications')
        }
      }
    } catch (error) {
      console.error('Failed to load task:', error)
      toast.error('Failed to load task')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || user.role !== 'freelancer') {
      toast.error('Only freelancers can apply to tasks')
      return
    }

    setApplying(true)
    try {
      await applications.createApplication({
        task_id: task!.id,
        freelancer_id: user.id,
        proposal,
        proposed_price: parseFloat(proposedPrice),
      })
      toast.success('Application submitted successfully!')
      setShowApplyForm(false)
      setProposal('')
      setProposedPrice('')
      // Note: Applications will be visible to business owner when they refresh or visit the page
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  const handleWhatsApp = (phone?: string) => {
    if (!phone) {
      toast.error('Phone number not available')
      return
    }
    const message = encodeURIComponent(`Hi! I'm interested in discussing the task: ${task?.title}`)
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank')
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

  if (!task) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <p className="text-gray-400">Task not found</p>
        </div>
      </>
    )
  }

  const isOwner = user?.id === task.business_owner_id
  const canApply = user?.role === 'freelancer' && !isOwner

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/tasks"
            className="text-primary-400 hover:text-primary-300 mb-4 inline-block transition-colors"
          >
            ← Back to tasks
          </Link>

          <div className="bg-gray-900 shadow-lg rounded-lg border border-gray-800 p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{task.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-primary-900/50 text-primary-300 rounded-full font-medium border border-primary-700">
                    {task.category}
                  </span>
                  <span>📍 {task.location}</span>
                  <span className="font-semibold text-primary-400">₹{task.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{task.description}</p>
            </div>

            {task.business_owner && (
              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Posted by</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{task.business_owner.full_name}</p>
                    {task.business_owner.location && (
                      <p className="text-sm text-gray-400">📍 {task.business_owner.location}</p>
                    )}
                  </div>
                  {task.business_owner.phone && (
                    <button
                      onClick={() => handleWhatsApp(task.business_owner?.phone)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 flex items-center space-x-2 transition-colors"
                    >
                      <span>💬</span>
                      <span>Contact via WhatsApp</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {canApply && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                {!showApplyForm ? (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
                  >
                    Apply to this Task
                  </button>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Proposal *
                      </label>
                      <textarea
                        required
                        rows={4}
                        className="w-full rounded-md border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border bg-gray-800 text-white"
                        placeholder="Explain why you're the right fit for this task..."
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Proposed Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="w-full rounded-md border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border bg-gray-800 text-white"
                        placeholder="5000"
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowApplyForm(false)
                          setProposal('')
                          setProposedPrice('')
                        }}
                        className="flex-1 px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={applying}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 disabled:opacity-50 transition-colors"
                      >
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {isOwner && (
            <div className="bg-gray-900 shadow-lg rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Applications ({applicationsList.length})
              </h2>
              {applicationsList.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No applications yet. Applications will appear here when freelancers apply to this task.
                </p>
              ) : (
                <div className="space-y-4">
                  {applicationsList.map((app) => (
                  <div key={app.id} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">
                          {app.freelancer?.full_name || 'Unknown'}
                        </p>
                        {app.freelancer?.location && (
                          <p className="text-sm text-gray-400">📍 {app.freelancer.location}</p>
                        )}
                      </div>
                      <div className="text-right">
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
                    <p className="text-gray-300 mb-3">{app.proposal}</p>
                    <div className="flex items-center space-x-2">
                      {app.freelancer?.phone && (
                        <button
                          onClick={() => handleWhatsApp(app.freelancer?.phone)}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-500 transition-colors"
                        >
                          💬 WhatsApp
                        </button>
                      )}
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={async () => {
                              await applications.updateApplicationStatus(app.id, 'accepted')
                              await loadData()
                              toast.success('Application accepted')
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-500 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={async () => {
                              await applications.updateApplicationStatus(app.id, 'rejected')
                              await loadData()
                              toast.success('Application rejected')
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

