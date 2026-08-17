import { test, expect } from '@playwright/test'

// Mock admin API responses so these tests run without a live database.
const MOCK_PROJECTS = [
  {
    id: 1, title: 'GeoWeather', description: 'Weather dashboard', image: '/a.webp',
    tech: ['React'], category: 'React', github: 'https://github.com/x', demo: 'https://demo.com',
    isVisible: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2, title: 'Secret Project', description: 'Hidden project', image: '/b.webp',
    tech: ['Next.js'], category: 'Fullstack', github: 'https://github.com/x', demo: 'https://demo.com',
    isVisible: false, createdAt: '2024-01-02T00:00:00.000Z', updatedAt: '2024-01-02T00:00:00.000Z',
  },
]

test.describe('Admin project visibility', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/admin/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ username: 'admin' }) })
    )
    await page.route('**/api/admin/projects', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_PROJECTS) })
      }
      return route.continue()
    })
  })

  test('shows Visible/Hidden status for every project', async ({ page }) => {
    await page.goto('/admin')

    await expect(page.getByText('GeoWeather')).toBeVisible()
    await expect(page.getByText('Secret Project')).toBeVisible()

    // Both projects render with their status labels and switches
    await expect(page.getByText('Visible', { exact: true })).toHaveCount(1)
    await expect(page.getByText('Hidden', { exact: true })).toHaveCount(1)
    await expect(page.getByRole('switch')).toHaveCount(2)
  })

  test('filters projects by All / Visible / Hidden', async ({ page }) => {
    await page.goto('/admin')

    await page.click('button:has-text("hidden")')
    await expect(page.getByText('GeoWeather')).not.toBeVisible()
    await expect(page.getByText('Secret Project')).toBeVisible()

    await page.click('button:has-text("visible")')
    await expect(page.getByText('GeoWeather')).toBeVisible()
    await expect(page.getByText('Secret Project')).not.toBeVisible()

    await page.click('button:has-text("all")')
    await expect(page.getByText('GeoWeather')).toBeVisible()
    await expect(page.getByText('Secret Project')).toBeVisible()
  })

  test('toggling a project off PATCHes the API, updates state and shows a success toast', async ({ page }) => {
    let patchCalls = 0
    await page.route('**/api/admin/projects/*/visibility', async (route) => {
      patchCalls++
      const body = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...MOCK_PROJECTS[0], isVisible: body.is_visible }),
      })
    })

    await page.goto('/admin')

    // Turn GeoWeather (currently Visible) OFF
    await page.click('button[aria-label="Hide project on public website"]')

    await expect(page.getByText('Hidden', { exact: true })).toHaveCount(2)
    await expect(page.getByText('Project is now hidden on the public website')).toBeVisible()
    expect(patchCalls).toBe(1)
  })

  test('does not fire duplicate requests while an update is saving', async ({ page }) => {
    let patchCalls = 0
    await page.route('**/api/admin/projects/*/visibility', async (route) => {
      patchCalls++
      await new Promise((r) => setTimeout(r, 400))
      const body = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...MOCK_PROJECTS[0], isVisible: body.is_visible }),
      })
    })

    await page.goto('/admin')

    // The switch's aria-label flips after the first click, so target it by role
    const toggle = page.getByRole('switch').first()
    await toggle.click()
    await toggle.click({ force: true }) // click again while the request is pending
    await toggle.click({ force: true })

    await page.waitForTimeout(700)
    expect(patchCalls).toBe(1)

    await expect(page.getByText('Hidden', { exact: true })).toHaveCount(2)
  })

  test('reverts the toggle and shows an error when the update fails', async ({ page }) => {
    await page.route('**/api/admin/projects/*/visibility', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Failed to update project visibility' }) })
    )

    await page.goto('/admin')

    await page.click('button[aria-label="Hide project on public website"]')

    await expect(page.getByText('Failed to update visibility')).toBeVisible()

    // Toggle reverted — back to 1 Visible + 1 Hidden
    await expect(page.getByText('Visible', { exact: true })).toHaveCount(1)
    await expect(page.getByText('Hidden', { exact: true })).toHaveCount(1)
  })
})
