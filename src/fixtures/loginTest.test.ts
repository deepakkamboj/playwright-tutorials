import { StandardUser } from '@/data/credentials';
import { test } from './saucewebFixture';

test.describe.parallel('Login functionality', async () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(StandardUser.username, StandardUser.password);
    await loginPage.verifyLogin();
  });
  test('First test', async ({ page, cartPage }) => {
    await page.getByAltText('Products').isVisible();
    await cartPage.addProductToCart('Sauce Labs Backpack');
    await cartPage.clickCart();
    await cartPage.validateProductsInCart('Sauce Labs Backpack');
    await cartPage.checkout();
  });
});
