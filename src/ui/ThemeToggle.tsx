'use client'

import type { ThemePreference } from '@/storage/themeStorage'
import { useTheme } from './useTheme'

const CYCLE: readonly ThemePreference[] = ['light', 'dark', 'system']

const ICONS: Record<ThemePreference, string> = {
  light: '\u2600',
  dark: '\u263E',
  system: '\u2699',
}

const LABELS: Record<ThemePreference, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System mode',
}

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()

  const handleClick = () => {
    const currentIndex = CYCLE.indexOf(preference)
    const nextIndex = (currentIndex + 1) % CYCLE.length
    setPreference(CYCLE[nextIndex])
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded border border-zinc-300 px-2.5 py-1 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
      aria-label={LABELS[preference]}
      title={LABELS[preference]}
      data-testid="theme-toggle"
    >
      {ICONS[preference]}
    </button>
  )
}
