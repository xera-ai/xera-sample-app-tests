import type { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly saveChangesButton: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly changePasswordButton: Locator;
  readonly profileSavedConfirmation: Locator;
  readonly passwordChangedConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Profile', exact: true });
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.saveChangesButton = page.getByRole('button', { name: 'Save changes' });
    this.currentPasswordInput = page.getByLabel('Current password');
    this.newPasswordInput = page.getByLabel('New password');
    this.changePasswordButton = page.getByRole('button', { name: 'Change password' });
    this.profileSavedConfirmation = page.getByText(/profile (saved|updated)/i);
    this.passwordChangedConfirmation = page.getByText(/password (changed|updated)/i);
  }

  async goto() {
    await this.page.goto('/settings/profile');
  }

  async setName(name: string) {
    await this.nameInput.fill(name);
  }

  async saveProfile() {
    await this.saveChangesButton.click();
  }

  async changePassword(current: string, next: string) {
    await this.currentPasswordInput.fill(current);
    await this.newPasswordInput.fill(next);
    await this.changePasswordButton.click();
  }
}
