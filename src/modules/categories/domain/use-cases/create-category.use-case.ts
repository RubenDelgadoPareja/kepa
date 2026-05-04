import { Category } from '@/modules/categories/domain/entities/category.entity'
import type { CategoryRepository } from '@/modules/categories/domain/repositories/category.repository'

export interface CreateCategoryInput {
  name: string
  color: string
}

export class CreateCategoryUseCase {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(input: CreateCategoryInput): Promise<Category> {
    const category = new Category({
      id: crypto.randomUUID(),
      name: input.name,
      color: input.color,
      createdAt: new Date(),
    })
    await this.repository.save(category)
    return category
  }
}
