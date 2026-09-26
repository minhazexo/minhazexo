import { test, expect, type Page } from '@playwright/test'

/* Phone-only navbar (.glenn-mobile-nav): the desktop pill nav is hidden
   below 640px, so this spec runs only on the mobile projects. Same gate
   entry as home.spec.ts. */

async function enterGallery(page: Page) {
  await page.goto('http://localhost:4000')
  await expect(page.locator('.glenn-gate')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('.glenn-enter')).toBeVisible({ timeout: 25000 })
  await page.click('.glenn-enter')
  await expect(page.locator('.glenn-gate')).toBeHidden({ timeout: 5000 })
  // Let live API data land before interacting: the index first renders
  // fallback order, then re-renders in API order — clicking mid-swap
  // opens a different project than the label just read.
  await page
    .waitForResponse((r) => r.url().includes('/api/projects'), { timeout: 20000 })
    .catch(() => null)
}

test.describe('Mobile navbar', () => {
  test.beforeEach(async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 1000) >= 640, 'phone-only navbar')
    await enterGallery(page)
  })

  test('shows the pill bar and hides the desktop nav', async ({ page }) => {
    await expect(page.locator('.mnav-bar')).toBeVisible()
    await expect(page.locator('.mnav-toggle')).toBeVisible()
    await expect(page.locator('.glenn-nav')).toBeHidden()
    await expect(page.locator('.mnav-dot')).toHaveCount(8)
    await expect(page.locator('.mnav-logo img')).toBeVisible()
  })

  test('hamburger opens the menu with all links and closes on Escape', async ({ page }) => {
    await page.locator('.mnav-toggle').click()
    await expect(page.locator('#mnav-sheet')).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    await expect(page.locator('#mnav-sheet a[href="#about"]')).toBeVisible()
    await expect(page.locator('#mnav-sheet a[href="#projects"]')).toBeVisible()
    await expect(page.locator('#mnav-sheet a[href="#contact"]')).toBeVisible()
    await expect(page.locator('#mnav-sheet a[href^="mailto:"]')).toBeVisible()
    await expect(page.locator('#mnav-sheet a[download]')).toBeVisible()
    await expect(page.locator('.mnav-toggle')).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(page.locator('#mnav-sheet')).toBeHidden()
  })

  test('accent dot switches the theme', async ({ page }) => {
    const html = page.locator('html')
    // The dots sit in the bar (always visible). A manual pick stops the
    // 15s auto-cycle, so the chosen theme sticks.
    const current = await html.getAttribute('data-theme')
    const target = current === 'orange' ? 'purple' : 'orange'
    const name = target === 'orange' ? 'Accent color: Orange' : 'Accent color: Purple'
    await page.locator(`.mnav-dot[aria-label="${name}"]`).click()
    await expect(html).toHaveAttribute('data-theme', target, { timeout: 10000 })
  })

  test('hexgrid picker switches the effect', async ({ page }) => {
    await page.locator('.mnav-toggle').click()
    const sheet = page.locator('#mnav-sheet')
    await sheet.getByRole('button', { name: 'Calm' }).click()
    await expect.poll(() => page.evaluate(() => localStorage.getItem('hexgrid-effect'))).toBe('off')
    await sheet.getByRole('button', { name: 'Wave' }).click()
    await expect.poll(() => page.evaluate(() => localStorage.getItem('hexgrid-effect'))).toBe('wave')
  })

  test('menu link scrolls to its section and closes the menu', async ({ page }) => {
    await page.locator('.mnav-toggle').click()
    await page.locator('#mnav-sheet a[href="#about"]').click()
    await expect(page.locator('#mnav-sheet')).toBeHidden()
    await expect(page.locator('#about')).toBeInViewport({ timeout: 10000 })
  })
})
