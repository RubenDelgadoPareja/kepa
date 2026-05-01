import { observer } from 'mobx-react-lite'
import { format, subMonths, startOfWeek, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { createStatsDependencies } from '@/modules/stats/stats.wiring'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { HabitStats } from '@/modules/stats/domain/use-cases/calculate-habit-stats'
import { StatsViewModel } from '../view-models/stats.view-model'

export const StatsPage = observer(function StatsPage() {
  const vm = useViewModel(() => {
    const deps = createStatsDependencies()
    return new StatsViewModel(deps.listHabits, deps.getAllEntries)
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 md:py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-8">Estadísticas</h1>

      {vm.isLoading ? (
        <LoadingSkeleton />
      ) : vm.items.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-500 text-sm">Crea hábitos y empieza a registrar para ver estadísticas.</p>
      ) : (
        <ul className="space-y-6">
          {vm.items.map(({ habit, entries, stats }) => (
            <HabitStatCard key={habit.id} habit={habit} entries={entries} stats={stats} today={vm.today} />
          ))}
        </ul>
      )}
    </div>
  )
})

export function HabitStatCard({
  habit,
  entries,
  stats,
  today,
}: {
  habit: Habit
  entries: Entry[]
  stats: HabitStats
  today: string
}) {
  return (
    <li className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
        <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{habit.name}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatBadge label="Racha actual" value={stats.currentStreak} unit="días" color={habit.color} />
        <StatBadge label="Racha más larga" value={stats.longestStreak} unit="días" />
        <StatBadge label="Últimos 30 días" value={stats.completionRate30d} unit="%" />
      </div>

      <HabitCalendar entries={entries} today={today} color={habit.color} />
    </li>
  )
}

export function StatBadge({
  label,
  value,
  unit,
  color,
}: {
  label: string
  value: number
  unit: string
  color?: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 px-3 py-3">
      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">{label}</p>
      <p
        className="text-2xl font-bold tracking-tight"
        style={color ? { color } : undefined}
      >
        <span className={!color ? 'text-slate-500 dark:text-slate-400' : ''}>{value}</span>
        <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-0.5">{unit}</span>
      </p>
    </div>
  )
}

export function HabitCalendar({
  entries,
  today,
  color,
}: {
  entries: Entry[]
  today: string
  color: string
}) {
  const completedDates = new Set(entries.map((e) => e.date))

  const endDate = new Date(today + 'T00:00:00')
  const startDate = startOfWeek(subMonths(endDate, 3), { weekStartsOn: 1 })
  const allDays = eachDayOfInterval({ start: startDate, end: endDate })

  const weeks: Date[][] = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }

  const monthLabels = weeks.map((week, i) => {
    const month = week[0].getMonth()
    const prevMonth = i > 0 ? weeks[i - 1][0].getMonth() : -1
    return month !== prevMonth ? format(week[0], 'MMM', { locale: es }) : ''
  })

  return (
    <div className="rounded-lg bg-slate-100 dark:bg-slate-950 p-3 space-y-1">
      {/* Fila de etiquetas de mes — flex-1 por columna, alineado con el grid */}
      <div className="flex gap-1">
        <div className="w-5 flex-shrink-0" />
        {monthLabels.map((label, wi) => (
          <div
            key={wi}
            className="flex-1 min-w-0 overflow-visible whitespace-nowrap text-[10px] text-slate-400 dark:text-slate-500"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid principal */}
      <div className="flex gap-1">
        {/* Columna de días de la semana */}
        <div className="w-5 flex-shrink-0 flex flex-col gap-1">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
            <div
              key={d}
              className="flex-1 flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-500 leading-none"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Columnas de semanas — flex-1 para repartir todo el ancho */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex-1 min-w-0 flex flex-col gap-1">
            {week.map((day, di) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const done = completedDates.has(dateStr)
              return (
                <div
                  key={di}
                  title={format(day, 'd MMM yyyy', { locale: es })}
                  className={`aspect-square rounded-sm transition-colors ${
                    done ? '' : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                  style={done ? { backgroundColor: color } : undefined}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <ul className="space-y-6">
      {[1, 2].map((i) => (
        <li key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" />
      ))}
    </ul>
  )
}
