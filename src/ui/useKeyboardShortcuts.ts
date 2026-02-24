'use client'

import { useEffect } from 'react'

export interface ShortcutActions {
  readonly onExport: () => void
  readonly onSave: () => void
  readonly onToggleHelp: () => void
  readonly onToggleSidebar: () => void
  readonly onToggleVim: () => void
}

export interface ShortcutDef {
  readonly key: string
  readonly code?: string
  readonly mac: string
  readonly win: string
  readonly label: string
  readonly action: keyof ShortcutActions
  readonly mod?: boolean
  readonly alt?: boolean
  readonly shift?: boolean
}

export const shortcutDefs: readonly ShortcutDef[] = [
  { key: 'e', mac: '\u2318E', win: 'Ctrl+E', label: 'Export as .txt', action: 'onExport' },
  { key: 's', mac: '\u2318S', win: 'Ctrl+S', label: 'Save now', action: 'onSave' },
  { key: '/', mac: '\u2318/', win: 'Ctrl+/', label: 'Toggle help', action: 'onToggleHelp' },
  { key: 'b', mac: '\u2318B', win: 'Ctrl+B', label: 'Toggle sidebar', action: 'onToggleSidebar' },
  {
    code: 'KeyV',
    key: 'v',
    mac: '\u2325\u21e7V',
    win: 'Alt+Shift+V',
    label: 'Toggle vim mode',
    action: 'onToggleVim',
    mod: false,
    alt: true,
    shift: true,
  },
]

export function getShortcutHint(action: keyof ShortcutActions, isMac: boolean): string | undefined {
  const def = shortcutDefs.find((d) => d.action === action)
  if (!def) return undefined
  const shortcut = isMac ? def.mac : def.win
  return `${def.label} (${shortcut})`
}

function matchesKey(e: KeyboardEvent, def: ShortcutDef): boolean {
  if (def.code) return e.code === def.code
  return e.key.toLowerCase() === def.key
}

function matchesModifiers(e: KeyboardEvent, def: ShortcutDef): boolean {
  const expectMod = def.mod !== false
  const hasMod = e.metaKey || e.ctrlKey
  if (expectMod !== hasMod) return false
  if ((def.alt ?? false) !== e.altKey) return false
  if ((def.shift ?? false) !== e.shiftKey) return false
  return true
}

export function createShortcutHandler(
  actions: ShortcutActions,
  helpOpen: boolean,
): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    for (const def of shortcutDefs) {
      if (!matchesKey(e, def)) continue
      if (!matchesModifiers(e, def)) continue
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
