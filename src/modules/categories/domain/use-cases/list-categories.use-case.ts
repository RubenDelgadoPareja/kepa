import type { Category } from '@/modules/categories/domain/entities/category.entity'
import type { CategoryRepository } from '@/modules/categories/domain/repositories/category.repository'

export class ListCategoriesUseCase {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(): Promise<Category[]> {
    const all = await this.repository.findAll()
    return all.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }
}
