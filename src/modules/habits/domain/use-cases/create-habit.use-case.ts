import { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { HabitFrequency, HabitGoal, HabitKind, HabitUnit } from '@/modules/habits/domain/entities/habit.entity'
import type { HabitRepository } from '@/modules/habits/domain/repositories/habit.repository'

export interface CreateHabitInput {
  name: string
  kind: HabitKind
  unit: HabitUnit | null
  goal: HabitGoal | null
  frequency: HabitFrequency
  categoryId: string | null
  color: string
}

export class CreateHabitUseCase {
  constructor(private readonly repository: HabitRepository) {}

  async execute(input: CreateHabitInput): Promise<Habit> {
    const habit = new Habit({
      id: crypto.randomUUID(),
      name: input.name,
      kind: input.kind,
      unit: input.unit,
      goal: input.goal,
      frequency: input.frequency,
      categoryId: input.categoryId,
      color: input.color,
      archivedAt: null,
      createdAt: new Date(),
    })
    await this.repository.save(habit)
    return habit
  }
}
