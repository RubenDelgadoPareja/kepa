import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { EntryRepository } from '@/modules/tracking/domain/repositories/entry.repository'

export class GetDayEntriesUseCase {
  private readonly repository: EntryRepository

  constructor(repository: EntryRepository) {
    this.repository = repository
  }

  async execute(date: string): Promise<Entry[]> {
    return this.repository.findByDate(date)
  }
}
