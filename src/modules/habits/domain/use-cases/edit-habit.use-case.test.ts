import { describe, expect, it, beforeEach } from 'vitest'
import { Habit } from '@/modules/habits/domain/entities/habit.entity'
import { EditHabitUseCase } from './edit-habit.use-case'
import { InMemoryHabitRepository } from './in-memory-habit.repository'

const originalHabit = new Habit({
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

describe('EditHabitUseCase', () => {
  let repository: InMemoryHabitRepository
  let useCase: EditHabitUseCase

  beforeEach(async () => {
    repository = new InMemoryHabitRepository()
    useCase = new EditHabitUseCase(repository)
    await repository.save(originalHabit)
  })

  it('actualiza el nombre y lo persiste', async () => {
    await useCase.execute({ id: 'habit-1', name: 'Respiración' })

    const saved = await repository.findById('habit-1')
    expect(saved?.name).toBe('Respiración')
  })

  it('devuelve el hábito actualizado', async () => {
    const result = await useCase.execute({ id: 'habit-1', name: 'Respiración' })
    expect(result.name).toBe('Respiración')
  })

  it('conserva los campos no modificados', async () => {
    const result = await useCase.execute({ id: 'habit-1', color: '#ff0000' })
    expect(result.name).toBe('Meditar')
    expect(result.kind).toBe('binary')
  })

  it('lanza si el hábito no existe', async () => {
    await expect(useCase.execute({ id: 'no-existe', name: 'X' })).rejects.toThrow()
  })

  it('lanza si el cambio viola una regla de negocio', async () => {
    await expect(useCase.execute({ id: 'habit-1', name: '' })).rejects.toThrow()
  })
})
