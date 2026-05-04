import { db } from '@/lib/db'
import { DexieCategoryDataSource } from './data/data-sources/dexie-category.data-source'
import { CategoryRepositoryImpl } from './data/repositories/category.repository.impl'
import { ListCategoriesUseCase } from './domain/use-cases/list-categories.use-case'
import { CreateCategoryUseCase } from './domain/use-cases/create-category.use-case'
import { EditCategoryUseCase } from './domain/use-cases/edit-category.use-case'
import { DeleteCategoryUseCase } from './domain/use-cases/delete-category.use-case'

export function createCategoryDependencies() {
  const dataSource = new DexieCategoryDataSource(db.categories)
  const repository = new CategoryRepositoryImpl(dataSource)
  return {
    listCategories: new ListCategoriesUseCase(repository),
    createCategory: new CreateCategoryUseCase(repository),
    editCategory: new EditCategoryUseCase(repository),
    deleteCategory: new DeleteCategoryUseCase(repository),
  }
}
