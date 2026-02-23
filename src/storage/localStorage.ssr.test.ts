// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { loadDocument, saveDocument } from './localStorage'

describe('localStorage (SSR / no window)', () => {
  it('loadDocument returns null when window is undefined', () => {
    expect(loadDocument()).toBeNull()
  })

  it('saveDocument returns false when window is undefined', () => {
    expect(saveDocument('content')).toBe(false)
  })
})
