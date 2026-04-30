import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'

export interface EntryRepository {
  findAll(): Promise<Entry[]>
  findByHabitAndDate(habitId: string, date: string): Promise<Entry | null>
  findByDate(date: string): Promise<Entry[]>
  save(entry: Entry): Promise<void>
  delete(entryId: string): Promise<void>
}
