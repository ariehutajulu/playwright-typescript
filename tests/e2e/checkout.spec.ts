import { test, expect } from '../../src/fixtures/baseFixture';
import { TestDataGenerator } from '../../src/utils/testDataGenerator';

test.describe('E-Commerce Purchasing Journey @regression @checkout', () => {
  test('TC05 - End-to-end checkout flow with dynamic customer data', async ({
    authedInventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    const customer = TestDataGenerator.generateCustomer();

    await test.step('Add item to cart from inventory', async () => {
      await authedInventoryPage.addItemToCartByName('Sauce Labs Backpack');
      const badgeCount = await authedInventoryPage.header.getCartBadgeCount();
      expect(badgeCount).toBe(1);
    });

    await test.step('Navigate to cart and verify selected item', async () => {
      await authedInventoryPage.header.openCart();
      await cartPage.verifyLoaded();
      const items = await cartPage.getCartItemTitles();
      expect(items).toContain('Sauce Labs Backpack');
    });

    await test.step('Proceed to checkout and populate customer information', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInformation(customer);
    });

    await test.step('Verify pricing breakdown calculations (Subtotal + Tax = Total)', async () => {
      const summary = await checkoutPage.getPaymentSummary();
      expect(summary.subtotal).toBeGreaterThan(0);
      expect(summary.tax).toBeGreaterThan(0);
      const calculatedTotal = Number((summary.subtotal + summary.tax).toFixed(2));
      expect(summary.total).toBeCloseTo(calculatedTotal, 2);
    });

    await test.step('Finalize order and verify confirmation message', async () => {
      await checkoutPage.finishOrder();
      await checkoutPage.verifyOrderSuccess();
    });
  });

  test('TC06 - Catalog price sorting validation (Low to High)', async ({
    authedInventoryPage,
  }) => {
    await test.step('Sort catalog by Price (low to high)', async () => {
      await authedInventoryPage.sortBy('lohi');
    });

    await test.step('Assert prices are sorted in ascending order', async () => {
      const prices = await authedInventoryPage.getAllPrices();
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    });
  });

  test('TC07 - Remove item dynamically updates cart badge', async ({
    authedInventoryPage,
    cartPage,
  }) => {
    await test.step('Add multiple items to cart', async () => {
      await authedInventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await authedInventoryPage.addItemToCartByName('Sauce Labs Bike Light');
      expect(await authedInventoryPage.header.getCartBadgeCount()).toBe(2);
    });

    await test.step('Open cart and remove an item', async () => {
      await authedInventoryPage.header.openCart();
      await cartPage.removeItemByName('Sauce Labs Backpack');
      expect(await authedInventoryPage.header.getCartBadgeCount()).toBe(1);
    });
  });
});
