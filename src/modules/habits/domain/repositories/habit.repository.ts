import type { Habit } from '@/modules/habits/domain/entities/habit.entity'

export interface HabitRepository {
  findAll(): Promise<Habit[]>
  findById(id: string): Promise<Habit | null>
  save(habit: Habit): Promise<void>
}
