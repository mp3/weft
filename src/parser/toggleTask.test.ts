import { describe, expect, it } from 'vitest'
import { toggleTaskLine, toggleTaskInDocument } from './toggleTask'

describe('toggleTaskLine', () => {
  it('toggles open to completed', () => {
    expect(toggleTaskLine('- [ ] Buy groceries')).toBe('- [x] Buy groceries')
  })

  it('toggles completed to open', () => {
    expect(toggleTaskLine('- [x] Buy groceries')).toBe('- [ ] Buy groceries')
  })

  it('returns non-task lines unchanged', () => {
    expect(toggleTaskLine('Just a line')).toBe('Just a line')
    expect(toggleTaskLine('# Heading')).toBe('# Heading')
    expect(toggleTaskLine('')).toBe('')
  })

  it('preserves tags and due dates when toggling', () => {
    const line = '- [ ] Deploy #devops due:2026-03-01'
    const toggled = toggleTaskLine(line)
    expect(toggled).toBe('- [x] Deploy #devops due:2026-03-01')
  })
})

describe('toggleTaskInDocument', () => {
  const doc = `# Tasks
- [ ] First task
- [x] Second task
Some notes`

  it('toggles a specific task line in the document', () => {
    const result = toggleTaskInDocument(doc, 1)
    expect(result.split('\n')[1]).toBe('- [x] First task')
  })

  it('toggles completed task back to open', () => {
    const result = toggleTaskInDocument(doc, 2)
    expect(result.split('\n')[2]).toBe('- [ ] Second task')
  })

  it('returns document unchanged for non-task line', () => {
    const result = toggleTaskInDocument(doc, 0)
    expect(result).toBe(doc)
  })

  it('returns document unchanged for out-of-bounds index', () => {
    expect(toggleTaskInDocument(doc, -1)).toBe(doc)
    expect(toggleTaskInDocument(doc, 100)).toBe(doc)
  })

  it('preserves all other lines', () => {
    const result = toggleTaskInDocument(doc, 1)
    const lines = result.split('\n')
    expect(lines[0]).toBe('# Tasks')
    expect(lines[2]).toBe('- [x] Second task')
    expect(lines[3]).toBe('Some notes')
  })
})
