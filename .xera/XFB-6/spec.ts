import { test, expect, request as playwrightRequest } from '@playwright/test';
import { RegisterPage } from './page-objects/RegisterPage';

const API_BASE = process.env.XERA_HTTP_BASE_URL ?? 'http://localhost:3000/api/v1';

function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
}

test.describe('XFB-6: US-101 — Register an Account', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('Registration form displays Name, Email, and Password fields', async ({ page }) => {
    const register = new RegisterPage(page);
    await expect(register.nameInput).toBeVisible();
    await expect(register.emailInput).toBeVisible();
    await expect(register.passwordInput).toBeVisible();
    await expect(register.submitButton).toBeVisible();
  });

  test('Successful registration logs the user in and redirects to Dashboard', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.register('Alice Example', uniqueEmail('alice.new'), 'Secret123!');
    await page.waitForURL((url) => !url.pathname.startsWith('/register'));
    expect(new URL(page.url()).pathname).not.toMatch(/^\/register/);
    expect(new URL(page.url()).pathname).not.toMatch(/^\/login/);
  });

  test('Duplicate email shows a clear error', async ({ page }) => {
    // Use full URL (not relative path with baseURL) — a leading-slash path
    // resolves against the host, NOT against the /api/v1 base prefix.
    const ctx = await playwrightRequest.newContext();
    const dupEmail = uniqueEmail('dup');
    const firstRes = await ctx.post(`${API_BASE}/auth/register`, {
      data: { name: 'First User', email: dupEmail, password: 'Secret123!' },
      failOnStatusCode: false,
    });
    expect([200, 201]).toContain(firstRes.status());
    await ctx.dispose();

    const register = new RegisterPage(page);

    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/auth/register') && res.request().method() === 'POST',
    );
    await register.register('Alice Example', dupEmail, 'Secret123!');
    const response = await responsePromise;
    expect(response.status()).toBe(409);

    await expect(register.errorMessage).toBeVisible();
    expect(new URL(page.url()).pathname).toMatch(/^\/register/);
  });

  test('Password shorter than 8 characters shows an error', async ({ page }) => {
    const register = new RegisterPage(page);

    const responsePromise = page
      .waitForResponse(
        (res) => res.url().includes('/auth/register') && res.request().method() === 'POST',
        { timeout: 5_000 },
      )
      .catch(() => null);

    await register.register('Alice Example', uniqueEmail('short'), 'Short1!');
    const response = await responsePromise;
    if (response) {
      expect(response.status()).toBe(400);
    }

    await expect(register.errorMessage).toBeVisible();
    expect(new URL(page.url()).pathname).toMatch(/^\/register/);
  });

  test('Invalid email format shows an error', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.register('Alice Example', 'not-an-email', 'Secret123!');
    await expect(register.errorMessage).toBeVisible();
    expect(new URL(page.url()).pathname).toMatch(/^\/register/);
  });

  test('Desktop layout shows the 2-panel design', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/register');
    const register = new RegisterPage(page);
    await expect(register.brandingPanel).toBeVisible();
    await expect(register.formPanel).toBeVisible();
    const brandingBox = await register.brandingPanel.boundingBox();
    const formBox = await register.formPanel.boundingBox();
    expect(brandingBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(brandingBox!.x).toBeLessThan(formBox!.x);
  });

  test('Mobile layout collapses the branding panel', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/register');
    const register = new RegisterPage(page);
    await expect(register.brandingPanel).toBeHidden();
    await expect(register.formPanel).toBeVisible();
    const formBox = await register.formPanel.boundingBox();
    expect(formBox).not.toBeNull();
    expect(formBox!.width).toBeGreaterThanOrEqual(375 - 32);
  });
});
