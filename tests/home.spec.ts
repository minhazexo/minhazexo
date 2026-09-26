import { test, expect, type Page } from '@playwright/test'

/* Gallery (Glenn-style) homepage flow:
   gate (Loading Assets → Enter) → project index → sections.
   The gate blocks everything until entered, so every test enters first. */

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

test.describe('Home Page', () => {
  test('gate loads assets then enters the gallery index', async ({ page }) => {
    await page.goto('http://localhost:4000')
    // Loading phase shows the asset counter…
    await expect(page.locator('.glenn-gate')).toContainText(/loading/i, { timeout: 10000 })
    // …then the Enter phase with name + role…
    await expect(page.locator('.glenn-enter')).toBeVisible({ timeout: 25000 })
    await expect(page.locator('.glenn-gate')).toContainText(/Mehrab/)
    await page.click('.glenn-enter')
    await expect(page.locator('.glenn-gate')).toBeHidden({ timeout: 5000 })
    // …revealing the project index + meta.
    await expect(page.locator('.glenn-row-link').first()).toBeVisible()
    await expect(page.locator('.glenn-meta')).toContainText(/Mehrab Hossain/)
  })

  test('navigation pills scroll to their sections', async ({ page }) => {
    await enterGallery(page)
    for (const section of ['about', 'projects', 'contact']) {
      await page.click(`.glenn-nav a[href="#${section}"]`)
      await expect(page.locator(`#${section}`)).toBeInViewport({ timeout: 10000 })
    }
  })

  test('all content sections exist with anchors', async ({ page }) => {
    await enterGallery(page)
    for (const section of ['projects', 'about', 'skills', 'experience', 'testimonials', 'contact']) {
      await expect(page.locator(`#${section}`)).toBeAttached()
    }
  })

  test('accent picker switches the theme', async ({ page }) => {
    await enterGallery(page)
    const html = page.locator('html')
    // The 15s show is always on by default.
    await expect(page.locator('.glenn-auto')).toHaveClass(/is-active/)
    await expect(page.locator('.glenn-auto')).toHaveAttribute('aria-pressed', 'true')
    // Pick a deterministic target (immune to the 15s auto-cycle: the manual
    // pick itself stops future cycling, so the theme sticks once set).
    const current = await html.getAttribute('data-theme')
    const target = current === 'orange' ? 'purple' : 'orange'
    const name = target === 'orange' ? 'Orange accent' : 'Purple accent'
    await page.getByRole('button', { name }).scrollIntoViewIfNeeded()
    await page.getByRole('button', { name }).click()
    await expect(html).toHaveAttribute('data-theme', target, { timeout: 10000 })
  })

  test('auto pill resumes the 15s theme cycle after a manual pick', async ({ page }) => {
    // The resume tick lands one full interval after the click — needs room.
    test.setTimeout(90000)
    await enterGallery(page)
    const html = page.locator('html')
    const auto = page.locator('.glenn-auto')
    await auto.scrollIntoViewIfNeeded()

    // A manual pick stops the cycle…
    await page.getByRole('button', { name: 'Orange accent' }).click()
    await expect(html).toHaveAttribute('data-theme', 'orange', { timeout: 10000 })
    await expect(auto).toHaveAttribute('aria-pressed', 'false')

    // …and the Auto pill brings it back: the theme must advance by itself.
    await auto.click()
    await expect(auto).toHaveAttribute('aria-pressed', 'true')
    await expect.poll(async () => html.getAttribute('data-theme'), { timeout: 20000 }).not.toBe('orange')
  })

  test('project index opens a detail modal and Escape closes it', async ({ page }) => {
    await enterGallery(page)
    const firstTitle = ((await page.locator('.glenn-row-link .glenn-row-text').first().textContent()) ?? '').trim()
    expect(firstTitle.length).toBeGreaterThan(0)
    await page.locator('.glenn-row-link').first().click()
    const dialog = page.getByRole('dialog', { name: `Project details: ${firstTitle}` })
    await expect(dialog).toBeVisible({ timeout: 5000 })
    await page.keyboard.press('Escape')
    // Exit animation needs a moment — auto-retry until detached/hidden.
    await expect(dialog).toBeHidden({ timeout: 8000 })
  })

  test('contact form validates then submits gracefully', async ({ page }) => {
    // Multi-step form flow with mocked transport — give it room under load.
    test.setTimeout(60000)
    await enterGallery(page)
    await page.click('.glenn-nav a[href="#contact"]')
    await expect(page.locator('#contact')).toBeInViewport({ timeout: 10000 })

    await page.click('.glenn-form button[type="submit"]')
    await expect(page.locator('.glenn-form .glenn-field-error').first()).toBeVisible()

    // The real send hits an external email API (proven working in live
    // checks) — mock the transport here so the suite stays deterministic
    // while still proving both outcome branches end to end.
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    )
    await page.fill('#glenn-name', 'Test User')
    await page.fill('#glenn-email', 'test@example.com')
    await page.fill('#glenn-message', 'This is a test message')
    await page.click('.glenn-form button[type="submit"]')
    await expect(page.locator('.glenn-form-status')).toBeVisible({ timeout: 10000 })

    // Failure branch: a 500 must surface a visible error, never hang.
    await page.route('**/api/contact', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Mock send failure' }) })
    )
    await page.fill('#glenn-name', 'Test User')
    await page.fill('#glenn-email', 'test@example.com')
    await page.fill('#glenn-message', 'Second attempt')
    await page.click('.glenn-form button[type="submit"]')
    await expect(page.locator('.glenn-form .glenn-field-error').first()).toBeVisible({ timeout: 10000 })
  })

  test('sound toggle flips and back-to-top returns to index', async ({ page }) => {
    await enterGallery(page)
    const toggle = page.locator('.glenn-sound')
    const before = await toggle.textContent()
    await toggle.click()
    await expect(toggle).not.toHaveText(before ?? '')

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(800)
    // At the very end TOP steps aside for the footer links (by design).
    await expect(page.locator('.glenn-top')).toBeHidden({ timeout: 8000 })
    // Mid-page it returns and carries you home.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3))
    await expect(page.locator('.glenn-top')).toBeVisible({ timeout: 8000 })
    await page.locator('.glenn-top').click()
    await expect(page.locator('#projects')).toBeInViewport({ timeout: 8000 })
  })

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto('http://localhost:4000/nonexistent-page')
    expect(response?.status()).toBe(404)
    await expect(page.locator('text=404')).toBeVisible()
  })
})
