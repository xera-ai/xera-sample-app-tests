import { test, expect, request as playwrightRequest } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { DashboardPage } from './page-objects/DashboardPage';

const REGULAR_EMAIL = process.env.TEST_REGULAR_EMAIL ?? 'alice@example.com';
const REGULAR_PWD = process.env.TEST_REGULAR_PWD ?? 'Secret123!';
const API_BASE = process.env.XERA_HTTP_BASE_URL ?? 'http://localhost:3000/api/v1';

test.describe('XFB-7: US-102 — Log In', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('Login form displays Email and Password fields', async ({ page }) => {
    const login = new LoginPage(page);
    await expect(login.emailInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.submitButton).toBeVisible();
  });

  test('Successful login redirects to Dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    await login.signIn(REGULAR_EMAIL, REGULAR_PWD);
    await page.waitForURL((url) => !url.pathname.startsWith('/login'));
    expect(new URL(page.url()).pathname).not.toMatch(/^\/login/);
  });

  test('Invalid credentials display an error message', async ({ page }) => {
    const login = new LoginPage(page);
    await login.signIn(REGULAR_EMAIL, 'definitely-wrong-password');
    await expect(login.errorMessage).toBeVisible();
    expect(new URL(page.url()).pathname).toMatch(/^\/login/);
  });

  test('Session is persisted after a page reload', async ({ page }) => {
    const login = new LoginPage(page);
    await login.signIn(REGULAR_EMAIL, REGULAR_PWD);
    await page.waitForURL((url) => !url.pathname.startsWith('/login'));
    const postLoginUrl = page.url();
    await page.reload();
    expect(new URL(page.url()).pathname).toBe(new URL(postLoginUrl).pathname);
    expect(new URL(page.url()).pathname).not.toMatch(/^\/login/);
  });

  // Note: AC "auto-refresh after 15 min of inactivity" describes a client-side timer.
  // We can't wait 15 minutes in CI, so we verify the underlying capability: a successful
  // login issues a refresh_token, and POST /auth/refresh exchanges it for a new
  // access_token. The 15-minute timer itself is exercised separately via unit tests.
  test('Access token can be refreshed via the refresh endpoint', async ({ page }) => {
    const loginResponse = await page.request.post(`${API_BASE}/auth/login`, {
      data: { email: REGULAR_EMAIL, password: REGULAR_PWD },
    });
    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    expect(loginBody.refresh_token).toBeTruthy();
    expect(loginBody.access_token).toBeTruthy();

    const refreshResponse = await page.request.post(`${API_BASE}/auth/refresh`, {
      data: { refresh_token: loginBody.refresh_token },
    });
    expect(refreshResponse.status()).toBe(200);
    const refreshBody = await refreshResponse.json();
    expect(refreshBody.access_token).toBeTruthy();
    expect(refreshBody.access_token).not.toBe(loginBody.access_token);
  });

  // Note: 20-attempts/minute rate-limit AC. Drive via the API (UI submission would be slow
  // and the AC explicitly cites HTTP 429). Use a fresh request context so we do not share
  // limiter state with other tests in this file.
  test('Rate limit blocks after 20 failed login attempts in one minute', async () => {
    const ctx = await playwrightRequest.newContext({ baseURL: API_BASE });
    const burstEmail = `ratelimit-${Date.now()}@example.com`;
    let sawRateLimit = false;
    for (let i = 0; i < 25; i++) {
      const res = await ctx.post('/auth/login', {
        data: { email: burstEmail, password: 'wrong-password' },
        failOnStatusCode: false,
      });
      if (res.status() === 429) {
        sawRateLimit = true;
        break;
      }
    }
    await ctx.dispose();
    expect(sawRateLimit).toBe(true);
  });

  test('Desktop layout shows the 2-panel design', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/login');
    const login = new LoginPage(page);
    await expect(login.brandingPanel).toBeVisible();
    await expect(login.formPanel).toBeVisible();
    const brandingBox = await login.brandingPanel.boundingBox();
    const formBox = await login.formPanel.boundingBox();
    expect(brandingBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(brandingBox!.x).toBeLessThan(formBox!.x);
  });

  test('Mobile layout collapses the branding panel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    const login = new LoginPage(page);
    await expect(login.brandingPanel).toBeHidden();
    await expect(login.formPanel).toBeVisible();
    const formBox = await login.formPanel.boundingBox();
    expect(formBox).not.toBeNull();
    expect(formBox!.width).toBeGreaterThanOrEqual(375 - 32);
  });
});

// Confirm DashboardPage is used to keep the POM contract.
test.describe('XFB-7: dashboard landing smoke', () => {
  test.use({ storageState: '.xera/.auth/regular.json' });
  test('Dashboard is reachable for an authenticated user', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    expect(new URL(page.url()).pathname).not.toMatch(/^\/login/);
  });
});
