import { test, expect } from '../../src/fixtures/baseFixture';
import { envConfig } from '../../src/utils/envConfig';

test.describe('Authentication & Session Management @smoke @auth', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('TC01 - Standard user logs in successfully', async ({ loginPage, inventoryPage }) => {
    await test.step('Perform login with valid credentials', async () => {
      await loginPage.login(envConfig.users.standard, envConfig.users.password);
    });

    await test.step('Verify navigation to inventory dashboard', async () => {
      await inventoryPage.verifyLoaded();
      await expect(inventoryPage.header.shoppingCartLink).toBeVisible();
    });
  });

  test('TC02 - Locked out user receives descriptive error message', async ({ loginPage }) => {
    await test.step('Attempt login with locked out user', async () => {
      await loginPage.login(envConfig.users.locked, envConfig.users.password);
    });

    await test.step('Verify lockout error banner is displayed', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('Sorry, this user has been locked out.');
    });
  });

  test('TC03 - Validation error on empty credentials', async ({ loginPage }) => {
    await test.step('Click login without entering credentials', async () => {
      await loginPage.login('', '');
    });

    await test.step('Verify required field validation message', async () => {
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toContain('Username is required');
    });
  });

  test('TC04 - User can log out cleanly through navigation menu', async ({
    loginPage,
    inventoryPage,
  }) => {
    await test.step('Login with standard user', async () => {
      await loginPage.login(envConfig.users.standard, envConfig.users.password);
      await inventoryPage.verifyLoaded();
    });

    await test.step('Trigger logout from menu', async () => {
      await inventoryPage.header.logout();
    });

    await test.step('Verify redirection back to login screen', async () => {
      await expect(loginPage.loginButton).toBeVisible();
      await loginPage.verifyUrlContains('saucedemo.com');
    });
  });
});
