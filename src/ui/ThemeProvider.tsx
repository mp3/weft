'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ThemePreference } from '@/storage/themeStorage'
import { loadThemePreference, saveThemePreference } from '@/storage/themeStorage'
import { resolveTheme, ThemeContext } from './useTheme'

interface ThemeProviderProps {
  readonly children: React.ReactNode
}

function getSystemDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(loadThemePreference)
  const [systemDark, setSystemDark] = useState<boolean>(getSystemDark)

  const resolved = resolveTheme(preference, systemDark)

  useEffect(() => {
    const root = document.documentElement
    if (resolved === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolved])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current)
    }
  }, [])

  const setPreference = useCallback((pref: ThemePreference) => {
    document.documentElement.classList.add('theme-transition')
    setPreferenceState(pref)
    saveThemePreference(pref)
    if (transitionTimer.current) clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 200)
  }, [])

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
