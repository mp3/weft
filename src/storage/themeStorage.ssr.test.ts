// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { loadThemePreference, saveThemePreference } from './themeStorage'

describe('themeStorage (SSR / no window)', () => {
  it('loadThemePreference returns system when window is undefined', () => {
    expect(loadThemePreference()).toBe('system')
  })

  it('saveThemePreference returns false when window is undefined', () => {
    expect(saveThemePreference('dark')).toBe(false)
  })
})
