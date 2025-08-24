import { test, expect } from '@playwright/test';

const isMobile = true;
test.beforeEach(async ({ page }) => {
  test.fixme(isMobile, 'Settings page does not work in mobile yet');

  await page.goto('http://localhost:3000/settings');
});

test('user profile', async ({ page }) => {
  await page.click('text=My Profile');
  // ...
});
