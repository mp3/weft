import { expect, test } from '@playwright/test'

const mod = process.platform === 'darwin' ? 'Meta' : 'Control'

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.removeItem('weft-doc')
    })
    await page.goto('/')
    await expect(page.locator('.cm-editor')).toBeVisible()
  })

  test('Mod+/ toggles help dialog', async ({ page }) => {
    const dialog = page.locator('[data-testid="help-dialog"]')
    await expect(dialog).not.toBeVisible()

    await page.keyboard.press(`${mod}+/`)
    await expect(dialog).toBeVisible()

    await page.keyboard.press(`${mod}+/`)
    await expect(dialog).not.toBeVisible()
  })

  test('Mod+B toggles sidebar on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    const sidebar = page.locator('[data-testid="sidebar"]')
    const backdrop = page.locator('[data-testid="sidebar-backdrop"]')

    await expect(backdrop).not.toBeVisible()

    await page.keyboard.press(`${mod}+b`)
    await expect(backdrop).toBeVisible()
    await expect(sidebar).toHaveClass(/translate-x-0/)

    await page.keyboard.press(`${mod}+b`)
    await expect(backdrop).not.toBeVisible()
    await expect(sidebar).toHaveClass(/translate-x-full/)
  })

  test('Mod+E triggers download', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download')

    await page.keyboard.press(`${mod}+e`)

    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.txt$/)
  })

  test('Mod+S shows save toast', async ({ page }) => {
    const toast = page.locator('[data-testid="save-toast"]')
    await expect(toast).not.toBeVisible()

    await page.keyboard.press(`${mod}+s`)
    await expect(toast).toBeVisible()
    await expect(toast).toHaveText('Saved')

    await expect(toast).not.toBeVisible({ timeout: 3000 })
  })

  test('help dialog shows keyboard shortcuts section', async ({ page }) => {
    await page.keyboard.press(`${mod}+/`)

    const dialog = page.locator('[data-testid="help-dialog"]')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText('Keyboard Shortcuts')
    await expect(dialog).toContainText('Export as .txt')
    await expect(dialog).toContainText('Save now')
    await expect(dialog).toContainText('Toggle help')
    await expect(dialog).toContainText('Toggle sidebar')
  })
})
