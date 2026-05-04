import { describe, expect, it, beforeEach } from 'vitest'
import { ListCategoriesUseCase } from './list-categories.use-case'
import { InMemoryCategoryRepository } from './in-memory-category.repository'
import { Category } from '@/modules/categories/domain/entities/category.entity'

function makeCategory(overrides: Partial<{ id: string; name: string; createdAt: Date }> = {}): Category {
  return new Category({
    id: overrides.id ?? crypto.randomUUID(),
    name: overrides.name ?? 'Deporte',
    color: '#6366f1',
    createdAt: overrides.createdAt ?? new Date(),
  })
}

describe('ListCategoriesUseCase', () => {
  let repository: InMemoryCategoryRepository
  let useCase: ListCategoriesUseCase

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    useCase = new ListCategoriesUseCase(repository)
  })

  it('devuelve lista vacía si no hay categorías', async () => {
    const result = await useCase.execute()
    expect(result).toHaveLength(0)
  })

  it('devuelve todas las categorías ordenadas por createdAt', async () => {
    const older = makeCategory({ name: 'Antigua', createdAt: new Date('2024-01-01') })
    const newer = makeCategory({ name: 'Nueva', createdAt: new Date('2024-06-01') })
    await repository.save(newer)
    await repository.save(older)

    const result = await useCase.execute()

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Antigua')
    expect(result[1].name).toBe('Nueva')
  })
})
