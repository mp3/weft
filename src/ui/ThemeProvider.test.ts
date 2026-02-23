import { describe, expect, it } from 'vitest'
import { resolveTheme } from './useTheme'

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
})
