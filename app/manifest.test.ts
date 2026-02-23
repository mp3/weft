import { describe, expect, it } from 'vitest'
import manifest from './manifest'

describe('manifest', () => {
  const result = manifest()

  it('returns correct app name', () => {
    expect(result.name).toBe('Weft')
    expect(result.short_name).toBe('Weft')
  })

  it('uses standalone display mode', () => {
    expect(result.display).toBe('standalone')
  })

  it('starts from root URL', () => {
    expect(result.start_url).toBe('/')
  })

  it('includes required icon sizes', () => {
    const icons = result.icons ?? []
    const sizes = icons.map((icon) => icon.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
  })

  it('includes maskable icons', () => {
    const icons = result.icons ?? []
    const maskable = icons.filter((icon) => icon.purpose === 'maskable')
    expect(maskable.length).toBeGreaterThanOrEqual(2)
  })

  it('has valid theme and background colors', () => {
    expect(result.theme_color).toMatch(/^#[0-9a-fA-F]{6}$/)
    expect(result.background_color).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})
