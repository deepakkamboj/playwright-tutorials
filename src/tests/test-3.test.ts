import { test, expect } from '@playwright/test';
test.describe('chromium only', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only!');

  test.beforeAll(async () => {
    // This hook is only run in Chromium.
  });

  test('test 1', async ({ page }) => {
    // This test is only run in Chromium.
  });

  test('test 2', async ({ page }) => {
    // This test is only run in Chromium.
  });

  test('Test login page @fast', async ({ page }) => {
    // ...
  });

  test('Test full report @slow', async ({ page }) => {
    // ...
  });
});
