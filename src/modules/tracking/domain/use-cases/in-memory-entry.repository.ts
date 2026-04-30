import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { EntryRepository } from '@/modules/tracking/domain/repositories/entry.repository'

export class InMemoryEntryRepository implements EntryRepository {
  private readonly entries: Map<string, Entry> = new Map()

  async findByHabitAndDate(habitId: string, date: string): Promise<Entry | null> {
    for (const entry of this.entries.values()) {
      if (entry.habitId === habitId && entry.date === date) return entry
    }
    return null
  }

  async findByDate(date: string): Promise<Entry[]> {
    return Array.from(this.entries.values()).filter((e) => e.date === date)
  }

  async save(entry: Entry): Promise<void> {
    this.entries.set(entry.id, entry)
  }

  async delete(entryId: string): Promise<void> {
    this.entries.delete(entryId)
  }
}
