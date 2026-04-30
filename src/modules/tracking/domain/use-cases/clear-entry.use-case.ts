import type { EntryRepository } from '@/modules/tracking/domain/repositories/entry.repository'

export class ClearEntryUseCase {
  private readonly repository: EntryRepository

  constructor(repository: EntryRepository) {
    this.repository = repository
  }

  async execute(habitId: string, date: string): Promise<void> {
    const existing = await this.repository.findByHabitAndDate(habitId, date)
    if (!existing) return
    await this.repository.delete(existing.id)
  }
}
