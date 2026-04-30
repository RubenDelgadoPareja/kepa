import { db } from '@/lib/db'
import { DexieHabitDataSource } from '@/modules/habits/data/data-sources/dexie-habit.data-source'
import { HabitRepositoryImpl } from '@/modules/habits/data/repositories/habit.repository.impl'
import { ListHabitsUseCase } from '@/modules/habits/domain/use-cases/list-habits.use-case'
import { DexieEntryDataSource } from './data/data-sources/dexie-entry.data-source'
import { EntryRepositoryImpl } from './data/repositories/entry.repository.impl'
import { ClearEntryUseCase } from './domain/use-cases/clear-entry.use-case'
import { GetDayEntriesUseCase } from './domain/use-cases/get-day-entries.use-case'
import { SetEntryUseCase } from './domain/use-cases/set-entry.use-case'

export function createTrackingDependencies() {
  const entryDataSource = new DexieEntryDataSource(db.entries)
  const entryRepository = new EntryRepositoryImpl(entryDataSource)

  const habitDataSource = new DexieHabitDataSource(db.habits)
  const habitRepository = new HabitRepositoryImpl(habitDataSource)

  return {
    listHabits: new ListHabitsUseCase(habitRepository),
    getDayEntries: new GetDayEntriesUseCase(entryRepository),
    setEntry: new SetEntryUseCase(entryRepository),
    clearEntry: new ClearEntryUseCase(entryRepository),
  }
}
