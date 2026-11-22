import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage serves as the foundation for all Page Objects in the framework.
 * Encapsulates common page actions, safe navigation, and logging.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a specific path relative to the baseURL
   */
  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Retrieves the current page URL
   */
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Retrieves the current page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Waits for a URL pattern to match
   */
  async waitForUrl(pattern: RegExp | string): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  /**
   * Verifies that the current URL contains the expected path
   */
  async verifyUrlContains(substring: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(substring));
  }

  /**
   * Reloads the current page
   */
  async reloadPage(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Takes a full-page screenshot
   */
  async takeFullScreenshot(filename: string): Promise<Buffer> {
    return await this.page.screenshot({
      path: `test-results/screenshots/${filename}.png`,
      fullPage: true,
    });
  }
}
