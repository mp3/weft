import { describe, expect, it } from 'vitest'
import { moveLineInDocument } from './moveLine'

describe('moveLineInDocument', () => {
  const doc = `# Tasks
- [ ] First task
- [ ] Second task
- [ ] Third task
Some notes`

  it('moves a line down (from < to)', () => {
    const result = moveLineInDocument(doc, 1, 3)
    const lines = result.split('\n')
    expect(lines[1]).toBe('- [ ] Second task')
    expect(lines[2]).toBe('- [ ] Third task')
    expect(lines[3]).toBe('- [ ] First task')
  })

  it('moves a line up (from > to)', () => {
    const result = moveLineInDocument(doc, 3, 1)
    const lines = result.split('\n')
    expect(lines[1]).toBe('- [ ] Third task')
    expect(lines[2]).toBe('- [ ] First task')
    expect(lines[3]).toBe('- [ ] Second task')
  })

  it('returns document unchanged for same position', () => {
    expect(moveLineInDocument(doc, 2, 2)).toBe(doc)
  })

  it('returns document unchanged for negative fromLineIndex', () => {
    expect(moveLineInDocument(doc, -1, 2)).toBe(doc)
  })

  it('returns document unchanged for out-of-bounds fromLineIndex', () => {
    expect(moveLineInDocument(doc, 100, 2)).toBe(doc)
  })

  it('returns document unchanged for negative toLineIndex', () => {
    expect(moveLineInDocument(doc, 2, -1)).toBe(doc)
  })

  it('returns document unchanged for out-of-bounds toLineIndex', () => {
    expect(moveLineInDocument(doc, 2, 100)).toBe(doc)
  })

  it('moves first line to last', () => {
    const result = moveLineInDocument(doc, 0, 4)
    const lines = result.split('\n')
    expect(lines[0]).toBe('- [ ] First task')
    expect(lines[4]).toBe('# Tasks')
  })

  it('moves last line to first', () => {
    const result = moveLineInDocument(doc, 4, 0)
    const lines = result.split('\n')
    expect(lines[0]).toBe('Some notes')
    expect(lines[4]).toBe('- [ ] Third task')
  })

  it('preserves relative order of other lines', () => {
    const result = moveLineInDocument(doc, 1, 3)
    const lines = result.split('\n')
    expect(lines[0]).toBe('# Tasks')
    expect(lines[4]).toBe('Some notes')
  })

  it('handles single-line document', () => {
    const singleLine = 'Only line'
    expect(moveLineInDocument(singleLine, 0, 0)).toBe(singleLine)
  })
})
