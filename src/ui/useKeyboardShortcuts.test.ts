import { describe, expect, it, vi } from 'vitest'
import type { ShortcutActions } from './useKeyboardShortcuts'
import { createShortcutHandler, shortcutDefs } from './useKeyboardShortcuts'

function makeEvent(
  key: string,
  modifiers: {
    metaKey?: boolean
    ctrlKey?: boolean
    altKey?: boolean
    shiftKey?: boolean
    code?: string
  } = {},
) {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  })
  vi.spyOn(event, 'preventDefault')
  return event
}

function createActions(): ShortcutActions {
  return {
    onExport: vi.fn(),
    onSave: vi.fn(),
    onToggleHelp: vi.fn(),
    onToggleSidebar: vi.fn(),
    onToggleVim: vi.fn(),
  }
}

describe('createShortcutHandler', () => {
  it('calls onExport on Mod+E (metaKey)', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)
    const event = makeEvent('e', { metaKey: true })

    handler(event)

    expect(actions.onExport).toHaveBeenCalledOnce()
    expect(event.preventDefault).toHaveBeenCalledOnce()
  })

  it('calls onSave on Mod+S (ctrlKey)', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)
    const event = makeEvent('s', { ctrlKey: true })

    handler(event)

    expect(actions.onSave).toHaveBeenCalledOnce()
    expect(event.preventDefault).toHaveBeenCalledOnce()
  })

  it('calls onToggleHelp on Mod+/', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)
    const event = makeEvent('/', { metaKey: true })

    handler(event)

    expect(actions.onToggleHelp).toHaveBeenCalledOnce()
  })

  it('calls onToggleSidebar on Mod+B', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)
    const event = makeEvent('b', { ctrlKey: true })

    handler(event)

    expect(actions.onToggleSidebar).toHaveBeenCalledOnce()
  })

  it('does not call actions without Mod key', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)

    handler(makeEvent('e'))
    handler(makeEvent('s'))
    handler(makeEvent('/'))
    handler(makeEvent('b'))

    expect(actions.onExport).not.toHaveBeenCalled()
    expect(actions.onSave).not.toHaveBeenCalled()
    expect(actions.onToggleHelp).not.toHaveBeenCalled()
    expect(actions.onToggleSidebar).not.toHaveBeenCalled()
  })

  it('ignores non-help shortcuts when helpOpen is true', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, true)

    handler(makeEvent('e', { metaKey: true }))
    handler(makeEvent('s', { metaKey: true }))
    handler(makeEvent('b', { metaKey: true }))

    expect(actions.onExport).not.toHaveBeenCalled()
    expect(actions.onSave).not.toHaveBeenCalled()
    expect(actions.onToggleSidebar).not.toHaveBeenCalled()
  })

  it('allows Mod+/ when helpOpen is true', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, true)
    const event = makeEvent('/', { metaKey: true })

    handler(event)

    expect(actions.onToggleHelp).toHaveBeenCalledOnce()
    expect(event.preventDefault).toHaveBeenCalledOnce()
  })

  it('handles uppercase keys', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)

    handler(makeEvent('E', { metaKey: true }))

    expect(actions.onExport).toHaveBeenCalledOnce()
  })

  it('does not call preventDefault for unmatched Mod keys', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)
    const event = makeEvent('z', { metaKey: true })

    handler(event)

    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  it('calls onToggleVim on Alt+Shift+V (via e.code)', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)
    const event = makeEvent('\u25CA', { altKey: true, shiftKey: true, code: 'KeyV' })

    handler(event)

    expect(actions.onToggleVim).toHaveBeenCalledOnce()
    expect(event.preventDefault).toHaveBeenCalledOnce()
  })

  it('does not call onToggleVim on Mod+V', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)
    const event = makeEvent('v', { metaKey: true, code: 'KeyV' })

    handler(event)

    expect(actions.onToggleVim).not.toHaveBeenCalled()
  })

  it('does not call onToggleVim on Alt+V without Shift', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, false)
    const event = makeEvent('v', { altKey: true, code: 'KeyV' })

    handler(event)

    expect(actions.onToggleVim).not.toHaveBeenCalled()
  })

  it('ignores onToggleVim when helpOpen is true', () => {
    const actions = createActions()
    const handler = createShortcutHandler(actions, true)
    const event = makeEvent('\u25CA', { altKey: true, shiftKey: true, code: 'KeyV' })

    handler(event)

    expect(actions.onToggleVim).not.toHaveBeenCalled()
  })
})

describe('shortcutDefs', () => {
  it('has definitions for all five shortcuts', () => {
    expect(shortcutDefs).toHaveLength(5)
  })

  it('every definition has required fields', () => {
    for (const def of shortcutDefs) {
      expect(def.key).toBeTruthy()
      expect(def.mac).toBeTruthy()
      expect(def.label).toBeTruthy()
      expect(def.action).toBeTruthy()
    }
  })
})
