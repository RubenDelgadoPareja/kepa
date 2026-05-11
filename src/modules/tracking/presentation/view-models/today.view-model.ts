import { makeObservable, observable, computed, runInAction } from 'mobx'
import { format, subDays } from 'date-fns'
import { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { Category } from '@/modules/categories/domain/entities/category.entity'
import type { ListHabitsUseCase } from '@/modules/habits/domain/use-cases/list-habits.use-case'
import type { GetDayEntriesUseCase } from '@/modules/tracking/domain/use-cases/get-day-entries.use-case'
import type { SetEntryUseCase } from '@/modules/tracking/domain/use-cases/set-entry.use-case'
import type { ClearEntryUseCase } from '@/modules/tracking/domain/use-cases/clear-entry.use-case'
import type { ListCategoriesUseCase } from '@/modules/categories/domain/use-cases/list-categories.use-case'
import { calculateCurrentStreak } from '@/modules/stats/domain/use-cases/calculate-habit-stats'

export interface HabitWithEntry {
  habit: Habit
  entry: Entry | null
  category: Category | null
  streak: number
}

export class TodayViewModel extends BaseViewModel {
  items: HabitWithEntry[] = []
  isLoading = false
  readonly date: string = format(new Date(), 'yyyy-MM-dd')

  private readonly listHabitsUseCase: ListHabitsUseCase
  private readonly getDayEntriesUseCase: GetDayEntriesUseCase
  private readonly setEntryUseCase: SetEntryUseCase
  private readonly clearEntryUseCase: ClearEntryUseCase
  private readonly listCategoriesUseCase: ListCategoriesUseCase
  private readonly getAllEntries: () => Promise<Entry[]>

  constructor(
    listHabitsUseCase: ListHabitsUseCase,
    getDayEntriesUseCase: GetDayEntriesUseCase,
    setEntryUseCase: SetEntryUseCase,
    clearEntryUseCase: ClearEntryUseCase,
    listCategoriesUseCase: ListCategoriesUseCase,
    getAllEntries: () => Promise<Entry[]>,
  ) {
    super()
    this.listHabitsUseCase = listHabitsUseCase
    this.getDayEntriesUseCase = getDayEntriesUseCase
    this.setEntryUseCase = setEntryUseCase
    this.clearEntryUseCase = clearEntryUseCase
    this.listCategoriesUseCase = listCategoriesUseCase
    this.getAllEntries = getAllEntries
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

  override onFocus(): void {
    void this.load()
  }

  async load() {
    runInAction(() => { this.isLoading = true })
    try {
      const yesterday = format(subDays(new Date(this.date + 'T00:00:00'), 1), 'yyyy-MM-dd')
      const [habits, entries, allEntries, categories] = await Promise.all([
        this.listHabitsUseCase.execute(),
        this.getDayEntriesUseCase.execute(this.date),
        this.getAllEntries(),
        this.listCategoriesUseCase.execute(),
      ])
      const entryByHabitId = new Map(entries.map((e) => [e.habitId, e]))
      const categoryMap = new Map(categories.map((c) => [c.id, c]))
      const entriesByHabit = new Map<string, Entry[]>()
      for (const entry of allEntries) {
        const list = entriesByHabit.get(entry.habitId) ?? []
        list.push(entry)
        entriesByHabit.set(entry.habitId, list)
      }
      runInAction(() => {
        this.items = habits.map((habit) => {
          const entry = entryByHabitId.get(habit.id) ?? null
          const habitEntries = entriesByHabit.get(habit.id) ?? []
          const streakDate = entry !== null ? this.date : yesterday
          return {
            habit,
            entry,
            category: habit.categoryId ? (categoryMap.get(habit.categoryId) ?? null) : null,
            streak: calculateCurrentStreak(habitEntries, streakDate),
          }
        })
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
