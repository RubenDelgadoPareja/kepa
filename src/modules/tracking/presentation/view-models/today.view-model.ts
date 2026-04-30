import { makeObservable, observable, computed, runInAction } from 'mobx'
import { format } from 'date-fns'
import { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { ListHabitsUseCase } from '@/modules/habits/domain/use-cases/list-habits.use-case'
import type { GetDayEntriesUseCase } from '@/modules/tracking/domain/use-cases/get-day-entries.use-case'
import type { SetEntryUseCase } from '@/modules/tracking/domain/use-cases/set-entry.use-case'
import type { ClearEntryUseCase } from '@/modules/tracking/domain/use-cases/clear-entry.use-case'

export interface HabitWithEntry {
  habit: Habit
  entry: Entry | null
}

export class TodayViewModel extends BaseViewModel {
  items: HabitWithEntry[] = []
  isLoading = false
  readonly date: string = format(new Date(), 'yyyy-MM-dd')

  private readonly listHabitsUseCase: ListHabitsUseCase
  private readonly getDayEntriesUseCase: GetDayEntriesUseCase
  private readonly setEntryUseCase: SetEntryUseCase
  private readonly clearEntryUseCase: ClearEntryUseCase

  constructor(
    listHabitsUseCase: ListHabitsUseCase,
    getDayEntriesUseCase: GetDayEntriesUseCase,
    setEntryUseCase: SetEntryUseCase,
    clearEntryUseCase: ClearEntryUseCase,
  ) {
    super()
    this.listHabitsUseCase = listHabitsUseCase
    this.getDayEntriesUseCase = getDayEntriesUseCase
    this.setEntryUseCase = setEntryUseCase
    this.clearEntryUseCase = clearEntryUseCase
    makeObservable(this, {
      items: observable,
      isLoading: observable,
      completedCount: computed,
      totalCount: computed,
    })
  }

  get completedCount(): number {
    return this.items.filter((i) => i.entry !== null).length
  }

  get totalCount(): number {
    return this.items.length
  }

  override async didMount() {
    await this.load()
  }

  async load() {
    runInAction(() => { this.isLoading = true })
    try {
      const [habits, entries] = await Promise.all([
        this.listHabitsUseCase.execute(),
        this.getDayEntriesUseCase.execute(this.date),
      ])
      const entryByHabitId = new Map(entries.map((e) => [e.habitId, e]))
      runInAction(() => {
        this.items = habits.map((habit) => ({
          habit,
          entry: entryByHabitId.get(habit.id) ?? null,
        }))
        this.isLoading = false
      })
    } catch {
      runInAction(() => { this.isLoading = false })
    }
  }

  async toggle(habit: Habit) {
    const item = this.items.find((i) => i.habit.id === habit.id)
    if (item?.entry) {
      await this.clearEntryUseCase.execute(habit.id, this.date)
    } else {
      await this.setEntryUseCase.execute({ habitId: habit.id, date: this.date, value: true, habitKind: habit.kind })
    }
    await this.load()
  }

  async setValue(habit: Habit, value: number) {
    if (value <= 0) {
      await this.clearEntryUseCase.execute(habit.id, this.date)
    } else {
      await this.setEntryUseCase.execute({ habitId: habit.id, date: this.date, value, habitKind: habit.kind })
    }
    await this.load()
  }
}
