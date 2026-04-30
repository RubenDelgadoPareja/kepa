const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export type HabitKind = 'binary' | 'quantitative'
export type HabitUnit = 'km' | 'minutes' | 'reps'
export type HabitFrequency = { type: 'daily' } | { type: 'weekly'; timesPerWeek: number }
export type HabitGoal = { value: number; period: 'daily' | 'weekly' }

export interface HabitProps {
  id: string
  name: string
  kind: HabitKind
  unit: HabitUnit | null
  goal: HabitGoal | null
  frequency: HabitFrequency
  categoryId: string | null
  color: string
  archivedAt: Date | null
  createdAt: Date
}

type UpdatableHabitFields = Pick<
  HabitProps,
  'name' | 'unit' | 'goal' | 'frequency' | 'categoryId' | 'color'
>

export class Habit {
  readonly id: string
  readonly name: string
  readonly kind: HabitKind
  readonly unit: HabitUnit | null
  readonly goal: HabitGoal | null
  readonly frequency: HabitFrequency
  readonly categoryId: string | null
  readonly color: string
  readonly archivedAt: Date | null
  readonly createdAt: Date

  constructor(props: HabitProps) {
    if (!props.name.trim()) {
      throw new Error('El nombre del hábito no puede estar vacío')
    }
    if (props.kind === 'quantitative' && props.unit === null) {
      throw new Error('Un hábito cuantitativo requiere una unidad')
    }
    if (props.kind === 'binary' && props.unit !== null) {
      throw new Error('Un hábito binario no puede tener unidad')
    }
    if (props.goal !== null && props.goal.value <= 0) {
      throw new Error('El valor del objetivo debe ser mayor que 0')
    }
    if (props.frequency.type === 'weekly') {
      const { timesPerWeek } = props.frequency
      if (!Number.isInteger(timesPerWeek) || timesPerWeek < 1 || timesPerWeek > 7) {
        throw new Error('timesPerWeek debe ser un entero entre 1 y 7')
      }
    }
    if (!HEX_COLOR_RE.test(props.color)) {
      throw new Error('El color debe ser un valor hexadecimal válido (ej: #ff0000)')
    }

    this.id = props.id
    this.name = props.name
    this.kind = props.kind
    this.unit = props.unit
    this.goal = props.goal
    this.frequency = props.frequency
    this.categoryId = props.categoryId
    this.color = props.color
    this.archivedAt = props.archivedAt
    this.createdAt = props.createdAt
  }

  get isArchived(): boolean {
    return this.archivedAt !== null
  }

  archive(): Habit {
    return new Habit({ ...this.toProps(), archivedAt: new Date() })
  }

  unarchive(): Habit {
    return new Habit({ ...this.toProps(), archivedAt: null })
  }

  update(changes: Partial<UpdatableHabitFields>): Habit {
    return new Habit({ ...this.toProps(), ...changes })
  }

  private toProps(): HabitProps {
    return {
      id: this.id,
      name: this.name,
      kind: this.kind,
      unit: this.unit,
      goal: this.goal,
      frequency: this.frequency,
      categoryId: this.categoryId,
      color: this.color,
      archivedAt: this.archivedAt,
      createdAt: this.createdAt,
    }
  }
}
