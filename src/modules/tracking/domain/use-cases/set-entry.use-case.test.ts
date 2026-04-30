import { describe, expect, it, beforeEach } from 'vitest'
import { SetEntryUseCase } from './set-entry.use-case'
import { InMemoryEntryRepository } from './in-memory-entry.repository'

const TODAY = '2024-03-15'

describe('SetEntryUseCase', () => {
  let repository: InMemoryEntryRepository
  let useCase: SetEntryUseCase

  beforeEach(() => {
    repository = new InMemoryEntryRepository()
    useCase = new SetEntryUseCase(repository)
  })

  it('crea una entrada binaria nueva', async () => {
    const entry = await useCase.execute({
      habitId: 'h1',
      date: TODAY,
      value: true,
      habitKind: 'binary',
    })

    expect(entry.habitId).toBe('h1')
    expect(entry.value).toBe(true)
    expect(entry.date).toBe(TODAY)
  })

  it('crea una entrada cuantitativa nueva', async () => {
    const entry = await useCase.execute({
      habitId: 'h1',
      date: TODAY,
      value: 5,
      habitKind: 'quantitative',
    })

    expect(entry.value).toBe(5)
  })

  it('sobreescribe una entrada existente del mismo día (conserva id y createdAt)', async () => {
    const first = await useCase.execute({ habitId: 'h1', date: TODAY, value: 3, habitKind: 'quantitative' })
    const second = await useCase.execute({ habitId: 'h1', date: TODAY, value: 7, habitKind: 'quantitative' })

    expect(second.id).toBe(first.id)
    expect(second.createdAt).toBe(first.createdAt)
    expect(second.value).toBe(7)

    const all = await repository.findByDate(TODAY)
    expect(all).toHaveLength(1)
  })

  it('lanza si el valor no coincide con el tipo binario', async () => {
    await expect(
      useCase.execute({ habitId: 'h1', date: TODAY, value: 5, habitKind: 'binary' }),
    ).rejects.toThrow()
  })

  it('lanza si el valor no coincide con el tipo cuantitativo', async () => {
    await expect(
      useCase.execute({ habitId: 'h1', date: TODAY, value: true, habitKind: 'quantitative' }),
    ).rejects.toThrow()
  })

  it('lanza si el valor numérico es 0 o negativo (validación de Entry)', async () => {
    await expect(
      useCase.execute({ habitId: 'h1', date: TODAY, value: 0, habitKind: 'quantitative' }),
    ).rejects.toThrow()
  })
})
