import { test, expect } from '@playwright/test';
import LoginPage from '@/pages/loginPage';
import { TestUser, AdminUser } from '@/data/credentials';
import { playgroundDashboardUrl } from '@/data/contants';

const users = [
  { username: TestUser.username, password: TestUser.password, label: 'TestUser' },
  { username: AdminUser.username, password: AdminUser.password, label: 'AdminUser' },
];

users.forEach(({ username, password, label }) => {
  test(`Login with ${label}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(username, password);
    await loginPage.verifyLogin();
    await expect(page).toHaveURL(playgroundDashboardUrl);
  });
});
