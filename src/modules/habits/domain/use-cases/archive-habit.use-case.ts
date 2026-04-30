import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { HabitRepository } from '@/modules/habits/domain/repositories/habit.repository'

export class ArchiveHabitUseCase {
  private readonly repository: HabitRepository

  constructor(repository: HabitRepository) {
    this.repository = repository
  }

  async execute(habitId: string): Promise<Habit> {
    const habit = await this.repository.findById(habitId)
    if (!habit) throw new Error(`Hábito no encontrado: ${habitId}`)

    const archived = habit.archive()
    await this.repository.save(archived)
    return archived
  }
}
