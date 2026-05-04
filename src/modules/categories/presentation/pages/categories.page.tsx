import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { createCategoryDependencies } from '@/modules/categories/categories.wiring'
import type { Category } from '@/modules/categories/domain/entities/category.entity'
import { CategoriesViewModel } from '../view-models/categories.view-model'

export const CategoriesPage = observer(function CategoriesPage() {
  const vm = useViewModel(() => {
    const deps = createCategoryDependencies()
    return new CategoriesViewModel(deps.listCategories, deps.createCategory, deps.editCategory, deps.deleteCategory)
  })

  const [formMode, setFormMode] = useState<null | 'create' | Category>(null)

  function openCreate() { setFormMode('create') }
  function openEdit(category: Category) { setFormMode(category) }
  function closeForm() { setFormMode(null) }

  async function handleCreate(name: string, color: string) {
    await vm.create({ name, color })
    closeForm()
  }

  async function handleEdit(category: Category, name: string, color: string) {
    await vm.edit(category.id, name, color)
    closeForm()
  }

  const isFormOpen = formMode !== null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Categorías</h1>
        <button
          onClick={isFormOpen ? closeForm : openCreate}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          {isFormOpen ? 'Cancelar' : 'Nueva categoría'}
        </button>
      </div>

      {formMode === 'create' && (
        <CategoryForm onSubmit={handleCreate} />
      )}
      {formMode !== null && formMode !== 'create' && (
        <CategoryForm initialValues={formMode} onSubmit={(name, color) => handleEdit(formMode, name, color)} />
      )}

      {vm.error && <p className="mb-4 text-red-500 dark:text-red-400 text-sm">{vm.error}</p>}

      {vm.isLoading ? (
        <LoadingSkeleton />
      ) : vm.categories.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {vm.categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => openEdit(category)}
              onDelete={() => vm.delete(category.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
})

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316']

function CategoryForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: Category
  onSubmit: (name: string, color: string) => Promise<void>
}) {
  const isEdit = initialValues !== undefined
  const [name, setName] = useState(initialValues?.name ?? '')
  const [color, setColor] = useState(initialValues?.color ?? COLORS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit(name, color)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar la categoría')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500'

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4"
    >
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
        {isEdit ? 'Editar categoría' : 'Nueva categoría'}
      </p>

      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Deporte"
          required
          className={inputCls}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110"
              style={{ backgroundColor: c, outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
      >
        {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear categoría'}
      </button>
    </form>
  )
}

function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category
  onEdit: () => void
  onDelete: () => void
}) {
  const [confirming, setConfirming] = useState(false)

  return (
    <li className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none">
      <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{category.name}</p>
      </div>
      {confirming ? (
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">¿Eliminar?</span>
          <button onClick={onDelete} className="text-xs font-medium text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">Sí</button>
          <button onClick={() => setConfirming(false)} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">No</button>
        </div>
      ) : (
        <>
          <button onClick={onEdit} className="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Editar</button>
          <button onClick={() => setConfirming(true)} className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">Eliminar</button>
        </>
      )}
    </li>
  )
}

function LoadingSkeleton() {
  return (
    <ul className="space-y-3">
      {[1, 2, 3].map((i) => (
        <li key={i} className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" />
      ))}
    </ul>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 space-y-3">
      <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
      <p className="text-slate-600 dark:text-slate-400 text-sm">Aún no tienes categorías.</p>
      <p className="text-slate-400 dark:text-slate-600 text-xs">Crea una para organizar tus hábitos.</p>
    </div>
  )
}
