import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { createHabitDependencies } from '@/modules/habits/habits.wiring'
import type { CreateHabitInput } from '@/modules/habits/domain/use-cases/create-habit.use-case'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import { HabitsListViewModel } from '../view-models/habits-list.view-model'

export const HabitsPage = observer(function HabitsPage() {
  const vm = useViewModel(() => {
    const deps = createHabitDependencies()
    return new HabitsListViewModel(deps.listHabits, deps.createHabit, deps.archiveHabit, deps.editHabit)
  })

  const [formMode, setFormMode] = useState<null | 'create' | Habit>(null)

  function openCreate() {
    setFormMode('create')
  }

  function openEdit(habit: Habit) {
    setFormMode(habit)
  }

  function closeForm() {
    setFormMode(null)
  }

  async function handleCreate(input: CreateHabitInput) {
    await vm.create(input)
    closeForm()
  }

  async function handleEdit(habit: Habit, input: CreateHabitInput) {
    await vm.edit({
      id: habit.id,
      name: input.name,
      unit: input.unit,
      color: input.color,
      frequency: input.frequency,
    })
    closeForm()
  }

  const isFormOpen = formMode !== null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-slate-100">Hábitos</h1>
        <button
          onClick={isFormOpen ? closeForm : openCreate}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          {isFormOpen ? 'Cancelar' : 'Nuevo hábito'}
        </button>
      </div>

      {formMode === 'create' && (
        <HabitForm onSubmit={handleCreate} />
      )}

      {formMode !== null && formMode !== 'create' && (
        <HabitForm initialValues={formMode} onSubmit={(input) => handleEdit(formMode, input)} />
      )}

      {vm.error && (
        <p className="mb-4 text-red-400 text-sm">{vm.error}</p>
      )}

      {vm.isLoading ? (
        <p className="text-slate-500 text-sm">Cargando...</p>
      ) : vm.habits.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {vm.habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={() => openEdit(habit)}
              onArchive={() => vm.archive(habit.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
})

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

export function HabitForm({
  initialValues,
  onSubmit,
}: {
  initialValues?: Habit
  onSubmit: (input: CreateHabitInput) => Promise<void>
}) {
  const isEdit = initialValues !== undefined
  const [name, setName] = useState(initialValues?.name ?? '')
  const [kind] = useState<'binary' | 'quantitative'>(initialValues?.kind ?? 'binary')
  const [unit, setUnit] = useState<'km' | 'minutes' | 'reps'>(
    (initialValues?.unit as 'km' | 'minutes' | 'reps') ?? 'reps',
  )
  const [color, setColor] = useState(initialValues?.color ?? COLORS[0])
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly'>(
    initialValues?.frequency.type ?? 'daily',
  )
  const [timesPerWeek, setTimesPerWeek] = useState(
    initialValues?.frequency.type === 'weekly' ? initialValues.frequency.timesPerWeek : 3,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({
        name,
        kind,
        unit: kind === 'quantitative' ? unit : null,
        goal: null,
        frequency:
          frequencyType === 'weekly' ? { type: 'weekly', timesPerWeek } : { type: 'daily' },
        categoryId: null,
        color,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar el hábito')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4"
    >
      <p className="text-sm font-medium text-slate-300">
        {isEdit ? 'Editar hábito' : 'Nuevo hábito'}
      </p>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Meditar"
          required
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1">Tipo</label>
          <select
            value={kind}
            disabled={isEdit}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="binary">Binario (sí / no)</option>
            <option value="quantitative">Cuantitativo</option>
          </select>
        </div>

        {kind === 'quantitative' && (
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">Unidad</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'km' | 'minutes' | 'reps')}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="reps">Repeticiones</option>
              <option value="km">Kilómetros</option>
              <option value="minutes">Minutos</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1">Frecuencia</label>
          <select
            value={frequencyType}
            onChange={(e) => setFrequencyType(e.target.value as 'daily' | 'weekly')}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="daily">Diaria</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>

        {frequencyType === 'weekly' && (
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Veces por semana
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={timesPerWeek}
              onChange={(e) => setTimesPerWeek(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Color</label>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-7 h-7 rounded-full transition-transform hover:scale-110"
              style={{
                backgroundColor: c,
                outline: color === c ? `2px solid ${c}` : 'none',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
      >
        {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear hábito'}
      </button>
    </form>
  )
}

export function HabitCard({
  habit,
  onEdit,
  onArchive,
}: {
  habit: Habit
  onEdit: () => void
  onArchive: () => void
}) {
  const frequencyLabel =
    habit.frequency.type === 'daily'
      ? 'Diario'
      : `${habit.frequency.timesPerWeek}× por semana`

  return (
    <li className="flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700">
      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100 truncate">{habit.name}</p>
        <p className="text-xs text-slate-500">
          {habit.kind === 'quantitative' ? `Cuantitativo · ${habit.unit}` : 'Binario'} · {frequencyLabel}
        </p>
      </div>
      <button
        onClick={onEdit}
        className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
      >
        Editar
      </button>
      <button
        onClick={onArchive}
        className="text-xs text-slate-500 hover:text-red-400 transition-colors"
      >
        Archivar
      </button>
    </li>
  )
}

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <p className="text-slate-500 text-sm">Aún no tienes hábitos.</p>
      <p className="text-slate-600 text-xs mt-1">Crea uno para empezar a hacer seguimiento.</p>
    </div>
  )
}
