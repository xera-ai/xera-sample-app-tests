import type { Page, Locator } from '@playwright/test';

export class ApiKeysPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly newKeyResultHeading: Locator;
  readonly newKeyValue: Locator;
  readonly newKeyWarning: Locator;
  readonly dismissDialogButton: Locator;
  readonly keysTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'API Keys', exact: true });
    this.createButton = page.getByRole('button', { name: 'Create Key', exact: true });
    this.nameInput = page.getByLabel('Key name');
    this.submitButton = page.getByRole('button', { name: 'Create', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.newKeyResultHeading = page.getByRole('heading', { name: 'API Key Created' });
    // xera-allow-css: raw API key is rendered inside a <code> block with no role/label/testid; matching by hex pattern is the only stable handle.
    this.newKeyValue = page.locator('code').filter({ hasText: /^[a-f0-9]{32,}$/ });
    this.newKeyWarning = page.getByText(/won.?t be shown again/i);
    this.dismissDialogButton = page.getByRole('button', { name: 'Done', exact: true });
    this.keysTable = page.getByRole('table');
  }

  async goto() {
    await this.page.goto('/settings/api-keys');
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async createKey(name: string) {
    await this.nameInput.fill(name);
    await this.submitForm();
  }

  async dismissNewKeyDialog() {
    await this.dismissDialogButton.click();
  }

  rowForKey(name: string): Locator {
    return this.keysTable.getByRole('row').filter({ hasText: name });
  }

  async revokeKey(name: string) {
    const row = this.rowForKey(name);
    await row.getByRole('button', { name: 'Delete', exact: true }).click();
  }
}
