import { makeObservable, observable, runInAction } from 'mobx'
import { BaseViewModel } from '@/core/presentation/view-models/base/base.view-model'
import type { Category } from '@/modules/categories/domain/entities/category.entity'
import type { CreateCategoryInput, CreateCategoryUseCase } from '@/modules/categories/domain/use-cases/create-category.use-case'
import type { EditCategoryUseCase } from '@/modules/categories/domain/use-cases/edit-category.use-case'
import type { DeleteCategoryUseCase } from '@/modules/categories/domain/use-cases/delete-category.use-case'
import type { ListCategoriesUseCase } from '@/modules/categories/domain/use-cases/list-categories.use-case'

export class CategoriesViewModel extends BaseViewModel {
  categories: Category[] = []
  isLoading = false
  error: string | null = null

  private readonly listCategoriesUseCase: ListCategoriesUseCase
  private readonly createCategoryUseCase: CreateCategoryUseCase
  private readonly editCategoryUseCase: EditCategoryUseCase
  private readonly deleteCategoryUseCase: DeleteCategoryUseCase

  constructor(
    listCategoriesUseCase: ListCategoriesUseCase,
    createCategoryUseCase: CreateCategoryUseCase,
    editCategoryUseCase: EditCategoryUseCase,
    deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {
    super()
    this.listCategoriesUseCase = listCategoriesUseCase
    this.createCategoryUseCase = createCategoryUseCase
    this.editCategoryUseCase = editCategoryUseCase
    this.deleteCategoryUseCase = deleteCategoryUseCase
    makeObservable(this, {
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
      const categories = await this.listCategoriesUseCase.execute()
      runInAction(() => {
        this.categories = categories
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : 'Error cargando categorías'
        this.isLoading = false
      })
    }
  }

  async create(input: CreateCategoryInput) {
    await this.createCategoryUseCase.execute(input)
    await this.load()
  }

  async edit(id: string, name: string, color: string) {
    await this.editCategoryUseCase.execute({ id, name, color })
    await this.load()
  }

  async delete(id: string) {
    await this.deleteCategoryUseCase.execute(id)
    await this.load()
  }
}
