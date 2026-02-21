import { describe, expect, it } from 'vitest'
import { dueSoon } from './dueSoon'
import type { ParsedTask } from '@/parser/types'

const REF_DATE = '2026-02-21'

const makeTask = (overrides: Partial<ParsedTask>): ParsedTask => ({
  line: 0,
  text: '',
  completed: false,
  description: '',
  tags: [],
  due: null,
  ...overrides,
})

describe('dueSoon', () => {
  it('returns tasks due within the window', () => {
    const tasks = [
      makeTask({ due: '2026-02-22', description: 'Tomorrow' }),
      makeTask({ due: '2026-02-25', description: 'In 4 days' }),
    ]
    const result = dueSoon(tasks, REF_DATE, 7)
    expect(result).toHaveLength(2)
  })

  it('excludes completed tasks', () => {
    const tasks = [makeTask({ due: '2026-02-22', completed: true })]
    const result = dueSoon(tasks, REF_DATE, 7)
    expect(result).toHaveLength(0)
  })

  it('excludes tasks with no due date', () => {
    const tasks = [makeTask({ due: null })]
    const result = dueSoon(tasks, REF_DATE, 7)
    expect(result).toHaveLength(0)
  })

  it('excludes tasks due beyond the window', () => {
    const tasks = [makeTask({ due: '2026-04-01' })]
    const result = dueSoon(tasks, REF_DATE, 7)
    expect(result).toHaveLength(0)
  })

  it('includes tasks due on the boundary (reference date)', () => {
    const tasks = [makeTask({ due: '2026-02-21' })]
    const result = dueSoon(tasks, REF_DATE, 7)
    expect(result).toHaveLength(1)
  })

  it('includes tasks due on the end boundary', () => {
    const tasks = [makeTask({ due: '2026-02-28' })]
    const result = dueSoon(tasks, REF_DATE, 7)
    expect(result).toHaveLength(1)
  })

  it('sorts results by date ascending', () => {
    const tasks = [
      makeTask({ due: '2026-02-25', description: 'Later' }),
      makeTask({ due: '2026-02-22', description: 'Sooner' }),
      makeTask({ due: '2026-02-21', description: 'Today' }),
    ]
    const result = dueSoon(tasks, REF_DATE, 7)
    expect(result.map((t) => t.due)).toEqual(['2026-02-21', '2026-02-22', '2026-02-25'])
  })

  it('returns empty for empty input', () => {
    expect(dueSoon([], REF_DATE)).toEqual([])
  })
})
