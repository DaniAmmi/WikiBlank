import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const getUser = () => {
  const uniqueId = Date.now() + Math.floor(Math.random() * 10000);
  return { testUser: `testuser_${uniqueId}`, testPassword: 'password123' };
};

test.describe('WikiBlank E2E Tests', () => {

  test('1. App loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h1', { hasText: 'Benvenuto su WikiBlank' })).toBeVisible();
  });

  test('2. Navigation links exist', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('nav a', { hasText: 'Cronologia' })).toBeVisible();
    await expect(page.locator('nav a', { hasText: 'Classifica' })).toBeVisible();
    await expect(page.locator('nav a', { hasText: 'Accedi' })).toBeVisible();
  });

  test('3. History page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/history`);
    await expect(page.locator('h1', { hasText: 'Cronologia Partite' })).toBeVisible();
  });

  test('4. Leaderboard page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/leaderboard`);
    await expect(page.locator('h1', { hasText: 'Classifica Globale' })).toBeVisible();
  });

  test('5. Login page loads properly', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('h2', { hasText: 'Accedi' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Accedi' })).toBeVisible();
  });

  test('6. Register page loads properly', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page.locator('h2', { hasText: 'Registrati' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Registrati' })).toBeVisible();
  });

  test('7. Unauthenticated user redirects to login on start game', async ({ page }) => {
    await page.goto(BASE_URL);
    const startBtn = page.locator('button', { hasText: 'Accedi per Giocare' });
    await expect(startBtn).toBeVisible();
    await startBtn.click();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('8. User can register', async ({ page }) => {
    const { testUser, testPassword } = getUser();
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[type="text"]', testUser);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Registrati")');
    await expect(page.locator(`text=Ciao, ${testUser}`)).toBeVisible({ timeout: 10000 });
  });

  test('9. User can login', async ({ page }) => {
    const { testUser, testPassword } = getUser();
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[type="text"]', testUser);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Registrati")');
    await expect(page.locator(`text=Ciao, ${testUser}`)).toBeVisible();
    
    await page.click('button:has-text("Esci")');
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="text"]', testUser);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Accedi")');
    await expect(page.locator(`text=Ciao, ${testUser}`)).toBeVisible({ timeout: 10000 });
  });

  test('10. Authenticated user can start game', async ({ page }) => {
    const { testUser, testPassword } = getUser();
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[type="text"]', testUser);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Registrati")');
    await expect(page.locator(`text=Ciao, ${testUser}`)).toBeVisible();
    
    await page.click('button:has-text("Nuova Partita")');
    await expect(page).toHaveURL(/.*\/game\/\d+/);
    await expect(page.locator('h1', { hasText: 'Titolo:' })).toBeVisible({ timeout: 15000 });
  });

  test('11. User can guess a word', async ({ page }) => {
    const { testUser, testPassword } = getUser();
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[type="text"]', testUser);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Registrati")');
    await expect(page.locator(`text=Ciao, ${testUser}`)).toBeVisible();
    
    await page.click('button:has-text("Nuova Partita")');
    await expect(page.locator('h1', { hasText: 'Titolo:' })).toBeVisible({ timeout: 15000 });

    await page.fill('input[placeholder="Indovina una parola..."]', 'di');
    await page.click('button:has-text("Prova")');
    await expect(page.locator('p', { hasText: 'Tentativi: 1' })).toBeVisible();
  });

  test('12. User can abandon game', async ({ page }) => {
    const { testUser, testPassword } = getUser();
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[type="text"]', testUser);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Registrati")');
    await expect(page.locator(`text=Ciao, ${testUser}`)).toBeVisible();
    
    await page.click('button:has-text("Nuova Partita")');
    await expect(page.locator('h1', { hasText: 'Titolo:' })).toBeVisible({ timeout: 15000 });

    await page.click('button:has-text("Abbandona")');
    await expect(page.locator('h1', { hasText: 'Partita Abbandonata' })).toBeVisible();
  });
});
