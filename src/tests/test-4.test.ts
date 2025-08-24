import { test, expect } from '@playwright/test';
import { ExampleClass } from '../pages/example.page';

test.describe('Sample Runner Test Suite', () => {
  test('Navigate to Google', async ({ page }) => {
    await page.goto('https://google.com/');
    const url = await page.url();
    expect(url).toContain('google');
  });

  test('Search for Playwright', async ({ page }) => {
    await page.goto('https://google.com/');
    let exampletest = new ExampleClass(page);
    await exampletest.typeSearchText();
    await exampletest.pressEnter();
    const text = await exampletest.searchResult();
    await console.log(text);
    //expect(text).toContain('Playwright1: Fast and reliable');
    expect(text).toContain('Playwright: Fast and reliable end-to-end testing for modern ...');
  });

  test('skip this test', async ({ page, browserName }) => {
    test.skip(browserName === 'chromium', 'Still working on it');
  });
});
