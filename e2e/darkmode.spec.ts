import { expect, test } from '@playwright/test'

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.removeItem('weft-theme')
      window.localStorage.removeItem('weft-doc')
    })
  })

  test('defaults to system preference (light)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)
  })

  test('defaults to system preference (dark)', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('theme toggle cycles through light, dark, system', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    const toggle = page.locator('[data-testid="theme-toggle"]')
    await expect(toggle).toBeVisible()

    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)

    // system -> light (still no dark class)
    await toggle.click()

    // light -> dark
    await toggle.click()
    await expect(html).toHaveClass(/dark/)

    // dark -> system (back to light since emulated light)
    await toggle.click()
    await expect(html).not.toHaveClass(/dark/)
  })

  test('persists preference to localStorage', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    const toggle = page.locator('[data-testid="theme-toggle"]')

    // system -> light -> dark
    await toggle.click()
    await toggle.click()

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    const stored = await page.evaluate(() => window.localStorage.getItem('weft-theme'))
    expect(stored).toBe('dark')
  })

  test('sidebar adapts to dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    const sidebar = page.locator('[data-testid="sidebar"]')
    await expect(sidebar).toBeVisible()
  })

  test('help dialog works in dark mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    const helpBtn = page.locator('[data-testid="help-button"]')
    await helpBtn.click()

    const dialog = page.locator('[data-testid="help-dialog"]')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Syntax Reference')
  })

  test('no flash of wrong theme on load with dark preference', async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem('weft-theme', 'dark')
    })
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })
})
