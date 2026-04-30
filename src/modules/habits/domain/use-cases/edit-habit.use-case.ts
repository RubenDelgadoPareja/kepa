import type { Habit, HabitFrequency, HabitGoal, HabitUnit } from '@/modules/habits/domain/entities/habit.entity'
import type { HabitRepository } from '@/modules/habits/domain/repositories/habit.repository'

export interface EditHabitInput {
  id: string
  name?: string
  unit?: HabitUnit | null
  goal?: HabitGoal | null
  frequency?: HabitFrequency
  categoryId?: string | null
  color?: string
}

export class EditHabitUseCase {
  private readonly repository: HabitRepository

  constructor(repository: HabitRepository) {
    this.repository = repository
  }

  async execute(input: EditHabitInput): Promise<Habit> {
    const { id, ...changes } = input
    const habit = await this.repository.findById(id)
    if (!habit) throw new Error(`Hábito no encontrado: ${id}`)

    const updated = habit.update(changes)
    await this.repository.save(updated)
    return updated
  }
}
