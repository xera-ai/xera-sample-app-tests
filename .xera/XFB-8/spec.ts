import { test, expect, request as playwrightRequest } from '@playwright/test';
import { NavigationBar } from './page-objects/NavigationBar';

const API_BASE = process.env.XERA_HTTP_BASE_URL ?? 'http://localhost:3000/api/v1';
const REGULAR_EMAIL = process.env.TEST_REGULAR_EMAIL ?? 'alice@example.com';
const REGULAR_PWD = process.env.TEST_REGULAR_PWD ?? 'Secret123!';
const STORAGE_STATE = '.xera/.auth/.cache/regular.json';

async function apiLogin(): Promise<{ accessToken: string; refreshToken: string }> {
  const ctx = await playwrightRequest.newContext();
  const res = await ctx.post(`${API_BASE}/auth/login`, {
    data: { email: REGULAR_EMAIL, password: REGULAR_PWD },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  await ctx.dispose();
  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
  };
}

test.describe('XFB-8: US-103 — Log Out', () => {
  test.use({ storageState: STORAGE_STATE });

  test('Sign-out button is visible in the navigation bar on the Dashboard', async ({ page }) => {
    await page.goto('/');
    const nav = new NavigationBar(page);
    await expect(nav.signOutButton).toBeVisible();
  });

  test('Sign-out button is visible on a non-Dashboard authenticated page', async ({ page }) => {
    await page.goto('/profile');
    const nav = new NavigationBar(page);
    await expect(nav.signOutButton).toBeVisible();
  });

  test('Clicking Sign out redirects to the login page', async ({ page }) => {
    await page.goto('/');
    const nav = new NavigationBar(page);
    await nav.clickSignOut();
    await page.waitForURL((url) => url.pathname.startsWith('/login'));
    expect(new URL(page.url()).pathname).toMatch(/^\/login/);
  });

  test('Refresh token is invalidated immediately after logout', async ({ page }) => {
    const { refreshToken } = await apiLogin();
    await page.goto('/');
    const nav = new NavigationBar(page);
    await nav.clickSignOut();
    await page.waitForURL((url) => url.pathname.startsWith('/login'));

    const ctx = await playwrightRequest.newContext();
    const refreshRes = await ctx.post(`${API_BASE}/auth/refresh`, {
      data: { refresh_token: refreshToken },
      failOnStatusCode: false,
    });
    await ctx.dispose();
    expect(refreshRes.status()).toBeGreaterThanOrEqual(400);
    expect(refreshRes.status()).toBeLessThan(500);
  });

  test('Old access token cannot be reused after logout', async ({ page }) => {
    const { accessToken } = await apiLogin();
    await page.goto('/');
    const nav = new NavigationBar(page);
    await nav.clickSignOut();
    await page.waitForURL((url) => url.pathname.startsWith('/login'));

    const ctx = await playwrightRequest.newContext();
    const meRes = await ctx.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      failOnStatusCode: false,
    });
    await ctx.dispose();
    expect(meRes.status()).toBe(401);
  });
});
