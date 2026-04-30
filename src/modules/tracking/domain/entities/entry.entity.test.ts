import { describe, expect, it } from 'vitest'
import { Entry } from './entry.entity'
import type { EntryProps } from './entry.entity'

const baseBinaryProps: EntryProps = {
  id: 'entry-1',
  habitId: 'habit-1',
  date: '2024-03-15',
  value: true,
  createdAt: new Date('2024-03-15'),
}

const baseQuantitativeProps: EntryProps = {
  ...baseBinaryProps,
  id: 'entry-2',
  value: 5.5,
}

describe('Entry', () => {
  describe('constructor — caso feliz', () => {
    it('crea una entrada binaria válida', () => {
      const entry = new Entry(baseBinaryProps)
      expect(entry.id).toBe('entry-1')
      expect(entry.value).toBe(true)
    })

    it('crea una entrada cuantitativa válida', () => {
      const entry = new Entry(baseQuantitativeProps)
      expect(entry.value).toBe(5.5)
    })

    it('acepta value=false para entradas binarias', () => {
      expect(() => new Entry({ ...baseBinaryProps, value: false })).not.toThrow()
    })
  })

  describe('constructor — validación de fecha', () => {
    it('lanza si la fecha no tiene formato YYYY-MM-DD', () => {
      expect(() => new Entry({ ...baseBinaryProps, date: '15-03-2024' })).toThrow()
      expect(() => new Entry({ ...baseBinaryProps, date: '2024/03/15' })).toThrow()
      expect(() => new Entry({ ...baseBinaryProps, date: 'hoy' })).toThrow()
    })

    it('lanza si la fecha es inválida aunque tenga el formato correcto', () => {
      expect(() => new Entry({ ...baseBinaryProps, date: '2024-02-30' })).toThrow()
      expect(() => new Entry({ ...baseBinaryProps, date: '2024-13-01' })).toThrow()
    })

    it('acepta años bisiestos válidos', () => {
      expect(() => new Entry({ ...baseBinaryProps, date: '2024-02-29' })).not.toThrow()
    })

    it('lanza en años no bisiestos para el 29 de febrero', () => {
      expect(() => new Entry({ ...baseBinaryProps, date: '2023-02-29' })).toThrow()
    })
  })

  describe('constructor — validación de valor', () => {
    it('lanza si el valor numérico es 0', () => {
      expect(() => new Entry({ ...baseQuantitativeProps, value: 0 })).toThrow()
    })

    it('lanza si el valor numérico es negativo', () => {
      expect(() => new Entry({ ...baseQuantitativeProps, value: -1 })).toThrow()
    })

    it('no lanza para value=false (boolean falsy, no numérico)', () => {
      expect(() => new Entry({ ...baseBinaryProps, value: false })).not.toThrow()
    })
  })

  describe('withValue', () => {
    it('devuelve una nueva instancia con el valor actualizado', () => {
      const entry = new Entry(baseQuantitativeProps)
      const updated = entry.withValue(10)
      expect(updated).not.toBe(entry)
      expect(updated.value).toBe(10)
      expect(entry.value).toBe(5.5)
    })

    it('no muta la entrada original', () => {
      const entry = new Entry(baseBinaryProps)
      entry.withValue(false)
      expect(entry.value).toBe(true)
    })
  })
})
