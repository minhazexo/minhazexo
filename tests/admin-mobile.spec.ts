import { test, expect } from '@playwright/test';

// Like admin-projects-visibility.spec.ts, mock the admin APIs: this spec is
// about toggle geometry on small screens, not about real credentials
// (which live in the production database, not in test env).
test.use({ viewport: { width: 375, height: 667 } })

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

test('admin mobile toggle placement', async ({ page }) => {
  await page.route('**/api/admin/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ username: 'admin' }) })
  )
  await page.route('**/api/admin/projects', (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_PROJECTS) })
    }
    return route.continue()
  })

  await page.goto('/admin');
  // take mobile screenshot
  await page.screenshot({ path: 'test-results/admin-mobile.png', fullPage: true });
  // check that Visible toggle is visible and within viewport
  const toggle = page.getByText('Visible', { exact: true }).first();
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
