import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'

export interface HabitStats {
  currentStreak: number
  longestStreak: number
  completionRate30d: number
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function prevDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return toLocalDateStr(d)
}

function diffDays(a: string, b: string): number {
  const msA = new Date(a + 'T00:00:00').getTime()
  const msB = new Date(b + 'T00:00:00').getTime()
  return Math.round((msB - msA) / 86_400_000)
}

function daysAgo(today: string, n: number): string {
  const d = new Date(today + 'T00:00:00')
  d.setDate(d.getDate() - n)
  return toLocalDateStr(d)
}

export function calculateCurrentStreak(entries: Entry[], today: string): number {
  const dates = new Set(entries.map((e) => e.date))
  let streak = 0
  let cursor = today
  while (dates.has(cursor)) {
    streak++
    cursor = prevDay(cursor)
  }
  return streak
}

export function calculateLongestStreak(entries: Entry[]): number {
  if (entries.length === 0) return 0
  const sorted = [...new Set(entries.map((e) => e.date))].sort()
  let longest = 1
  let current = 1
  for (let i = 1; i < sorted.length; i++) {
    if (diffDays(sorted[i - 1], sorted[i]) === 1) {
      current++
      if (current > longest) longest = current
    } else if (diffDays(sorted[i - 1], sorted[i]) > 1) {
      current = 1
    }
  }
  return longest
}

export function calculateCompletionRate30d(entries: Entry[], today: string): number {
  const dates = new Set(entries.map((e) => e.date))
  let completed = 0
  for (let i = 0; i < 30; i++) {
    if (dates.has(daysAgo(today, i))) completed++
  }
  return Math.round((completed / 30) * 100)
}

export function calculateHabitStats(entries: Entry[], today: string): HabitStats {
  return {
    currentStreak: calculateCurrentStreak(entries, today),
    longestStreak: calculateLongestStreak(entries),
    completionRate30d: calculateCompletionRate30d(entries, today),
  }
}
