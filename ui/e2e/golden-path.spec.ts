import { test, expect } from '@playwright/test';

// Freezes the app's current end-to-end behavior before the refactor plan
// (see ui/refactoring.md) starts changing what's underneath it. Runs against
// the MSW-mocked API (see mocks/handlers.ts) — no real backend required.
test('browse, filter, view a detail, and submit a missing-person report', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Signalement Disparitions/);

  // Browse via the dedicated /missing-persons listing route (see
  // refactoring.md Phase 3.8 — the inline grid that used to live on Home
  // was replaced by this route).
  await page.getByRole('button', { name: 'Parcourir les personnes' }).click();
  await expect(page).toHaveURL(/\/missing-persons$/);

  const listings = page.getByRole('main');
  await page.getByRole('button', { name: 'Recherche avancée' }).click();
  await page.getByPlaceholder('Rechercher une personne...').fill('Tassong');

  await expect(listings.getByRole('heading', { name: 'Paul Tassong', level: 3 })).toBeVisible();
  await expect(listings.getByRole('heading', { name: 'Aïcha Bello', level: 3 })).not.toBeVisible();

  // Open a person's detail view — a real, shareable /missing-persons/[id]
  // URL rendered as an intercepted modal-over-grid (Phase 3.5).
  await listings.getByRole('button', { name: 'Voir détails' }).click();
  await expect(page).toHaveURL(/\/missing-persons\/\d+$/);
  await expect(page.getByRole('heading', { name: 'Paul Tassong', level: 1 })).toBeVisible();
  await expect(page.getByText('Détails du signalement')).toBeVisible();

  // Close the detail modal — pops back to /missing-persons (filters intact,
  // since this is a real history back(), not a fresh navigation)
  await page.getByText('Détails du signalement').locator('xpath=following-sibling::button').click();
  await expect(page).toHaveURL(/\/missing-persons\?search=Tassong$/);
  await expect(page.getByText('Détails du signalement')).not.toBeVisible();

  // Open the report form from the header — lands on /report, person tab
  // active by default (see refactoring.md Phase 3.4).
  await page.getByRole('banner').getByRole('link', { name: 'Signaler une disparition' }).click();
  await expect(page).toHaveURL(/\/report$/);
  await expect(page.getByRole('button', { name: 'Personne disparue' })).toBeVisible();

  // Step 1: personal information
  await page.getByPlaceholder('Ex: Paul Tassong').fill('Jean Test');
  await page.getByPlaceholder('Ex: 25').fill('30');
  await page.locator('select[name="gender"]').selectOption('male');
  await page.getByRole('button', { name: 'Suivant' }).click();

  // Step 2: location & circumstances
  await page.getByPlaceholder('Ex: Marché Mokolo, Yaoundé').fill('Marché Central, Yaoundé');
  await page.locator('select[name="region"]').selectOption('Centre');
  await page.locator('input[name="last_seen_date"]').fill('2026-08-01');
  await page
    .getByPlaceholder('Décrivez les circonstances de la disparition...')
    .fill('Disparition constatée par la famille.');
  await page.getByRole('button', { name: 'Suivant' }).click();

  // Step 3: contact information & submit
  await page.getByPlaceholder('Téléphone principal *').fill('+237600000009');
  await page.getByPlaceholder('Votre nom complet *').fill('Jean Test');
  await page.getByPlaceholder('Votre téléphone *').fill('+237600000009');
  await page.getByRole('button', { name: 'Publier le signalement' }).click();

  await expect(page.getByRole('heading', { name: 'Signalement envoyé!' })).toBeVisible();
});
