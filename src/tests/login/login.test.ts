import { test, expect } from '@playwright/test';

import LoginPage from '@/pages/loginPage';
import { AdminUser } from '@/data/credentials.js';

test.describe.parallel('Login functionality', async () => {
  test('User can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(AdminUser.username, AdminUser.password);
    await loginPage.verifyLogin();
  });
});
