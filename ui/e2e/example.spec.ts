import { test, expect } from '@playwright/test';

test('homepage loads and renders the header', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Signalement Disparitions/);
});
