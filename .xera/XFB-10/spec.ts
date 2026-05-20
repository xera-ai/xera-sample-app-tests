import { test, expect } from '@playwright/test';
import { ProfilePage } from './page-objects/ProfilePage';

test.use({ storageState: '.xera/.auth/.cache/regular.json' });

test.describe('XFB-10: US-105 — Update Profile', () => {
  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    page.on('dialog', (d) => d.accept());
    profile = new ProfilePage(page);
    await profile.goto();
    await expect(profile.heading).toBeVisible();
  });

  test('Changing the display name and saving persists the new name', async ({ page }) => {
    const newName = `Updated Tester ${Date.now()}`;
    const originalName = (await profile.nameInput.inputValue()).trim();

    await profile.setName(newName);
    await profile.saveProfile();

    try {
      await expect(profile.profileSavedConfirmation).toBeVisible({ timeout: 5000 });
      await page.reload();
      await expect(profile.heading).toBeVisible();
      await expect(profile.nameInput).toHaveValue(newName);
    } finally {
      // Best-effort restore so re-runs stay deterministic.
      await profile.setName(originalName).catch(() => undefined);
      await profile.saveProfile().catch(() => undefined);
    }
  });

  test('Changing the password requires a new password of at least 8 characters', async () => {
    await profile.currentPasswordInput.fill('user123');
    await profile.newPasswordInput.fill('short');
    await profile.changePasswordButton.click();

    await expect(profile.newPasswordInput).toHaveJSProperty('validity.valid', false);
    await expect(profile.passwordChangedConfirmation).toBeHidden();
  });

  test('Changing the password with a valid new password shows a confirmation message', async () => {
    const currentPassword = 'user123';
    const newPassword = `validpwd-${Date.now()}`;

    await profile.changePassword(currentPassword, newPassword);

    try {
      await expect(profile.passwordChangedConfirmation).toBeVisible({ timeout: 5000 });
    } finally {
      // Best-effort restore so the seed password keeps working on later runs.
      await profile.changePassword(newPassword, currentPassword).catch(() => undefined);
    }
  });
});
