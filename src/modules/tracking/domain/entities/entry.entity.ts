const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isValidDateString(date: string): boolean {
  if (!DATE_RE.test(date)) return false
  const [year, month, day] = date.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
}

export interface EntryProps {
  id: string
  habitId: string
  date: string
  value: boolean | number
  createdAt: Date
}

export class Entry {
  readonly id: string
  readonly habitId: string
  readonly date: string
  readonly value: boolean | number
  readonly createdAt: Date

  constructor(props: EntryProps) {
    if (!isValidDateString(props.date)) {
      throw new Error('La fecha debe tener formato YYYY-MM-DD y ser una fecha válida')
    }
    if (typeof props.value === 'number' && props.value <= 0) {
      throw new Error('El valor cuantitativo debe ser mayor que 0')
    }

    this.id = props.id
    this.habitId = props.habitId
    this.date = props.date
    this.value = props.value
    this.createdAt = props.createdAt
  }

  withValue(value: boolean | number): Entry {
    return new Entry({ ...this, value })
  }
}
