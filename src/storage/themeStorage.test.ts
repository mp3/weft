import { beforeEach, describe, expect, it } from 'vitest'
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
})
