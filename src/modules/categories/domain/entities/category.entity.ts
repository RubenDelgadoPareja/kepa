const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export interface CategoryProps {
  id: string
  name: string
  color: string
  createdAt: Date
}

export class Category {
  readonly id: string
  readonly name: string
  readonly color: string
  readonly createdAt: Date

  constructor(props: CategoryProps) {
    if (!props.name.trim()) {
      throw new Error('El nombre de la categoría no puede estar vacío')
    }
    if (!HEX_COLOR_RE.test(props.color)) {
      throw new Error('El color debe ser un valor hexadecimal válido (ej: #ff0000)')
    }

    this.id = props.id
    this.name = props.name
    this.color = props.color
    this.createdAt = props.createdAt
  }

  update(changes: Partial<Pick<CategoryProps, 'name' | 'color'>>): Category {
    return new Category({ ...this, ...changes })
  }
}
