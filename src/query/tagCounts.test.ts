import { describe, expect, it } from 'vitest'
import { tagCounts } from './tagCounts'
import type { ParsedTask } from '@/parser/types'

const makeTask = (tags: string[]): ParsedTask => ({
  line: 0,
  text: '',
  completed: false,
  description: '',
  tags,
  due: null,
})

describe('tagCounts', () => {
  it('counts tag occurrences across tasks', () => {
    const tasks = [
      makeTask(['backend', 'devops']),
      makeTask(['backend', 'frontend']),
      makeTask(['devops']),
    ]
    const result = tagCounts(tasks)
    expect(result).toEqual([
      { tag: 'backend', count: 2 },
      { tag: 'devops', count: 2 },
      { tag: 'frontend', count: 1 },
    ])
  })

  it('sorts by count descending', () => {
    const tasks = [
      makeTask(['a']),
      makeTask(['b', 'a']),
      makeTask(['c', 'b', 'a']),
    ]
    const result = tagCounts(tasks)
    expect(result[0]).toEqual({ tag: 'a', count: 3 })
    expect(result[1]).toEqual({ tag: 'b', count: 2 })
    expect(result[2]).toEqual({ tag: 'c', count: 1 })
  })

  it('returns empty for empty input', () => {
    expect(tagCounts([])).toEqual([])
  })

  it('returns empty for tasks with no tags', () => {
    const tasks = [makeTask([]), makeTask([])]
    expect(tagCounts(tasks)).toEqual([])
  })
})
