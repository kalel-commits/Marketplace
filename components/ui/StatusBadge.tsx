import React from 'react'

type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
type ApplicationStatus = 'pending' | 'accepted' | 'rejected'

interface StatusBadgeProps {
  status: TaskStatus | ApplicationStatus
  type?: 'task' | 'application'
}

export default function StatusBadge({ status, type = 'task' }: StatusBadgeProps) {
  const styles = {
    task: {
      open: 'bg-green-900/50 text-green-300 border-green-700',
      in_progress: 'bg-blue-900/50 text-blue-300 border-blue-700',
      completed: 'bg-gray-800 text-gray-300 border-gray-700',
      cancelled: 'bg-red-900/50 text-red-300 border-red-700',
    },
    application: {
      pending: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
      accepted: 'bg-green-900/50 text-green-300 border-green-700',
      rejected: 'bg-red-900/50 text-red-300 border-red-700',
    },
  }

  const styleClass = type === 'task' 
    ? styles.task[status as TaskStatus]
    : styles.application[status as ApplicationStatus]

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded border ${styleClass}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
