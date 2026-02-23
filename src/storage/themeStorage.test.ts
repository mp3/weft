import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadThemePreference, saveThemePreference } from './themeStorage'

describe('themeStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns system when nothing is stored', () => {
    expect(loadThemePreference()).toBe('system')
  })

  it('saves and loads light preference', () => {
    saveThemePreference('light')
    expect(loadThemePreference()).toBe('light')
  })

  it('saves and loads dark preference', () => {
    saveThemePreference('dark')
    expect(loadThemePreference()).toBe('dark')
  })

  it('saves and loads system preference', () => {
    saveThemePreference('system')
    expect(loadThemePreference()).toBe('system')
  })

  it('returns system for invalid stored value', () => {
    window.localStorage.setItem('weft-theme', 'invalid')
    expect(loadThemePreference()).toBe('system')
  })

  it('returns true on successful save', () => {
    expect(saveThemePreference('dark')).toBe(true)
  })

  it('overwrites previous preference', () => {
    saveThemePreference('light')
    saveThemePreference('dark')
    expect(loadThemePreference()).toBe('dark')
  })

  it('returns system when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(loadThemePreference()).toBe('system')
  })

  it('returns false when localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(saveThemePreference('dark')).toBe(false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})
