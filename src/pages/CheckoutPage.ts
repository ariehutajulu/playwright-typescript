import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerData } from '../utils/testDataGenerator';

export class CheckoutPage extends BasePage {
  // Step 1: Customer Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step 2: Overview & Summary
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Complete
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Fills customer shipping information and submits step 1
   */
  async fillShippingInformation(customer: CustomerData): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
  }

  /**
   * Completes the checkout order
   */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Asserts order was successfully placed
   */
  async verifyOrderSuccess(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await this.verifyUrlContains('checkout-complete.html');
  }

  /**
   * Retrieves summary amounts as parsed numbers
   */
  async getPaymentSummary(): Promise<{ subtotal: number; tax: number; total: number }> {
    const subtotalText = await this.subtotalLabel.innerText();
    const taxText = await this.taxLabel.innerText();
    const totalText = await this.totalLabel.innerText();

    return {
      subtotal: parseFloat(subtotalText.replace(/[^0-9.]/g, '')),
      tax: parseFloat(taxText.replace(/[^0-9.]/g, '')),
      total: parseFloat(totalText.replace(/[^0-9.]/g, '')),
    };
  }

  /**
   * Retrieves error message on step 1
   */
  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) || '';
  }
}
