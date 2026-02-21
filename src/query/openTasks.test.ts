import { describe, expect, it } from 'vitest'
import { openTasks } from './openTasks'
import type { ParsedTask } from '@/parser/types'

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

describe('openTasks', () => {
  it('filters out completed tasks', () => {
    const tasks = makeTasks([{ completed: false }, { completed: true }, { completed: false }])
    const result = openTasks(tasks)
    expect(result).toHaveLength(2)
    expect(result.every((t) => !t.completed)).toBe(true)
  })

  it('preserves document order', () => {
    const tasks = makeTasks([
      { completed: false, line: 5 },
      { completed: true, line: 2 },
      { completed: false, line: 10 },
    ])
    const result = openTasks(tasks)
    expect(result[0].line).toBe(5)
    expect(result[1].line).toBe(10)
  })

  it('returns empty array for empty input', () => {
    expect(openTasks([])).toEqual([])
  })

  it('returns empty array when all tasks are completed', () => {
    const tasks = makeTasks([{ completed: true }, { completed: true }])
    expect(openTasks(tasks)).toEqual([])
  })
})
