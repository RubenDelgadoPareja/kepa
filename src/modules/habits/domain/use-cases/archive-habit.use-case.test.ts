import { describe, expect, it, beforeEach } from 'vitest'
import { Habit } from '@/modules/habits/domain/entities/habit.entity'
import { ArchiveHabitUseCase } from './archive-habit.use-case'
import { InMemoryHabitRepository } from './in-memory-habit.repository'

const activeHabit = new Habit({
  id: 'habit-1',
  name: 'Meditar',
  kind: 'binary',
  unit: null,
  goal: null,
  frequency: { type: 'daily' },
  categoryId: null,
  color: '#6366f1',
  archivedAt: null,
  createdAt: new Date(),
})

describe('ArchiveHabitUseCase', () => {
  let repository: InMemoryHabitRepository
  let useCase: ArchiveHabitUseCase

  beforeEach(async () => {
    repository = new InMemoryHabitRepository()
    useCase = new ArchiveHabitUseCase(repository)
    await repository.save(activeHabit)
  })

  it('archiva el hábito y lo persiste', async () => {
    await useCase.execute('habit-1')

    const saved = await repository.findById('habit-1')
    expect(saved?.isArchived).toBe(true)
  })

  it('devuelve el hábito archivado', async () => {
    const result = await useCase.execute('habit-1')
    expect(result.isArchived).toBe(true)
    expect(result.archivedAt).toBeInstanceOf(Date)
  })

  it('no muta la instancia original del repositorio', async () => {
    await useCase.execute('habit-1')
    expect(activeHabit.isArchived).toBe(false)
  })

  it('lanza si el hábito no existe', async () => {
    await expect(useCase.execute('no-existe')).rejects.toThrow()
  })
})
