// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { loadVimEnabled, saveVimEnabled } from './vimStorage'

describe('vimStorage (SSR / no window)', () => {
  it('loadVimEnabled returns false when window is undefined', () => {
    expect(loadVimEnabled()).toBe(false)
  })

  it('saveVimEnabled returns false when window is undefined', () => {
    expect(saveVimEnabled(true)).toBe(false)
  })
})
