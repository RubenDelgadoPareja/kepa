import { describe, expect, it, beforeEach } from 'vitest'
import { EditCategoryUseCase } from './edit-category.use-case'
import { InMemoryCategoryRepository } from './in-memory-category.repository'
import { Category } from '@/modules/categories/domain/entities/category.entity'

function makeCategory(): Category {
  return new Category({ id: 'cat-1', name: 'Deporte', color: '#6366f1', createdAt: new Date() })
}

describe('EditCategoryUseCase', () => {
  let repository: InMemoryCategoryRepository
  let useCase: EditCategoryUseCase

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    useCase = new EditCategoryUseCase(repository)
  })

  it('actualiza el nombre y persiste el cambio', async () => {
    await repository.save(makeCategory())

    const updated = await useCase.execute({ id: 'cat-1', name: 'Salud' })

    expect(updated.name).toBe('Salud')
    expect(updated.color).toBe('#6366f1')
    const persisted = await repository.findById('cat-1')
    expect(persisted?.name).toBe('Salud')
  })

  it('actualiza el color', async () => {
    await repository.save(makeCategory())

    const updated = await useCase.execute({ id: 'cat-1', color: '#ec4899' })

    expect(updated.color).toBe('#ec4899')
  })

  it('lanza si la categoría no existe', async () => {
    await expect(useCase.execute({ id: 'no-existe', name: 'Test' })).rejects.toThrow('Categoría no encontrada')
  })
})
