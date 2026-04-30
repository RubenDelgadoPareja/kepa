import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { HabitRepository } from '@/modules/habits/domain/repositories/habit.repository'

export class InMemoryHabitRepository implements HabitRepository {
  private habits: Map<string, Habit> = new Map()

  async findAll(): Promise<Habit[]> {
    return Array.from(this.habits.values())
  }

  async findById(id: string): Promise<Habit | null> {
    return this.habits.get(id) ?? null
  }

  async save(habit: Habit): Promise<void> {
    this.habits.set(habit.id, habit)
  }
}
