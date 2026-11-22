import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  /**
   * Asserts the inventory page is loaded
   */
  async verifyLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  /**
   * Adds an item to the cart by its product title
   */
  async addItemToCartByName(itemName: string): Promise<void> {
    const itemContainer = this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: itemName }),
    });
    await itemContainer.locator('button:has-text("Add to cart")').click();
  }

  /**
   * Adds an item to the cart by zero-based index
   */
  async addItemToCartByIndex(index: number): Promise<string> {
    const item = this.inventoryItems.nth(index);
    const title = await item.locator('[data-test="inventory-item-name"]').innerText();
    await item.locator('button:has-text("Add to cart")').click();
    return title;
  }

  /**
   * Removes an item from the cart on the inventory page
   */
  async removeItemFromCartByName(itemName: string): Promise<void> {
    const itemContainer = this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: itemName }),
    });
    await itemContainer.locator('button:has-text("Remove")').click();
  }

  /**
   * Sorts the catalog by the provided sort option
   */
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Retrieves all product item prices as an array of numbers
   */
  async getAllPrices(): Promise<number[]> {
    const priceLocators = await this.page.locator('[data-test="inventory-item-price"]').all();
    const prices: number[] = [];
    for (const locator of priceLocators) {
      const text = await locator.innerText();
      prices.push(parseFloat(text.replace('$', '').trim()));
    }
    return prices;
  }

  /**
   * Retrieves all product titles
   */
  async getAllItemTitles(): Promise<string[]> {
    return await this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }
}
