import minimist from 'minimist';

export interface TestOption {
  owner: string;
  userAlias: string;
  tenant: string;
  environment: string;
  geography: string;
  baseURL: string;
  isTestingAgainstLocal: boolean;
}

export interface TestOptions {
  owner: string;
  userAliases: string[];
  tenants: string[];
  environments: string[];
  geographies: string[];
  baseURL: string;
  isTestingAgainstLocal: boolean;
}

export function getCommandParameters() {
  return minimist(process.argv.slice(2), {
    string: ['alias', 'project', 'tenant', 'environment', 'geography'],
  });
}

export const getTestOptions = (): TestOptions => {
  const owner = 'default';
  const userAliases = ['default', 'admin', 'globalAdmin', 'testuser01'];
  const tenants = ['makerShell', 'adminCenter', 'pva', 'powerPages'];
  const environments = ['default', 'test', 'prod'];
  const geographies = ['us', 'eu', 'in'];
  const baseURL = process.env.BASE_URL || 'default';
  const isTestingAgainstLocal = false;

  return {
    owner,
    userAliases,
    tenants,
    environments,
    geographies,
    baseURL,
    isTestingAgainstLocal,
  };
};
