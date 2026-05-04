import type { Category } from '@/modules/categories/domain/entities/category.entity'
import type { CategoryRepository } from '@/modules/categories/domain/repositories/category.repository'
import type { DexieCategoryDataSource } from '@/modules/categories/data/data-sources/dexie-category.data-source'

export class CategoryRepositoryImpl implements CategoryRepository {
  private readonly dataSource: DexieCategoryDataSource

  constructor(dataSource: DexieCategoryDataSource) {
    this.dataSource = dataSource
  }

  findAll(): Promise<Category[]> {
    return this.dataSource.findAll()
  }

  findById(id: string): Promise<Category | null> {
    return this.dataSource.findById(id)
  }

  save(category: Category): Promise<void> {
    return this.dataSource.save(category)
  }

  delete(id: string): Promise<void> {
    return this.dataSource.delete(id)
  }
}
