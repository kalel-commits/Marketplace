import React from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  icon?: React.ReactNode
}

export default function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
      {description && <p className="text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>}
      {action && (
        <div>
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
            >
              {action.label}
            </a>
          ) : action.onClick ? (
            <button
              onClick={action.onClick}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-500 transition-colors"
            >
              {action.label}
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}
