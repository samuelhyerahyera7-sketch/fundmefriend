import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium' }).format(new Date(date))
}

export function getProgressPercent(raised: number, goal: number) {
  return Math.min(Math.round((raised / goal) * 100), 100)
}

export function getDaysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
