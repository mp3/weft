import { describe, expect, it } from 'vitest'
import { parseLine } from './parseLine'

describe('parseLine', () => {
  it('parses an open task', () => {
    const result = parseLine('- [ ] Buy groceries', 0)
    expect(result).toEqual({
      line: 0,
      text: '- [ ] Buy groceries',
      completed: false,
      description: 'Buy groceries',
      tags: [],
      due: null,
    })
  })

  it('parses a completed task', () => {
    const result = parseLine('- [x] Buy groceries', 3)
    expect(result).toEqual({
      line: 3,
      text: '- [x] Buy groceries',
      completed: true,
      description: 'Buy groceries',
      tags: [],
      due: null,
    })
  })

  it('extracts tags', () => {
    const result = parseLine('- [ ] Fix bug #frontend #urgent', 1)
    expect(result?.tags).toEqual(['frontend', 'urgent'])
  })

  it('extracts due date', () => {
    const result = parseLine('- [ ] Deploy due:2026-03-01', 2)
    expect(result?.due).toBe('2026-03-01')
  })

  it('extracts both tags and due date', () => {
    const result = parseLine('- [ ] Set up CI pipeline #devops due:2026-02-22', 0)
    expect(result?.tags).toEqual(['devops'])
    expect(result?.due).toBe('2026-02-22')
    expect(result?.completed).toBe(false)
  })

  it('returns null for plain text', () => {
    expect(parseLine('Just a normal line', 0)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(parseLine('', 0)).toBeNull()
  })

  it('returns null for headings', () => {
    expect(parseLine('# Project Tasks', 0)).toBeNull()
  })

  it('handles tags with hyphens and underscores', () => {
    const result = parseLine('- [ ] Task #my-tag #under_score', 0)
    expect(result?.tags).toEqual(['my-tag', 'under_score'])
  })

  it('preserves the line index', () => {
    const result = parseLine('- [ ] Task', 42)
    expect(result?.line).toBe(42)
  })
})
