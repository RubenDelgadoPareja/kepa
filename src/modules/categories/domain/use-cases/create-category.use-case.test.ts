import { describe, expect, it, beforeEach } from 'vitest'
import { CreateCategoryUseCase } from './create-category.use-case'
import { InMemoryCategoryRepository } from './in-memory-category.repository'

const validInput = { name: 'Deporte', color: '#6366f1' }

describe('CreateCategoryUseCase', () => {
  let repository: InMemoryCategoryRepository
  let useCase: CreateCategoryUseCase

  beforeEach(() => {
    repository = new InMemoryCategoryRepository()
    useCase = new CreateCategoryUseCase(repository)
  })

  it('crea y persiste una categoría válida', async () => {
    const category = await useCase.execute(validInput)
    const all = await repository.findAll()

    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(category.id)
  })

  it('la categoría creada tiene id y createdAt', async () => {
    const category = await useCase.execute(validInput)

    expect(category.id).toBeTruthy()
    expect(category.createdAt).toBeInstanceOf(Date)
  })

  it('devuelve la categoría con los datos del input', async () => {
    const category = await useCase.execute(validInput)

    expect(category.name).toBe('Deporte')
    expect(category.color).toBe('#6366f1')
  })

  it('lanza si el nombre está vacío', async () => {
    await expect(useCase.execute({ ...validInput, name: '' })).rejects.toThrow()
  })

  it('genera ids únicos para cada categoría', async () => {
    const a = await useCase.execute(validInput)
    const b = await useCase.execute({ ...validInput, name: 'Salud' })

    expect(a.id).not.toBe(b.id)
  })
})
