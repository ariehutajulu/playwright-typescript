import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TodoPage extends BasePage {
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly toggleAllCheckbox: Locator;
  readonly toggleAllLabel: Locator;
  readonly allFilterButton: Locator;
  readonly activeFilterButton: Locator;
  readonly completedFilterButton: Locator;
  readonly clearCompletedButton: Locator;
  readonly itemsLeftCount: Locator;

  constructor(page: Page) {
    super(page);
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.locator('.todo-list li');
    this.toggleAllCheckbox = page.locator('#toggle-all');
    this.toggleAllLabel = page.locator('label[for="toggle-all"]');
    this.allFilterButton = page.getByRole('link', { name: 'All' });
    this.activeFilterButton = page.getByRole('link', { name: 'Active' });
    this.completedFilterButton = page.getByRole('link', { name: 'Completed' });
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.itemsLeftCount = page.locator('.todo-count');
  }

  /**
   * Navigates to the Playwright TodoMVC demo application
   */
  async open(): Promise<void> {
    await this.page.goto('https://demo.playwright.dev/todomvc/#/');
    await expect(this.newTodoInput).toBeVisible();
  }

  /**
   * Adds one or multiple todo items
   */
  async createTodos(...titles: string[]): Promise<void> {
    for (const title of titles) {
      await this.newTodoInput.fill(title);
      await this.newTodoInput.press('Enter');
    }
  }

  /**
   * Clicks the "Toggle All" button to mark all items complete or active
   */
  async clickToggleAll(): Promise<void> {
    await this.toggleAllLabel.click();
  }

  /**
   * Toggles the completion checkbox for a specific todo item by index (0-based)
   */
  async toggleItemByIndex(index: number): Promise<void> {
    const item = this.todoItems.nth(index);
    await item.locator('.toggle').click();
  }

  /**
   * Deletes a todo item by hovering and clicking its destroy button
   */
  async deleteItemByIndex(index: number): Promise<void> {
    const item = this.todoItems.nth(index);
    // In TodoMVC, destroy button becomes visible on hover
    await item.hover();
    await item.locator('button.destroy').click();
  }

  /**
   * Clicks the "Clear completed" button
   */
  async clickClearCompleted(): Promise<void> {
    await this.clearCompletedButton.click();
  }

  /**
   * Clicks a specific filter button ("All", "Active", "Completed")
   */
  async filterBy(filter: 'All' | 'Active' | 'Completed'): Promise<void> {
    switch (filter) {
      case 'All':
        await this.allFilterButton.click();
        break;
      case 'Active':
        await this.activeFilterButton.click();
        break;
      case 'Completed':
        await this.completedFilterButton.click();
        break;
    }
  }

  /**
   * Returns titles of all currently visible items in the list
   */
  async getVisibleItemTitles(): Promise<string[]> {
    return await this.todoItems.locator('label').allInnerTexts();
  }
}
