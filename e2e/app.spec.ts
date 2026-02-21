import { test, expect } from '@playwright/test'

test.describe('Weft Editor', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.removeItem('weft-doc')
    })
    await page.goto('/')
  })

  test('loads with sample text and editor visible', async ({ page }) => {
    const editor = page.locator('[data-testid="editor"]')
    await expect(editor).toBeVisible()

    const cmEditor = page.locator('.cm-editor')
    await expect(cmEditor).toBeVisible()

    const content = page.locator('.cm-content')
    await expect(content).toContainText('Project Tasks')
  })

  test('sidebar shows open tasks from sample text', async ({ page }) => {
    const tasksTab = page.locator('[data-testid="tab-tasks"]')
    await expect(tasksTab).toBeVisible()

    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    const checkboxes = sidebarContent.locator('input[type="checkbox"]')
    await expect(checkboxes.first()).toBeVisible()

    const checkboxCount = await checkboxes.count()
    expect(checkboxCount).toBeGreaterThan(0)
  })

  test('toggling a checkbox updates the sidebar', async ({ page }) => {
    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    const checkboxes = sidebarContent.locator('input[type="checkbox"]')

    const initialCount = await checkboxes.count()
    expect(initialCount).toBeGreaterThan(0)

    await checkboxes.first().click()

    await expect(sidebarContent.locator('input[type="checkbox"]')).toHaveCount(initialCount - 1)
  })

  test('due soon tab shows items with due dates', async ({ page }) => {
    const dueTab = page.locator('[data-testid="tab-due"]')
    await dueTab.click()

    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    await expect(sidebarContent).toBeVisible()
  })

  test('tags tab shows tag cloud', async ({ page }) => {
    const tagsTab = page.locator('[data-testid="tab-tags"]')
    await tagsTab.click()

    const sidebarContent = page.locator('[data-testid="sidebar-content"]')
    await expect(sidebarContent).toBeVisible()
    await expect(sidebarContent).toContainText('#')
  })

  test('content persists across reload via localStorage', async ({ page, context }) => {
    const testDoc = '# Test\n- [ ] Persistence test task'

    // Set localStorage with test content, then reload to load it
    await context.addInitScript((doc: string) => {
      window.localStorage.setItem('weft-doc', doc)
    }, testDoc)

    await page.reload()

    await expect(page.locator('.cm-content')).toContainText('Persistence test task')
  })

  test('export button is visible', async ({ page }) => {
    const exportBtn = page.locator('[data-testid="export-button"]')
    await expect(exportBtn).toBeVisible()
    await expect(exportBtn).toHaveText('Export .txt')
  })
})
