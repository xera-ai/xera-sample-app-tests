import { defineAuthSetup } from '@xera-ai/web';
import { defineHttpAuthSetup, presetHttpAuth } from '@xera-ai/http';


export const web = defineAuthSetup(async (page, _role, creds) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(creds.email);
  await page.getByLabel('Password').fill(creds.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  // Sample app redirects to "/" (Dashboard) after login, not /dashboard
  await page.waitForURL((url) => !url.pathname.startsWith('/login'));
  return { expiresAt: Date.now() + 8 * 3600 * 1000 };
});

export const http = defineHttpAuthSetup(async (request, role, creds) => {
  // Default preset — reads tokenEnv from xera.config.ts http.auth.roles.<role>.tokenEnv.
  // Replace this body with a custom login flow if your API doesn't use static tokens.
  return presetHttpAuth({
    request,
    role,
    // The runner injects config via a global; v0.7 limitation
    config: (globalThis as Record<string, unknown>).__XERA_HTTP_CONFIG__ as never,
  });
});

