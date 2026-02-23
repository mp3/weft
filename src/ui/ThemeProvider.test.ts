import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from './ThemeProvider'
import { resolveTheme, useTheme } from './useTheme'

describe('resolveTheme', () => {
  it('returns light when preference is light regardless of system', () => {
    expect(resolveTheme('light', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
  })

  it('returns dark when preference is dark regardless of system', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme('dark', true)).toBe('dark')
  })

  it('returns light when system and system is light', () => {
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('returns dark when system and system is dark', () => {
    expect(resolveTheme('system', true)).toBe('dark')
  })

  it('throws when useTheme is called outside ThemeProvider', () => {
    function BadComponent() {
      useTheme()
      return null
    }
    expect(() => renderToString(createElement(BadComponent))).toThrow(
      'useTheme must be used within a ThemeProvider',
    )
  })

  it('returns context value when useTheme is called inside ThemeProvider', () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    vi.stubGlobal('matchMedia', matchMediaMock)

    let captured: ReturnType<typeof useTheme> | null = null
    function GoodComponent() {
      captured = useTheme()
      return null
    }
    renderToString(
      createElement(ThemeProvider, null, createElement(GoodComponent)),
    )
    expect(captured).not.toBeNull()
    expect(captured!.preference).toBe('system')
    expect(captured!.resolved).toBe('light')
    expect(typeof captured!.setPreference).toBe('function')

    vi.unstubAllGlobals()
  })
})
