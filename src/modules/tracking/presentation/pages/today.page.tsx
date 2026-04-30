import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { createTrackingDependencies } from '@/modules/tracking/tracking.wiring'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import { TodayViewModel } from '../view-models/today.view-model'

export const TodayPage = observer(function TodayPage() {
  const vm = useViewModel(() => {
    const deps = createTrackingDependencies()
    return new TodayViewModel(deps.listHabits, deps.getDayEntries, deps.setEntry, deps.clearEntry)
  })

  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: es })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-xs font-medium text-indigo-400 uppercase tracking-widest mb-1 capitalize">
          {formattedDate}
        </p>
        <h1 className="text-2xl font-semibold text-slate-100">Hoy</h1>
      </div>

      <ProgressBar completed={vm.completedCount} total={vm.totalCount} />

      {vm.isLoading ? (
        <p className="text-slate-500 text-sm mt-6">Cargando...</p>
      ) : vm.items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-6 space-y-3">
          {vm.items.map(({ habit, entry }) =>
            habit.kind === 'binary' ? (
              <BinaryHabitRow
                key={habit.id}
                habit={habit}
                entry={entry}
                onToggle={() => vm.toggle(habit)}
              />
            ) : (
              <QuantitativeHabitRow
                key={habit.id}
                habit={habit}
                entry={entry}
                onSetValue={(value) => vm.setValue(habit, value)}
              />
            ),
          )}
        </ul>
      )}
    </div>
  )
})

export function ProgressBar({ completed, total }: { completed: number; total: number }) {
  if (total === 0) return null
  const pct = Math.round((completed / total) * 100)

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-500">
          {completed} de {total} completados
        </span>
        <span className="text-xs font-medium text-slate-400">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function BinaryHabitRow({
  habit,
  entry,
  onToggle,
}: {
  habit: Habit
  entry: Entry | null
  onToggle: () => void
}) {
  const done = entry !== null

  return (
    <li>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${
          done
            ? 'bg-slate-800/60 border-slate-700/50'
            : 'bg-slate-800 border-slate-700 hover:border-slate-600'
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            done ? 'border-transparent' : 'border-slate-600'
          }`}
          style={done ? { backgroundColor: habit.color } : {}}
        >
          {done && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span
          className={`flex-1 text-sm font-medium text-left transition-colors ${
            done ? 'text-slate-500 line-through' : 'text-slate-100'
          }`}
        >
          {habit.name}
        </span>
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: habit.color }}
        />
      </button>
    </li>
  )
}

export function QuantitativeHabitRow({
  habit,
  entry,
  onSetValue,
}: {
  habit: Habit
  entry: Entry | null
  onSetValue: (value: number) => void
}) {
  const currentValue = typeof entry?.value === 'number' ? entry.value : 0
  const [inputValue, setInputValue] = useState(String(currentValue || ''))
  const done = entry !== null

  function handleBlur() {
    const parsed = parseFloat(inputValue)
    if (!isNaN(parsed) && parsed > 0) {
      onSetValue(parsed)
    } else {
      setInputValue(String(currentValue || ''))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') e.currentTarget.blur()
  }

  return (
    <li
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${
        done ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-800 border-slate-700'
      }`}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
      <span className={`flex-1 text-sm font-medium ${done ? 'text-slate-400' : 'text-slate-100'}`}>
        {habit.name}
      </span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0.1}
          step={0.1}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="0"
          className="w-16 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-100 text-sm text-right focus:outline-none focus:border-indigo-500"
        />
        <span className="text-xs text-slate-500 w-12">{habit.unit}</span>
      </div>
    </li>
  )
}

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <p className="text-slate-500 text-sm">No tienes hábitos activos.</p>
      <p className="text-slate-600 text-xs mt-1">Ve a Hábitos para crear el primero.</p>
    </div>
  )
}
