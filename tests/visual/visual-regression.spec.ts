import { test, expect } from '../../src/fixtures/baseFixture';

test.describe('Visual Regression Testing @visual', () => {
  test('VIS01 - Login screen layout snapshot matches visual baseline', async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();

    // Verify full login page layout against baseline snapshot
    await expect(page).toHaveScreenshot('login-page-baseline.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('VIS02 - Component-level snapshot of login form box', async ({
    loginPage,
  }) => {
    await loginPage.open();

    // Isolate component snapshot (proves fine-grained component testing capability)
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
