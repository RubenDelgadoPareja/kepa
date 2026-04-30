import { db } from '@/lib/db'
import { DexieHabitDataSource } from './data/data-sources/dexie-habit.data-source'
import { HabitRepositoryImpl } from './data/repositories/habit.repository.impl'
import { ArchiveHabitUseCase } from './domain/use-cases/archive-habit.use-case'
import { CreateHabitUseCase } from './domain/use-cases/create-habit.use-case'
import { EditHabitUseCase } from './domain/use-cases/edit-habit.use-case'
import { ListHabitsUseCase } from './domain/use-cases/list-habits.use-case'

export function createHabitDependencies() {
  const dataSource = new DexieHabitDataSource(db.habits)
  const repository = new HabitRepositoryImpl(dataSource)
  return {
    listHabits: new ListHabitsUseCase(repository),
    createHabit: new CreateHabitUseCase(repository),
    archiveHabit: new ArchiveHabitUseCase(repository),
    editHabit: new EditHabitUseCase(repository),
  }
}
