import { describe, expect, it, beforeEach } from 'vitest'
import { CreateHabitUseCase } from './create-habit.use-case'
import { InMemoryHabitRepository } from './in-memory-habit.repository'

const validInput = {
  name: 'Meditar',
  kind: 'binary' as const,
  unit: null,
  goal: null,
  frequency: { type: 'daily' as const },
  categoryId: null,
  color: '#6366f1',
}

describe('CreateHabitUseCase', () => {
  let repository: InMemoryHabitRepository
  let useCase: CreateHabitUseCase

  beforeEach(() => {
    repository = new InMemoryHabitRepository()
    useCase = new CreateHabitUseCase(repository)
  })

  it('crea y persiste un hábito válido', async () => {
    const habit = await useCase.execute(validInput)
    const all = await repository.findAll()

    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(habit.id)
  })

  it('el hábito creado tiene id, archivedAt=null y createdAt', async () => {
    const habit = await useCase.execute(validInput)

    expect(habit.id).toBeTruthy()
    expect(habit.archivedAt).toBeNull()
    expect(habit.createdAt).toBeInstanceOf(Date)
  })

  it('devuelve el hábito creado con los datos del input', async () => {
    const habit = await useCase.execute(validInput)

    expect(habit.name).toBe('Meditar')
    expect(habit.kind).toBe('binary')
    expect(habit.color).toBe('#6366f1')
  })

  it('lanza si los datos del input son inválidos', async () => {
    await expect(useCase.execute({ ...validInput, name: '' })).rejects.toThrow()
  })

  it('genera ids únicos para cada hábito', async () => {
    const a = await useCase.execute(validInput)
    const b = await useCase.execute({ ...validInput, name: 'Correr' })

    expect(a.id).not.toBe(b.id)
  })
})
