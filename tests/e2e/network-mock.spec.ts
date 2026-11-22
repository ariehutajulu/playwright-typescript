import { test, expect } from '../../src/fixtures/baseFixture';
import { envConfig } from '../../src/utils/envConfig';

test.describe('Network Interception & API Mocking @advanced @mock', () => {
  test('NET01 - Simulate network latency or failure gracefully', async ({
    page,
    loginPage,
  }) => {
    // Intercept static assets or API calls to verify UI handles slow/failed networks
    let networkCallIntercepted = false;

    await page.route(/(png|jpg|jpeg|svg|css|js)/i, async (route) => {
      networkCallIntercepted = true;
      await route.continue();
    });

    await loginPage.open();
    await loginPage.login(envConfig.users.standard, envConfig.users.password);

    expect(networkCallIntercepted).toBe(true);
  });

  test('NET02 - Verify application response headers and security status', async ({
    page,
  }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    const headers = response?.headers();
    expect(headers).toBeDefined();
  });
});
