import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatExpirationDate(unixTimestamp: string | number): string {
  try {
    const timestamp = typeof unixTimestamp === 'string' ? parseInt(unixTimestamp) : unixTimestamp
    const date = new Date(timestamp * 1000)
    return format(date, 'MMM dd, yyyy')
  } catch (error) {
    return 'Invalid date'
  }
}
