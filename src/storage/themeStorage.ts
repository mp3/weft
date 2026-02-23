import { z } from 'zod'

const THEME_KEY = 'weft-theme'

const ThemePreference = z.enum(['light', 'dark', 'system'])
type ThemePreference = z.infer<typeof ThemePreference>

export function loadThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem(THEME_KEY)
    const parsed = ThemePreference.safeParse(stored)
    return parsed.success ? parsed.data : 'system'
  } catch {
    return 'system'
  }
}

export function saveThemePreference(pref: ThemePreference): boolean {
  if (typeof window === 'undefined') return false
  try {
    window.localStorage.setItem(THEME_KEY, pref)
    return true
  } catch {
    return false
  }
}

export type { ThemePreference }
