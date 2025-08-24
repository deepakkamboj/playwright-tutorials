import { AdminUser } from '@/data/credentials';
import CartPage from '@/pages/cartPage';
import LoginPage from '@/pages/loginPage';
import { test as base } from '@playwright/test';
import { log } from 'console';

// Declare the types of your fixtures.
type MyFixtures = {
  loginPage: LoginPage;
  cartPage: CartPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    // Set up the fixture.
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(AdminUser.username, AdminUser.password);
    await loginPage.verifyLogin();

    // Use the fixture value in the test.
    await use(loginPage);
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});
export default test;
export { expect } from '@playwright/test';
