import { expect, test } from '@playwright/test'

test.describe('Search and Filter', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.removeItem('weft-doc')
    })
    await page.goto('/')
    // Wait for sidebar content to be ready
    await expect(page.locator('[data-testid="sidebar-content"]')).toBeVisible()
  })

  test('search input filters task list', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]')
    await expect(searchInput).toBeVisible()

    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    const initialCount = await sidebarContent.locator('input[type="checkbox"]').count()
    expect(initialCount).toBeGreaterThan(0)

    await searchInput.fill('login')

    const filteredCheckboxes = sidebarContent.locator('input[type="checkbox"]')
    await expect(filteredCheckboxes).toHaveCount(1)
    await expect(sidebarContent).toContainText('Fix login page CSS bug')
  })

  test('clearing search restores all tasks', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]')
    const sidebarContent = page.locator('[data-testid="sidebar-content"]')

    const initialCount = await sidebarContent.locator('input[type="checkbox"]').count()

    await searchInput.fill('login')
    await expect(sidebarContent.locator('input[type="checkbox"]')).toHaveCount(1)

    await searchInput.clear()
    await expect(sidebarContent.locator('input[type="checkbox"]')).toHaveCount(initialCount)
  })

  test('tag click filters tasks and shows active tag chip', async ({ page }) => {
    // Switch to Tags tab to click a tag
    await page.locator('[data-testid="tab-tags"]').click()

    const devopsTag = page.locator('[data-testid="tag-devops"]')
    await expect(devopsTag).toBeVisible()
    await devopsTag.click()

    // Active tag chip should appear in search bar
    const tagChip = page.locator('[data-testid="active-tag-filter"]')
    await expect(tagChip).toBeVisible()
    await expect(tagChip).toContainText('#devops')

    // Switch to Open Tasks tab to verify filter
    await page.locator('[data-testid="tab-tasks"]').click()
    const sidebarContent = page.locator('[data-testid="sidebar-content"]')

    // Should show only devops tasks (CI pipeline and Deploy to staging)
    const checkboxes = sidebarContent.locator('input[type="checkbox"]')
    await expect(checkboxes).toHaveCount(2)
  })

  test('tag chip dismiss removes tag filter', async ({ page }) => {
    // Apply tag filter
    await page.locator('[data-testid="tab-tags"]').click()
    await page.locator('[data-testid="tag-devops"]').click()

    const tagChip = page.locator('[data-testid="active-tag-filter"]')
    await expect(tagChip).toBeVisible()

    // Dismiss it
    await tagChip.click()
    await expect(tagChip).not.toBeVisible()

    // Switch to tasks tab and verify all tasks are back
    await page.locator('[data-testid="tab-tasks"]').click()
    const checkboxes = page
      .locator('[data-testid="sidebar-content"]')
      .locator('input[type="checkbox"]')
    const count = await checkboxes.count()
    expect(count).toBeGreaterThan(2)
  })

  test('show completed toggle displays completed tasks', async ({ page }) => {
    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    const initialCount = await sidebarContent.locator('input[type="checkbox"]').count()

    const toggle = page.locator('[data-testid="show-completed-toggle"]')
    await toggle.check()

    // Should show more tasks (including completed ones)
    const expandedCount = await sidebarContent.locator('input[type="checkbox"]').count()
    expect(expandedCount).toBeGreaterThan(initialCount)
  })

  test('text search and tag filter combine with AND logic', async ({ page }) => {
    // Set tag filter via Tags tab
    await page.locator('[data-testid="tab-tags"]').click()
    await page.locator('[data-testid="tag-devops"]').click()

    // Switch to tasks and add text search
    await page.locator('[data-testid="tab-tasks"]').click()
    await page.locator('[data-testid="search-input"]').fill('deploy')

    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    const checkboxes = sidebarContent.locator('input[type="checkbox"]')
    await expect(checkboxes).toHaveCount(1)
    await expect(sidebarContent).toContainText('Deploy to staging')
  })
})
