import { defineConfig } from '@xera-ai/core';

export default defineConfig({
  adapters: ['web', 'http'],
  jira: {
    baseUrl: 'https://trinitytechvn.atlassian.net',
    projectKeys: ['XFB',],
    fields: {
      story: 'description',
      
    },
  },
  web: {
    baseUrl: { staging: 'http://localhost:5173' },
    defaultEnv: 'staging',
    auth: {
      strategy: 'storageState',
      setupScript: './shared/auth-setup.ts',
      roles: {
        admin: { envEmail: 'TEST_ADMIN_EMAIL', envPassword: 'TEST_ADMIN_PWD' },
        regular: { envEmail: 'TEST_REGULAR_EMAIL', envPassword: 'TEST_REGULAR_PWD' },
        
      },
    },
  },
  http: {
    baseUrl: { staging: 'http://localhost:3000/api/v1' },
    defaultEnv: 'staging',
    spec: './openapi.json',
    auth: {
      strategy: 'bearer',
      roles: {
        user: { tokenEnv: 'USER_BEARER_TOKEN' },
        
      },
    },
  },
  // Coverage gap report (v0.8.0+). Run `/xera-coverage` to see UNCOVERED /
  // STALE areas and AC gaps. See docs/CONFIGURATION.md for `criticalAreas`.
  coverage: {
    staleAfterDays: 30,
    criticalAreas: [],
    autoSnapshotOnCoverage: true,
  },
});
