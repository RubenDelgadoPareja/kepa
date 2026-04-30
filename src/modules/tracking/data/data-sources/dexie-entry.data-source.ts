import type { EntityTable } from 'dexie'
import { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { EntryRecord } from '@/lib/db'

export class DexieEntryDataSource {
  private readonly table: EntityTable<EntryRecord, 'id'>

  constructor(table: EntityTable<EntryRecord, 'id'>) {
    this.table = table
  }

  async findAll(): Promise<Entry[]> {
    const records = await this.table.toArray()
    return records.map(toEntry)
  }

  async findByHabitAndDate(habitId: string, date: string): Promise<Entry | null> {
    const record = await this.table.where('[habitId+date]').equals([habitId, date]).first()
    return record ? toEntry(record) : null
  }

  async findByDate(date: string): Promise<Entry[]> {
    const records = await this.table.where('date').equals(date).toArray()
    return records.map(toEntry)
  }

  async save(entry: Entry): Promise<void> {
    await this.table.put(toRecord(entry))
  }

  async delete(entryId: string): Promise<void> {
    await this.table.delete(entryId)
  }
}

function toEntry(r: EntryRecord): Entry {
  return new Entry({
    id: r.id,
    habitId: r.habitId,
    date: r.date,
    value: r.value,
    createdAt: r.createdAt,
  })
}

function toRecord(e: Entry): EntryRecord {
  return {
    id: e.id,
    habitId: e.habitId,
    date: e.date,
    value: e.value,
    createdAt: e.createdAt,
  }
}
