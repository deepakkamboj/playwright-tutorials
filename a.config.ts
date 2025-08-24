import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import { BrowserTypes, ProcessEnvironmentConfig, TimeOut, getAuthFilePath } from './src/fixtures/common';
import { TestOption, TestOptions, getCommandParameters, getTestOptions } from './src/fixtures/options';

const testOptions = getTestOptions();
//console.log('getTestOptions: ', testOptions);

const parseProject = (project: string) => {
  const [tenant = 'defaultTenant', environment = 'defaultEnv', geography = 'defaultGeo'] = project
    ? project.split('-')
    : [];

  return { tenant, environment, geography };
};

const generateProjects = () => {
  type Project = PlaywrightTestConfig<TestOption>['projects'];

  const parameters = getCommandParameters();

  const argsErrors: string[] = [];

  if (!parameters.project) {
    argsErrors.push('project missing');
  }

  if (!parameters.alias) {
    argsErrors.push('alias missing');
  }

  if (argsErrors.length > 0) {
    throw new Error(`Invalid arguements: ${argsErrors.join(', ')}`);
  }

  const { tenant, environment, geography } = parseProject(parameters.project);
  const userAlias = parameters.alias;
  const projects: Project = [
    {
      name: 'setup',
      testMatch: '**/global.setup.ts',
      metadata: { tenant, environment, geography, userAlias },
      use: {
        ...testOptions,
        ...devices['Desktop Edge'],
        //channel: "msedge",
      },
    },
    {
      name: 'e2e tests',
      testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
      metadata: { tenant, environment, geography, userAlias },
      testDir: path.join(__dirname, 'src', tenant),
      use: {
        ...testOptions,
        ...devices['Desktop Edge'],
        //channel: "msedge",
        storageState: getAuthFilePath(userAlias, tenant),
      },
      dependencies: ['setup'],
    },
    {
      name: 'teardown',
      testMatch: '**/global.teardown.ts',
      metadata: { tenant, environment, geography, userAlias },
      use: {
        ...testOptions,
        ...devices['Desktop Edge'],
        //channel: "msedge",
      },
      dependencies: ['e2e tests'],
    },
  ];

  // The type of browsers or devices we want to run our tests against
  const deviceList: [browserType: string, deviceName: string][] = [['chromium', 'Desktop Chrome']];

  // build the projects and group them into {userAlias}-{tenant}-{envType}-{geo}

  for (const userAlias of testOptions.userAliases) {
    for (const tenant of testOptions.tenants) {
      // only run tests for the current user and tenant type combination
      //const grep = new RegExp(`@${userAlias}.*@${tenant}`, 'i');
      for (const [browserType, deviceName] of deviceList) {
        projects.push({
          name: `${browserType}-${userAlias}-${tenant}`,
          metadata: { userAlias, tenant, environment: 'prod1', geography: 'us' },
          use: {
            ...devices[deviceName],
            //...testOptions,
            userAlias: userAlias,
            tenant: tenant,
            environment: 'prod',
            geography: 'us',
            // storageState: getAuthFilePath(userAlias, tenant),
          },
          // grep,
          dependencies: ['setup'],
        });
      }
    }
  }
  return projects;
};

//console.log('projects: ', generateProjects());

export default defineConfig<TestOptions>({
  name: 'Playwright Tests',
  //globalSetup: require.resolve('./src/globals/global-setup'),
  //globalTeardown: require.resolve('./src/globals/global-teardown'),
  reportSlowTests: null,
  updateSnapshots: 'missing',

  use: {
    ...testOptions,
    browserName: ProcessEnvironmentConfig().browserType as BrowserTypes,
    headless: ProcessEnvironmentConfig().headless,
    viewport: { width: 1920, height: 1080 },

    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    extraHTTPHeaders: {
      origin: '',
    },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    locale: 'en-US',
    actionTimeout: TimeOut.TwoMinutesTimeout,
    navigationTimeout: TimeOut.TwoMinutesTimeout,
    launchOptions: {
      headless: ProcessEnvironmentConfig().headless,
      slowMo: Number(ProcessEnvironmentConfig().slowDown),
      devtools: ProcessEnvironmentConfig().openDevTools,
      args: [
        '--start-maximized',
        '--no-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
        '--start-fullscreen',
        '--window-size=1920,1080',
      ],
    },
  },
  outputDir: path.join(ProcessEnvironmentConfig().outputDirectory, 'artifacts', 'testArtifacts'),
  reporter: [
    ['list'],
    [
      'junit',
      {
        outputFile: ProcessEnvironmentConfig().outputDirectory + '/artifacts/testResults/test-results.xml',
      },
    ],
  ],
  repeatEach: ProcessEnvironmentConfig().repeatEach,
  retries: ProcessEnvironmentConfig().retries,
  testDir: ProcessEnvironmentConfig().testDirectory,
  timeout: ProcessEnvironmentConfig().testTimeout,
  testMatch: ['**/?(*.)+(spec|test).+(ts|js)'],
  workers: ProcessEnvironmentConfig().workers,

  // Generate projects for different tenants from config file
  projects: generateProjects(),
});
