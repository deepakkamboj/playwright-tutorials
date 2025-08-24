import { test, chromium } from '@playwright/test';

test.describe('Test suite name', () => {
  test('test case name', async () => {
    // launch browser
    const browser = await chromium.launch();
    // create browser context
    const context = await browser.newContext();
    // open page
    const page = await context.newPage();
    // navigate to a website
    await page.goto('https://www.w3schools.com/');
    // close browser
    await browser.close();
  });
});
