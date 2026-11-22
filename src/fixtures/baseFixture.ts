import { test as baseTest, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { TodoPage } from '../pages/TodoPage';
import { envConfig } from '../utils/envConfig';

/**
 * Custom fixture types extending Playwright's base test context.
 * Injects pre-instantiated Page Objects and testing utilities.
 */
type CustomFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  todoPage: TodoPage;
  authedInventoryPage: InventoryPage;
  makeAxeBuilder: () => AxeBuilder;
};

export const test = baseTest.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  todoPage: async ({ page }, use) => {
    await use(new TodoPage(page));
  },

  /**
   * Pre-authenticated fixture: logs in as the standard user and ensures
   * the inventory page is loaded before yielding control to the test.
   */
  authedInventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(envConfig.users.standard, envConfig.users.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.verifyLoaded();
    await use(inventoryPage);
  },

  /**
   * Axe accessibility builder fixture configured with standard WCAG tags
   */
  makeAxeBuilder: async ({ page }, use) => {
    const makeBuilder = () =>
      new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
    await use(makeBuilder);
  },
});

export { expect };
