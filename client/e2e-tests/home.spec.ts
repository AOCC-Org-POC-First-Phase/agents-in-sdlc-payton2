import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the correct title', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle('Tailspin Toys - Crowdfunding your new favorite game!');
  });

  test('should display the main heading', async ({ page }) => {
    await page.goto('/');
    
    // Check that the main heading is present - look for the hero section heading specifically
    const heroHeading = page.locator('main h1');
    await expect(heroHeading).toContainText('Welcome to');
  });

  test('should display the welcome message', async ({ page }) => {
    await page.goto('/');
    
    // Check that the welcome message is present
    const welcomeMessage = page.locator('p').first();
    await expect(welcomeMessage).toContainText('DevOps-inspired board games');
  });
});
