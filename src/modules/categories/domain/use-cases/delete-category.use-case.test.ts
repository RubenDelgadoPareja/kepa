import { describe, expect, it, beforeEach } from 'vitest'
import { DeleteCategoryUseCase } from './delete-category.use-case'
import { InMemoryCategoryRepository } from './in-memory-category.repository'
import { Category } from '@/modules/categories/domain/entities/category.entity'

function makeCategory(): Category {
  return new Category({ id: 'cat-1', name: 'Deporte', color: '#6366f1', createdAt: new Date() })
}

describe('DeleteCategoryUseCase', () => {
  let repository: InMemoryCategoryRepository
  let useCase: DeleteCategoryUseCase

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    useCase = new DeleteCategoryUseCase(repository)
  })

  it('elimina la categoría del repositorio', async () => {
    await repository.save(makeCategory())

    await useCase.execute('cat-1')

    const all = await repository.findAll()
    expect(all).toHaveLength(0)
  })

  it('lanza si la categoría no existe', async () => {
    await expect(useCase.execute('no-existe')).rejects.toThrow('Categoría no encontrada')
  })
})
