import { AdminUser } from '@/data/credentials.js';
import { test as setup, expect } from '@playwright/test';
import { TestUser, VisualUser } from '@/data/credentials';
import { adminauthFile, playgroundDashboardUrl, testauthFile } from '@/data/contants';

setup('Create standard user auth', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/login');

  await page.getByTestId('email-input').fill(TestUser.username);
  await page.getByTestId('password-input').fill(TestUser.password);
  await page.getByTestId('login-submit-button').click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(playgroundDashboardUrl);
  //await page.getByAltText('Products').isVisible();
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  //await expect(page.getByRole('button', { id: 'Open Menu' })).toBeVisible();

  // End of authentication steps.
  // Save the storage state so it can be shared across tests.

  // create a delay of 1 second to allow the storage state to be saved
  // await page.waitForTimeout(5000);
  await page.context().storageState({ path: testauthFile });
});

setup('Create visual user auth', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('/login');
  await page.getByTestId('email-input').fill(AdminUser.username);
  await page.getByTestId('password-input').fill(AdminUser.password);
  await page.getByTestId('login-submit-button').click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(playgroundDashboardUrl);
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  //await expect(page.getByRole('button', { id: 'Open Menu' })).toBeVisible();

  // End of authentication steps.
  // Save the storage state so it can be shared across tests.

  // create a delay of 1 second to allow the storage state to be saved
  // await page.waitForTimeout(5000);
  await page.context().storageState({ path: adminauthFile });
});
