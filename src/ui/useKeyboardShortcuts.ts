'use client'

import { useEffect } from 'react'

export interface ShortcutActions {
  readonly onExport: () => void
  readonly onSave: () => void
  readonly onToggleHelp: () => void
  readonly onToggleSidebar: () => void
}

export interface ShortcutDef {
  readonly key: string
  readonly mac: string
  readonly label: string
  readonly action: keyof ShortcutActions
}

export const shortcutDefs: readonly ShortcutDef[] = [
  { key: 'e', mac: '\u2318E', label: 'Export as .txt', action: 'onExport' },
  { key: 's', mac: '\u2318S', label: 'Save now', action: 'onSave' },
  { key: '/', mac: '\u2318/', label: 'Toggle help', action: 'onToggleHelp' },
  { key: 'b', mac: '\u2318B', label: 'Toggle sidebar', action: 'onToggleSidebar' },
] as const

function isMod(e: KeyboardEvent): boolean {
  return e.metaKey || e.ctrlKey
}

export function createShortcutHandler(
  actions: ShortcutActions,
  helpOpen: boolean,
): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (!isMod(e)) return

    const key = e.key.toLowerCase()

    for (const def of shortcutDefs) {
      if (key !== def.key) continue
      if (helpOpen && def.action !== 'onToggleHelp') continue

      e.preventDefault()
      actions[def.action]()
      return
    }
  }
}

export function useKeyboardShortcuts(
  actions: ShortcutActions,
  options?: { readonly helpOpen?: boolean },
): void {
  useEffect(() => {
    const handler = createShortcutHandler(actions, options?.helpOpen ?? false)

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [actions, options?.helpOpen])
}
