import { chromium, BrowserContext, Page } from '@playwright/test';
import * as path from 'path';

export async function runTrace(): Promise<void> {
  const browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext();

  // Start tracing before creating / navigating a page.
  await context.tracing.start({ screenshots: true, snapshots: true });

  const page: Page = await context.newPage();
  await page.goto('https://playwright.dev');

  // Use path package to resolve the trace file path
  const tracePath = path.resolve(__dirname, 'trace.zip');
  await context.tracing.stop({ path: tracePath });
  await browser.close();
}

if (require.main === module) {
  runTrace().catch((err) => {
    console.error('Error running trace:', err);
    process.exit(1);
  });
}
