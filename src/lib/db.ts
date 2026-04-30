import Dexie, { type EntityTable } from 'dexie'

export interface HabitRecord {
  id: string
  name: string
  kind: 'binary' | 'quantitative'
  unit: 'km' | 'minutes' | 'reps' | null
  goal: { value: number; period: 'daily' | 'weekly' } | null
  frequency: { type: 'daily' } | { type: 'weekly'; timesPerWeek: number }
  categoryId: string | null
  color: string
  archivedAt: Date | null
  createdAt: Date
}

export interface CategoryRecord {
  id: string
  name: string
  color: string
  createdAt: Date
}

export interface EntryRecord {
  id: string
  habitId: string
  date: string
  value: boolean | number
  createdAt: Date
}

class KepaDatabase extends Dexie {
  habits!: EntityTable<HabitRecord, 'id'>
  categories!: EntityTable<CategoryRecord, 'id'>
  entries!: EntityTable<EntryRecord, 'id'>

  constructor() {
    super('kepa')
    this.version(1).stores({
      habits: 'id, archivedAt, categoryId, createdAt',
      categories: 'id, createdAt',
      entries: 'id, habitId, date, [habitId+date]',
    })
  }
}

export const db = new KepaDatabase()
