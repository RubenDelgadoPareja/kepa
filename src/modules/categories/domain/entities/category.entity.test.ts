import { describe, expect, it } from 'vitest'
import { Category } from './category.entity'
import type { CategoryProps } from './category.entity'

const baseProps: CategoryProps = {
  id: 'cat-1',
  name: 'Salud',
  color: '#22c55e',
  createdAt: new Date('2024-01-01'),
}

describe('Category', () => {
  describe('constructor — caso feliz', () => {
    it('crea una categoría válida', () => {
      const category = new Category(baseProps)
      expect(category.id).toBe('cat-1')
      expect(category.name).toBe('Salud')
      expect(category.color).toBe('#22c55e')
    })

    it('acepta color en formato corto (#RGB)', () => {
      expect(() => new Category({ ...baseProps, color: '#abc' })).not.toThrow()
    })
  })

  describe('constructor — validaciones', () => {
    it('lanza si el nombre está vacío', () => {
      expect(() => new Category({ ...baseProps, name: '' })).toThrow()
    })

    it('lanza si el nombre es solo espacios', () => {
      expect(() => new Category({ ...baseProps, name: '   ' })).toThrow()
    })

    it('lanza si el color no es hexadecimal válido', () => {
      expect(() => new Category({ ...baseProps, color: 'green' })).toThrow()
      expect(() => new Category({ ...baseProps, color: '#zzzzzz' })).toThrow()
    })
  })

  describe('update', () => {
    it('devuelve una nueva instancia con los cambios aplicados', () => {
      const category = new Category(baseProps)
      const updated = category.update({ name: 'Deporte' })
      expect(updated).not.toBe(category)
      expect(updated.name).toBe('Deporte')
      expect(category.name).toBe('Salud')
    })

    it('lanza si el nuevo nombre está vacío', () => {
      const category = new Category(baseProps)
      expect(() => category.update({ name: '' })).toThrow()
    })

    it('conserva los campos no modificados', () => {
      const category = new Category(baseProps)
      const updated = category.update({ color: '#ff0000' })
      expect(updated.id).toBe(category.id)
      expect(updated.createdAt).toBe(category.createdAt)
    })
  })
})
