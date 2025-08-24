import { test, expect } from '@playwright/test';

test('Verify Autify Nexus page and text content', async ({ page }) => {
  // Open the site
  await page.goto('https://autify.com/');

  // Hover over the "Product" menu
  await page.hover('text=Product');

  // Click on "Autify Nexus"
  await page.click('text=Autify Nexus');

  // Verify the target text is visible on the new page
  await expect(page.getByRole('heading', { name: 'Write Tests In Natural Languages' })).toBeVisible();
});
