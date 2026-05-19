import { defineConfig, devices } from '@playwright/test';

// baseURL is set by xera-internal exec via the XERA_BASE_URL env var so it
// always reflects the env declared in xera.config.ts (override with XERA_ENV).
// When running Playwright directly without xera, falls back to http://localhost:5173.
const baseURL = process.env.XERA_BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './.xera',
  testMatch: '**/spec.ts',
  use: {
    baseURL,
    trace: 'on',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chromium'] } }],
});
