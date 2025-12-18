'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { tasks, Task } from '@/lib/tasks'
import Navbar from '@/components/Navbar'

const CATEGORIES = [
  'Website Creation',
  'Social Media Management',
  'Reel Editing',
  'Branding',
  'Other',
]

export default function TasksPage() {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    location: '',
  })

  useEffect(() => {
    loadTasks()
  }, [filters])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const data = await tasks.getTasks({
        status: 'open',
        ...(filters.category && { category: filters.category }),
        ...(filters.location && { location: filters.location }),
      })
      setTaskList(data)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Browse Tasks</h1>
          </div>

          <div className="bg-gray-900 shadow-lg rounded-lg p-6 mb-6 border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  className="w-full rounded-md border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border bg-gray-800 text-white"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border bg-gray-800 text-white"
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            </div>
          ) : taskList.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-lg shadow border border-gray-800">
              <p className="text-gray-400">No tasks found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {taskList.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="bg-gray-900 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all border border-gray-800 p-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {task.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-primary-900/50 text-primary-300 rounded border border-primary-700">
                      {task.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {task.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">📍 {task.location}</span>
                    <span className="font-semibold text-primary-400">₹{task.budget.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

