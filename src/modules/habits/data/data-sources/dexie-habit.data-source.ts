import type { EntityTable } from 'dexie'
import { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { HabitRecord } from '@/lib/db'

export class DexieHabitDataSource {
  private readonly table: EntityTable<HabitRecord, 'id'>

  constructor(table: EntityTable<HabitRecord, 'id'>) {
    this.table = table
  }

  async findAll(): Promise<Habit[]> {
    const records = await this.table.toArray()
    return records.map(toHabit)
  }

  async findById(id: string): Promise<Habit | null> {
    const record = await this.table.get(id)
    return record ? toHabit(record) : null
  }

  async save(habit: Habit): Promise<void> {
    await this.table.put(toRecord(habit))
  }
}

function toHabit(r: HabitRecord): Habit {
  return new Habit({
    id: r.id,
    name: r.name,
    kind: r.kind,
    unit: r.unit,
    goal: r.goal,
    frequency: r.frequency,
    categoryId: r.categoryId,
    color: r.color,
    archivedAt: r.archivedAt,
    createdAt: r.createdAt,
  })
}

function toRecord(h: Habit): HabitRecord {
  return {
    id: h.id,
    name: h.name,
    kind: h.kind,
    unit: h.unit,
    goal: h.goal,
    frequency: h.frequency,
    categoryId: h.categoryId,
    color: h.color,
    archivedAt: h.archivedAt,
    createdAt: h.createdAt,
  }
}
