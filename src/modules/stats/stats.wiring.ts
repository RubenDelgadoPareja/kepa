import { db } from '@/lib/db'
import { DexieHabitDataSource } from '@/modules/habits/data/data-sources/dexie-habit.data-source'
import { HabitRepositoryImpl } from '@/modules/habits/data/repositories/habit.repository.impl'
import { ListHabitsUseCase } from '@/modules/habits/domain/use-cases/list-habits.use-case'
import { DexieEntryDataSource } from '@/modules/tracking/data/data-sources/dexie-entry.data-source'
import { EntryRepositoryImpl } from '@/modules/tracking/data/repositories/entry.repository.impl'

export function createStatsDependencies() {
  const habitDataSource = new DexieHabitDataSource(db.habits)
  const habitRepository = new HabitRepositoryImpl(habitDataSource)

  const entryDataSource = new DexieEntryDataSource(db.entries)
  const entryRepository = new EntryRepositoryImpl(entryDataSource)

  return {
    listHabits: new ListHabitsUseCase(habitRepository),
    getAllEntries: () => entryRepository.findAll(),
  }
}
