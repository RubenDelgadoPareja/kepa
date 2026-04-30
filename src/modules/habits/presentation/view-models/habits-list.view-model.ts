import { makeObservable, observable, runInAction } from 'mobx'
import { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { ArchiveHabitUseCase } from '@/modules/habits/domain/use-cases/archive-habit.use-case'
import type { CreateHabitInput, CreateHabitUseCase } from '@/modules/habits/domain/use-cases/create-habit.use-case'
import type { ListHabitsUseCase } from '@/modules/habits/domain/use-cases/list-habits.use-case'

export class HabitsListViewModel extends BaseViewModel {
  habits: Habit[] = []
  isLoading = false
  error: string | null = null

  private readonly listHabitsUseCase: ListHabitsUseCase
  private readonly createHabitUseCase: CreateHabitUseCase
  private readonly archiveHabitUseCase: ArchiveHabitUseCase

  constructor(
    listHabitsUseCase: ListHabitsUseCase,
    createHabitUseCase: CreateHabitUseCase,
    archiveHabitUseCase: ArchiveHabitUseCase,
  ) {
    super()
    this.listHabitsUseCase = listHabitsUseCase
    this.createHabitUseCase = createHabitUseCase
    this.archiveHabitUseCase = archiveHabitUseCase
    makeObservable(this, {
      habits: observable,
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
      const habits = await this.listHabitsUseCase.execute()
      runInAction(() => {
        this.habits = habits
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : 'Error cargando hábitos'
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
}
