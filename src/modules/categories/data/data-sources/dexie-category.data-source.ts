import type { EntityTable } from 'dexie'
import { Category } from '@/modules/categories/domain/entities/category.entity'
import type { CategoryRecord } from '@/lib/db'

export class DexieCategoryDataSource {
  private readonly table: EntityTable<CategoryRecord, 'id'>

  constructor(table: EntityTable<CategoryRecord, 'id'>) {
    this.table = table
  }

  async findAll(): Promise<Category[]> {
    const records = await this.table.toArray()
    return records.map(toCategory)
  }

  async findById(id: string): Promise<Category | null> {
    const record = await this.table.get(id)
    return record ? toCategory(record) : null
  }

  async save(category: Category): Promise<void> {
    await this.table.put(toRecord(category))
  }

  async delete(id: string): Promise<void> {
    await this.table.delete(id)
  }
}

function toCategory(r: CategoryRecord): Category {
  return new Category({
    id: r.id,
    name: r.name,
    color: r.color,
    createdAt: r.createdAt,
  })
}

function toRecord(c: Category): CategoryRecord {
  return {
    id: c.id,
    name: c.name,
    color: c.color,
    createdAt: c.createdAt,
  }
}
