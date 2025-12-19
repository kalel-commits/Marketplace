import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-gray-900 rounded-lg shadow-lg border border-gray-800 ${hover ? 'hover:bg-gray-800 hover:shadow-xl transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
