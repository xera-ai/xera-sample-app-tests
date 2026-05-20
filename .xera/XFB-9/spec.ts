import { test, expect } from '@playwright/test';
import { ApiKeysPage } from './page-objects/ApiKeysPage';

test.use({ storageState: '.xera/.auth/.cache/regular.json' });

const uniqueName = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;

test.describe('XFB-9: US-104 — Manage API Keys', () => {
  let apiKeys: ApiKeysPage;

  test.beforeEach(async ({ page }) => {
    page.on('dialog', (d) => d.accept());
    apiKeys = new ApiKeysPage(page);
    await apiKeys.goto();
    await expect(apiKeys.heading).toBeVisible();
  });

  test('The API keys page displays the list of existing keys', async () => {
    await expect(apiKeys.keysTable).toBeVisible();
    await expect(apiKeys.keysTable.getByRole('row')).not.toHaveCount(0);
  });

  test('Creating a new key requires a name', async () => {
    await apiKeys.openCreateForm();
    await expect(apiKeys.nameInput).toBeVisible();

    await apiKeys.submitForm();

    await expect(apiKeys.nameInput).toHaveJSProperty('validity.valid', false);
    await expect(apiKeys.newKeyResultHeading).toBeHidden();
  });

  test('Creating a new key with a valid name shows the raw key exactly once', async ({ page }) => {
    const name = uniqueName('Postman');
    await apiKeys.openCreateForm();
    await apiKeys.createKey(name);

    await expect(apiKeys.newKeyResultHeading).toBeVisible();
    await expect(apiKeys.newKeyWarning).toBeVisible();
    await expect(apiKeys.newKeyValue).toBeVisible();
    const rawKey = (await apiKeys.newKeyValue.innerText()).trim();
    expect(rawKey).toMatch(/^[a-f0-9]{32,}$/);

    await apiKeys.dismissNewKeyDialog();
    await expect(apiKeys.newKeyResultHeading).toBeHidden();
    await expect(page.getByText(rawKey, { exact: true })).toHaveCount(0);
    await expect(apiKeys.rowForKey(name)).toBeVisible();
  });

  test('Revoking an existing key removes it from the list', async () => {
    const name = uniqueName('Old script');
    await apiKeys.openCreateForm();
    await apiKeys.createKey(name);
    await apiKeys.dismissNewKeyDialog();
    await expect(apiKeys.rowForKey(name)).toBeVisible();

    await apiKeys.revokeKey(name);
    await expect(apiKeys.rowForKey(name)).toHaveCount(0);
  });

  test('A revoked key stops working immediately', async ({ page, request }) => {
    const name = uniqueName('Soon to revoke');
    await apiKeys.openCreateForm();
    await apiKeys.createKey(name);
    await expect(apiKeys.newKeyValue).toBeVisible();
    const rawKey = (await apiKeys.newKeyValue.innerText()).trim();
    await apiKeys.dismissNewKeyDialog();

    await apiKeys.revokeKey(name);
    await expect(apiKeys.rowForKey(name)).toHaveCount(0);

    const apiOrigin = new URL(page.url()).origin.replace(':5273', ':3100');
    const response = await request.get(`${apiOrigin}/api/v1/api-keys/`, {
      headers: { Authorization: `Bearer ${rawKey}` },
    });
    expect(response.status()).toBe(401);
  });
});
