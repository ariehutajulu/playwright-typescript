import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage models the authentication screen and interactions.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Navigates directly to the login page
   */
  async open(): Promise<void> {
    await this.navigateTo('/');
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Performs standard credentials login
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Retrieves the displayed error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent()) || '';
  }

  /**
   * Asserts whether the error banner is visible
   */
  async isErrorDisplayed(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }
}
