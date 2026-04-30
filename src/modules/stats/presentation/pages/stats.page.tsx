import { observer } from 'mobx-react-lite'
import { format, subWeeks, startOfWeek, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { useViewModel } from '@/core/presentation/hooks/useViewModel'
import { createStatsDependencies } from '@/modules/stats/stats.wiring'
import type { Habit } from '@/modules/habits/domain/entities/habit.entity'
import type { Entry } from '@/modules/tracking/domain/entities/entry.entity'
import type { HabitStats } from '@/modules/stats/domain/use-cases/calculate-habit-stats'
import { StatsViewModel } from '../view-models/stats.view-model'

const WEEKS = 26

export const StatsPage = observer(function StatsPage() {
  const vm = useViewModel(() => {
    const deps = createStatsDependencies()
    return new StatsViewModel(deps.listHabits, deps.getAllEntries)
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-100 mb-8">Estadísticas</h1>

      {vm.isLoading ? (
        <p className="text-slate-500 text-sm">Cargando...</p>
      ) : vm.items.length === 0 ? (
        <p className="text-slate-500 text-sm">Crea hábitos y empieza a registrar para ver estadísticas.</p>
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
    <li className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
        <span className="text-base font-semibold text-slate-100">{habit.name}</span>
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
    <div className="rounded-lg bg-slate-900 px-3 py-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold" style={color ? { color } : { color: '#94a3b8' }}>
        {value}
        <span className="text-xs font-normal text-slate-500 ml-0.5">{unit}</span>
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
  const startDate = startOfWeek(subWeeks(endDate, WEEKS - 1), { weekStartsOn: 1 })
  const allDays = eachDayOfInterval({ start: startDate, end: endDate })

  const weeks: Date[][] = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }

  const monthLabels = buildMonthLabels(weeks)

  return (
    <div className="space-y-1.5">
      <div className="flex gap-0.5 pl-7">
        {monthLabels.map(({ label, weekIndex }) => (
          <div
            key={weekIndex}
            className="text-[10px] text-slate-600"
            style={{ width: `${(1 / weeks.length) * 100}%` }}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="flex gap-0.5">
        <div className="flex flex-col justify-between pr-1.5" style={{ gap: '2px' }}>
          {['L', 'X', 'V'].map((d) => (
            <span key={d} className="text-[10px] text-slate-600 leading-none" style={{ height: '10px', lineHeight: '10px' }}>
              {d}
            </span>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day, di) => {
              const dateStr = format(day, 'yyyy-MM-dd')
              const done = completedDates.has(dateStr)
              const isFuture = dateStr > today
              return (
                <div
                  key={di}
                  title={format(day, 'd MMM yyyy', { locale: es })}
                  className="w-2.5 h-2.5 rounded-sm transition-colors"
                  style={{
                    backgroundColor: isFuture
                      ? 'transparent'
                      : done
                        ? color
                        : '#1e293b',
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function buildMonthLabels(weeks: Date[][]): { label: string; weekIndex: number }[] {
  const labels: { label: string; weekIndex: number }[] = []
  let lastMonth = -1
  weeks.forEach((week, i) => {
    const month = week[0].getMonth()
    if (month !== lastMonth) {
      labels.push({
        label: format(week[0], 'MMM', { locale: es }),
        weekIndex: i,
      })
      lastMonth = month
    } else {
      labels.push({ label: '', weekIndex: i })
    }
  })
  return labels
}

