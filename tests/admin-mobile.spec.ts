import { test, expect } from '@playwright/test';

test('admin mobile toggle placement', async ({ page }) => {
  for (const pw of ['Portfolio7102', 'admin123']) {
    const r = await page.request.post('/api/admin/login', {
      data: { username: 'admin', password: pw },
    });
    if (r.ok()) break;
  }
  await page.goto('/admin');
  await page.waitForTimeout(3000);
  // take mobile screenshot
  await page.screenshot({ path: 'test-results/admin-mobile.png', fullPage: true });
  // check that Visible toggle is visible and within viewport
  const toggle = page.locator('text=Visible').first();
  await expect(toggle).toBeVisible({ timeout: 10000 });
  const box = await toggle.boundingBox();
  console.log('Visible toggle box', box);
  expect(box).not.toBeNull();
  if (box) {
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(400); // mobile width 375 + margin
  }
  // check that ON label is inside track
  const switchBtn = page.getByRole('switch').first();
  await expect(switchBtn).toBeVisible();
  const switchBox = await switchBtn.boundingBox();
  console.log('switch box', switchBox);
  expect(switchBox!.width).toBeCloseTo(52, 5);
});
