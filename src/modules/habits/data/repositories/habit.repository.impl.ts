import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { HabitRepository } from '@/modules/habits/domain/repositories/habit.repository'
import type { DexieHabitDataSource } from '@/modules/habits/data/data-sources/dexie-habit.data-source'

export class HabitRepositoryImpl implements HabitRepository {
  private readonly dataSource: DexieHabitDataSource

  constructor(dataSource: DexieHabitDataSource) {
    this.dataSource = dataSource
  }

  findAll(): Promise<Habit[]> {
    return this.dataSource.findAll()
  }

  findById(id: string): Promise<Habit | null> {
    return this.dataSource.findById(id)
  }

  save(habit: Habit): Promise<void> {
    return this.dataSource.save(habit)
  }
}
