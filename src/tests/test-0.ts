import { chromium } from '@playwright/test';

export async function runUiModeTest(): Promise<void> {
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
}

if (require.main === module) {
  runUiModeTest().catch((err) => {
    console.error('Error running UI mode test:', err);
    process.exit(1);
  });
}
