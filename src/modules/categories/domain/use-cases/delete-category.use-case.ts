import type { CategoryRepository } from '@/modules/categories/domain/repositories/category.repository'

export class DeleteCategoryUseCase {
  private readonly repository: CategoryRepository

  constructor(repository: CategoryRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<void> {
    const category = await this.repository.findById(id)
    if (!category) throw new Error(`Categoría no encontrada: ${id}`)
    await this.repository.delete(id)
  }
}
