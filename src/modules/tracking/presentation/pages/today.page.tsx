import { observer } from 'mobx-react-lite'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { createTrackingDependencies } from '@/modules/tracking/tracking.wiring'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import { TodayViewModel } from '../view-models/today.view-model'

const QUOTES = [
  'Un 1% mejor cada día se convierte en casi cuatro veces mejor al año.',
  'No necesitas motivación para empezar. Empieza, y la motivación llegará.',
  'Los hábitos son los votos silenciosos que hacemos a nuestra identidad.',
  'Pequeños pasos sostenidos en el tiempo cambian vidas.',
  'La disciplina es elegir lo que quieres a largo plazo sobre lo que quieres ahora.',
  'Cada hábito que cumples es una prueba de que eres quien quieres ser.',
  'No se trata de perfección. Se trata de presencia.',
  'El secreto de avanzar es, simplemente, empezar.',
  'La constancia vence al talento cuando el talento no es constante.',
  'Haz hoy lo que tu yo del futuro te agradecerá.',
  'El éxito no es un gran salto. Es una serie de pequeños pasos diarios.',
  'No cambias tu vida con grandes gestos. La cambias con pequeñas decisiones repetidas.',
  'Una buena rutina no te limita. Te libera para enfocarte en lo que importa.',
  'El mejor momento para empezar fue ayer. El segundo mejor es ahora.',
  'Eres el resultado de lo que haces repetidamente. Que sea algo que valga la pena.',
  'La motivación te pone en marcha. El hábito te mantiene en movimiento.',
  'Cuida tus hábitos. Ellos cuidan tu futuro.',
  'Cada día que cumples, te acercas un paso más a quien quieres ser.',
  'No hay progreso sin constancia. No hay constancia sin pequeños actos diarios.',
  'Sé la persona que hace lo que se propone.',
]

function getDailyQuote(): string {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const dayOfYear = Math.floor((+new Date() - +start) / 86_400_000)
  return QUOTES[dayOfYear % QUOTES.length]
}

export const TodayPage = observer(function TodayPage() {
  const vm = useViewModel(() => {
    const deps = createTrackingDependencies()
    return new TodayViewModel(deps.listHabits, deps.getDayEntries, deps.setEntry, deps.clearEntry)
  })

  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: es })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 md:py-12">
      <div className="mb-6">
        <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1 capitalize">
          {formattedDate}
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Hoy</h1>
      </div>

      <DailyQuote />

      <ProgressBar completed={vm.completedCount} total={vm.totalCount} />

      {vm.isLoading ? (
        <LoadingSkeleton />
      ) : vm.items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ul className="mt-5 space-y-3">
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
          {vm.completedCount > 0 && vm.completedCount === vm.totalCount && (
            <AllDoneCard />
          )}
        </>
      )}
    </div>
  )
})

function DailyQuote() {
  return (
    <div className="mb-7 pl-3 border-l-2 border-indigo-400/50 dark:border-indigo-500/50">
      <p className="text-sm italic text-slate-500 dark:text-slate-400 leading-relaxed">
        "{getDailyQuote()}"
      </p>
    </div>
  )
}

export function ProgressBar({ completed, total }: { completed: number; total: number }) {
  if (total === 0) return null
  const pct = Math.round((completed / total) * 100)

  return (
    <div>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-500">
          {completed} de {total} completados
        </span>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
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
        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all ${
          done
            ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/40'
            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.99] shadow-sm dark:shadow-none'
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            done ? 'border-transparent' : 'border-slate-300 dark:border-slate-600'
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
            done
              ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-600'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {habit.name}
        </span>
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
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
      className={`flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all ${
        done
          ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/40'
          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none'
      }`}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
      <span className={`flex-1 text-sm font-medium ${done ? 'text-slate-500 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>
        {habit.name}
      </span>

      <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => onSetValue(Math.round((value - step) * 10) / 10)}
          disabled={value === 0}
          className="px-3 py-2 text-lg leading-none text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none"
        >
          −
        </button>
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 min-w-[5.5rem] text-center">
          {done ? (
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {formatValue(value, habit.unit)}{' '}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">{habit.unit}</span>
            </span>
          ) : (
            <span className="text-sm text-slate-400 dark:text-slate-600">— {habit.unit}</span>
          )}
        </div>
        <button
          onClick={() => onSetValue(Math.round((value + step) * 10) / 10)}
          className="px-3 py-2 text-lg leading-none text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors select-none"
        >
          +
        </button>
      </div>
    </li>
  )
}

function AllDoneCard() {
  return (
    <div className="mt-5 px-4 py-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-700/30 text-center">
      <p className="text-base font-bold text-indigo-600 dark:text-indigo-300 tracking-tight">¡Todo completado hoy!</p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Buen trabajo. Hasta mañana.</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <ul className="mt-5 space-y-3">
      {[1, 2, 3].map((i) => (
        <li key={i} className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" />
      ))}
    </ul>
  )
}

export function EmptyState() {
  return (
    <div className="text-center py-16 space-y-4">
      <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" strokeWidth={1.5} />
      </svg>
      <div className="space-y-1">
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">No tienes hábitos activos.</p>
        <p className="text-slate-400 dark:text-slate-600 text-xs">Todo comienza con un primer paso.</p>
      </div>
      <Link to="/habits" className="inline-block text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
        Crear mi primer hábito →
      </Link>
    </div>
  )
}
