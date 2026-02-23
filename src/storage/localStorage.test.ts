import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadDocument, saveDocument } from './localStorage'

describe('localStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('saves and loads a document roundtrip', () => {
    const doc = '- [ ] Test task'
    saveDocument(doc)
    expect(loadDocument()).toBe(doc)
  })

  it('returns null when nothing is stored', () => {
    expect(loadDocument()).toBeNull()
  })

  it('returns true on successful save', () => {
    expect(saveDocument('content')).toBe(true)
  })

  it('overwrites previous content on save', () => {
    saveDocument('first')
    saveDocument('second')
    expect(loadDocument()).toBe('second')
  })

  it('returns null when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(loadDocument()).toBeNull()
  })

  it('returns false when localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(saveDocument('content')).toBe(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})
