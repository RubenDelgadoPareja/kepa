import { describe, expect, it, beforeEach } from 'vitest'
import { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import { GetDayEntriesUseCase } from './get-day-entries.use-case'
import { InMemoryEntryRepository } from './in-memory-entry.repository'

describe('GetDayEntriesUseCase', () => {
  let repository: InMemoryEntryRepository
  let useCase: GetDayEntriesUseCase

  beforeEach(() => {
    repository = new InMemoryEntryRepository()
    useCase = new GetDayEntriesUseCase(repository)
  })

  it('devuelve lista vacía si no hay entradas ese día', async () => {
    const result = await useCase.execute('2024-03-15')
    expect(result).toHaveLength(0)
  })

  it('devuelve solo las entradas del día solicitado', async () => {
    await repository.save(new Entry({ id: 'e1', habitId: 'h1', date: '2024-03-15', value: true, createdAt: new Date() }))
    await repository.save(new Entry({ id: 'e2', habitId: 'h2', date: '2024-03-15', value: true, createdAt: new Date() }))
    await repository.save(new Entry({ id: 'e3', habitId: 'h1', date: '2024-03-16', value: true, createdAt: new Date() }))

    const result = await useCase.execute('2024-03-15')
    expect(result).toHaveLength(2)
    expect(result.every((e) => e.date === '2024-03-15')).toBe(true)
  })
})
