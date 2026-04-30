import { observer } from 'mobx-react-lite'
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

const UNIT_STEP: Record<string, number> = { km: 0.5, minutes: 5, reps: 1 }

function formatValue(value: number, unit: string | null): string {
  if (unit === 'km') return value % 1 === 0 ? String(value) : value.toFixed(1)
  return String(value)
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
  const value = typeof entry?.value === 'number' ? entry.value : 0
  const step = UNIT_STEP[habit.unit ?? 'reps']
  const done = entry !== null

  return (
    <li
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all ${
        done ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-800 border-slate-700'
      }`}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
      <span className={`flex-1 text-sm font-medium ${done ? 'text-slate-300' : 'text-slate-100'}`}>
        {habit.name}
      </span>

      <div className="flex items-center rounded-lg border border-slate-700 overflow-hidden">
        <button
          onClick={() => onSetValue(Math.round((value - step) * 10) / 10)}
          disabled={value === 0}
          className="px-3 py-2 text-lg leading-none text-slate-400 hover:text-slate-100 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none"
        >
          −
        </button>
        <div className="px-4 py-2 bg-slate-900 min-w-[5.5rem] text-center">
          {done ? (
            <span className="text-sm font-semibold text-slate-100">
              {formatValue(value, habit.unit)}{' '}
              <span className="text-xs font-normal text-slate-500">{habit.unit}</span>
            </span>
          ) : (
            <span className="text-sm text-slate-600">— {habit.unit}</span>
          )}
        </div>
        <button
          onClick={() => onSetValue(Math.round((value + step) * 10) / 10)}
          className="px-3 py-2 text-lg leading-none text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors select-none"
        >
          +
        </button>
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
