import { db } from '@/lib/db'
import { DexieHabitDataSource } from './data/data-sources/dexie-habit.data-source'
import { HabitRepositoryImpl } from './data/repositories/habit.repository.impl'
import { ArchiveHabitUseCase } from './domain/use-cases/archive-habit.use-case'
import { CreateHabitUseCase } from './domain/use-cases/create-habit.use-case'
import { EditHabitUseCase } from './domain/use-cases/edit-habit.use-case'
import { ListHabitsUseCase } from './domain/use-cases/list-habits.use-case'
import { DexieCategoryDataSource } from '@/modules/categories/data/data-sources/dexie-category.data-source'
import { CategoryRepositoryImpl } from '@/modules/categories/data/repositories/category.repository.impl'
import { ListCategoriesUseCase } from '@/modules/categories/domain/use-cases/list-categories.use-case'

export function createHabitDependencies() {
  const habitDataSource = new DexieHabitDataSource(db.habits)
  const habitRepository = new HabitRepositoryImpl(habitDataSource)

  const categoryDataSource = new DexieCategoryDataSource(db.categories)
  const categoryRepository = new CategoryRepositoryImpl(categoryDataSource)

  return {
    listHabits: new ListHabitsUseCase(habitRepository),
    createHabit: new CreateHabitUseCase(habitRepository),
    archiveHabit: new ArchiveHabitUseCase(habitRepository),
    editHabit: new EditHabitUseCase(habitRepository),
    listCategories: new ListCategoriesUseCase(categoryRepository),
  }
}
