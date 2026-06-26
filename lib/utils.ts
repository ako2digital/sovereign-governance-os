import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date?: string | null): string {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatValue(value?: string | null): string {
  if (!value) return "—"
  return value
}

export function formatSensitivity(level?: string | null): string {
  if (!level) return "—"
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function formatPersonName(
  person: { full_name?: string | null; preferred_name?: string | null } | null
): string {
  if (!person) return "Unknown person"
  return person.preferred_name || person.full_name || "Unknown person"
}
