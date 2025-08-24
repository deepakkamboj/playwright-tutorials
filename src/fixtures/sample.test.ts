import { test } from './fixture';

test.describe('Sample Test', () => {
  //setTestFileOwner(test, 'deepak');

  //test.use({ owner: 'deepak' });

  test.use({
    owner: 'deepak',
    tenants: ['makerShell'],
    environments: ['test', 'prod'],
    geographies: ['us'],
  });

  test('Sample Test', async ({ page, owner }) => {
    console.log(`Sample Test (Owner: ${owner})`);
    console.log('Page URL: ', page.url());
  });
});
