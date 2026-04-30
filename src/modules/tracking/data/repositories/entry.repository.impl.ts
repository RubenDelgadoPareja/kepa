import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { EntryRepository } from '@/modules/tracking/domain/repositories/entry.repository'
import type { DexieEntryDataSource } from '@/modules/tracking/data/data-sources/dexie-entry.data-source'

export class EntryRepositoryImpl implements EntryRepository {
  private readonly dataSource: DexieEntryDataSource

  constructor(dataSource: DexieEntryDataSource) {
    this.dataSource = dataSource
  }

  findByHabitAndDate(habitId: string, date: string): Promise<Entry | null> {
    return this.dataSource.findByHabitAndDate(habitId, date)
  }

  findByDate(date: string): Promise<Entry[]> {
    return this.dataSource.findByDate(date)
  }

  save(entry: Entry): Promise<void> {
    return this.dataSource.save(entry)
  }

  delete(entryId: string): Promise<void> {
    return this.dataSource.delete(entryId)
  }
}
