import { expect, test } from '@playwright/test'

test.describe('Mobile UI', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.removeItem('weft-doc')
    })
    await page.goto('/')
  })

  test('sidebar is hidden by default', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]')
    await expect(sidebar).not.toBeInViewport()
  })

  test('toggle button is visible on mobile', async ({ page }) => {
    const toggle = page.locator('[data-testid="sidebar-toggle"]')
    await expect(toggle).toBeVisible()
  })

  test('toggle opens sidebar with backdrop', async ({ page }) => {
    const toggle = page.locator('[data-testid="sidebar-toggle"]')
    await toggle.click()

    const sidebar = page.locator('[data-testid="sidebar"]')
    await expect(sidebar).toBeInViewport()

    const backdrop = page.locator('[data-testid="sidebar-backdrop"]')
    await expect(backdrop).toBeVisible()
  })

  test('sidebar shows tasks when open', async ({ page }) => {
    const toggle = page.locator('[data-testid="sidebar-toggle"]')
    await toggle.click()

    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    const checkboxes = sidebarContent.locator('input[type="checkbox"]')
    await expect(checkboxes.first()).toBeVisible()
  })

  test('backdrop tap closes sidebar', async ({ page }) => {
    const toggle = page.locator('[data-testid="sidebar-toggle"]')
    await toggle.click()

    const sidebar = page.locator('[data-testid="sidebar"]')
    await expect(sidebar).toBeInViewport()

    const backdrop = page.locator('[data-testid="sidebar-backdrop"]')
    await backdrop.click()

    await expect(sidebar).not.toBeInViewport()
    await expect(backdrop).not.toBeVisible()
  })

  test('tab switching works in mobile sidebar', async ({ page }) => {
    const toggle = page.locator('[data-testid="sidebar-toggle"]')
    await toggle.click()

    const dueTab = page.locator('[data-testid="tab-due"]')
    await dueTab.click()

    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    await expect(sidebarContent).toBeVisible()

    const tagsTab = page.locator('[data-testid="tab-tags"]')
    await tagsTab.click()
    await expect(sidebarContent).toContainText('#')
  })

  test('task toggle works in mobile sidebar', async ({ page }) => {
    const toggle = page.locator('[data-testid="sidebar-toggle"]')
    await toggle.click()

    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    const checkboxes = sidebarContent.locator('input[type="checkbox"]')

    const initialCount = await checkboxes.count()
    expect(initialCount).toBeGreaterThan(0)

    await checkboxes.first().click()
    await expect(sidebarContent.locator('input[type="checkbox"]')).toHaveCount(initialCount - 1)
  })

  test('help and export buttons are accessible', async ({ page }) => {
    const helpBtn = page.locator('[data-testid="help-button"]')
    await expect(helpBtn).toBeVisible()

    const exportBtn = page.locator('[data-testid="export-button"]')
    await expect(exportBtn).toBeVisible()
  })
})

test.describe('Desktop sidebar', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.removeItem('weft-doc')
    })
    await page.goto('/')
  })

  test('toggle button is hidden on desktop', async ({ page }) => {
    const toggle = page.locator('[data-testid="sidebar-toggle"]')
    await expect(toggle).not.toBeVisible()
  })

  test('sidebar is always visible on desktop', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar"]')
    await expect(sidebar).toBeVisible()
    await expect(sidebar).toBeInViewport()
  })
})
