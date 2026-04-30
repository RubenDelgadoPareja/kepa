import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { HabitRepository } from '@/modules/habits/domain/repositories/habit.repository'

export interface ListHabitsInput {
  includeArchived?: boolean
}

export class ListHabitsUseCase {
  constructor(private readonly repository: HabitRepository) {}

  async execute(input: ListHabitsInput = {}): Promise<Habit[]> {
    const habits = await this.repository.findAll()
    if (input.includeArchived) return habits
    return habits.filter((h) => !h.isArchived)
  }
}
