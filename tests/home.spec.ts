import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4000')
    await page.waitForLoadState('networkidle')
  })

  test('loads successfully and shows hero section', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible()
    await expect(page.locator('text=Mehrab Hossain')).toBeVisible()
  })

  test('navigation scrolls to correct sections', async ({ page }) => {
    const sections = ['about', 'projects', 'skills', 'contact']
    
    for (const section of sections) {
      await page.click(`a[href="#${section}"]`)
      await page.waitForTimeout(500)
      await expect(page.locator(`#${section}`)).toBeInViewport()
    }
  })

  test('theme switching cycles through all 10 themes', async ({ page }) => {
    await page.click('button[aria-label="Choose color theme"]')
    await expect(page.locator('text=Choose Theme')).toBeVisible()
    
    const themes = ['Dark', 'Light', 'Pink', 'Red', 'Blue', 'Green', 'Purple', 'Orange', 'Cyan', 'Rose']
    
    for (const theme of themes) {
      await page.click(`button:has-text("${theme}")`)
      await page.waitForTimeout(200)
      await expect(page.locator('html')).toHaveClass(new RegExp(theme.toLowerCase()))
    }
  })

  test('404 page renders for unknown routes', async ({ page }) => {
    const response = await page.goto('http://localhost:4000/nonexistent-page')
    expect(response?.status()).toBe(404)
    await expect(page.locator('text=404')).toBeVisible()
  })

  test('contact form submits with valid data', async ({ page }) => {
    await page.click('a[href="#contact"]')
    await page.waitForTimeout(500)
    
    await page.fill('input[type="text"]', 'Test User')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('textarea', 'This is a test message')
    
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
    
    await expect(page.locator('text=TRANSMISSION SENT')).toBeVisible()
  })

  test('project filters work', async ({ page }) => {
    await page.click('a[href="#projects"]')
    await page.waitForTimeout(500)
    
    const filterButtons = page.locator('button:has-text("All"), button:has-text("React"), button:has-text("Fullstack")')
    await expect(filterButtons.first()).toBeVisible()
    
    await page.click('button:has-text("React")')
    await page.waitForTimeout(300)
    await expect(page.locator('text=GeoWeather')).toBeVisible()
  })

  test('background music can be played', async ({ page }) => {
    const musicButton = page.locator('button[aria-label*="music" i]')
    if (await musicButton.count() > 0) {
      await musicButton.click()
      await expect(musicButton).toHaveAttribute('aria-label', /pause/i)
    }
  })

  test('project detail modal opens and closes', async ({ page }) => {
    await page.click('a[href="#projects"]')
    await page.waitForTimeout(500)
    
    await page.click('article:has-text("GeoWeather")')
    await expect(page.locator('text=Project details: GeoWeather')).toBeVisible()
    
    await page.click('button[aria-label="Close project details"]')
    await expect(page.locator('text=Project details: GeoWeather')).not.toBeVisible()
  })
})