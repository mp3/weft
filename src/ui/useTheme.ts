import { createContext, useContext } from 'react'
import type { ThemePreference } from '@/storage/themeStorage'

export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  readonly preference: ThemePreference
  readonly resolved: ResolvedTheme
  readonly setPreference: (pref: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}

export function resolveTheme(preference: ThemePreference, systemDark: boolean): ResolvedTheme {
  if (preference === 'system') return systemDark ? 'dark' : 'light'
  return preference
}
