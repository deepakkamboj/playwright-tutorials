import { test, expect } from '@playwright/test';

// test suite
test.describe('Example Test Suite', () => {
  test('test', async ({ page }) => {
    test.step('Navigate to example.com', async () => {
      await page.goto('https://www.example.com/');
    });

    await page.goto('https://www.example.com/');

    await page.goto('https://www.example.com/');

    await page.goto('https://www.example.com/');
  });

  test.skip('another test', async ({ page }) => {
    await page.goto('https://www.example.com/');
  });
});
