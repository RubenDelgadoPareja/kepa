import { db } from '@/lib/db'
import { DexieHabitDataSource } from '@/modules/habits/data/data-sources/dexie-habit.data-source'
import { HabitRepositoryImpl } from '@/modules/habits/data/repositories/habit.repository.impl'
import { ListHabitsUseCase } from '@/modules/habits/domain/use-cases/list-habits.use-case'
import { DexieEntryDataSource } from '@/modules/tracking/data/data-sources/dexie-entry.data-source'
import { EntryRepositoryImpl } from '@/modules/tracking/data/repositories/entry.repository.impl'
import { DexieCategoryDataSource } from '@/modules/categories/data/data-sources/dexie-category.data-source'
import { CategoryRepositoryImpl } from '@/modules/categories/data/repositories/category.repository.impl'
import { ListCategoriesUseCase } from '@/modules/categories/domain/use-cases/list-categories.use-case'

export function createStatsDependencies() {
  const habitDataSource = new DexieHabitDataSource(db.habits)
  const habitRepository = new HabitRepositoryImpl(habitDataSource)

  const entryDataSource = new DexieEntryDataSource(db.entries)
  const entryRepository = new EntryRepositoryImpl(entryDataSource)

  const categoryDataSource = new DexieCategoryDataSource(db.categories)
  const categoryRepository = new CategoryRepositoryImpl(categoryDataSource)

  return {
    listHabits: new ListHabitsUseCase(habitRepository),
    getAllEntries: () => entryRepository.findAll(),
    listCategories: new ListCategoriesUseCase(categoryRepository),
  }
}
