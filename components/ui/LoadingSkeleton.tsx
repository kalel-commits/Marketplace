import React from 'react'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className = '', lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-800 rounded mb-2" />
      ))}
    </div>
  )
}

export function TaskCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-6 bg-gray-800 rounded w-3/4"></div>
        <div className="h-5 bg-gray-800 rounded w-20"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-800 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-800 rounded w-24"></div>
        <div className="h-5 bg-gray-800 rounded w-20"></div>
      </div>
    </div>
  )
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6 animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-24 mb-2"></div>
      <div className="h-8 bg-gray-800 rounded w-16"></div>
    </div>
  )
}
