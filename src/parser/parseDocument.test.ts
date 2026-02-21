import { describe, expect, it } from 'vitest'
import { parseDocument } from './parseDocument'

describe('parseDocument', () => {
  it('parses a mixed document with tasks and non-tasks', () => {
    const doc = `# Project
- [ ] Task one #backend
- [x] Task two #frontend
Some notes here
- [ ] Task three due:2026-03-01`

    const result = parseDocument(doc)
    expect(result.tasks).toHaveLength(3)
    expect(result.tasks[0].description).toBe('Task one #backend')
    expect(result.tasks[1].completed).toBe(true)
    expect(result.tasks[2].due).toBe('2026-03-01')
  })

  it('returns empty tasks for empty document', () => {
    const result = parseDocument('')
    expect(result.tasks).toHaveLength(0)
    expect(result.allTags).toHaveLength(0)
  })

  it('returns empty tasks for document with no tasks', () => {
    const doc = `# Notes
Just some text
More text`
    const result = parseDocument(doc)
    expect(result.tasks).toHaveLength(0)
  })

  it('parses a document where all lines are tasks', () => {
    const doc = `- [ ] Task one
- [x] Task two
- [ ] Task three`

    const result = parseDocument(doc)
    expect(result.tasks).toHaveLength(3)
  })

  it('collects unique tags across all tasks', () => {
    const doc = `- [ ] Task one #backend #devops
- [ ] Task two #backend #frontend
- [x] Task three #devops`

    const result = parseDocument(doc)
    expect(result.allTags).toEqual(expect.arrayContaining(['backend', 'devops', 'frontend']))
    expect(result.allTags).toHaveLength(3)
  })

  it('preserves correct line indices', () => {
    const doc = `# Header
- [ ] First task
Some text
- [ ] Second task`

    const result = parseDocument(doc)
    expect(result.tasks[0].line).toBe(1)
    expect(result.tasks[1].line).toBe(3)
  })
})
