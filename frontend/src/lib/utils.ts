import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale: string = 'ja-JP'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string, locale: string = 'ja-JP'): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}