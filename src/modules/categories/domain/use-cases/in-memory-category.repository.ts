import type { Category } from '@/modules/categories/domain/entities/category.entity'
import type { CategoryRepository } from '@/modules/categories/domain/repositories/category.repository'

export class InMemoryCategoryRepository implements CategoryRepository {
  private readonly categories: Map<string, Category> = new Map()

  async findAll(): Promise<Category[]> {
    return Array.from(this.categories.values())
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.get(id) ?? null
  }

  async save(category: Category): Promise<void> {
    this.categories.set(category.id, category)
  }

  async delete(id: string): Promise<void> {
    this.categories.delete(id)
  }
}
