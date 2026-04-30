import { describe, expect, it, beforeEach } from 'vitest'
import { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import { ClearEntryUseCase } from './clear-entry.use-case'
import { InMemoryEntryRepository } from './in-memory-entry.repository'

const TODAY = '2024-03-15'

const existingEntry = new Entry({
  id: 'entry-1',
  habitId: 'h1',
  date: TODAY,
  value: true,
  createdAt: new Date(),
})

describe('ClearEntryUseCase', () => {
  let repository: InMemoryEntryRepository
  let useCase: ClearEntryUseCase

  beforeEach(async () => {
    repository = new InMemoryEntryRepository()
    useCase = new ClearEntryUseCase(repository)
    await repository.save(existingEntry)
  })

  it('elimina la entrada del día para ese hábito', async () => {
    await useCase.execute('h1', TODAY)

    const result = await repository.findByHabitAndDate('h1', TODAY)
    expect(result).toBeNull()
  })

  it('no lanza si no existe entrada para ese día', async () => {
    await expect(useCase.execute('no-existe', TODAY)).resolves.not.toThrow()
  })

  it('no elimina entradas de otros hábitos', async () => {
    const other = new Entry({ id: 'entry-2', habitId: 'h2', date: TODAY, value: true, createdAt: new Date() })
    await repository.save(other)

    await useCase.execute('h1', TODAY)

    const remaining = await repository.findByDate(TODAY)
    expect(remaining).toHaveLength(1)
    expect(remaining[0].habitId).toBe('h2')
  })
})
