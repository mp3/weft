import { beforeEach, describe, expect, it } from 'vitest'
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
})
