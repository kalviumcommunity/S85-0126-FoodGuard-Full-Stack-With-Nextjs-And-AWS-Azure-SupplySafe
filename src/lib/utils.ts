import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'compliant':
    case 'approved':
    case 'active':
    case 'delivered':
      return 'text-green-700 bg-green-50 border-green-200'
    case 'pending':
    case 'in-transit':
    case 'processing':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'non-compliant':
    case 'rejected':
    case 'expired':
    case 'critical':
      return 'text-red-700 bg-red-50 border-red-200'
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200'
  }
}
