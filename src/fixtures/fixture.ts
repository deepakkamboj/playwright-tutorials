import { test as base, TestType } from '@playwright/test';

export type BaseOptions = {
  owner: string;
  tenants: string[];
  environments: string[];
  geographies: string[];
  baseURL?: string;
};

export const test = base.extend<BaseOptions>({
  tenants: async ({}, use) => {
    await use([]);
  },
  environments: async ({}, use) => {
    await use([]);
  },
  geographies: async ({}, use) => {
    await use([]);
  },
});

test.beforeEach(async ({ tenants, environments, geographies }, testInfo) => {
  const currentTenant = testInfo.project.metadata.tenant;
  const currentEnvironment = testInfo.project.metadata.environment;
  const currentGeography = testInfo.project.metadata.geography;

  if (
    !tenants.includes(currentTenant) ||
    !environments.includes(currentEnvironment) ||
    !geographies.includes(currentGeography)
  ) {
    //testInfo.skip();
    base.skip();
  }
});

function setOwner(owner: string) {
  const annotations = base.info().annotations;
  const ownerAnnotation = annotations.find(a => a.type === 'owner');

  if (ownerAnnotation) {
    ownerAnnotation.description = owner;
  } else {
    annotations.push({
      type: 'owner',
      description: owner,
    });
  }
}

export function setTestFileOwner(test: TestType<BaseOptions, {}>, owner: string) {
  test.beforeAll(() => {
    setOwner(owner);
  });

  test.use({
    owner,
  });
}
