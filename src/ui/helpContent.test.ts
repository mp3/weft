import { describe, expect, it } from 'vitest'
import { helpSections } from './helpContent'

describe('helpSections', () => {
  it('has sections with title and items', () => {
    for (const section of helpSections) {
      expect(section.title).toBeTruthy()
      expect(section.items.length).toBeGreaterThan(0)
    }
  })

  it('contains Tasks section', () => {
    const tasks = helpSections.find((s) => s.title === 'Tasks')
    expect(tasks).toBeDefined()
    expect(tasks!.items.length).toBeGreaterThanOrEqual(2)
  })

  it('contains Tags section', () => {
    const tags = helpSections.find((s) => s.title === 'Tags')
    expect(tags).toBeDefined()
    expect(tags!.items.length).toBeGreaterThanOrEqual(1)
  })

  it('contains Due Dates section', () => {
    const due = helpSections.find((s) => s.title === 'Due Dates')
    expect(due).toBeDefined()
    expect(due!.items.length).toBeGreaterThanOrEqual(1)
  })

  it('every item has syntax and description', () => {
    for (const section of helpSections) {
      for (const item of section.items) {
        expect(item.syntax).toBeTruthy()
        expect(item.description).toBeTruthy()
      }
    }
  })
})
