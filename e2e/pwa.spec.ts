import { expect, test } from '@playwright/test'

test.describe('PWA', () => {
  test('manifest.webmanifest returns valid JSON', async ({ page }) => {
    const response = await page.goto('/manifest.webmanifest')
    expect(response?.status()).toBe(200)

    const json = await response?.json()
    expect(json.name).toBe('Weft')
    expect(json.short_name).toBe('Weft')
    expect(json.display).toBe('standalone')
    expect(json.start_url).toBe('/')
    expect(json.icons.length).toBeGreaterThanOrEqual(4)
  })

  test('apple-touch-icon link tag exists', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('link[rel="apple-touch-icon"]')
    await expect(link).toHaveAttribute('href', /apple-touch-icon/)
  })

  test('mobile-web-app-capable meta tag exists', async ({ page }) => {
    await page.goto('/')
    const meta = page.locator('meta[name="mobile-web-app-capable"]')
    await expect(meta).toHaveAttribute('content', 'yes')
  })
})
