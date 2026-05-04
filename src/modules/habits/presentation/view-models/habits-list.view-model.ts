import { makeObservable, observable, runInAction } from 'mobx'
import { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { Category } from '@/modules/categories/domain/entities/category.entity'
import type { ArchiveHabitUseCase } from '@/modules/habits/domain/use-cases/archive-habit.use-case'
import type { CreateHabitInput, CreateHabitUseCase } from '@/modules/habits/domain/use-cases/create-habit.use-case'
import type { EditHabitInput, EditHabitUseCase } from '@/modules/habits/domain/use-cases/edit-habit.use-case'
import type { ListHabitsUseCase } from '@/modules/habits/domain/use-cases/list-habits.use-case'
import type { ListCategoriesUseCase } from '@/modules/categories/domain/use-cases/list-categories.use-case'

export class HabitsListViewModel extends BaseViewModel {
  habits: Habit[] = []
  categories: Category[] = []
  isLoading = false
  error: string | null = null

  private readonly listHabitsUseCase: ListHabitsUseCase
  private readonly createHabitUseCase: CreateHabitUseCase
  private readonly archiveHabitUseCase: ArchiveHabitUseCase
  private readonly editHabitUseCase: EditHabitUseCase
  private readonly listCategoriesUseCase: ListCategoriesUseCase

  constructor(
    listHabitsUseCase: ListHabitsUseCase,
    createHabitUseCase: CreateHabitUseCase,
    archiveHabitUseCase: ArchiveHabitUseCase,
    editHabitUseCase: EditHabitUseCase,
    listCategoriesUseCase: ListCategoriesUseCase,
  ) {
    super()
    this.listHabitsUseCase = listHabitsUseCase
    this.createHabitUseCase = createHabitUseCase
    this.archiveHabitUseCase = archiveHabitUseCase
    this.editHabitUseCase = editHabitUseCase
    this.listCategoriesUseCase = listCategoriesUseCase
    makeObservable(this, {
      habits: observable,
      categories: observable,
      isLoading: observable,
      error: observable,
    })
  }

  override async didMount() {
    await this.load()
  }

  async load() {
    runInAction(() => {
      this.isLoading = true
      this.error = null
    })
    try {
      const [habits, categories] = await Promise.all([
        this.listHabitsUseCase.execute(),
        this.listCategoriesUseCase.execute(),
      ])
      runInAction(() => {
        this.habits = habits
        this.categories = categories
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : 'Error cargando datos'
        this.isLoading = false
      })
    }
  }

  async create(input: CreateHabitInput) {
    await this.createHabitUseCase.execute(input)
    await this.load()
  }

  async archive(habitId: string) {
    await this.archiveHabitUseCase.execute(habitId)
    await this.load()
  }

  async edit(input: EditHabitInput) {
    await this.editHabitUseCase.execute(input)
    await this.load()
  }
}
