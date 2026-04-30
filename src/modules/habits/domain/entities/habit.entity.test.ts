import { describe, expect, it } from 'vitest'
import { Habit } from './habit.entity'
import type { HabitProps } from './habit.entity'

const baseProps: HabitProps = {
  id: 'habit-1',
  name: 'Meditar',
  kind: 'binary',
  unit: null,
  goal: null,
  frequency: { type: 'daily' },
  categoryId: null,
  color: '#6366f1',
  archivedAt: null,
  createdAt: new Date('2024-01-01'),
}

describe('Habit', () => {
  describe('constructor — caso feliz', () => {
    it('crea un hábito binario válido', () => {
      const habit = new Habit(baseProps)
      expect(habit.id).toBe('habit-1')
      expect(habit.name).toBe('Meditar')
      expect(habit.kind).toBe('binary')
    })

    it('crea un hábito cuantitativo válido', () => {
      const habit = new Habit({ ...baseProps, kind: 'quantitative', unit: 'km' })
      expect(habit.unit).toBe('km')
    })

    it('crea un hábito con goal válido', () => {
      const habit = new Habit({ ...baseProps, goal: { value: 10, period: 'daily' } })
      expect(habit.goal?.value).toBe(10)
    })

    it('crea un hábito semanal válido', () => {
      const habit = new Habit({
        ...baseProps,
        frequency: { type: 'weekly', timesPerWeek: 3 },
      })
      expect(habit.frequency).toEqual({ type: 'weekly', timesPerWeek: 3 })
    })

    it('acepta color en formato corto (#RGB)', () => {
      expect(() => new Habit({ ...baseProps, color: '#fff' })).not.toThrow()
    })
  })

  describe('constructor — validaciones', () => {
    it('lanza si el nombre está vacío', () => {
      expect(() => new Habit({ ...baseProps, name: '' })).toThrow()
    })

    it('lanza si el nombre es solo espacios', () => {
      expect(() => new Habit({ ...baseProps, name: '   ' })).toThrow()
    })

    it('lanza si un hábito cuantitativo no tiene unidad', () => {
      expect(() => new Habit({ ...baseProps, kind: 'quantitative', unit: null })).toThrow()
    })

    it('lanza si un hábito binario tiene unidad', () => {
      expect(() => new Habit({ ...baseProps, kind: 'binary', unit: 'km' })).toThrow()
    })

    it('lanza si goal.value es 0', () => {
      expect(() => new Habit({ ...baseProps, goal: { value: 0, period: 'daily' } })).toThrow()
    })

    it('lanza si goal.value es negativo', () => {
      expect(() =>
        new Habit({ ...baseProps, goal: { value: -5, period: 'weekly' } }),
      ).toThrow()
    })

    it('lanza si timesPerWeek es 0', () => {
      expect(() =>
        new Habit({ ...baseProps, frequency: { type: 'weekly', timesPerWeek: 0 } }),
      ).toThrow()
    })

    it('lanza si timesPerWeek es 8', () => {
      expect(() =>
        new Habit({ ...baseProps, frequency: { type: 'weekly', timesPerWeek: 8 } }),
      ).toThrow()
    })

    it('lanza si timesPerWeek no es entero', () => {
      expect(() =>
        new Habit({ ...baseProps, frequency: { type: 'weekly', timesPerWeek: 1.5 } }),
      ).toThrow()
    })

    it('lanza si el color no es hexadecimal válido', () => {
      expect(() => new Habit({ ...baseProps, color: 'red' })).toThrow()
      expect(() => new Habit({ ...baseProps, color: '#gggggg' })).toThrow()
    })
  })

  describe('isArchived', () => {
    it('es false cuando archivedAt es null', () => {
      const habit = new Habit(baseProps)
      expect(habit.isArchived).toBe(false)
    })

    it('es true cuando archivedAt tiene fecha', () => {
      const habit = new Habit({ ...baseProps, archivedAt: new Date() })
      expect(habit.isArchived).toBe(true)
    })
  })

  describe('archive / unarchive', () => {
    it('archive devuelve una nueva instancia con archivedAt establecido', () => {
      const habit = new Habit(baseProps)
      const archived = habit.archive()
      expect(archived).not.toBe(habit)
      expect(archived.isArchived).toBe(true)
      expect(archived.archivedAt).toBeInstanceOf(Date)
    })

    it('archive no muta el hábito original', () => {
      const habit = new Habit(baseProps)
      habit.archive()
      expect(habit.isArchived).toBe(false)
    })

    it('unarchive devuelve una nueva instancia con archivedAt null', () => {
      const archived = new Habit({ ...baseProps, archivedAt: new Date() })
      const active = archived.unarchive()
      expect(active).not.toBe(archived)
      expect(active.isArchived).toBe(false)
    })
  })

  describe('update', () => {
    it('devuelve una nueva instancia con los cambios aplicados', () => {
      const habit = new Habit(baseProps)
      const updated = habit.update({ name: 'Leer' })
      expect(updated).not.toBe(habit)
      expect(updated.name).toBe('Leer')
      expect(habit.name).toBe('Meditar')
    })

    it('lanza si el nuevo nombre está vacío', () => {
      const habit = new Habit(baseProps)
      expect(() => habit.update({ name: '' })).toThrow()
    })

    it('conserva los campos no modificados', () => {
      const habit = new Habit(baseProps)
      const updated = habit.update({ color: '#ff0000' })
      expect(updated.id).toBe(habit.id)
      expect(updated.kind).toBe(habit.kind)
      expect(updated.createdAt).toBe(habit.createdAt)
    })
  })
})
