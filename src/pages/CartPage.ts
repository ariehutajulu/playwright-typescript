import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  /**
   * Asserts that the cart page is visible
   */
  async verifyLoaded(): Promise<void> {
    await expect(this.checkoutButton).toBeVisible();
    await this.verifyUrlContains('cart.html');
  }

  /**
   * Returns list of item titles in the cart
   */
  async getCartItemTitles(): Promise<string[]> {
    return await this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  /**
   * Removes an item from the cart
   */
  async removeItemByName(name: string): Promise<void> {
    const item = this.cartItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: name }),
    });
    await item.locator('button:has-text("Remove")').click();
  }

  /**
   * Proceeds to checkout step one
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Returns back to inventory
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
