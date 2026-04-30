import { describe, expect, it } from 'vitest'
import { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateCompletionRate30d,
  calculateHabitStats,
} from './calculate-habit-stats'

const TODAY = '2024-03-15'

function makeEntry(date: string): Entry {
  return new Entry({ id: date, habitId: 'h1', date, value: true, createdAt: new Date() })
}

describe('calculateCurrentStreak', () => {
  it('devuelve 0 si no hay entradas', () => {
    expect(calculateCurrentStreak([], TODAY)).toBe(0)
  })

  it('devuelve 0 si la última entrada no es de hoy', () => {
    const entries = [makeEntry('2024-03-13'), makeEntry('2024-03-14')]
    expect(calculateCurrentStreak(entries, TODAY)).toBe(0)
  })

  it('cuenta días consecutivos terminando hoy', () => {
    const entries = [
      makeEntry('2024-03-13'),
      makeEntry('2024-03-14'),
      makeEntry('2024-03-15'),
    ]
    expect(calculateCurrentStreak(entries, TODAY)).toBe(3)
  })

  it('se detiene en el primer hueco', () => {
    const entries = [
      makeEntry('2024-03-12'),
      makeEntry('2024-03-14'),
      makeEntry('2024-03-15'),
    ]
    expect(calculateCurrentStreak(entries, TODAY)).toBe(2)
  })
})

describe('calculateLongestStreak', () => {
  it('devuelve 0 si no hay entradas', () => {
    expect(calculateLongestStreak([])).toBe(0)
  })

  it('devuelve 1 para una sola entrada', () => {
    expect(calculateLongestStreak([makeEntry('2024-03-15')])).toBe(1)
  })

  it('encuentra la racha más larga entre varias', () => {
    const entries = [
      makeEntry('2024-03-01'),
      makeEntry('2024-03-02'),
      makeEntry('2024-03-03'),
      makeEntry('2024-03-10'),
      makeEntry('2024-03-11'),
    ]
    expect(calculateLongestStreak(entries)).toBe(3)
  })

  it('ignora fechas duplicadas', () => {
    const entries = [makeEntry('2024-03-01'), makeEntry('2024-03-01'), makeEntry('2024-03-02')]
    expect(calculateLongestStreak(entries)).toBe(2)
  })
})

describe('calculateCompletionRate30d', () => {
  it('devuelve 0 sin entradas', () => {
    expect(calculateCompletionRate30d([], TODAY)).toBe(0)
  })

  it('devuelve 100 si hay una entrada cada día de los últimos 30', () => {
    const entries = Array.from({ length: 30 }, (_, i) => {
      const d = new Date('2024-03-15T00:00:00')
      d.setDate(d.getDate() - i)
      const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      return makeEntry(s)
    })
    expect(calculateCompletionRate30d(entries, TODAY)).toBe(100)
  })

  it('calcula correctamente para 15 de 30 días', () => {
    const entries = Array.from({ length: 15 }, (_, i) => {
      const d = new Date('2024-03-15T00:00:00')
      d.setDate(d.getDate() - i)
      const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      return makeEntry(s)
    })
    expect(calculateCompletionRate30d(entries, TODAY)).toBe(50)
  })
})

describe('calculateHabitStats', () => {
  it('devuelve las tres métricas juntas', () => {
    const entries = [makeEntry('2024-03-14'), makeEntry('2024-03-15')]
    const stats = calculateHabitStats(entries, TODAY)
    expect(stats.currentStreak).toBe(2)
    expect(stats.longestStreak).toBe(2)
    expect(stats.completionRate30d).toBeGreaterThan(0)
  })
})
