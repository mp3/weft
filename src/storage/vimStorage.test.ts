import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadVimEnabled, saveVimEnabled } from './vimStorage'

describe('vimStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns false when nothing is stored', () => {
    expect(loadVimEnabled()).toBe(false)
  })

  it('saves and loads true', () => {
    saveVimEnabled(true)
    expect(loadVimEnabled()).toBe(true)
  })

  it('saves and loads false', () => {
    saveVimEnabled(true)
    saveVimEnabled(false)
    expect(loadVimEnabled()).toBe(false)
  })

  it('returns false for invalid stored value', () => {
    window.localStorage.setItem('weft-vim', 'invalid')
    expect(loadVimEnabled()).toBe(false)
  })

  it('returns true on successful save', () => {
    expect(saveVimEnabled(true)).toBe(true)
  })

  it('overwrites previous value', () => {
    saveVimEnabled(false)
    saveVimEnabled(true)
    expect(loadVimEnabled()).toBe(true)
  })

  it('returns false when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(loadVimEnabled()).toBe(false)
  })

  it('returns false when localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(saveVimEnabled(true)).toBe(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})
