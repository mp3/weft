import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
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

    const capturedRef: { current: ReturnType<typeof useTheme> | null } = { current: null }
    function GoodComponent() {
      // eslint-disable-next-line react-hooks/immutability -- intentional capture pattern for SSR hook testing
      capturedRef.current = useTheme()
      return null
    }
    renderToString(createElement(ThemeProvider, null, createElement(GoodComponent)))
    expect(capturedRef.current).not.toBeNull()
    expect(capturedRef.current!.preference).toBe('system')
    expect(capturedRef.current!.resolved).toBe('light')
    expect(typeof capturedRef.current!.setPreference).toBe('function')

    vi.unstubAllGlobals()
  })
})
