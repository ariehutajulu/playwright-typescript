import { Page, Locator, expect } from '@playwright/test';

/**
 * HeaderComponent handles global navigation elements present across pages.
 * Demonstrates Component Object Model pattern.
 */
export class HeaderComponent {
  private readonly page: Page;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly allItemsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
  }

  /**
   * Retrieves the current count badge of items in the cart
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.shoppingCartBadge.isVisible()) {
      const text = await this.shoppingCartBadge.innerText();
      return parseInt(text.trim(), 10);
    }
    return 0;
  }

  /**
   * Navigates to the shopping cart page
   */
  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Opens the slide-out menu
   */
  async openMenu(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  /**
   * Logs out the user via the slide-out menu
   */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }
}
