import { makeObservable, observable, runInAction } from 'mobx'
import { format } from 'date-fns'
import { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { Category } from '@/modules/categories/domain/entities/category.entity'
import type { ListHabitsUseCase } from '@/modules/habits/domain/use-cases/list-habits.use-case'
import type { ListCategoriesUseCase } from '@/modules/categories/domain/use-cases/list-categories.use-case'
import { calculateHabitStats } from '@/modules/stats/domain/use-cases/calculate-habit-stats'
import type { HabitStats } from '@/modules/stats/domain/use-cases/calculate-habit-stats'

export interface HabitStatItem {
  habit: Habit
  entries: Entry[]
  stats: HabitStats
}

export class StatsViewModel extends BaseViewModel {
  items: HabitStatItem[] = []
  categories: Category[] = []
  isLoading = false
  readonly today: string = format(new Date(), 'yyyy-MM-dd')

  private readonly listHabitsUseCase: ListHabitsUseCase
  private readonly getAllEntries: () => Promise<Entry[]>
  private readonly listCategoriesUseCase: ListCategoriesUseCase

  constructor(
    listHabitsUseCase: ListHabitsUseCase,
    getAllEntries: () => Promise<Entry[]>,
    listCategoriesUseCase: ListCategoriesUseCase,
  ) {
    super()
    this.listHabitsUseCase = listHabitsUseCase
    this.getAllEntries = getAllEntries
    this.listCategoriesUseCase = listCategoriesUseCase
    makeObservable(this, {
      items: observable,
      categories: observable,
      isLoading: observable,
    })
  }

  override async didMount() {
    await this.load()
  }

  async load() {
    runInAction(() => { this.isLoading = true })
    try {
      const [habits, allEntries, categories] = await Promise.all([
        this.listHabitsUseCase.execute(),
        this.getAllEntries(),
        this.listCategoriesUseCase.execute(),
      ])
      runInAction(() => {
        this.categories = categories
        this.items = habits
          .map((habit) => {
            const entries = allEntries.filter((e) => e.habitId === habit.id)
            return { habit, entries, stats: calculateHabitStats(entries, this.today) }
          })
          .sort((a, b) => b.stats.currentStreak - a.stats.currentStreak)
        this.isLoading = false
      })
    } catch {
      runInAction(() => { this.isLoading = false })
    }
  }
}
