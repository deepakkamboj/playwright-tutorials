import path from 'path';

export enum BrowserTypes {
  Chromium = 'chromium',
  Firefox = 'firefox',
  Webkit = 'webkit',
}

export enum TimeOut {
  DefaultLoopWaitTime = 5000, // 5 secs
  DefaultWaitTime = 60000, // 60 secs
  DefaultMaxWaitTime = 180000, // 3 minutes
  DefaultWaitTimeForValidation = 30000, // 30 secs
  ElementWaitTime = 2000, // 2 secs
  FiveMinutesTimeout = 720000, // 5 minutes
  LoadTimeOut = 60000, // 1 minute
  NavigationTimeout = 60000, // 60 secs (1 minute)
  OneMinuteTimeOut = 60000, // 1 minute
  PageLoadTimeOut = 30000, // 30 secs
  TestTimeout = 360000, // 360000 ms (6 minutes)
  TestTimeoutMax = 600000, // 600000 ms (10 minutes)
  TwoMinutesTimeout = 120000, // 2 minutes
  FifteenMinutesTimeout = 900000, // 15 minutes
}

export const ProcessEnvironmentConfig = () => ({
  browserType: process.env.BROWSER?.toLowerCase() || BrowserTypes.Chromium,
  headless: process.env.HEADLESS === 'true' || false,
  openDevTools: process.env.AUTO_OPEN_DEVTOOLS === 'true' || false,
  outputDirectory: process.env.OUTPUT_DIR || process.cwd(),
  playwrightTestRunName: process.env.TEST_RUN_NAME || 'Integration Tests',
  repeatEach: Number(process.env.REPEAT) || 1,
  retries: Number(process.env.RETRIES) || 1,
  slowDown: Number(process.env.SLOW_DOWN_MS) || 40,
  testDirectory: process.env.TEST_DIR || 'src/tests',
  testTimeout: Number(process.env.TEST_TIMEOUT) || TimeOut.TestTimeoutMax,
  workers: Number(process.env.WORKERS) || 1,
});

export function getArtifactFilePath(...paths: string[]) {
  return path.join(ProcessEnvironmentConfig().outputDirectory, 'artifacts', ...paths);
}

/**
 * Storage State Path for sign-in cookies & origin information.
 */
export const getStorageStatePath = (fileName: string) =>
  getArtifactFilePath('state', fileName || 'storageState.json');

export const getAuthFilePath = (userAlias: string, tenant: string) => {
  return getStorageStatePath(`${userAlias}-${tenant}.json`);
};

export const screenshotPath = getArtifactFilePath('screenshots', 'test.png');

export const sleep = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, (seconds || 1) * 1000));
