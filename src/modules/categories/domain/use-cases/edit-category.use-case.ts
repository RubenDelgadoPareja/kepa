import type { Category } from '@/modules/categories/domain/entities/category.entity'
import type { CategoryRepository } from '@/modules/categories/domain/repositories/category.repository'

export interface EditCategoryInput {
  id: string
  name?: string
  color?: string
}

export class EditCategoryUseCase {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(input: EditCategoryInput): Promise<Category> {
    const { id, ...changes } = input
    const category = await this.repository.findById(id)
    if (!category) throw new Error(`Categoría no encontrada: ${id}`)

    const updated = category.update(changes)
    await this.repository.save(updated)
    return updated
  }
}
