// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';
import path from 'path';

export type BrowserType = 'chromium' | 'webkit' | 'firefox';
export function isBrowserType(str: string): str is BrowserType {
  return str === 'chromium' || str === 'firefox' || str === 'webkit';
}

const integrationTestsPackageName = 'test';
if (!process.env.OUTPUT_DIR) {
  process.env.OUTPUT_DIR = process.cwd();
}

const browser = isBrowserType(process.env.BROWSER) ? (process.env.BROWSER as BrowserType) : 'chromium';

const config: PlaywrightTestConfig = {
  name: 'Integration Tests',
  globalSetup: require.resolve('./globals/global-setup'),
  globalTeardown: require.resolve('./globals/global-teardown'),
  use: {
    browserName: browser,
    headless: Boolean(process.env.HEADLESS),
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    trace: 'retain-on-failure',

    launchOptions: {
      headless: Boolean(process.env.HEADLESS),
      slowMo: Number(process.env.SLOW_DOWN_MS),
      devtools: process.env.AUTO_OPEN_DEVTOOLS === 'true',
      args: ['--start-maximized', '--no-sandbox', '--disable-web-security'],
    },
  },
  outputDir: path.join(process.env.OUTPUT_DIR, 'artifacts'),
  reporter: [
    ['list'],
    [
      'junit',
      {
        outputFile:
          process.env.OUTPUT_DIR +
          '/artifacts/testResults/' +
          integrationTestsPackageName.replace(/[^a-z0-9.-]+/gi, '_').toLowerCase() +
          '-results.xml',
      },
    ],
  ],
  retries: Number(process.env.RETRIES) || 1,
  testDir: process.env.TEST_DIR || 'src/tests',
  timeout: Number(process.env.TEST_TIMEOUT) || 30000,
  testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
  workers: process.env.CI ? 2 : undefined,
};
export default config;
