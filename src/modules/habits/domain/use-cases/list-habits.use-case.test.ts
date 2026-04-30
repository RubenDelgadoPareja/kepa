import { describe, expect, it, beforeEach } from 'vitest'
import { Habit } from '@/modules/habits/domain/entities/habit.entity'
import { ListHabitsUseCase } from './list-habits.use-case'
import { InMemoryHabitRepository } from './in-memory-habit.repository'

const makeHabit = (id: string, archived = false) =>
  new Habit({
    id,
    name: `Hábito ${id}`,
    kind: 'binary',
    unit: null,
    goal: null,
    frequency: { type: 'daily' },
    categoryId: null,
    color: '#6366f1',
    archivedAt: archived ? new Date() : null,
    createdAt: new Date(),
  })

describe('ListHabitsUseCase', () => {
  let repository: InMemoryHabitRepository
  let useCase: ListHabitsUseCase

  beforeEach(() => {
    repository = new InMemoryHabitRepository()
    useCase = new ListHabitsUseCase(repository)
  })

  it('devuelve lista vacía si no hay hábitos', async () => {
    const result = await useCase.execute()
    expect(result).toHaveLength(0)
  })

  it('devuelve solo los hábitos activos por defecto', async () => {
    await repository.save(makeHabit('active'))
    await repository.save(makeHabit('archived', true))

    const result = await useCase.execute()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('active')
  })

  it('incluye los archivados cuando se pide explícitamente', async () => {
    await repository.save(makeHabit('active'))
    await repository.save(makeHabit('archived', true))

    const result = await useCase.execute({ includeArchived: true })
    expect(result).toHaveLength(2)
  })
})
