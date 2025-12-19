import { useState, useEffect } from 'react'
import { tasks, Task } from '@/lib/tasks'
import toast from 'react-hot-toast'

interface UseTasksOptions {
  filters?: {
    category?: string
    location?: string
    status?: string
    business_owner_id?: string
  }
  autoLoad?: boolean
}

export function useTasks(options: UseTasksOptions = {}) {
  const { filters = {}, autoLoad = true } = options
  const [taskList, setTaskList] = useState<Task[]>([])
  const [loading, setLoading] = useState(autoLoad)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tasks.getTasks(filters)
      setTaskList(data)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load tasks'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoLoad) {
      loadTasks()
    }
  }, [JSON.stringify(filters)])

  return { taskList, loading, error, reload: loadTasks }
}
