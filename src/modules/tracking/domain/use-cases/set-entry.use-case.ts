import { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { HabitKind } from '@/modules/habits/domain/entities/habit.entity'
import type { EntryRepository } from '@/modules/tracking/domain/repositories/entry.repository'

export interface SetEntryInput {
  habitId: string
  date: string
  value: boolean | number
  habitKind: HabitKind
}

export class SetEntryUseCase {
  private readonly repository: EntryRepository

  constructor(repository: EntryRepository) {
    this.repository = repository
  }

  async execute(input: SetEntryInput): Promise<Entry> {
    if (input.habitKind === 'binary' && typeof input.value !== 'boolean') {
      throw new Error('Un hábito binario requiere un valor booleano')
    }
    if (input.habitKind === 'quantitative' && typeof input.value !== 'number') {
      throw new Error('Un hábito cuantitativo requiere un valor numérico')
    }

    const existing = await this.repository.findByHabitAndDate(input.habitId, input.date)

    const entry = new Entry({
      id: existing?.id ?? crypto.randomUUID(),
      habitId: input.habitId,
      date: input.date,
      value: input.value,
      createdAt: existing?.createdAt ?? new Date(),
    })

    await this.repository.save(entry)
    return entry
  }
}
