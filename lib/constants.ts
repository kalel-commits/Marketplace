export const CATEGORIES = [
  'Website Creation',
  'Social Media Management',
  'Reel Editing',
  'Branding',
  'Other',
] as const

export type Category = typeof CATEGORIES[number]

export const TASK_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'] as const
export const APPLICATION_STATUSES = ['pending', 'accepted', 'rejected'] as const

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget_high', label: 'Budget: High to Low' },
  { value: 'budget_low', label: 'Budget: Low to High' },
] as const
