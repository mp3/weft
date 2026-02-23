import { describe, expect, it } from 'vitest'
import type { ParsedTask } from '@/parser/types'
import type { TaskFilter } from './filterTasks'
import { EMPTY_FILTER, filterTasks } from './filterTasks'

const makeTasks = (overrides: Partial<ParsedTask>[]): ParsedTask[] =>
  overrides.map((o, i) => ({
    line: i,
    text: `- [${o.completed ? 'x' : ' '}] Task ${i}`,
    completed: false,
    description: `Task ${i}`,
    tags: [],
    due: null,
    ...o,
  }))

describe('filterTasks', () => {
  it('returns all incomplete tasks with default filter', () => {
    const tasks = makeTasks([{ completed: false }, { completed: true }, { completed: false }])
    const result = filterTasks(tasks, EMPTY_FILTER)
    expect(result).toHaveLength(2)
    expect(result.every((t) => !t.completed)).toBe(true)
  })

  it('filters by text query case-insensitively', () => {
    const tasks = makeTasks([
      { description: 'Fix login bug' },
      { description: 'Add signup feature' },
      { description: 'fix logout issue' },
    ])
    const filter: TaskFilter = { ...EMPTY_FILTER, query: 'fix' }
    const result = filterTasks(tasks, filter)
    expect(result).toHaveLength(2)
    expect(result[0].description).toBe('Fix login bug')
    expect(result[1].description).toBe('fix logout issue')
  })

  it('filters by tag with exact match', () => {
    const tasks = makeTasks([
      { tags: ['frontend', 'bug'] },
      { tags: ['backend'] },
      { tags: ['frontend'] },
    ])
    const filter: TaskFilter = { ...EMPTY_FILTER, tag: 'frontend' }
    const result = filterTasks(tasks, filter)
    expect(result).toHaveLength(2)
  })

  it('shows completed tasks when showCompleted is true', () => {
    const tasks = makeTasks([{ completed: false }, { completed: true }, { completed: true }])
    const filter: TaskFilter = { ...EMPTY_FILTER, showCompleted: true }
    const result = filterTasks(tasks, filter)
    expect(result).toHaveLength(3)
  })

  it('applies AND composition of text, tag, and completion filters', () => {
    const tasks = makeTasks([
      { description: 'Fix bug', tags: ['frontend'], completed: false },
      { description: 'Fix typo', tags: ['backend'], completed: false },
      { description: 'Fix style', tags: ['frontend'], completed: true },
    ])
    const filter: TaskFilter = { query: 'fix', tag: 'frontend', showCompleted: false }
    const result = filterTasks(tasks, filter)
    expect(result).toHaveLength(1)
    expect(result[0].description).toBe('Fix bug')
  })

  it('returns empty array for empty input', () => {
    expect(filterTasks([], EMPTY_FILTER)).toEqual([])
  })

  it('returns empty array when no tasks match', () => {
    const tasks = makeTasks([{ description: 'Deploy app', tags: ['devops'] }])
    const filter: TaskFilter = { ...EMPTY_FILTER, query: 'nonexistent' }
    expect(filterTasks(tasks, filter)).toEqual([])
  })

  it('preserves document order', () => {
    const tasks = makeTasks([
      { line: 10, description: 'Second' },
      { line: 3, description: 'First' },
      { line: 20, description: 'Third' },
    ])
    const result = filterTasks(tasks, EMPTY_FILTER)
    expect(result[0].line).toBe(10)
    expect(result[1].line).toBe(3)
    expect(result[2].line).toBe(20)
  })

  it('does not match tag filter partially', () => {
    const tasks = makeTasks([{ tags: ['frontend-ui'] }, { tags: ['frontend'] }])
    const filter: TaskFilter = { ...EMPTY_FILTER, tag: 'front' }
    expect(filterTasks(tasks, filter)).toEqual([])
  })

  it('includes completed tasks matching all filters when showCompleted is true', () => {
    const tasks = makeTasks([
      { description: 'Fix auth', tags: ['backend'], completed: true },
      { description: 'Fix cache', tags: ['backend'], completed: false },
    ])
    const filter: TaskFilter = { query: 'fix', tag: 'backend', showCompleted: true }
    const result = filterTasks(tasks, filter)
    expect(result).toHaveLength(2)
  })
})
