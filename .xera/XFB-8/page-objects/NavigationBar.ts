import type { Page, Locator } from '@playwright/test';

export class NavigationBar {
  readonly page: Page;
  readonly nav: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByRole('navigation');
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
  }

  async clickSignOut() {
    await this.signOutButton.click();
  }
}
